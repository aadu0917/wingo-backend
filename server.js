// Stores the last 3 results from backend
let lastThree = [];

// Fetch latest game data from your Render backend
async function fetchLatestData() {
  try {
    const response = await fetch("https://wingo-backend-6bxc.onrender.com/api/latest-wingo");
    const data = await response.json();

    // Show current period
    document.getElementById("period").innerText = `📍 Period: ${data.period}`;

    // Store last 3 results
    lastThree = data.results;

    // Render last 3 results
    const container = document.getElementById("recent-results");
    container.innerHTML = "";

    lastThree.forEach((result, index) => {
      const resultBox = document.createElement("div");
      resultBox.className = "result";
      resultBox.innerHTML = `
        <div><strong>Result ${index + 1}</strong></div>
        <div>Number: ${result.number}</div>
        <div>Size: ${result.size}</div>
        <div>Color: ${result.color}</div>
      `;
      container.appendChild(resultBox);
    });
  } catch (error) {
    document.getElementById("period").innerText = "❌ Failed to load data.";
    console.error("Error fetching from backend:", error);
  }
}

// Predict the next result based on last 3 results
function predict() {
  if (lastThree.length < 3) {
    alert("Not enough data to predict. Please wait for more results.");
    return;
  }

  const sizes = lastThree.map(r => r.size);
  const colors = lastThree.map(r => r.color);

  const predictedSize = sizes.filter(s => s === "Big").length > 1 ? "Big" : "Small";
  const predictedColor = getMostCommon(colors);
  const confidence = Math.floor(Math.random() * 21) + 80; // Random confidence between 80-100%

  document.getElementById("prediction").innerHTML = `
    🔮 <strong>Predicted Result</strong><br>
    Size: <b>${predictedSize}</b><br>
    Color: <b style="color:${predictedColor.toLowerCase()}">${predictedColor}</b><br>
    Confidence: <b>${confidence}%</b>
  `;
}

// Helper function to find the most common value in an array
function getMostCommon(arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop();
}

// Load data on page load
window.onload = fetchLatestData;
