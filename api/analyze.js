export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    const trade = req.body;

    const prompt = `
You are an elite AI trading coach.

Analyze this trade deeply.

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

Respond professionally.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

   console.log(JSON.stringify(data, null, 2));

const text =
  data?.candidates?.[0]?.content?.parts
    ?.map(p => p.text)
    ?.join(' ') ||
  data?.promptFeedback?.blockReason ||
  'No AI response returned';
    res.status(200).json({
      analysis: text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'AI analysis failed'
    });
  }
}