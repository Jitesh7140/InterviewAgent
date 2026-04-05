import axios from "axios";

export const askAi = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Message is required");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat", 
        messages: messages,
        max_tokens: 1000, 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const content = response?.data?.choices[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error("No content received from AI");
    }

    return content;
  } catch (error) {
    console.log("openrouter error:", error.response?.data || error.message);
    throw new Error("Failed to get response from AI");
  }
};


export default askAi;