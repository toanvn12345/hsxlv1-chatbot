// netlify/functions/chat.js
export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const body = JSON.parse(event.body || '{}');
  const message = (body.message || '').toString().slice(0, 2000);
  if (!message) return { statusCode: 400, body: JSON.stringify({ error: 'Missing message' }) };

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI key not configured' }) };
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are HSXL ChatBot: a helpful Vietnamese/English study assistant for highschool students. Answer clearly and step-by-step if asked.' },
          { role: 'user', content: message }
        ],
        temperature: 0.2,
        max_tokens: 800
      })
    });

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? '';
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI request failed' }) };
  }
}
