module.exports = async function handler(req, res) {

  // Allow only POST requests
  if (req.method !== 'POST') {

    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    const trade = req.body;

    // Build AI prompt
    const prompt = `
You are an elite AI trading coach.

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

Respond professionally.
`;

    // Send request to Gemini
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
          ],

          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }

        })
      }
    );

    // Parse Gemini response
    const data = await response.json();

    console.log("FULL GEMINI RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    // Handle Gemini API errors
    if (!response.ok) {

      console.log("GEMINI ERROR:");
      console.log(JSON.stringify(data, null, 2));

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          'Gemini API request failed'
      });
    }

    // Extract AI response safely
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || '')
        ?.join(' ')
        ?.trim()
      || data?.promptFeedback?.blockReason
      || 'No AI response returned';

    // Return AI analysis
    return res.status(200).json({
      analysis: text
    });

  } catch (error) {

    console.error('AI ANALYSIS ERROR:', error);

    return res.status(500).json({
      error: error.message || 'AI analysis failed'
    });
  }
}