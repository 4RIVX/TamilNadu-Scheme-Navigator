# Tamil Nadu Scheme Navigator

A bilingual mobile app that helps Tamil Nadu residents discover government schemes, understand eligibility, and find official application information in one place.

Built with Expo and React Native, the app provides a Tamil-first experience with English support and keeps scheme information available locally for dependable browsing.

> **Important:** This is an informational prototype, not an official Government of Tamil Nadu service. Always confirm eligibility, benefits, and application requirements on the linked official portal before applying.

## Features

- Browse and search Tamil Nadu government schemes by category
- View benefits, eligibility rules, required documents, and application guidance
- Check likely eligibility using a short profile questionnaire
- Save schemes locally for later reference
- Switch between Tamil and English
- Open official scheme pages directly from the app
- Optional AI assistant API with scheme-aware retrieval and Tamil/Tanglish responses

## Tech stack

- **Mobile:** Expo, React Native, Expo Router, TypeScript
- **State:** Zustand and AsyncStorage
- **Fonts:** Noto Sans Tamil
- **Data:** Local JSON scheme catalogue
- **Optional backend:** Flask, Gemini API, and Groq fallback

## Project structure

```text
app/            Expo Router screens and navigation
components/     Reusable UI, scheme, eligibility, and assistant components
data/           Local scheme catalogue and source metadata
i18n/           Tamil and English translations
services/       Scheme, chat, and API services
store/          Client-side app state
utils/          Eligibility and text helpers
backend/        Optional Flask assistant API
```

## Run the mobile app

### Prerequisites

- Node.js 20 or later
- npm
- Expo Go on a physical device, or an Android/iOS simulator

### Install and start

```bash
npm install
npm start
```

Then scan the QR code with Expo Go, or use one of the platform commands:

```bash
npm run android
npm run ios
npm run web
```

### Quality checks

```bash
npm run lint
```

## Optional assistant backend

The Flask API loads the catalogue from `data/schemes.json`, retrieves relevant schemes, and can call Gemini with a Groq fallback. It is optional: the scheme browsing and eligibility features use local data.

```bash
cd backend
python -m venv .venv
```

Activate the environment, install dependencies, and start the server:

```bash
pip install -r requirements.txt
python app.py
```

Create `backend/.env` and add at least one provider credential:

```env
GEMINI_API_KEY=your_gemini_api_key
# Optional alternatives
# GEMINI_API_KEYS=first_key,second_key
# GROQ_API_KEY=your_groq_api_key
# GEMINI_MODEL=gemini-2.5-flash
```

The backend runs on `http://localhost:5000` by default. Configure your mobile client’s API base URL before enabling chat requests; `services/api.ts` is intentionally the integration point for that setup.

## Data and verification

Scheme records live in [`data/schemes.json`](data/schemes.json). Each record includes its source or official-page URL and a data status. Treat the catalogue as a starting point rather than legal or administrative advice—government schemes and their criteria may change.

When updating the catalogue:

1. Verify details against the relevant official Tamil Nadu department site or [myScheme](https://www.myscheme.gov.in/).
2. Update the source URL and verification date with the record.
3. Preserve bilingual names and all data-status fields.

## Contributing

Contributions are welcome. For scheme-data changes, please include the official source used to verify the update. Do not commit API keys, `.env` files, build output, or `node_modules`.

## License

No license has been specified yet. Add a license file before distributing or accepting external contributions.
