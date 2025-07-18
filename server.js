const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/latest-wingo', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.82lottery.net/m/plan/wingo1.html');
    const $ = cheerio.load(data);

    const results = [];

    $('ul.game-list li').each((i, el) => {
      if (i >= 3) return false; // Only take last 3 results
      const periodNo = $(el).find('.game-issue').text().trim().replace('期', '');
      const valueText = $(el).find('.game-no').text().trim();
      const value = parseInt(valueText, 10);

      let color = 'Unknown';
      if ([1, 3, 7, 9].includes(value)) color = 'Red';
      else if ([2, 4, 6, 8].includes(value)) color = 'Green';
      else color = 'Violet';

      results.push({
        no: periodNo,
        value: value,
        color: color
      });
    });

    res.json({ periods: results });
  } catch (error) {
    console.error('Error fetching Wingo data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Wingo Prediction Backend is Running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
