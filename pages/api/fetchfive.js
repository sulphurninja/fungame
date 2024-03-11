// pages/api/fetchfive.js

export default (req, res) => {
    try {
      const results = require('../../results.json'); // Adjust the path accordingly
  
      const currentTime = new Date();
      const currentMinute = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const currentMinuteIndex = Object.keys(results).indexOf(currentMinute);
  
      if (currentMinuteIndex === -1) {
        throw new Error(`No winning number found for minute ${currentMinute}`);
      }
  
      const lastFiveMinutes = Object.keys(results).slice(currentMinuteIndex - 5, currentMinuteIndex);
      const lastFiveWinningNumbers = lastFiveMinutes.map((minute) => results[minute]);
  
      res.status(200).json({ lastFiveWinningNumbers });
    } catch (error) {
      console.error('Error fetching winning numbers:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  