import axios from "axios";

// Agar pehla model slow/timeout ho ya fail ho jaye, isi order me next model try hota hai.
const FALLBACK_MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "deepseek/deepseek-chat:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
];

const REQUEST_TIMEOUT_MS = 15000;

const callModel = async (model, messages) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages,
      max_tokens: 1000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: REQUEST_TIMEOUT_MS,
    },
  );

  const content = response?.data?.choices?.[0]?.message?.content;

  if (!content || !content.trim()) {
    throw new Error(`No content received from model "${model}"`);
  }

  return content;
};

export const askAi = async (messages) => {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error("Message is required");
  }

  let lastError;

  for (const model of FALLBACK_MODELS) {
    try {
      return await callModel(model, messages);
    } catch (error) {
      lastError = error;
      const reason =
        error.code === "ECONNABORTED"
          ? `timeout after ${REQUEST_TIMEOUT_MS}ms`
          : error.response?.data?.error?.message || error.message;
      console.log(`openrouter: "${model}" failed (${reason}), switching to next model...`);
    }
  }

  console.log("openrouter error: all fallback models failed", lastError?.response?.data || lastError?.message);
  throw new Error("Failed to get response from AI");
};


export default askAi;