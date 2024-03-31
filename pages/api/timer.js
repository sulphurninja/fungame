// Server-side API route (e.g., /api/time)
export default function handler(req, res) {
  const currentTime = new Date();
  const nextToDraw = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    currentTime.getHours(),
    currentTime.getMinutes() + 1,
    0,
    0
  );

  const timeDiff = Math.floor((nextToDraw.getTime() - currentTime.getTime()) / 1000);
  
  res.status(200).json({ timeDiff });
}
