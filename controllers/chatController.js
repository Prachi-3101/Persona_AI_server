import callOpenRouter from "../config/openrouter.js";
import personas from "../prompts/personas.js";
import Chat from "../models/Chat.js";

export const getChat = async (req, res) => {
  try {
    const { persona } = req.params;
    const chat = await Chat.findOne({ userId: req.userId, persona });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({ messages: chat.messages });
  } catch (error) {
    console.error("Get Chat Error:", error.message);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};

export const chat = async (req, res) => {
  try {
    const { persona, messages } = req.body;

    const userMessage = messages[messages.length - 1];

    let chat = await Chat.findOne({ userId: req.userId, persona });

    if (!chat) {
      chat = await Chat.create({
        userId: req.userId,
        persona,
        messages: [],
      });
    }

    chat.messages.push({
      role: "user",
      content: userMessage.content,
    });

    const response = await callOpenRouter({
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: personas[persona],
        },
        ...chat.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    const reply = response.choices[0].message.content;

    chat.messages.push({
      role: "assistant",
      content: reply,
    });

    await chat.save();

    res.json({ reply });
  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({ reply: error.message });
  }
};

export const clearChat = async (req, res) => {
  try {
    const { persona } = req.params;
    await Chat.findOneAndUpdate(
      { userId: req.userId, persona },
      { $set: { messages: [] } }
    );
    res.json({ message: "Chat cleared" });
  } catch (error) {
    console.error("Clear Chat Error:", error.message);
    res.status(500).json({ message: "Failed to clear chat" });
  }
};
