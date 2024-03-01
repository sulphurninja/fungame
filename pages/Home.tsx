import Image from "next/image";
import { Inter } from "next/font/google";
import RouletteWrapper from "@/components/RouletteWrapper";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextToDraw = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    time.getHours(),
    time.getMinutes() + 1,
    0,
    0
  );

  const timeDiff: number = Math.floor((nextToDraw.getTime() - time.getTime()) / 1000);
  const minutes: number = Math.floor(timeDiff / 60);
  const seconds: number = timeDiff % 60;
  const timeToDraw: string = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const nextToDrawtime = nextToDraw.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const [nextNumber, setNextNumber] = useState<number | undefined>();

  const handleNewNumber = (number: number) => {
    setNextNumber(number);
  };
  console.log(nextNumber)

  return (
    <div className="h-screen w-full overflow-y-hidden absolute">
      <img src='/bg.png' className='w-full h-screen absolute' />
      <img src="/title.png" className="absolute h-10 ml-[30%]" />

      <div className="mx-6  grid grid-cols-3 ">
        <RouletteWrapper onNewNumber={handleNewNumber} />

        <div>
          <img src="/score.png" className="absolute h-12 mt-12" />
          <div className="">
            <img src="/timer.png" className="absolute h-10 mt-[12%]" />
            <h1 className="text-white  mt-[13%] text-sm ml-20   font-mono absolute ">{timeToDraw}</h1>
          </div>
          <div className="chips">
            <img src="/1.png" alt="" className="h-5 absolute mt-[18%] cursor-pointer hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
            <img src="/5.png" alt="" className="h-5 absolute mt-[18%] ml-[5%]  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
            <img src="/10.png" alt="" className="h-5 absolute mt-[18%] ml-[10%]  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
            <img src="/50.png" alt="" className="h-5 absolute mt-[18%] ml-[15%]  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400 " />
            <img src="/100.png" alt="" className="h-5 absolute mt-[22%]  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
            <img src="/500.png" alt="" className="h-5 absolute mt-[22%] ml-[5%]  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
            <img src="/1000.png" alt="" className="h-5 absolute mt-[22%] ml-[10%]  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400"/>
            <img src="/5000.png" alt="" className="h-5 absolute mt-[22%] ml-[15%]  hover:bg-amber-500 rounded-full hover:border-2 hover:border-amber-400" />
          </div>
        </div>

        <div>
          <img src="/winner.png" className="absolute h-9 mt-[6%] ml-[45%]" />
          <h1 className="absolute text-sm  mt-[8%] text-white font-mono ml-[52%]" >{nextNumber}</h1>

          <img src="/resul.png" className="absolute h-9 mt-[12%] ml-[44%]" />
          <img src="/zoom.png" className="absolute h-6 mt-[15%] ml-[45%]" />
          <div className="flex">
            <img src="/take final.png" className="absolute h-6 mt-[18%] ml-[42%]" />
            <img src="/betok.png" className="absolute h-6 mt-[18%] ml-[52%]" />

          </div>
          {/* <img src="/status.png" className="absolute h-10 -ml-[23%] mt-[40%]" /> */}
        </div>
        {/* <img src="/1.png" className="absolute h-12" /> */}
      </div>


    </div>
  );
}
