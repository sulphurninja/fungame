// pages/api/getWinningNumber.js

export default (req, res) => {
    try {
      const results = require('../../results.json'); // Adjust the path accordingly
  
      const currentTime = new Date();
      const currentMinute = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const winningNumber = results[currentMinute];
  
      if (winningNumber === undefined) {
        throw new Error(`No winning number found for minute ${currentMinute}`);
      }
  
      res.status(200).json({ winningNumber });
    } catch (error) {
      console.error('Error fetching winning number:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  