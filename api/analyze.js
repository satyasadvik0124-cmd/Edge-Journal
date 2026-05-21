export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {

          "Authorization":
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json",

          "HTTP-Referer":
            "https://edge-journal-sadvik.vercel.app",

          "X-Title":
            "Edge Journal"
        },

        body: JSON.stringify({

          model:
            "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "user",

              content:
                "You are an elite AI trading coach. Say hello."
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OPENROUTER RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          'OpenRouter request failed'
      });
    }

    const text =
      data?.choices?.[0]?.message?.content
      || "No response";

    return res.status(200).json({
      analysis: text
    });

  } catch(error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}