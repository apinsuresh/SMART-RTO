import express from 'express';
import Bytez from "bytez.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const key = "d6b0645bd30629b23515e48286ccd15e";
const sdk = new Bytez(key);
const model = sdk.model("openai/gpt-4o");

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Default system prompt to give RTO context
    const contextMessages = [
      {
        "role": "system",
        "content": "You are a helpful AI assistant for the Smart RTO (Regional Transport Office) portal. You help citizens with queries about driving licenses, vehicle registration, challans, and RTO rules in India. Keep answers concise and helpful."
      },
      ...messages
    ];

    const { error, output } = await model.run(contextMessages);

    if (error) {
      console.error("Bytez API error:", error);
      return res.status(500).json({ message: 'Failed to generate response' });
    }

    res.json({ reply: output });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
