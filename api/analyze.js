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
            "application/json"
        },

        body: JSON.stringify({

          model:
            "meta-llama/llama-3.1-8b-instruct:free",

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

    console.log(data);

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