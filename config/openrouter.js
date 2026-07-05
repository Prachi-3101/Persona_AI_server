const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const callOpenRouter = async ({
  model,
  messages,
  max_tokens = 300,
  temperature = 0.7,
  stream = false,
}) => {
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature,
        stream,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenRouter request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("OpenRouter Error:", error.message);
    throw error;
  }
};

export default callOpenRouter;