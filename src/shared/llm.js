// Helper to talk to the LLM from the browser.
// Read the API key from import.meta.env.VITE_API_KEY (see .env.example).
//
// Usage:
//   const reply = await askLLM([{ role: 'user', content: 'Hello' }], 'You are helpful.');

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-5-sonnet-20241022';

export async function askLLM(messages, systemPrompt = '') {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    return 'No API key found. Copy .env.example to .env.local and add your VITE_API_KEY.';
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      return `LLM request failed (status ${response.status}). Please try again.`;
    }

    const data = await response.json();
    return data.content?.[0]?.text ?? 'No response from the model.';
  } catch (error) {
    return 'Something went wrong while contacting the LLM. Please try again.';
  }
}
