import "dotenv/config"


const getGeminiApiResponse = async (prompt) => {
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    options
  );
  const data = await response.json();

  // Log full response so you can see what Gemini actually returns
  console.log("Gemini raw response:", JSON.stringify(data));

  const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!output) throw new Error("Gemini returned no content");
  return output;
};

export default getGeminiApiResponse;
