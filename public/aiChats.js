fetch("/ai/plan")
  .then(res => res.json())
  .then(data => {
    const planDiv = document.getElementById("plan");

    data.plan.forEach((day, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h4>${day.day}</h4>
        <ul>
          ${day.workout.map(w => `<li>${w}</li>`).join("")}
        </ul>
        <input type="checkbox" data-index="${index}" />
        Completed
      `;
      planDiv.appendChild(div);
    });

    updateProgress();
  });

function updateProgress() {
  const checks = document.querySelectorAll("input[type='checkbox']");
  checks.forEach(c =>
    c.addEventListener("change", () => {
      const done = document.querySelectorAll("input[type='checkbox']:checked").length;
      document.getElementById("progress").innerText =
        `Weekly Progress: ${Math.round((done / 7) * 100)}%`;
    })
  );

  const messages = [
    "Great job! Consistency wins 💪",
    "Small steps, big results 🚀",
    "You’re stronger than yesterday 🔥",
    "Discipline beats motivation 👊",
    "Keep going, you got this 🙌",
    "Almost there! 💥",
    "Finish strong 🏁"
  ];

  document.getElementById("motivation").innerText =
    messages[new Date().getDay()];
}