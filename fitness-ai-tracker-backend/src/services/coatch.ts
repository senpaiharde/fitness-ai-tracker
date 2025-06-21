import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCoachingTip(parsed: Record<string, any>, rawText: string) {
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
You're a psychologically aware AI coach.

The user just said:
→ "${rawText}"

Here's what we've logged recently:
→ ${parts.join(', ')}

Your job is to figure out what's really going on. Start a diagnostic conversation.

- Ask questions to clarify: hydration, sleep, stress, tension, food, emotion.
- If the user gives strong or clear answers, acknowledge and go deeper.
- Do NOT give fluffy motivation.
- Stay grounded, smart, real — like you're trying to solve a mystery inside their nervous system.

Reply like a real human would — with logic and intuition.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: [
      { role: 'system', content: 'You are a human-level coach trying to uncover root causes through smart questioning and reflection.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 120,
  });

  return response.choices?.[0]?.message?.content?.trim() || '';
}
