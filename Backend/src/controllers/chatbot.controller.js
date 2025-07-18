import fetch from "node-fetch"; // or use global fetch in Node 18+

export const chatbotReply = async (req, res) => {
  const { message } = req.body;
  console.log(message);
  if (!message) return res.status(400).json({ error: "Message is required" });
  console.log(process.env.OPENAI_API_KEY);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization":"Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "system", content: "You are CompanionBot in ConnectUs webapp, a helpful assistant for the ConnectUs social app and reply friendly to users." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    console.log(data);
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process your request.";
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
};