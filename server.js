import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

app.post("/blueprint", async (req, res) => {
  const { idea } = req.body;

  if (!idea) return res.status(400).json({ error: "Idea is required" });

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "You are an expert app designer and create app blueprints in JSON format." },
        { role: "user", content: `Create a JSON blueprint for this app idea: "${idea}"` }
      ],
      max_tokens: 500
    });

    const blueprint = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, blueprint });

  } catch (err) {
    res.status(500).json({ error: err.message || "AI processing error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AppMint AI backend running on port ${PORT}`));
