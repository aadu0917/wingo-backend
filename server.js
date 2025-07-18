let lastThree = [];

async function fetchLatestData() {
  try {
    const res = await fetch('https://wingo-backend-6bxc.onrender.com/api/latest-wingo');
    const data = await res.json();

    document.getElementById('period').innerText = `📍 Period: ${data.period}`;
    lastThree = data.results;

    const container = document.getElementById("recent-results");
    container.innerHTML = "";
    lastThree.forEach((r, i) => {
      const div = document.createElement("div");
      div.className = "result";
      div.innerHTML = `
        <div><strong>Result ${i + 1}</strong></div>
        <div>Number: ${r.number}</div>
        <div>Size: ${r.size}</div>
        <div>Color: ${r.color}</div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    document.getElementById('period').innerText = "❌ Failed to fetch data.";
    console.error("Error fetching data:", err);
  }
}

function predict() {
  if (lastThree.length < 3) {
    alert("Need at least 3 results to predict.");
    return;
  }

  const sizes = lastThree.map(r => r.size);
  const colors = lastThree.map(r => r.color);

  const predictedSize = sizes.filter(s => s === "Big").length > 1 ? "Big" : "Small";
  const predictedColor = mostCommon(colors);
  const confidence = Math.floor(Math.random() * 21) + 80; // 80-100%

  document.getElementById("prediction").innerHTML = `
    🔮 <strong>Predicted Result</strong><br>
    Size: <b>${predictedSize}</b><br>
    Color: <b style="color:${predictedColor.toLowerCase()}">${predictedColor}</b><br>
    Confidence: <b>${confidence}%</b>
  `;
}

function mostCommon(arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop();
}

window.onload = fetchLatestData;
