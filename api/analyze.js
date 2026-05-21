export default async function handler(req, res) {

  try {

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Say hello"
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
document.getElementById('aiResult').innerHTML = `
  <h3>AI Trading Coach</h3>
  <p>${data.analysis}</p>
`;
    console.log(data);

    return res.status(200).json(data);

  } catch(error) {

    console.log(error);

    return res.status(500).json({
      error: error.message
    });
  }
}