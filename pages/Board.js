import React, { useEffect, useState } from 'react';

const Board = ({ initialTimeToDraw, initialWinningNumber }) => {
  const [timeToDraw, setTimeToDraw] = useState(initialTimeToDraw);
  const [winningNumber, setWinningNumber] = useState(initialWinningNumber);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const currentTime = new Date();
        const currentMinute = currentTime.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        });

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
        const minutes = Math.floor(timeDiff / 60);
        const seconds = timeDiff % 60;
        const newTimeToDraw = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (minutes < 1) {
          // Call the getWinningNumber API only when timeToDraw is less than 1
          const response = await fetch('http://localhost:3000/api/getWinningNumber');
          const data = await response.json();
          const newWinningNumber = data.winningNumber;
          setWinningNumber(newWinningNumber);
        }

        setTimeToDraw(newTimeToDraw);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='text-white'>
      <p>Time to Draw: {timeToDraw}</p>
      <p>Winning Number: {winningNumber}</p>
      {/* Rest of your component */}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const currentTime = new Date();
    const currentMinute = currentTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    // Calculate timeToDraw on the server side
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
    const minutes = Math.floor(timeDiff / 60);
    const seconds = timeDiff % 60;
    const timeToDraw = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    let winningNumber = '';

    // Call the getWinningNumber API only when timeToDraw is less than 1
    if (minutes < 1) {
      const response = await fetch('http://localhost:3000/api/getWinningNumber');
      const data = await response.json();
      winningNumber = data.winningNumber;
    }

    return {
      props: {
        initialTimeToDraw: timeToDraw,
        initialWinningNumber: winningNumber,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialTimeToDraw: '',


        
        initialWinningNumber: '',
      },
    };
  }
}

export default Board;
