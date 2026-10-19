// Helper to talk to the LLM from the browser via OpenRouter.
// Read the API key from import.meta.env.VITE_API_KEY (see .env.example).
//
// Usage:
//   const reply = await askLLM([{ role: 'user', content: 'Hello' }], 'You are helpful.');

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";

export async function askLLM(messages, systemPrompt = "") {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    return "No API key found. Copy .env.example to .env.local and add your VITE_API_KEY.";
  }

  // Build the message list, putting the system prompt first.
  const fullMessages = [];
  if (systemPrompt) {
    fullMessages.push({ role: "system", content: systemPrompt });
  }
  fullMessages.push(...messages);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: fullMessages,
      }),
    });

    if (!response.ok) {
      return `LLM request failed (status ${response.status}). Please try again.`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "No response from the model.";
  } catch (error) {
    return "Something went wrong while contacting the LLM. Please try again.";
  }
}
