import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getBaseUrl(): string {
  try {
    const hostUri = Constants.expoConfig?.hostUri || (Constants as any).expoGoConfig?.hostUri;
    if (hostUri && typeof hostUri === 'string') {
      const ip = hostUri.split(':')[0];
      if (ip) return `http://${ip}:5000`;
    }
  } catch (e) {}
  return Platform.OS === 'web' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatResponse {
  ok: boolean;
  answer: string;
  fallback: boolean;
  sources?: string[];
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  activeSchemeId?: string
): Promise<ChatResponse> {
  const url = `${getBaseUrl()}/api/chat`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history.slice(-6),
        activeSchemeId,
      }),
    });
    if (!res.ok) throw new Error('Network response not ok');
    return await res.json();
  } catch (error) {
    return {
      ok: false,
      answer: 'Unable to connect to the assistant backend. Please ensure the server is running.',
      fallback: true,
    };
  }
}