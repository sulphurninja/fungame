// pages/api/getNextNumber.js
import data from '../../components/results.json';

export default function handler(req, res) {
  const currentTime = new Date();
  const formattedTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

  // Find the next draw time
  const nextDrawTime = data.find((entry) => entry.drawTime > formattedTime);

  // If there is a next draw time, use its couponNum; otherwise, default to 0
  const nextNumber = nextDrawTime ? nextDrawTime.couponNum : 0;

  res.status(200).json({ nextNumber });
}
