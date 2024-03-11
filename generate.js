const fs = require('fs');

// Function to generate a random number between 0 and 35
function getRandomNumber() {
  return Math.floor(Math.random() * 36);
}

// Function to generate results for a complete day (24 hours * 60 minutes)
function generateResultsForDay() {
  const results = {};

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute++) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      results[timeString] = getRandomNumber();
    }
  }

  return results;
}

// Generate results for a day
const dailyResults = generateResultsForDay();

// Write results to a JSON file
fs.writeFileSync('results.json', JSON.stringify(dailyResults, null, 2));

console.log('Results file generated successfully!');
