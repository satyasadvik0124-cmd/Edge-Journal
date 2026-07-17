export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const trade = req.body;
    const isFullReview = trade.pair === 'Full Account Review';
    const isChat = trade.pair === 'chat';
    const hasPhotos = trade.photos && trade.photos.length > 0;

    console.log('=== NEW ANALYSIS REQUEST ===');
    console.log('Type:', isFullReview ? 'Full Review' : isChat ? 'Chat' : 'Single Trade');
    console.log('Has photos:', hasPhotos);
    console.log('OpenRouter key present:', !!process.env.OPENROUTER_API_KEY);

    // Check API key
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY missing');
      return res.status(500).json({ 
        error: 'API key not configured. Please add OPENROUTER_API_KEY to environment variables.' 
      });
    }

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

    // Model selection with fallbacks
    const models = [
      'google/gemini-2.0-flash-001:free',
      'google/gemini-flash-1.5:free',
      'mistralai/mistral-7b-instruct:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'undi95/toppy-m-7b:free',
      'gryphe/mythomist-7b:free',
      // Paid fallbacks (will only work if you have credits)
      'google/gemini-2.0-flash-001',
      'meta-llama/llama-3.1-8b-instruct',
      'openai/gpt-3.5-turbo'
    ];

    let lastError = null;
    let modelUsed = null;

    // Try each model until one works
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}...`);
        
        // Build messages based on whether we have photos
        let messages;
        if (hasPhotos && (model.includes('gemini') || model.includes('gpt'))) {
          // Vision-capable models
          messages = [{
            role: 'user',
            content: [
              ...trade.photos.map(b64 => ({
                type: 'image_url',
                image_url: { url: b64 }
              })),
              { type: 'text', text: prompt }
            ]
          }];
        } else {
          // Text-only models (or when no photos)
          messages = [{ role: 'user', content: prompt }];
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://edge-journal-sadvik.vercel.app',
            'X-Title': 'EdgeJournal'
          },
          body: JSON.stringify({ 
            model, 
            messages,
            temperature: 0.7,
            max_tokens: isFullReview ? 2000 : 1000
          })
        });

        const data = await response.json();

        if (response.ok && data?.choices?.[0]?.message?.content) {
          modelUsed = model;
          console.log(`✅ Success with model: ${model}`);
          return res.status(200).json({ 
            analysis: data.choices[0].message.content 
          });
        } else {
          console.log(`❌ Model ${model} failed:`, data?.error?.message || 'Unknown error');
          lastError = data?.error?.message || 'Unknown error';
          
          // If it's a 402 error (insufficient credits), skip paid models
          if (response.status === 402) {
            console.log('Insufficient credits, removing paid models from list');
            // Remove all paid models and continue with free ones only
            const paidIndex = models.findIndex(m => !m.includes(':free'));
            if (paidIndex !== -1) {
              models.length = paidIndex;
            }
          }
        }
      } catch (err) {
        console.log(`❌ Model ${model} network error:`, err.message);
        lastError = err.message;
      }
    }

    // If we get here, no model worked
    console.error('All models failed. Last error:', lastError);
    return res.status(500).json({
      error: 'Unable to get AI analysis. Please try again later. Last error: ' + (lastError || 'Unknown error')
    });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error: ' + (error.message || 'Unknown error')
    });
  }
}