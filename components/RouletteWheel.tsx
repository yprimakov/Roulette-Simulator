"use client";

import { useEffect, useState } from "react";
import { WHEEL_NUMBERS, RED_NUMBERS, BLACK_NUMBERS } from "@/constants/roulette";

interface RouletteWheelProps {
  isSpinning: boolean;
  lastNumber?: number;
}

export default function RouletteWheel({
  isSpinning,
  lastNumber,
}: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);

  useEffect(() => {
    if (isSpinning && lastNumber !== undefined) {
      // Calculate rotation to land on the number
      const numberIndex = WHEEL_NUMBERS.indexOf(lastNumber);
      const segmentAngle = 360 / 37; // 37 numbers in European roulette
      const targetRotation = 360 * 5 + numberIndex * segmentAngle; // 5 full rotations + target

      setRotation(targetRotation);

      // Show the number after animation
      setTimeout(() => {
        setDisplayNumber(lastNumber);
      }, 2000);
    }
  }, [isSpinning, lastNumber]);

  const getNumberColor = (num: number): string => {
    if (RED_NUMBERS.includes(num)) return "bg-red-600";
    if (BLACK_NUMBERS.includes(num)) return "bg-gray-900";
    return "bg-green-600";
  };

  const getNumberTextColor = (num: number): string => {
    if (RED_NUMBERS.includes(num)) return "text-red-600";
    if (BLACK_NUMBERS.includes(num)) return "text-gray-900";
    return "text-green-600";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Wheel Container */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-8 border-yellow-600 shadow-2xl bg-gradient-to-br from-yellow-700 to-yellow-900"></div>

        {/* Spinning wheel */}
        <div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-inner transition-transform duration-2000 ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? "2000ms" : "0ms",
          }}
        >
          {/* Wheel numbers (simplified visual) */}
          {WHEEL_NUMBERS.map((num, index) => {
            const angle = (index * 360) / 37;
            const color = getNumberColor(num);

            return (
              <div
                key={num}
                className="absolute top-1/2 left-1/2 origin-left"
                style={{
                  transform: `rotate(${angle}deg) translateX(90px)`,
                  width: "20px",
                  height: "20px",
                }}
              >
                <div
                  className={`${color} rounded-full w-full h-full flex items-center justify-center text-white text-xs font-bold shadow-md`}
                >
                  {num}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          </div>
        </div>

        {/* Top pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-yellow-500"></div>
        </div>
      </div>

      {/* Result Display */}
      <div className="text-center">
        {displayNumber !== null && !isSpinning && (
          <div className="flex flex-col items-center space-y-2 animate-bounce-in">
            <div className="text-gray-400 text-sm font-medium uppercase tracking-wide">
              Winning Number
            </div>
            <div
              className={`w-20 h-20 rounded-full ${getNumberColor(
                displayNumber
              )} border-4 border-white shadow-2xl flex items-center justify-center`}
            >
              <span className="text-4xl font-bold text-white">
                {displayNumber}
              </span>
            </div>
            <div className={`text-lg font-bold ${getNumberTextColor(displayNumber)}`}>
              {RED_NUMBERS.includes(displayNumber)
                ? "RED"
                : BLACK_NUMBERS.includes(displayNumber)
                ? "BLACK"
                : "GREEN"}
            </div>
          </div>
        )}

        {isSpinning && (
          <div className="text-yellow-400 text-xl font-bold animate-pulse">
            Spinning...
          </div>
        )}

        {!isSpinning && displayNumber === null && (
          <div className="text-gray-500 text-lg">
            Place your bets
          </div>
        )}
      </div>
    </div>
  );
}
