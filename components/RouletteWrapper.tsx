import React, { useState, useRef, useEffect } from "react";
import Wheel from "./Wheel";
import Board from "./Board";
import { List, Button, Progress } from '@mantine/core';
import { Item, PlacedChip, RouletteWrapperState, GameData, GameStages } from "./Global";
import { Timer } from "easytimer.js";
import classNames from "classnames";
import ProgressBarRound from "./ProgressBar";

const RouletteWrapper: React.FC<{ onNewNumber: (nextNumber: number) => void }> = (props) => {
  const rouletteWheelNumbers = [
    0o0, 27, 10, 25, 29, 12, 8, 19,
    31, 18, 6, 21, 33, 16, 4,
    23, 35, 14, 2, 0, 28, 9, 26,
    30, 11, 7, 20, 32, 17, 5, 22,
    34, 15, 3, 24, 36, 13, 1
  ];

  const timer = new Timer();
  const numberRef = useRef<HTMLInputElement>(null);
  const [nextNumber, setNextNumber] = useState<any>();

  const [state, setState] = useState<RouletteWrapperState>({
    rouletteData: {
      numbers: rouletteWheelNumbers
    },
    chipsData: {
      selectedChip: null,
      placedChips: new Map()
    },
    number: {
      next: null
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

  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35];

  useEffect(() => {
    const secondsUntilNextDraw = getSecondsUntilNextDraw();
    setState((prev) => ({ ...prev, countdownSeconds: secondsUntilNextDraw }));

    // Use the callback function with setInterval to access the current state correctly
    const intervalId = setInterval(() => {
      setState((prev) => {
        const countdownSeconds = prev.countdownSeconds - 1;

        if (countdownSeconds <= 0) {
          // Spin the wheel when countdown reaches 0
          const nextNumber = getNextNumberBasedOnTime();
          return { ...prev, number: { next: nextNumber }, countdownSeconds: 60 };
        } else {
          return { ...prev, countdownSeconds };
        }
      });
    }, 1000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);



  const onCellClick = (item: Item) => {
    const currentChips = state.chipsData.placedChips;
    const chipValue = state.chipsData.selectedChip;

    if (chipValue === 0 || chipValue === null) {
      return;
    }

    let currentChip = {} as PlacedChip;
    currentChip.item = item;
    currentChip.sum = chipValue;

    console.log(state.chipsData.placedChips);
    console.log(item);

    if (currentChips.get(item) !== undefined) {
      currentChip.sum += currentChips.get(item).sum;
    }

    currentChips.set(item, currentChip);
    setState((prev) => ({ ...prev, chipsData: { selectedChip: state.chipsData.selectedChip, placedChips: currentChips } }));
  };

  const onChipClick = (chip: number | null) => {
    if (chip != null) {
      setState((prev) => ({ ...prev, chipsData: { selectedChip: chip, placedChips: state.chipsData.placedChips } }));
    }
  };

  const getChipClasses = (chip: number) => {
    const cellClass = classNames({
      chip_selected: chip === state.chipsData.selectedChip,
      "chip-100": chip === 100,
      "chip-20": chip === 20,
      "chip-10": chip === 10,
      "chip-5": chip === 5
    });

    return cellClass;
  };

  const onSpinClick = () => {
    const nextNumber = numberRef.current?.value;
    if (nextNumber != null) {
      setState((prev) => ({ ...prev, number: { next: nextNumber } }));
    }
  };

  const getSecondsUntilNextDraw = () => {
    const currentTime = new Date();
    const secondsUntilNextDraw = 60 - currentTime.getSeconds(); // Adjust for initial seconds
    return secondsUntilNextDraw;
  };

  const getNextNumberBasedOnTime = () => {
    // For demonstration purposes, generating a random number between 0 and 35
    const randomNextNumber = Math.floor(Math.random() * 36);

    console.log(randomNextNumber, 'this randomNextNumber');
    return randomNextNumber;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNextNumber = getNextNumberBasedOnTime();
      setNextNumber(randomNextNumber);
      props.onNewNumber(randomNextNumber);
    }, 20000); // 20 seconds interval

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run the effect only once

  const placeBet = () => {
    const placedChipsMap = state.chipsData.placedChips
    const chips: PlacedChip[] = [];

    for (let key of Array.from(placedChipsMap.keys())) {
      const chipsPlaced = placedChipsMap.get(key) as PlacedChip;
      console.log("place chips");
      console.log(chips);
      console.log(chipsPlaced);
      console.log(chips.length);
      chips.push(chipsPlaced);
    }

    // Replace this with your logic for placing the bet
    console.log("Placing bet:", chips);
  };

  const clearBet = () => {
    setState({
      ...state,
      chipsData: {
        selectedChip: null, // Add this line to include selectedChip in the state update
        placedChips: new Map()
      }
    });
  };


  return (
    <div className="-mt-24  absolute">

      <div>
      <img src="/wheelcontainer.png" className="absolute h-[40%] w-[60%] ml-[74%]  mt-[32%]" />
        
        <div className=" scale-[54%] ml-[70%]  ">
          <Wheel rouletteData={state.rouletteData} number={state.number} />
        </div>
        <div className="w-[110%] mt-4 [100%] absolute">
        <Board
          onCellClick={onCellClick}
          chipsData={state.chipsData}
          rouletteData={state.rouletteData}
        />
        </div>
      
      </div>

      <div>
        {/* <div className="roulette-actions hideElementsTest">
          <ul>
            <li>
              <Button variant="gradient" gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }} size="xl" onClick={() => clearBet()} >Clear Bet</Button>
            </li>
            <li className={"board-chip"}>
              <div
                key={"chip_100"}
                className={getChipClasses(100)}
                onClick={() => onChipClick(100)}
              >
                100
              </div>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_20"}>
                <div
                  className={getChipClasses(20)}
                  onClick={() => onChipClick(20)}
                >
                  20
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_10"}>
                <div
                  className={getChipClasses(10)}
                  onClick={() => onChipClick(10)}
                >
                  10
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_5"}>
                <div
                  className={getChipClasses(5)}
                  onClick={() => onChipClick(5)}
                >
                  5
                </div>
              </span>
            </li>
            <li>
              <Button disabled={state.stage === GameStages.PLACE_BET ? false : true}
                variant="gradient" gradient={{ from: 'orange', to: 'red' }} size="xl" onClick={() => placeBet()} >Place Bet</Button>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default RouletteWrapper;
