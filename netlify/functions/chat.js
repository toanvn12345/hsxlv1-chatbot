const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const question = event.queryStringParameters.message || "";
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // tạo key trên OpenAI

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Trả lời câu hỏi học tập: ${question}` }]
      })
    });

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: answer })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Có lỗi xảy ra. Vui lòng thử lại." })
    };
  }
};
