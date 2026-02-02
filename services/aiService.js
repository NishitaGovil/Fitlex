const getAgeCategory = (age) => {
  if (age < 25) return "young";
  if (age <= 45) return "adult";
  return "senior";
};

const calculateBMI = (height, weight) => {
  const h = height / 100;
  return weight / (h * h);
};

const generatePlan = ({ age, gender, height, weight, goal }) => {
  const ageCategory = getAgeCategory(age);
  const bmi = calculateBMI(height, weight);

  let intensity = "medium";

  if (gender === "Female") intensity = "low";
  if (ageCategory === "senior") intensity = "low";
  if (goal === "Muscle Gain" && bmi < 22) intensity = "high";

  return [
    {
      day: "Day 1",
      workout: intensity === "low"
        ? ["Brisk Walking 20 min", "Stretching"]
        : ["Push-ups", "Squats", "Plank"]
    },
    {
      day: "Day 2",
      workout: ["Yoga", "Core Exercises"]
    },
    {
      day: "Day 3",
      workout: goal === "Fat Loss"
        ? ["Jump Rope", "HIIT"]
        : ["Chest + Triceps"]
    },
    {
      day: "Day 4",
      workout: ["Active Rest", "Walking"]
    },
    {
      day: "Day 5",
      workout: ["Leg Day"]
    },
    {
      day: "Day 6",
      workout: ["Full Body Workout"]
    },
    {
      day: "Day 7",
      workout: ["Stretching + Recovery"]
    }
  ];
};

module.exports = generatePlan;

const OpenAI = require("openai");