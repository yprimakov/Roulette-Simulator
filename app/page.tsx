"use client";

import { useState } from "react";
import Image from "next/image";
import RouletteTable from "@/components/RouletteTable";
import SpinHistory from "@/components/SpinHistory";
import Statistics from "@/components/Statistics";
import SettingsModal from "@/components/SettingsModal";
import { useGameEngine } from "@/hooks/useGameEngine";
import { calculateTotalBetAmount } from "@/lib/bettingSystem";

export default function Home() {
  const {
    balance,
    currentBets,
    spinHistory,
    statistics,
    isSpinning,
    currentSpinNumber,
    selectedChip,
    setSelectedChip,
    isAutoPlaying,
    autoPlaySpeed,
    startingBalance,
    isEuropean,
    strategyConfig,
    placeBet,
    reduceBet,
    clearBets,
    doubleBets,
    repeatBets,
    spin,
    toggleAutoPlay,
    updateSettings,
  } = useGameEngine();

  const [showSettings, setShowSettings] = useState(false);

  const totalBet = calculateTotalBetAmount(currentBets);
  const hasBets = currentBets.length > 0;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Full Page Felt Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700"></div>
      <div 
        className="absolute inset-0 opacity-50 mix-blend-multiply"
        style={{
          backgroundImage: 'url(/img/felt.png)',
          backgroundSize: 'auto',
          backgroundPosition: '0 0',
          backgroundRepeat: 'repeat',
        }}
      ></div>

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen text-white">
        {/* Compact Header */}
        <header className="">
          <div className="max-w-full mx-auto px-4 pt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/img/roulette-logo.png"
                alt="Roulette Logo"
                width={40}
                height={40}
                className="drop-shadow-lg"
                priority
              />
              <h1 className="text-3xl font-bold bg-gradient-to-br from-slate-800 to-purple-900 bg-clip-text text-transparent mix-blend-multiply">
                Roulette Simulator
              </h1>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-800 hover:text-white"
              aria-label="Settings"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Game Area */}
        <div className="h-[calc(100vh-50px)] flex flex-col gap-2 px-4 pt-4">
          {/* Top Row - Betting Table and Spin History */}
          <div className="flex gap-4">
            {/* Left Column - Betting Table */}
            <div className="flex-1">
              <RouletteTable
                onPlaceBet={placeBet}
                onReduceBet={reduceBet}
                currentBets={currentBets}
                balance={balance}
                selectedChip={selectedChip}
                lastWinningNumber={currentSpinNumber ?? spinHistory[0]?.number ?? null}
                isSpinning={isSpinning}
                isEuropean={isEuropean}
                onSelectChip={setSelectedChip}
                onClearBets={clearBets}
                onDoubleBets={doubleBets}
                onRepeatBets={repeatBets}
                onSpin={spin}
                onToggleAutoPlay={toggleAutoPlay}
                isAutoPlaying={isAutoPlaying}
              />
            </div>

            {/* Right Column - Spin History */}
            <div className="w-[200px] flex flex-col">
              <SpinHistory spinHistory={spinHistory} />
            </div>
          </div>

          {/* Bottom Row - Statistics */}
          <div className="flex-1 overflow-y-auto">
            <Statistics statistics={statistics} spinHistory={spinHistory} balance={balance} />
          </div>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          startingBalance={startingBalance}
          autoPlaySpeed={autoPlaySpeed}
          isEuropean={isEuropean}
          strategyConfig={strategyConfig}
          onUpdateSettings={updateSettings}
        />
      </div>
    </main>
  );
}