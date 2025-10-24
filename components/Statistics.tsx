"use client";

import { GameStatistics, SpinResult } from "@/types";
import { RED_NUMBERS, BLACK_NUMBERS } from "@/constants/roulette";
import Card from "@/components/common/Card";
import TrailingCount from "./TrailingCount";

interface StatisticsProps {
  statistics: GameStatistics;
  spinHistory: SpinResult[];
  balance: number;
}

export default function Statistics({
  statistics,
  spinHistory,
  balance,
}: StatisticsProps) {
  const getNumberColor = (num: number): string => {
    if (RED_NUMBERS.includes(num)) return "bg-roulette-red";
    if (BLACK_NUMBERS.includes(num)) return "bg-roulette-black";
    return "bg-roulette-green";
  };

  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0.0";
    }
    return value.toFixed(1);
  };

  return (
    <div className="space-y-4">
      
      {/* Multi-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Balance Stats */}
        <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm h-64">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center">
            <span className="mr-2">💰</span>
            Bankroll
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Current:</span>
              <span className="text-white font-bold">${balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Starting:</span>
              <span className="text-gray-300">${statistics.startingBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max:</span>
              <span className="text-green-400 font-semibold">${statistics.maxBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Min:</span>
              <span className="text-red-400 font-semibold">${statistics.minBalance.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Net Profit:</span>
                <span
                  className={`font-bold ${
                    statistics.netProfit >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {statistics.netProfit >= 0 ? "+" : ""}${statistics.netProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Spin Stats */}
        <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm h-64">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center">
            <span className="mr-2">🎲</span>
            Spin Stats
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Spins:</span>
              <span className="text-white font-bold">{statistics.totalSpins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Bets:</span>
              <span className="text-green-400 font-semibold">{statistics.totalBets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Wagered:</span>
              <span className="text-red-400 font-semibold">${statistics.totalWagered.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Winnings:</span>
              <span className="text-white font-bold">${statistics.totalWinnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Net Profit:</span>
              <span className={`font-bold ${statistics.netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                ${statistics.netProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Combined Distribution Stats */}
        <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm h-64">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center">
            <span className="mr-2">📊</span>
            Distribution Stats
          </h3>
          <div className="space-y-4 overflow-y-auto h-48">
            {/* Colors Section */}
            <div>
              <div className="space-y-2">
                {/* Red */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-400 font-semibold">Red</span>
                    <span className="text-white">
                      {statistics.redCount || 0} ({formatPercentage(statistics.redPercentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-roulette-red h-1.5 rounded-full transition-all"
                      style={{ width: `${statistics.redPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Black */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 font-semibold">Black</span>
                    <span className="text-white">
                      {statistics.blackCount || 0} ({formatPercentage(statistics.blackPercentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-roulette-black h-1.5 rounded-full transition-all"
                      style={{ width: `${statistics.blackPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Green */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-400 font-semibold">Green</span>
                    <span className="text-white">
                      {statistics.greenCount || 0} ({formatPercentage(statistics.greenPercentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-roulette-green h-1.5 rounded-full transition-all"
                      style={{ width: `${statistics.greenPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parity Section */}
            <div>
              <div className="space-y-2">
                {/* Odd */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-400 font-semibold">Odd</span>
                    <span className="text-white">
                      {statistics.oddCount || 0} ({formatPercentage(statistics.oddPercentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${statistics.oddPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Even */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-400 font-semibold">Even</span>
                    <span className="text-white">
                      {statistics.evenCount || 0} ({formatPercentage(statistics.evenPercentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${statistics.evenPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ranges Section */}
            <div>
              <div className="space-y-2">
                {/* Low */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-400 font-semibold">Low (1-18)</span>
                    <span className="text-white">
                      {statistics.lowCount || 0} ({formatPercentage(statistics.lowPercentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${statistics.lowPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* High */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-orange-400 font-semibold">High (19-36)</span>
                    <span className="text-white">
                      {statistics.highCount || 0} ({formatPercentage(statistics.highPercentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${statistics.highPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Trailing Count Stats */}
        <TrailingCount statistics={statistics} />


      </div>
    </div>
  );
}