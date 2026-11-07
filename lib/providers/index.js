// Ayarlara göre doğru yapay zekâ sağlayıcısını seçer
import { config } from '../config.js';
import { GeminiProvider } from './gemini.js';
import { OllamaProvider } from './ollama.js';
import { MockProvider } from './mock.js';

export function getProvider() {
  switch (config.provider) {
    case 'ollama': return new OllamaProvider(config.ollama);
    case 'mock': return new MockProvider();
    case 'gemini':
    default: return new GeminiProvider(config.gemini);
  }
}
