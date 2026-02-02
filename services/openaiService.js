const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateWorkoutPlanWithAI = async (profile) => {
  const prompt = `
You are a professional fitness coach.
Create a 7-day workout plan based on:
Age: ${profile.ageGroup}, Gender: ${profile.sex}, Height: ${profile.height}, Weight: ${profile.weight}, Goal: ${profile.goal}

Rules:
- Females slightly lower intensity
- Age <25 high energy, 25-45 moderate, >45 low impact
- Output STRICT JSON
Format:
{
  "plan": [
    { "day": "Day 1", "workout": ["Exercise 1", "Exercise 2"] }
  ]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = generateWorkoutPlanWithAI;