import React, { useState, useRef, useEffect, useContext } from "react";
import Wheel from "./Wheel";
import Board from "./Board";
import { List, Button, Progress } from '@mantine/core';
import { Item, PlacedChip, RouletteWrapperState, GameData, GameStages } from "./Global";
import { Timer } from "easytimer.js";
import classNames from "classnames";
import { motion } from 'framer-motion'
import { DataContext } from "@/store/GlobalState";
import { Howl } from "howler";
import axios from 'axios';
import Cookie from 'js-cookie';
import { useRouter } from "next/router";

interface RouletteWrapperProps {
  onNewNumber: (nextNumber: number) => void;
  initialTimeToDraw: string;
  initialWinningNumber: string;
}

const RouletteWrapper: React.FC<RouletteWrapperProps> = (props) => {

  const [timeToDraw, setTimeToDraw] = useState(props.initialTimeToDraw);
  const [winningNumber, setWinningNumber] = useState(props.initialWinningNumber);
  const [isWheelZoomed, setIsWheelZoomed] = useState(false);
  const [isWheelHidden, setIsWheelHidden] = useState(false);

  const rouletteWheelNumbers = [
    0o0, 27, 10, 25, 29, 12, 8, 19,
    31, 18, 6, 21, 33, 16, 4,
    23, 35, 14, 2, 0, 28, 9, 26,
    30, 11, 7, 20, 32, 17, 5, 22,
    34, 15, 3, 24, 36, 13, 1
  ];

  const timer = new Timer();
  const { state = {}, dispatch } = useContext(DataContext);
  const { auth = {} } = state;


  const numberRef = useRef<HTMLInputElement>(null);
  const [nextNumber, setNextNumber] = useState<any>();
  const [balance, setBalance] = useState<number | null>(0);
  const [winningAmt, setWinningAmt] = useState<number | null>(0);
  const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");
  const [message, setMessage] = useState("For amusement only no cash value");


  useEffect(() => {
    // Retrieve username from localStorage on component mount
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);




  useEffect(() => {
    if (auth && auth.user && auth.user.userName) {
      // Update state and localStorage when user is authenticated
      setUserName(auth.user.userName);
      localStorage.setItem("userName", auth.user.userName);
    }
  }, [auth]);


  const [states, setState] = useState<RouletteWrapperState>({
    rouletteData: {
      numbers: rouletteWheelNumbers
    },
    chipsData: {
      selectedChip: null,
      placedChips: new Map()
    },
    number: {
      next: null,
    },
    winners: [],
    history: [],
    stage: GameStages.NONE,
    username: "",
    endTime: 0,
    progressCountdown: 0,
    time_remaining: 0,
    countdownSeconds: 0,
  });

  let animateProgress: any;
  // console.log(winningNumber, 'winnin')

  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35];

  // useEffect(() => {
  //   const secondsUntilNextDraw = getSecondsUntilNextDraw();
  //   setState((prev) => ({ ...prev, countdownSeconds: secondsUntilNextDraw }));

  //   // Use the callback function with setInterval to access the current state correctly
  //   const intervalId = setInterval(() => {
  //     setState((prev) => {
  //       const countdownSeconds = prev.countdownSeconds - 1;

  //       if (countdownSeconds <= 0) {
  //         // Spin the wheel when countdown reaches 0
  //         const nextNumber = getNextNumberBasedOnTime();
  //         return { ...prev, number: { next: nextNumber }, countdownSeconds: 60 };
  //       } else {
  //         return { ...prev, countdownSeconds };
  //       }
  //     });
  //   }, 1000);

  //   // Cleanup on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  const spinningSound = new Howl({
    src: ["/ticktick.mp3"], // Provide the path to your spinning sound file
  });

  const chipSound = new Howl({
    src: ["/chipclick.mp3"], // Provide the path to your chip sound file
  });

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
        const newTimeDiff = Math.floor(
          (nextToDraw.getTime() - currentTime.getTime()) / 1000
        );
        setTimeDiff(newTimeDiff);
        const minutes = Math.floor(timeDiff / 60);
        const seconds = timeDiff % 60;
        const newTimeToDraw = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeDiff < 1) {
          // Call the getWinningNumber API only when timeToDraw is less than 1 second
          const response = await fetch('https://funroulettedemo.vercel.app/api/getWinningNumber');
          const data = await response.json();
          const newWinningNumber = data.winningNumber;
          setWinningNumber(newWinningNumber);
          setIsWheelZoomed(true);
        }

        if (timeDiff >= 54) {
          setIsWheelZoomed(false);
        }

        if (timeDiff == 30) {
          setIsWheelHidden(true);
        } else if (timeDiff < 10) {
          setIsWheelHidden(false);
        }

        if (timeDiff == 30 && !spinningSound.playing()) {
          // Play the spinning sound if not already playing
          spinningSound.play();
        } else if (timeDiff == 2 && spinningSound.playing()) {
          // Stop the spinning sound if playing and timeDiff is less than or equal to 2
          spinningSound.stop();
        }

        setTimeToDraw(newTimeToDraw);

        // console.log('timeDiff:', timeDiff);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToDraw]);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //      setBalance(auth.user.balance)
  //     } catch (error) {
  //       console.error('Error fetching balance:', error);
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [auth]);

  // console.log('isWheelHidden:', isWheelHidden);




  const [lastFiveWinningNumbers, setLastFiveWinningNumbers] = useState<number[]>([]);

  useEffect(() => {
    const fetchLastFiveWinningNumbers = async () => {
      try {
        const response = await fetch('https://funroulettedemo.vercel.app/api/fetchfive');
        const data = await response.json();

        setLastFiveWinningNumbers(data.lastFiveWinningNumbers);
      } catch (error) {
        console.error('Error fetching last 5 winning numbers:', error);
      }
    };

    fetchLastFiveWinningNumbers();
  }, []);




  const onCellClick = (item: Item) => {
    const currentChips = states.chipsData.placedChips;
    const chipValue = states.chipsData.selectedChip;

    if (chipValue === 0 || chipValue === null) {
      return;
    }

    let currentChip = {} as PlacedChip;
    currentChip.item = item;
    currentChip.sum = chipValue;

    if (currentChips.get(item) !== undefined) {
      currentChip.sum += currentChips.get(item).sum;
    }

    currentChips.set(item, currentChip);
    setState((prev) => ({ ...prev, chipsData: { selectedChip: states.chipsData.selectedChip, placedChips: currentChips } }));

    // Deduct the chip value from the balance in real-time
    // setBalance((prevBalance) => (prevBalance !== null ? prevBalance - chipValue : prevBalance));
  };
  const [isChipClicked, setIsChipClicked] = useState<any>();
  const [totalChipSum, setTotalChipSum] = useState<number>(0);

  const calculateTotalChipSum = () => {
    let sum = 0;
    setBetDetails(states.chipsData.placedChips)
    for (const [key, value] of states.chipsData.placedChips.entries()) {
      sum += value.sum;
    }
    return sum;
  };

  useEffect(() => {
    // Update the total chip sum whenever placed chips change
    const sum = calculateTotalChipSum();
    setTotalChipSum(sum);
    const newBetDetails = Array.from(states.chipsData.placedChips.values());
    setBetDetails(newBetDetails);
  }, [states.chipsData]);




  const onChipClick = (chip: number | null) => {
    if (chip != null) {
      setState((prev) => ({ ...prev, chipsData: { selectedChip: chip, placedChips: states.chipsData.placedChips } }));
    }
    chipSound.play();
    setIsChipClicked(true)
  };

  const getChipClasses = (chip: number) => {
    const isSelected = chip === states.chipsData.selectedChip;

    const cellClass = classNames({
      chip_selected: isSelected,
      "chip-5000": chip === 5000,
      "chip-1000": chip === 1000,
      "chip-500": chip === 500,
      "chip-100": chip === 100,
      "chip-50": chip === 50,
      "chip-10": chip === 10,
      "chip-5": chip === 5,
      "chip-1": chip === 1,
    });

    return cellClass;
  };


  // const onSpinClick = () => {
  //   const nextNumber = numberRef.current?.value;
  //   if (nextNumber != null) {
  //     setState((prev) => ({ ...prev, number: { next: nextNumber } }));
  //   }
  // };



  const calculateWinningsAPI = async (winningNumber: number, placedChips: PlacedChip[]) => {
    try {
      const response = await fetch('/api/calculateWinnings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winningNumber, placedChips }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setWinningAmt(data.winnings);
      return data.winnings;
    } catch (error) {
      console.error('Error calculating winnings:', error);
      return 0; // Default value or handle the error as needed
    }
  };

  const [timeDiff, setTimeDiff] = useState(0);
  const [betDetails, setBetDetails] = useState({});

  const [insufficient, setInsufficient] = useState(false);

  const placeBet = async () => {
    try {
      if (!balance || totalChipSum > balance) {
        setInsufficient(true);
        setMessage("Insufficient Balance")
        // If balance is null or totalChipSum is greater than balance, don't place the bet
        throw new Error('Insufficient balance to place bet');
      }

      if (timeDiff <= 10) {
        // If timeDiff is less than or equal to 10, don't place the bet
        throw new Error('Cannot place bet. Time difference is less than or equal to 10');
      }

      const response = await fetch('/api/placeBet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName, // Assuming the username is stored in auth.user.username
          betAmount: totalChipSum,
          betDetails: betDetails
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const message = data.message;
      setMessage("Your Bet has been accepted");
      const newBalance = data.balance;
      console.log("newBALANCE", newBalance);
      // Display the message on the client side
      console.log(message); // You can replace this with the logic to display the message in your UI
      setMessage("Your Bet has been accepted");

      clearBet(); // Clear placed chips
    } catch (error) {
      console.error('Error placing bet:', error);
      // Handle error as needed
    }
  };

  // console.log('bet detaiuls', states.chipsData.placedChips)
  const clearBet = () => {
    setState({
      ...states,
      chipsData: {
        selectedChip: null, // Add this line to include selectedChip in the state update
        placedChips: new Map()
      }
    });
    // setMessage("For amusement only no cash value");
    // setBalance(auth.user.balance); // Assuming `auth.user.balance` contains the initial balance
  };

  // console.log(insufficient, "insufficient?")





  // console.log(timeToDraw, 'timetodraw')
  // console.log(state.chipsData.placedChips, 'placed chips data')
  const redNumbers: number[] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const router = useRouter();


  const handleLogout = () => {
    Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
    localStorage.removeItem('firstLogin')
    dispatch({ type: 'AUTH', payload: {} })
    router.push('/')
  }


  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`/api/updateBalance?userName=${auth.user.userName}`);
        const updatedBalance = response.data.balance;
        setBalance(updatedBalance);
        if (states.chipsData.placedChips.size > 0)
          setMessage("You can either make a Bet or Press the BETOK Button");
        else if (states.chipsData.placedChips == 0)
          setMessage("For amusement only no cash value");
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };



    const interval = setInterval(fetchBalance, 1000); // Fetch balance every 3 seconds
    return () => clearInterval(interval);
  }, [auth]);

  return (
    <>
      <h1 className="text-white text-xs mt-[8.2%] z-20 ml-[85%] font- font-bold absolute">{winningAmt} </h1>
      {/* <h1 className="text-white text-3xl ml-24 absolute">{timeToDraw}</h1> */}
      <h1 className="text-white text-[10px] font-semibold font- ml-[6%] mt-[7.4%] z-20 absolute">
        {balance}.00
      </h1>

      <div className="z-30 flex space-x-3 absolute ml-[82%] text-[11px] mt-[13.2%]">
        {lastFiveWinningNumbers.map((number, index) => (
          <h1
            className={` z-30 ${redNumbers.includes(number) ? 'text-red-500' : 'text-white'
              }`}
            key={index}
          >
            {number}
          </h1>
        ))}
      </div>
      <img src="/status.png" className="h-6 w-[80%]  absolute mt-[42.5%] z-0 ml-[8%] " />
      <h1 className={`h-6 text-green-400 font-mono absolute mt-[43.2%] text-[10px] z-0 uppercase ml-[28%] tracking-widest `}>
        {timeDiff <= 10
          ? "Bet Time Over"
          : message}
      </h1>



      <img src="/exit.png" onClick={handleLogout} className="h-5 cursor-pointer   absolute mt-[42%] z-0 ml-[87.2%] brightness-150 " />
      <img src="/amt.png" className="h-6   absolute mt-[42%] z-0 ml-[-1.5%] brightness-150 " />
      <h1 className="text-white absolute h-6 mt-[43.2%] font-bold z-10 ml-[3%] text-xs ">{totalChipSum}</h1>
      <div className="-mt-24  absolute">

        <div>
          {/** Wheel DIV */} {/**TO BE ANIMATED */}
          <motion.div
            className={isWheelHidden ? "" : isWheelZoomed ? "  " : "   "}
            style={{ opacity: isWheelZoomed ? 1 : 1, scale: isWheelZoomed ? 1 : 1 }}
            // initial={{ opacity: 1, scale: 1 }}
            // animate={{ opacity: 1, scale: isWheelZoomed ? 2.5 : 1 }}
            // exit={{ opacity: 1, scale: 1 }}
            transition={{ ease: 'easeOut', duration: 7 }} // Adjust the duration as needed
          >
            <img src="/wheelcontainer.png" className={"absolute h-[35%] w-[80%] ml-[68%] mt-[33.5%]"} />
            <div className={"scale-[73.5%] transition-opacity duration-1000 ease-in   ml-[68%]"}>
              <Wheel rouletteData={states.rouletteData} number={states.number} winningNumber={winningNumber} />
            </div>
          </motion.div>
          {/**END OF WHEEL DIV */}

          <div className={"w-[100%] mt-4 [100%] absolute"}>
            <Board
              onCellClick={onCellClick}
              chipsData={states.chipsData}
              rouletteData={states.rouletteData}

            />
            <div className="BETOK CANCEL flex   w-screen  mt-[-9%] justify-end -ml-24   space-x-24 ">
              <img src="/take final.png" className={` h-6 -mt-[40%] absolute `} />

              <Button
                variant="gradient" gradient={{ from: 'orange', to: 'red' }} size="sm" onClick={() => placeBet()} >
                {/* <img src="/betok.png" className={classNames("bg absolute h-5 -mt-[39%] rounded-full ", { 'bg-green-400  animate-pulse': states.chipsData.placedChips.size > 0 })} /> */}
                <img
                  src="/betok.png"
                  className={`bg absolute h-5 rounded-full 
                -mt-[39%]
                } ${(timeDiff > 10 && states.chipsData.placedChips.size > 0) ?
                      'bg-green-500 animate-pulse rounded-full' :
                      ''
                    }`}
                />
              </Button>

            </div>
            <div className="flex justify-end w-screen -ml-44 ">
              <Button variant="gradient" gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }} size="xl" onClick={() => clearBet()} >
                <img src="/cancel.png" className={"h-5 absolute -mt-[32%] "} />

              </Button>
            </div>

          </div>

        </div>


        {/***CHIPS CONTAINER */}
        <div className={"-mt-[56%] ml-52 absolute"}>

          <div className="roulette-actions hideElementsTest">
            <ul className="-ml-20">


              <div>
                <div className="flex">
                  <li className={"board-chip"}>
                    <div
                      key={"chip_1"}
                      className={getChipClasses(1)}
                      onClick={() => onChipClick(1)}
                    >
                      <img src="/1.png" alt="" className={` ${getChipClasses(1)} ${states.chipsData.selectedChip === 1 ? 'border-2 border-green-500 bg-green-500 rounded-full' : ''}  -ml-14  w-56 hover:bg-green-500 rounded-full hover:border-2 hover:border-green-500`} />

                    </div>
                  </li>

                  <li className={"board-chip"}>
                    <span key={"chip_5"}>
                      <div
                        className={getChipClasses(5)}
                        onClick={() => onChipClick(5)}
                      >
                        <img src="/5.png" alt="" className={` ${getChipClasses(1)} ${states.chipsData.selectedChip === 5 ? 'border-2 border-green-500 bg-green-500 rounded-full' : ''}  -ml-12  w-56 hover:bg-green-500 rounded-full hover:border-2 hover:border-green-500`} />
                      </div>
                    </span>
                  </li>
                  <li className={"board-chip"}>
                    <span key={"chip_10"}>
                      <div
                        className={getChipClasses(10)}
                        onClick={() => onChipClick(10)}
                      >
                        <img src="/10.png" alt="" className={` ${getChipClasses(1)} ${states.chipsData.selectedChip === 10 ? 'border-2 border-green-500 bg-green-500 rounded-full' : ''}  -ml-10  w-56 hover:bg-green-500 rounded-full hover:border-2 hover:border-green-500`} />
                      </div>
                    </span>
                  </li>
                  <li className={"board-chip"}>
                    <span key={"chip_50"}>
                      <div
                        className={getChipClasses(50)}
                        onClick={() => onChipClick(50)}
                      >
                        <img src="/50.png" alt="" className={` ${getChipClasses(1)} ${states.chipsData.selectedChip === 50 ? 'border-2 border-green-500 bg-green-500 rounded-full' : ''}  -ml-8  w-56 hover:bg-green-500 rounded-full hover:border-2 hover:border-green-500`} />
                      </div>
                    </span>
                  </li>
                </div>

                <div className="flex">

                  <li className={"board-chip"}>

                    <div
                      key={"chip_100"}
                      className={getChipClasses(100)}
                      onClick={() => onChipClick(100)}
                    >
                      <img src="/100.png" alt="" className={` ${getChipClasses(1)} ${states.chipsData.selectedChip === 100 ? 'border-2 border-green-500 bg-green-500 rounded-full' : ''}  -ml-14  w-56 hover:bg-green-500 rounded-full hover:border-2 hover:border-green-500`} />

                    </div>
                  </li>

                  <li className={"board-chip"}>
                    <div
                      key={"chip_500"}
                      className={getChipClasses(500)}
                      onClick={() => onChipClick(500)}
                    >
                      <img src="/500.png" alt="" className={` ${getChipClasses(1)} ${states.chipsData.selectedChip === 500 ? 'border-2 border-green-500 bg-green-500 rounded-full' : ''}  -ml-12  w-56 hover:bg-green-500 rounded-full hover:border-2 hover:border-green-500`} />
                    </div>
                  </li>
                  <li className={"board-chip"}>
                    <div
                      key={"chip_1000"}
                      className={getChipClasses(1000)}
                      onClick={() => onChipClick(1000)}
                    >
                      <img src="/1000.png" alt="" className={` ${getChipClasses(1)} ${states.chipsData.selectedChip === 1000 ? 'border-2 border-green-500 bg-green-500 rounded-full' : ''}  -ml-10  w-56 hover:bg-green-500 rounded-full hover:border-2 hover:border-green-500`} />
                    </div>
                  </li>
                  <li className={"board-chip"}>
                    <div
                      key={"chip_5000"}
                      className={getChipClasses(5000)}
                      onClick={() => onChipClick(5000)}
                    >
                      <img src="/5000.png" alt="" className={` ${getChipClasses(1)} ${states.chipsData.selectedChip === 5000 ? 'border-2 border-green-500 bg-green-500 rounded-full' : ''}  -ml-8  w-56 hover:bg-green-500 rounded-full hover:border-2 hover:border-green-500`} />
                    </div>
                  </li>
                </div>
              </div>
            </ul>
          </div>
        </div>

        {/* <div className="flex gap-x-10">
        <li className={"board-chip"}>
          <span key={"chip_10"}>
            <div
              className={getChipClasses(10)}
              onClick={() => onChipClick(10)}
            >
              <img src="/10.png" alt="" className=" absolute -mt-[48%]   h-5 w-14 ml-2 hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
            </div>
          </span>
        </li>
        <li className={"board-chip"}>
          <span key={"chip_50"}>
            <div
              className={getChipClasses(50)}
              onClick={() => onChipClick(50)}
            >
              <img src="/50.png" alt="" className=" absolute -mt-[48%]    h-5 w-14 ml-2  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
            </div>
          </span>
        </li>
        <li className={"board-chip"}>
          <span key={"chip_100"}>
            <div
              className={getChipClasses(100)}
              onClick={() => onChipClick(100)}
            >
              <img src="/100.png" alt="" className=" absolute -mt-[48%]    h-5 w-14 ml-2  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
            </div>
          </span>
        </li>
        <li className={"board-chip"}>
          <span key={"chip_5"}>
            <div
              className={getChipClasses(5)}
              onClick={() => onChipClick(5)}
            >
              <img src="/5.png" alt="" className=" absolute -mt-[48%]   h-5 w-14 ml-2  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
            </div>
          </span>
        </li>

      </div> */}


      </div >

    </>
  );
}

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

    // Call the getWinningNumber API only when timeToDraw is less than 1 second
    if (timeDiff < 1) {
      const response = await fetch('https://funroulettedemo.vercel.app/api/getWinningNumber');
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

export default RouletteWrapper;