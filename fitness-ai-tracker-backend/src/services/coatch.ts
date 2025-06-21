import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCoachingTip(parsed: Record<string, any>) {
  const parts = Object.entries(parsed)
    .map(([key, val]) => {
      if (val == null) return null;
      if (typeof val === 'string' || typeof val === 'number') {
        return `${key.replace(/([A-Z])/g, ' $1')}: ${val}`;
      }
      return `${key.replace(/([A-Z])/g, ' $1')}: ${JSON.stringify(val)}`;
    })
    .filter(Boolean);

  const prompt = `
You're a brutally honest, high-level human performance coach with deep psychological insight.

Here's a raw human log. It may be chaotic, expressive, emotional, incomplete, or totally freeform — analyze it deeply:
→ ${parts.join(', ')}

Respond with a clear, powerful insight or mindset reframe based on what they logged. Don't waste words — speak truth.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: [
      { role: 'system', content: 'You are a world-class coach, deeply intuitive, direct, and focused on transformation.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 100,
  });

  return response.choices?.[0]?.message?.content?.trim() || '';
}
