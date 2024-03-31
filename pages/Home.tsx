import Image from "next/image";
import { Inter } from "next/font/google";
import RouletteWrapper from "@/components/RouletteWrapper";
import { useContext, useEffect, useState } from "react";
import Wrapit from "@/components/Wrapit";
import { DataContext } from "@/store/GlobalState";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [time, setTime] = useState(new Date());
  const { state = {}, dispatch } = useContext(DataContext);
  const { auth = {} } = state;


  const [balance, setBalance] = useState<number | undefined>();


  // useEffect(() => {
  //   if (auth && auth.user && auth.user.balance) {
  //     setBalance(auth.user.balance);
  //     console.log(auth.user, 'user here')
  //   }
  //   console.log(balance, "this is my user balance bitch")
  // }, [auth]);

  // console.log(auth.user, 'user user')

  const [timeDiff, setTimeDiff] = useState(0);

  useEffect(() => {
    const fetchTimeDiff = async () => {
      try {
        const response = await fetch('/api/timer');
        const data = await response.json();
        setTimeDiff(data.timeDiff);
      } catch (error) {
        console.error('Error fetching time:', error);
      }
    };

    fetchTimeDiff();

    const interval = setInterval(fetchTimeDiff, 1000); // Fetch time difference periodically

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeDiff / 60);
  const seconds = timeDiff % 60;
  const timeToDraw = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const [nextNumber, setNextNumber] = useState<number | undefined>();

  const handleNewNumber = (number: number) => {
    setNextNumber(number);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`/api/updateBalance?userName=${auth.user.userName}`);
        const updatedBalance = response.data.balance;
        setBalance(updatedBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };



    const interval = setInterval(fetchBalance, 1000); // Fetch balance every 3 seconds
    return () => clearInterval(interval);
  }, [auth]);

  const [isWheelZoomed, setIsWheelZoomed] = useState(false);
  const [isWheelHidden, setIsWheelHidden] = useState(false);


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



        if (timeDiff == 30) {
          setIsWheelHidden(true);
        } else if (timeDiff < 10) {
          setIsWheelHidden(false);
        }


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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


  const redNumbers: number[] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];


  // console.log(balance, 'balance');

  const [isFullScreen, setIsFullScreen] = useState(false);

  const fullScreenButton = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };


  return (
    <div className="h-screen overflow-x-hidden w-screen absolute    overflow-y-hidden ">
      {/* <img src='/bg.png' className='w-full h-screen absolute' /> */}
      <div className='flex justify-center'>
        <img src="/title.png" className=" h-9 w-[34%] " />
        <h1 onClick={fullScreenButton} className='cursor-pointer text-2xl lg:text-3xl lg:block'>🖥️</h1>
      </div>
      <div className="w-full grid grid-cols-3  absolute h-full g mx-2 ">
        <div className="w-full"> {/** FIRST */}
          <div className="">
            <img src="/score.png" className="absolute h-12 " />
            <h1 className="text-white   text-[10px] ml-14 mt-5  font-mono absolute ">{balance}</h1>
          </div>
          <div className="mt-[20%]">
            <img src="/timer.png" className={`absolute h-10  `} />
            <h1 className={`text-  text-xs ml-20   absolute mt-3  font-mono  ${timeDiff <= 15 ? "animate-pulse mt-3 absolute text-amber-500" : "text-white"
              }`}>{timeToDraw}</h1>
          </div>
        </div>
        <div className="w-full  absolute ">
        <RouletteWrapper onNewNumber={handleNewNumber} initialWinningNumber="" initialTimeToDraw="" />
        </div>
    
  
      </div>
      <div className=" flex  justify-end   ">
          <div className="">
            <img src="/winner.png" className=" h-9  " />
            <h1 className="absolute text-sm  mt-[8%] text-white font-mono " >{nextNumber}</h1>
            <div className="mt-[20%]">
              <img src="/resul.png" className="  h-9 absolute  -ml-3" />
            </div>
            <div className="z-30 flex space-x-3 absolute mt-[1.2%] ml-9  text-[11px]  ">
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

          </div>
        </div>


    </div>
  );
}
