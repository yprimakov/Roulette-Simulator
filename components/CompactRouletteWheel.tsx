"use client";

import { useEffect, useState } from "react";
import { WHEEL_NUMBERS, RED_NUMBERS, BLACK_NUMBERS } from "@/constants/roulette";

interface CompactRouletteWheelProps {
  isSpinning: boolean;
  lastNumber?: number;
}

export default function CompactRouletteWheel({
  isSpinning,
  lastNumber,
}: CompactRouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);

  useEffect(() => {
    if (isSpinning && lastNumber !== undefined) {
      // Calculate rotation to land on the number
      const numberIndex = WHEEL_NUMBERS.indexOf(lastNumber);
      const segmentAngle = 360 / 37;
      // Multiple full rotations + target angle (negative for counter-clockwise)
      const targetRotation = rotation - (360 * 8 + numberIndex * segmentAngle);

      setRotation(targetRotation);

      // Show the number after animation
      setTimeout(() => {
        setDisplayNumber(lastNumber);
      }, 2000);
    }
  }, [isSpinning, lastNumber, rotation]);

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
    <div className="flex flex-col items-center justify-center">
      {/* Wheel Container */}
      <div className="relative w-48 h-48">
        {/* Outer decorative ring - STATIONARY */}
        <div className="absolute inset-0 rounded-full border-8 border-yellow-600 shadow-2xl bg-gradient-to-br from-yellow-700 to-yellow-900"></div>

        {/* Middle stationary ring */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-inner"></div>

        {/* Inner rotating number wheel */}
        <div
          className="absolute inset-8 rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
          }}
        >
          {/* Wheel segments - numbers arranged in a circle */}
          {WHEEL_NUMBERS.map((num, index) => {
            const angle = (index * 360) / 37;
            const color = getNumberColor(num);

            return (
              <div
                key={num}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateY(-50px) rotate(-${angle}deg)`,
                  transformOrigin: '0 0',
                }}
              >
                <div
                  className={`${color} rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white`}
                >
                  {num}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center hub - STATIONARY */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg flex items-center justify-center z-10">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          </div>
        </div>

        {/* Top pointer/arrow - STATIONARY */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-20">
          <div
            className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-500"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          ></div>
        </div>
      </div>

      {/* Result Display */}
      <div className="mt-4 text-center min-h-[80px] flex flex-col items-center justify-center">
        {displayNumber !== null && !isSpinning && (
          <div className="flex flex-col items-center space-y-2 animate-bounce-in">
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wide">
              Winner
            </div>
            <div
              className={`w-14 h-14 rounded-full ${getNumberColor(
                displayNumber
              )} border-4 border-white shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform`}
            >
              <span className="text-2xl font-bold text-white">
                {displayNumber}
              </span>
            </div>
            <div className={`text-sm font-bold ${getNumberTextColor(displayNumber)}`}>
              {RED_NUMBERS.includes(displayNumber)
                ? "RED"
                : BLACK_NUMBERS.includes(displayNumber)
                ? "BLACK"
                : "GREEN"}
            </div>
          </div>
        )}

        {isSpinning && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-yellow-400 text-sm font-bold">
              Spinning...
            </div>
          </div>
        )}

        {!isSpinning && displayNumber === null && (
          <div className="text-gray-500 text-sm">
            Ready to Spin
          </div>
        )}
      </div>
    </div>
  );
}
