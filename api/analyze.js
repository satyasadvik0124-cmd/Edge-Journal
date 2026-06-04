export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const trade = req.body;
    const isFullReview = trade.pair === 'Full Account Review';
    const isChat       = trade.pair === 'chat';
    const hasPhotos    = trade.photos && trade.photos.length > 0;

    // ── Log key presence (check Vercel logs if still broken) ──
    console.log('OpenRouter key present:', !!process.env.OPENROUTER_API_KEY);

    const prompt = (isFullReview || isChat)
      ? trade.reason
      : `You are an elite AI trading coach.

Analyze this forex trade deeply.
${hasPhotos ? 'I have attached chart screenshots — analyze the chart setup, entry/exit placement, and any visual patterns you see.' : ''}

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
${hasPhotos ? '7. Chart screenshot analysis — what you see in the images' : ''}

Respond professionally.`;

    // ── Vision model: use google/gemini-2.0-flash-exp:free (correct slug) ──
    // ── For text-only requests use a cheaper/faster model ──
    const model = hasPhotos
      ? 'google/gemini-2.0-flash-exp:free'
      : 'google/gemini-2.0-flash-exp:free';

    const messages = hasPhotos
      ? [{
          role: 'user',
          content: [
            ...trade.photos.map(b64 => ({
              type: 'image_url',
              image_url: { url: b64 }
            })),
            { type: 'text', text: prompt }
          ]
        }]
      : [{ role: 'user', content: prompt }];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://edge-journal-sadvik.vercel.app',
        'X-Title': 'Edge Journal'
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();

    // ── Surface the real OpenRouter error in Vercel logs ──
    if (!response.ok) {
      console.error('OpenRouter error:', JSON.stringify(data));
      return res.status(response.status).json({
        error: data?.error?.message || data?.message || JSON.stringify(data)
      });
    }

    const text = data?.choices?.[0]?.message?.content || 'No response received.';
    return res.status(200).json({ analysis: text });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}