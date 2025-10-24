"use client";

import { Bet } from "@/types";
import { calculateTotalBetAmount } from "@/lib/bettingSystem";

interface GameControlsProps {
  balance: number;
  currentBets: Bet[];
  isSpinning: boolean;
  isAutoPlaying: boolean;
  onSpin: () => void;
  onClearBets: () => void;
  onDoubleBets: () => void;
  onRepeatBets: () => void;
  onToggleAutoPlay: () => void;
}

export default function GameControls({
  balance,
  currentBets,
  isSpinning,
  isAutoPlaying,
  onSpin,
  onClearBets,
  onDoubleBets,
  onRepeatBets,
  onToggleAutoPlay,
}: GameControlsProps) {
  const totalBet = calculateTotalBetAmount(currentBets);
  const hasBets = currentBets.length > 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700">
      <div className="space-y-6">
        {/* Balance Display */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-lg p-4 border-2 border-green-600">
            <div className="text-green-400 text-sm font-medium mb-1">Balance</div>
            <div className="text-white text-2xl font-bold">
              ${balance.toFixed(2)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 rounded-lg p-4 border-2 border-yellow-600">
            <div className="text-yellow-400 text-sm font-medium mb-1">Total Bet</div>
            <div className="text-white text-2xl font-bold">
              ${totalBet.toFixed(2)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-lg p-4 border-2 border-blue-600">
            <div className="text-blue-400 text-sm font-medium mb-1">Bets Placed</div>
            <div className="text-white text-2xl font-bold">
              {currentBets.length}
            </div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="grid grid-cols-2 gap-4">
          {/* Spin Button */}
          <button
            onClick={onSpin}
            disabled={isSpinning || !hasBets || isAutoPlaying}
            className={`col-span-2 p-6 rounded-lg font-bold text-xl transition-all transform ${
              isSpinning || !hasBets || isAutoPlaying
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
            }`}
          >
            {isSpinning ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Spinning...</span>
              </div>
            ) : (
              "SPIN"
            )}
          </button>

          {/* Auto Play Button */}
          <button
            onClick={onToggleAutoPlay}
            disabled={isSpinning}
            className={`p-4 rounded-lg font-bold transition-all ${
              isAutoPlaying
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
            } ${isSpinning ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isAutoPlaying ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <span>STOP AUTO</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span>AUTO PLAY</span>
              </div>
            )}
          </button>

          {/* Clear Bets */}
          <button
            onClick={onClearBets}
            disabled={!hasBets || isSpinning || isAutoPlaying}
            className={`p-4 rounded-lg font-bold transition-all ${
              !hasBets || isSpinning || isAutoPlaying
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white"
            }`}
          >
            Clear Bets
          </button>
        </div>

        {/* Additional Controls */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onDoubleBets}
            disabled={!hasBets || isSpinning || isAutoPlaying || totalBet * 2 > balance}
            className={`p-3 rounded-lg font-semibold transition-all ${
              !hasBets || isSpinning || isAutoPlaying || totalBet * 2 > balance
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white"
            }`}
          >
            Double (x2)
          </button>

          <button
            onClick={onRepeatBets}
            disabled={isSpinning || isAutoPlaying}
            className={`p-3 rounded-lg font-semibold transition-all ${
              isSpinning || isAutoPlaying
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white"
            }`}
          >
            Repeat Last
          </button>
        </div>

        {/* Warnings */}
        {!hasBets && !isAutoPlaying && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 text-yellow-400 text-sm text-center">
            Place your bets to spin the wheel
          </div>
        )}

        {isAutoPlaying && (
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3 text-blue-400 text-sm text-center animate-pulse">
            Auto Play is active
          </div>
        )}
      </div>
    </div>
  );
}
