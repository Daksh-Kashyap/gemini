import "dotenv/config"

const getGeminiApiResponse = async (prompt) => {
  
    const options = {
      
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    };
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        options
      );
      const data = await response.json();
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return output;
    } catch (err) {
      console.error(err);
    }
}

export default getGeminiApiResponse;
