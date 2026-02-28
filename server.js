app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Please provide a prompt" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Pehle official method try karte hain
    let text = "";
    try {
      const response = await result.response;
      text = response.text();
    } catch (e) {
      // Agar official method fail ho, toh manual check
      text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    // AGAR DONO FAIL HO JAYEIN, TOH AAPWALA DEBUG LOG:
    if (!text) {
      text = "AI returned unrecognized structure: " + JSON.stringify(result);
    }

    res.json({
      success: true,
      model: "Gemini 1.5 Flash",
      answer: text
    });

  } catch (error) {
    console.error("Critical AI Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
