// pages/api/placeBet.js

import  connectDB  from '../../utils/connectDB';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userName, betAmount, betDetails } = req.body;

    try {
      // Connect to MongoDB
      const { db } = await connectDB();

      // Retrieve user's current balance
      const user = await db.collection('users').findOne({ userName });
      const currentBalance = user.balance;

      // Deduct bet amount from user's balance
      const updatedBalance = currentBalance - betAmount;

      // Update user's balance in the database
      await db.collection('users').updateOne(
        { userName },
        { $set: { balance: updatedBalance } }
      );

      // Insert bet details into the database
      await db.collection('bets').insertOne({
        userName,
        betAmount,
        betDetails,
        timestamp: new Date()
      });

      // Send back the updated balance to the client
      res.status(200).json({ balance: updatedBalance, message:"Your Bet has been accepted" });
    } catch (error) {
      console.error("Error placing bet:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}