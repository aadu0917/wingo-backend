const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const WINGO_URL = "https://www.82lottery.net/m/plan/wingo1.html";

function getColor(number) {
  number = parseInt(number);
  if ([1, 4, 7].includes(number)) return "Red";
  if ([2, 5, 8].includes(number)) return "Blue";
  if ([3, 6, 9, 0].includes(number)) return "Green";
  return "Unknown";
}

function getSize(number) {
  number = parseInt(number);
  return number >= 5 ? "Big" : "Small";
}

app.get("/api/latest-wingo", async (req, res) => {
  try {
    const response = await axios.get(WINGO_URL);
    const $ = cheerio.load(response.data);

    const rows = $(".table-bordered tr");
    const results = [];

    // Start from index 1 to skip table header
    rows.slice(1, 4).each((_, row) => {
      const tds = $(row).find("td");
      const period = $(tds[0]).text().trim();
      const number = $(tds[1]).text().trim();

      results.push({
        number,
        color: getColor(number),
        size: getSize(number)
      });

      if (_ === 0) {
        res.locals.period = period; // store latest period
      }
    });

    res.json({
      period: res.locals.period,
      results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Wingo data." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
