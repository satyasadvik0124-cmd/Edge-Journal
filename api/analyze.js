export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const trade = req.body;
    const isFullReview = trade.pair === 'Full Account Review';
    const isChat       = trade.pair === 'chat';

    // For dashboard analysis and chat, use the prompt directly from frontend
    const prompt = (isFullReview || isChat)
      ? trade.reason
      : `You are an elite AI trading coach.

Analyze this forex trade deeply.

Trade Details:
Pair: ${trade.pair}
Direction: ${trade.direction}
Entry: ${trade.entry}
Exit: ${trade.exit}
Stop Loss: ${trade.sl}
Take Profit: ${trade.tp}
Risk Reward: ${trade.rr}
PNL: ${trade.pnl}
Trade Duration: ${trade.duration}
Emotion: ${trade.emotion}

Entry Reason:
${trade.reason}

Lessons Learned:
${trade.lessons}

Provide:
1. Trade quality analysis
2. Psychology analysis
3. Risk management feedback
4. Execution mistakes
5. Improvement suggestions
6. Pattern observations

Respond professionally.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://edge-journal-sadvik.vercel.app",
        "X-Title": "Edge Journal"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'OpenRouter request failed' });

    const text = data?.choices?.[0]?.message?.content || "No response";
    return res.status(200).json({ analysis: text });

  } catch(error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}