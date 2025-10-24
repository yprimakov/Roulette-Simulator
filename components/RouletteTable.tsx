"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Bet, BetType, ChipValue } from "@/types";
import { TABLE_NUMBERS, RED_NUMBERS, BLACK_NUMBERS, CHIP_VALUES } from "@/constants/roulette";
import ChipSelector from "./ChipSelector";
import Chip from "./Chip";
import Card from "./common/Card";
import Button from "./common/Button";
import AnimatedBorder from "./common/AnimatedBorder";

interface RouletteTableProps {
  onPlaceBet: (type: BetType, numbers?: number[]) => boolean;
  onReduceBet: (type: BetType, numbers?: number[]) => boolean;
  currentBets: Bet[];
  balance: number;
  selectedChip: ChipValue;
  lastWinningNumber: number | null;
  isSpinning: boolean;
  isEuropean: boolean;
  onSelectChip: (value: ChipValue) => void;
  onClearBets?: () => void;
  onDoubleBets?: () => void;
  onRepeatBets?: () => void;
  onSpin?: () => void;
  onToggleAutoPlay?: () => void;
  isAutoPlaying?: boolean;
}

interface AnimatedChip {
  id: string;
  amount: number;
  x: number;
  y: number;
  isWin: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export default function RouletteTable({
  onPlaceBet,
  onReduceBet,
  currentBets,
  balance,
  selectedChip,
  lastWinningNumber,
  isSpinning,
  isEuropean,
  onSelectChip,
  onClearBets,
  onDoubleBets,
  onRepeatBets,
  onSpin,
  onToggleAutoPlay,
  isAutoPlaying,
}: RouletteTableProps) {
  const [animatedChips, setAnimatedChips] = useState<AnimatedChip[]>([]);
  const [previousBets, setPreviousBets] = useState<Bet[]>([]);
  const [wasSpinning, setWasSpinning] = useState(false);

  // Track when spin ends to trigger animations
  useEffect(() => {
    if (wasSpinning && !isSpinning && lastWinningNumber !== null) {
      // Animate chips for all bets that were placed before the spin
      if (previousBets.length > 0) {
        const chips: AnimatedChip[] = previousBets.map((bet, index) => {
          const isWinningBet = bet.numbers.includes(lastWinningNumber);
          const betPos = getBetPosition(bet);
          
          // Define animation destinations
          // Winning chips move toward player chip stack (down and center)
          // Losing chips move up and away from player chip stack
          const endX = isWinningBet ? 50 : 50; // Center horizontally
          const endY = isWinningBet ? 90 : 10; // Down for wins, up for losses
          
          return {
            id: `${bet.id}-anim-${index}`,
            amount: bet.amount,
            x: betPos.x,
            y: betPos.y,
            isWin: isWinningBet,
            startX: betPos.x,
            startY: betPos.y,
            endX: endX,
            endY: endY,
          };
        });
        setAnimatedChips(chips);
        setTimeout(() => setAnimatedChips([]), 1500);
      }
    }
    setWasSpinning(isSpinning);
  }, [isSpinning, wasSpinning, lastWinningNumber, previousBets]);

  useEffect(() => {
    if (isSpinning && currentBets.length > 0) {
      setPreviousBets([...currentBets]);
    }
  }, [isSpinning, currentBets]);

  const getNumberColor = (num: number): string => {
    if (RED_NUMBERS.includes(num)) return "bg-roulette-red hover:brightness-110";
    if (BLACK_NUMBERS.includes(num)) return "bg-roulette-black hover:brightness-180";
    return "bg-green-800";
  };

  const getBetsOnNumber = (num: number): Bet[] => {
    // Only show chips on individual numbers for straight bets (inside bets)
    // Outside bets should only show chips on their designated areas
    return currentBets.filter((bet) => 
      bet.type === "straight" && bet.numbers.includes(num)
    );
  };

  const getBetsOnType = (type: BetType): Bet[] => {
    return currentBets.filter((bet) => bet.type === type);
  };

  // Calculate approximate position of a bet on the table for animation
  const getBetPosition = (bet: Bet): { x: number; y: number } => {
    // This is a simplified positioning system
    // In a real implementation, you'd want to track the actual DOM positions
    
    if (bet.type === "straight") {
      // For straight bets, position based on the number
      const num = bet.numbers[0];
      if (num === 0) return { x: 50, y: 20 }; // Zero position
      if (num === 37) return { x: 50, y: 10 }; // Double zero position
      
      // Position based on number layout
      const row = Math.floor((num - 1) / 3);
      const col = (num - 1) % 3;
      return { x: 30 + col * 20, y: 30 + row * 15 };
    }
    
    // For outside bets, position based on bet type
    switch (bet.type) {
      case "red":
        return { x: 70, y: 60 };
      case "black":
        return { x: 80, y: 60 };
      case "even":
        return { x: 75, y: 70 };
      case "odd":
        return { x: 65, y: 70 };
      case "low":
        return { x: 60, y: 80 };
      case "high":
        return { x: 85, y: 80 };
      case "dozen1":
        return { x: 20, y: 50 };
      case "dozen2":
        return { x: 30, y: 50 };
      case "dozen3":
        return { x: 40, y: 50 };
      case "column1":
        return { x: 15, y: 40 };
      case "column2":
        return { x: 25, y: 40 };
      case "column3":
        return { x: 35, y: 40 };
      default:
        return { x: 50, y: 50 };
    }
  };

  const getTotalBetAmount = (bets: Bet[]): number => {
    return bets.reduce((sum, bet) => sum + bet.amount, 0);
  };

  const handleNumberClick = (num: number, e: React.MouseEvent) => {
    console.log(`Clicked on number ${num}, isSpinning: ${isSpinning}`);
    const bets = getBetsOnNumber(num);
    const target = e.target as HTMLElement;

    // Check if clicking on the chip amount (to reduce)
    if (bets.length > 0 && getTotalBetAmount(bets) > 0 &&
        (target.classList.contains('bet-amount') || target.closest('.bet-amount'))) {
      console.log(`Reducing bet on ${num}`);
      onReduceBet("straight", [num]);
      return;
    }

    // Otherwise add to bet (allow multiple clicks)
    console.log(`Placing bet on ${num}`);
    onPlaceBet("straight", [num]);
  };

  const handleOutsideBetClick = (type: BetType, e: React.MouseEvent) => {
    const bets = getBetsOnType(type);
    const target = e.target as HTMLElement;

    if (bets.length > 0 && getTotalBetAmount(bets) > 0 &&
        (target.classList.contains('bet-amount') || target.closest('.bet-amount'))) {
      onReduceBet(type);
      return;
    }

    onPlaceBet(type);
  };

  const renderChip = (amount: number) => {
    // Use the actual bet amount, not the closest chip value
    return (
      <div className="bet-amount absolute -top-1.5 -right-1.5 cursor-pointer hover:scale-110 transition-transform z-10">
        <div className="bg-white border-2 border-gray-300 rounded-full px-2 py-1 text-xs font-bold text-gray-800 shadow-md min-w-[32px] text-center">
          ${amount}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Main Table Grid - More Compact */}
      <div className="grid grid-cols-[auto_1fr_auto] gap-1">
        {/* Zero Column(s) */}
        <div className="flex flex-col items-center gap-1">
          {!isEuropean && (
            <button
              onClick={(e) => handleNumberClick(37, e)}
              className={`w-12 h-20 ${getNumberColor(0)} hover:brightness-110 transition-all rounded-lg border border-white/20 font-bold text-white text-xl relative ${lastWinningNumber === 37 ? 'winning-tile' : ''}`}
            >
              <span>00</span>
              {getBetsOnNumber(37).length > 0 && getTotalBetAmount(getBetsOnNumber(37)) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnNumber(37)))
              }
            </button>
          )}
          <button
            onClick={(e) => handleNumberClick(0, e)}
            className={`w-12 ${isEuropean ? 'h-full' : 'h-20'} ${getNumberColor(0)} hover:brightness-110 transition-all rounded-lg border border-white/20 font-bold text-white text-xl relative ${lastWinningNumber === 0 ? 'winning-tile' : ''}`}
          >
            <span>0</span>
            {getBetsOnNumber(0).length > 0 && getTotalBetAmount(getBetsOnNumber(0)) > 0 &&
              renderChip(getTotalBetAmount(getBetsOnNumber(0)))
            }
          </button>
        </div>

        {/* Main Number Grid */}
        <div className="space-y-1">
          {TABLE_NUMBERS.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-12 gap-1">
              {row.map((num) => (
                <button
                  key={num}
                  onClick={(e) => handleNumberClick(num, e)}
                  disabled={isSpinning}
                  className={`${getNumberColor(num)} transition-all w-full h-12 flex items-center justify-center border border-white/20 font-bold text-white text-base relative rounded-lg ${
                    isSpinning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  } ${lastWinningNumber === num ? 'winning-tile' : ''}`}
                >
                  {num}
                  {getBetsOnNumber(num).length > 0 && getTotalBetAmount(getBetsOnNumber(num)) > 0 &&
                    renderChip(getTotalBetAmount(getBetsOnNumber(num)))
                  }
                </button>
              ))}
            </div>
          ))}

          {/* Dozens */}
          <div className="grid grid-cols-3 gap-1 mt-1">
            <button
              onClick={(e) => handleOutsideBetClick("dozen1", e)}
              className="bg-green-800 hover:bg-green-700 transition-colors p-3 border border-white/20 font-bold text-white text-sm relative rounded-lg"
            >
              1st 12
              {getBetsOnType("dozen1").length > 0 && getTotalBetAmount(getBetsOnType("dozen1")) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType("dozen1")))
              }
            </button>
            <button
              onClick={(e) => handleOutsideBetClick("dozen2", e)}
              className="bg-green-800 hover:bg-green-700 transition-colors p-3 border border-white/20 font-bold text-white text-sm relative rounded-lg"
            >
              2nd 12
              {getBetsOnType("dozen2").length > 0 && getTotalBetAmount(getBetsOnType("dozen2")) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType("dozen2")))
              }
            </button>
            <button
              onClick={(e) => handleOutsideBetClick("dozen3", e)}
              className="bg-green-800 hover:bg-green-700 transition-colors p-3 border border-white/20 font-bold text-white text-sm relative rounded-lg"
            >
              3rd 12
              {getBetsOnType("dozen3").length > 0 && getTotalBetAmount(getBetsOnType("dozen3")) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType("dozen3")))
              }
            </button>
          </div>

          {/* Outside Bets */}
          <div className="grid grid-cols-6 gap-1">
            <button
              onClick={(e) => handleOutsideBetClick("low", e)}
              className="bg-green-800 hover:bg-green-700 transition-colors p-3 border border-white/20 font-bold text-white text-sm relative rounded-lg"
            >
              1-18
              {getBetsOnType("low").length > 0 && getTotalBetAmount(getBetsOnType("low")) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType("low")))
              }
            </button>
            <button
              onClick={(e) => handleOutsideBetClick("even", e)}
              className="bg-green-800 hover:bg-green-700 transition-colors p-3 border border-white/20 font-bold text-white text-sm relative rounded-lg"
            >
              EVEN
              {getBetsOnType("even").length > 0 && getTotalBetAmount(getBetsOnType("even")) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType("even")))
              }
            </button>
            <button
              onClick={(e) => handleOutsideBetClick("red", e)}
              className="bg-roulette-red hover:brightness-110 transition-all p-3 border border-white/20 font-bold text-white text-sm relative rounded-lg"
            >
              RED
              {getBetsOnType("red").length > 0 && getTotalBetAmount(getBetsOnType("red")) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType("red")))
              }
            </button>
            <button
              onClick={(e) => handleOutsideBetClick("black", e)}
              className="bg-roulette-black hover:brightness-180 transition-all p-3 border border-white/20 font-bold text-white text-sm relative rounded-lg"
            >
              BLACK
              {getBetsOnType("black").length > 0 && getTotalBetAmount(getBetsOnType("black")) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType("black")))
              }
            </button>
            <button
              onClick={(e) => handleOutsideBetClick("odd", e)}
              className="bg-green-800 hover:bg-green-700 transition-colors p-3 border border-white/20 font-bold text-white text-sm relative rounded-lg"
            >
              ODD
              {getBetsOnType("odd").length > 0 && getTotalBetAmount(getBetsOnType("odd")) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType("odd")))
              }
            </button>
            <button
              onClick={(e) => handleOutsideBetClick("high", e)}
              className="bg-green-800 hover:bg-green-700 transition-colors p-3 border border-white/20 font-bold text-white text-sm relative rounded-lg"
            >
              19-36
              {getBetsOnType("high").length > 0 && getTotalBetAmount(getBetsOnType("high")) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType("high")))
              }
            </button>
          </div>
        </div>

        {/* 2 to 1 Column */}
        <div className="flex flex-col gap-1">
          {[1, 2, 3].map((col) => (
            <button
              key={col}
              onClick={(e) => handleOutsideBetClick(`column${col}` as BetType, e)}
              className="bg-green-800 hover:bg-green-700 transition-colors p-3 border border-white/20 font-bold text-white h-12 text-sm relative rounded-lg"
            >
              2:1
              {getBetsOnType(`column${col}` as BetType).length > 0 && getTotalBetAmount(getBetsOnType(`column${col}` as BetType)) > 0 &&
                renderChip(getTotalBetAmount(getBetsOnType(`column${col}` as BetType)))
              }
            </button>
          ))}
        </div>
      </div>

      {/* Chip Selector and Action Buttons */}
      <div className="mt-4 flex items-center justify-between">
        {/* Balance Display */}
        <div className="flex gap-3">
          <Card className="bg-gradient-to-br from-green-900/90 to-green-950/90 backdrop-blur-sm">
            <div className="text-green-400 text-xs font-medium mb-1">Balance</div>
            <div className="text-white text-lg font-bold">${Math.floor(balance)}</div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/90 to-blue-950/90 backdrop-blur-sm">
            <div className="text-blue-400 text-xs font-medium mb-1">Total Bet</div>
            <div className="text-white text-lg font-bold">${currentBets.reduce((sum, bet) => sum + bet.amount, 0)}</div>
          </Card>
        </div>

        {/* Chip Selector */}
        <ChipSelector 
          selectedChip={selectedChip} 
          onSelectChip={onSelectChip}
          onClearBets={onClearBets}
          onDoubleBets={onDoubleBets}
          onRepeatBets={onRepeatBets}
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-32">
          {/* Spin Button */}
          {onSpin && (
            <Button
              onClick={onSpin}
              disabled={isSpinning || isAutoPlaying}
              color="primary"
              loading={isSpinning}
              loadingText="Spinning..."
              className="w-full"
            >
              {isSpinning ? "Spinning..." : "SPIN"}
            </Button>
          )}

          {/* Auto Play */}
          {onToggleAutoPlay && (
            <Button
              onClick={onToggleAutoPlay}
              disabled={isSpinning}
              color={isAutoPlaying ? "error" : "secondary"}
              shadow="lg"
              className="w-full"
            >
              {isAutoPlaying ? "Stop Auto" : "Auto Play"}
            </Button>
          )}
        </div>
      </div>

      {/* Spinning Logo Overlay */}
      {isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 drop-shadow-2xl">
          <div className="animate-spin-and-fade">
            <Image
              src="/img/roulette-logo.png"
              alt="Spinning Roulette"
              width={120}
              height={120}
              className=""
            />
          </div>
        </div>
      )}

      {/* Animated Chips Overlay */}
      {animatedChips.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {animatedChips.map((chip) => (
            <div
              key={chip.id}
              className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold shadow-2xl ${
                chip.isWin
                  ? 'bg-green-500 text-white border-green-700 animate-chip-win'
                  : 'bg-red-500 text-white border-red-700 animate-chip-loss'
              }`}
              style={{
                left: `${chip.startX}%`,
                top: `${chip.startY}%`,
                transform: chip.isWin
                  ? `translate(${(chip.endX - chip.startX)}vw, ${(chip.endY - chip.startY)}vh) scale(0.3)`
                  : `translate(${(chip.endX - chip.startX)}vw, ${(chip.endY - chip.startY)}vh) scale(0.3)`,
                opacity: 0,
              }}
            >
              ${chip.amount}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
