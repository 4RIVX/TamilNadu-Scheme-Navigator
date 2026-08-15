import json
import os
import re
import time

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEYS = [k.strip() for k in os.getenv("GEMINI_API_KEYS", os.getenv("GEMINI_API_KEY", "")).split(",") if k.strip()]
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
SCHEMES_PATH = os.getenv("SCHEMES_PATH", "../data/schemes.json")

ANSWER_CACHE = {}


def load_schemes():
    path = SCHEMES_PATH
    if not os.path.isabs(path):
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), path)
    with open(path, encoding="utf-8") as f:
        return json.load(f).get("schemes", [])


SCHEMES = load_schemes()

MASTER_INDEX = ""
for i, s in enumerate(SCHEMES, 1):
    MASTER_INDEX += f"{i}. {s.get('nameEn')} ({s.get('nameTa')}) - Tags: {', '.join(s.get('tags', []))}\n"

TA_RANGE = re.compile(r"[\u0B80-\u0BFF]")


def is_tamil(text):
    return bool(TA_RANGE.search(text or ""))


def tokenize(text):
    return [t for t in re.split(r"\s+", (text or "").lower()) if len(t) >= 2]


def scheme_haystack(s):
    parts = [s.get("nameEn", ""), s.get("nameTa", ""), " ".join(s.get("tags", [])), s.get("department", "")]
    for key in ("benefits", "eligibility", "documents"):
        v = s.get(key)
        if isinstance(v, list):
            parts.append(" ".join(x for x in v if isinstance(x, str)))
        elif isinstance(v, dict):
            for sub_list in v.values():
                parts.append(" ".join(x for x in sub_list if isinstance(x, str)))
    if s.get("howToApply"):
        parts.append(s.get("howToApply"))
    return " ".join(parts).lower()


def retrieve(message, active_scheme_id=None, limit=3):
    if active_scheme_id:
        hit = [s for s in SCHEMES if s.get("id") == active_scheme_id]
        if hit:
            return hit
    tokens = tokenize(message)
    scored = []
    for s in SCHEMES:
        hay = scheme_haystack(s)
        name_hay = (s.get("nameEn", "") + " " + s.get("nameTa", "") + " " + " ".join(s.get("tags", []))).lower()
        score = sum(2 if t in name_hay else 1 for t in tokens if t in hay)
        if score > 0:
            scored.append((score, s))
    scored.sort(key=lambda x: -x[0])
    return [s for _, s in scored[:limit]]


def build_context_text(schemes):
    text = f"MASTER INDEX OF ALL {len(SCHEMES)} SCHEMES I KNOW:\n{MASTER_INDEX}\n\n"
    if schemes:
        text += "DETAILED INFORMATION FOR MATCHED SCHEMES:\n"
        for s in schemes:
            text += f"\n### {s.get('nameEn')} ({s.get('nameTa')})\n"
            text += f"Department: {s.get('department')}\n"
            benefits = s.get('benefits')
            if benefits:
                text += f"Benefits: {', '.join(benefits) if isinstance(benefits, list) else benefits}\n"
            eligibility = s.get('eligibility')
            if eligibility:
                if isinstance(eligibility, dict):
                    for group, rules in eligibility.items():
                        text += f"Eligibility ({group}): {', '.join(rules)}\n"
                elif isinstance(eligibility, list):
                    text += f"Eligibility: {', '.join(eligibility)}\n"
            docs = s.get('documents')
            if docs:
                text += f"Documents: {', '.join(docs) if isinstance(docs, list) else docs}\n"
            text += f"How to Apply: {s.get('howToApply', 'Check official portal.')}\n"
            text += f"Official URL: {s.get('officialPageUrl') or s.get('applicationUrl') or 'tn.gov.in'}\n"
            text += "---\n"
    else:
        text += "No specific scheme matched the user's exact keywords, but they might be referring to one in the Master Index. Use your knowledge of the Master Index to help them.\n"
    return text


SYSTEM_PROMPT = """You are the 'TN Scheme Navigator AI', a world-class, highly intelligent citizen assistant for the Tamil Nadu Government, currently operating in the year 2026.
Context: The current Chief Minister of Tamil Nadu is Thalapathy Vijay (TVK party). Previous CMs include M.K. Stalin (DMK) and Edappadi K. Palaniswami (AIADMK). You are fully aware of this political context.

CRITICAL RULES FOR YOUR RESPONSES:
1. YOU KNOW EVERYTHING ABOUT THE SCHEMES: You have a Master Index of verified TN schemes. NEVER say "I don't have information" or "I don't know" about a scheme. If the user mentions a scheme (even with a typo or slang), find it in your Master Index and explain it using the Detailed Information provided or your general knowledge of TN schemes.
2. NEVER OUTPUT CODE: Never print JSON, Python, brackets, or raw data structures. Speak like a friendly, professional government officer.
3. LANGUAGE MATCHING:
   - If user speaks Tamil, reply in beautiful, formal but friendly Tamil.
   - If user speaks English, reply in clear English.
   - If user speaks Tanglish, reply in simple English with Tamil terms in brackets.
4. GENERAL KNOWLEDGE: If the user asks who the CM is, the year, or general trivia, answer it perfectly and proudly, then smoothly transition back to offering help with TN schemes.
5. NO HALLUCINATIONS ON AMOUNTS: If the detailed information does not state a specific ₹ amount, do NOT invent one. Say "The exact amount is determined by the department based on current G.O.s."

Always end your scheme explanations with: "For official verification and application, please visit the official portal."
"""


def call_gemini(message, history, context, api_key):
    from google import genai
    client = genai.Client(api_key=api_key)
    contents = []
    for h in history[-4:]:
        contents.append({"role": "user" if h.get("role") == "user" else "model", "parts": [{"text": h.get("text", "")}]})
    contents.append({"role": "user", "parts": [{"text": f"CONTEXT:\n{context}\n\nUSER QUESTION:\n{message}"}]})
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=contents,
        config={"system_instruction": SYSTEM_PROMPT},
    )
    return resp.text


def call_groq(message, history, context):
    msgs = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in history[-4:]:
        msgs.append({"role": "user" if h.get("role") == "user" else "assistant", "content": h.get("text", "")})
    msgs.append({"role": "user", "content": f"CONTEXT:\n{context}\n\nUSER QUESTION:\n{message}"})
    r = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
        json={"model": "llama-3.3-70b-versatile", "messages": msgs, "temperature": 0.4},
        timeout=30,
    )
    r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"]


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "schemes": len(SCHEMES), "model": GEMINI_MODEL,
                    "geminiKeys": len(GEMINI_API_KEYS), "groqConfigured": bool(GROQ_API_KEY)})


@app.post("/api/chat")
def chat():
    body = request.get_json(silent=True) or {}
    message = (body.get("message") or "").strip()
    history = body.get("history") or []
    active_scheme_id = body.get("activeSchemeId")
    if not message:
        return jsonify({"ok": False, "error": "empty_message"}), 400

    schemes = retrieve(message, active_scheme_id)

    cache_key = message.strip().lower()
    if cache_key in ANSWER_CACHE:
        return jsonify(ANSWER_CACHE[cache_key])

    context = build_context_text(schemes)
    limit_ta = "உதவியாளருக்கு இப்போது அதிக கோரிக்கைகள் வருகின்றன. சுமார் ஒரு நிமிடம் கழித்து மீண்டும் முயற்சிக்கவும். இந்த நேரத்தில் திட்டங்களை ஆஃப்லைனில் பார்க்கலாம்."
    limit_en = "The assistant is receiving too many requests right now. Please wait about a minute and try again. Meanwhile, you can browse all schemes offline."

    for key in GEMINI_API_KEYS:
        try:
            answer = call_gemini(message, history, context, key)
            resp = {"ok": True, "answer": answer, "sources": [s.get('id') for s in schemes], "fallback": False}
            ANSWER_CACHE[cache_key] = resp
            return jsonify(resp)
        except Exception as e:
            err = str(e)
            if not ('429' in err or 'RESOURCE_EXHAUSTED' in err or 'quota' in err.lower() or '503' in err):
                break

    if GROQ_API_KEY:
        try:
            answer = call_groq(message, history, context)
            resp = {"ok": True, "answer": answer, "sources": [s.get('id') for s in schemes], "fallback": False}
            ANSWER_CACHE[cache_key] = resp
            return jsonify(resp)
        except Exception:
            pass

    return jsonify({"ok": True, "answer": limit_ta if is_tamil(message) else limit_en,
                    "sources": [s.get('id') for s in schemes], "fallback": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)