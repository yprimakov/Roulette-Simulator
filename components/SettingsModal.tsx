"use client";

import { useState, useEffect } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  startingBalance: number;
  autoPlaySpeed: number;
  isEuropean: boolean;
  strategyConfig: {
    enabled: boolean;
    initialBet: number;
    patternThreshold: number;
    maxLossStreak: number;
    targetProfit: number;
    betType: "red" | "black" | "odd" | "even" | "low" | "high";
  };
  onUpdateSettings: (settings: {
    startingBalance: number;
    autoPlaySpeed: number;
    isEuropean: boolean;
    strategyConfig: {
      enabled: boolean;
      initialBet: number;
      patternThreshold: number;
      maxLossStreak: number;
      targetProfit: number;
      betType: "red" | "black" | "odd" | "even" | "low" | "high";
    };
  }) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  startingBalance,
  autoPlaySpeed,
  isEuropean,
  strategyConfig,
  onUpdateSettings,
}: SettingsModalProps) {
  const [balance, setBalance] = useState(startingBalance);
  const [speed, setSpeed] = useState(autoPlaySpeed);
  const [european, setEuropean] = useState(isEuropean);
  const [strategy, setStrategy] = useState(strategyConfig);

  useEffect(() => {
    setBalance(startingBalance);
    setSpeed(autoPlaySpeed);
    setEuropean(isEuropean);
    setStrategy(strategyConfig);
  }, [startingBalance, autoPlaySpeed, isEuropean, strategyConfig]);

  const handleSave = () => {
    onUpdateSettings({
      startingBalance: balance,
      autoPlaySpeed: speed,
      isEuropean: european,
      strategyConfig: strategy,
    });
    onClose();
  };

  const handleReset = () => {
    setBalance(10000);
    setSpeed(2500);
    setEuropean(false);
    setStrategy({
      enabled: false,
      initialBet: 10,
      patternThreshold: 2,
      maxLossStreak: 7,
      targetProfit: 1000,
      betType: "red",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-xl flex-shrink-0">
          <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
            <svg
              className="w-6 h-6"
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
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 flex-1 overflow-y-auto">
          {/* Starting Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Starting Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                min="100"
                max="1000000"
                step="100"
                className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Minimum: $100 | Recommended: $10,000
            </p>
          </div>

          {/* Auto-Play Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Auto-Play Speed
            </label>
            <div className="space-y-2">
              <input
                type="range"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                min="500"
                max="5000"
                step="100"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Fast (0.5s)</span>
                <span className="text-yellow-400 font-bold">
                  {(speed / 1000).toFixed(1)}s
                </span>
                <span>Slow (5s)</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Time between spins in auto-play mode
            </p>
          </div>

          {/* Roulette Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Roulette Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEuropean(true)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    european
                      ? "bg-green-900 border-green-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500"
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">🇪🇺</div>
                  <div className="text-sm font-semibold">European</div>
                  <div className="text-xs opacity-75">37 numbers (0-36)</div>
                </div>
              </button>
              <button
                onClick={() => setEuropean(false)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${
                    !european
                      ? "bg-blue-900 border-blue-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500"
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">🇺🇸</div>
                  <div className="text-sm font-semibold">American</div>
                  <div className="text-xs opacity-75">38 numbers (0-00-36)</div>
                </div>
              </button>
            </div>
            
          </div>

          {/* Auto Play Strategy */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Auto Play Strategy
            </label>
            <div className="space-y-4">
              {/* Strategy Type */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Strategy Type
                </label>
                <select
                  value="martingale"
                  disabled
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-not-allowed opacity-50"
                >
                  <option value="martingale">Martingale</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Currently only Martingale strategy is available
                </p>
              </div>

              {/* Initial Bet */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Initial Bet Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={strategy.initialBet}
                    onChange={(e) => setStrategy({...strategy, initialBet: Number(e.target.value)})}
                    min="1"
                    max="1000"
                    step="1"
                    className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Starting bet amount for Martingale progression
                </p>
              </div>

              {/* Max Loss Streak */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Max Loss Streak
                </label>
                <input
                  type="number"
                  value={strategy.maxLossStreak}
                  onChange={(e) => setStrategy({...strategy, maxLossStreak: Number(e.target.value)})}
                  min="1"
                  max="15"
                  step="1"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Stop after this many consecutive losses (1-15)
                </p>
              </div>

              {/* Target Profit */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Target Profit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={strategy.targetProfit}
                    onChange={(e) => setStrategy({...strategy, targetProfit: Number(e.target.value)})}
                    min="10"
                    max="10000"
                    step="10"
                    className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Auto-cashout when profit reaches this amount
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 px-6 py-4 flex items-center justify-between rounded-b-xl flex-shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-lg transition-colors text-sm font-bold shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
