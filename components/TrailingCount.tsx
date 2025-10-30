"use client";

import { GameStatistics } from "@/types";
import Card from "./common/Card";

interface TrailingCountProps {
  statistics: GameStatistics;
}

export default function TrailingCount({ statistics }: TrailingCountProps) {
  // Combine all trailing counts for table display
  const trailingCounts = [
    { type: "Red", current: statistics.consecutiveRed, max: statistics.maxConsecutiveRed },
    { type: "Black", current: statistics.consecutiveBlack, max: statistics.maxConsecutiveBlack },
    { type: "Odd", current: statistics.consecutiveOdd, max: statistics.maxConsecutiveOdd },
    { type: "Even", current: statistics.consecutiveEven, max: statistics.maxConsecutiveEven },
    { type: "Low", current: statistics.consecutiveLow, max: statistics.maxConsecutiveLow },
    { type: "High", current: statistics.consecutiveHigh, max: statistics.maxConsecutiveHigh },
  ];

  // Find the largest values for highlighting (excluding zeros)
  const nonZeroCurrents = trailingCounts.map(t => t.current).filter(val => val > 0);
  const nonZeroMaxs = trailingCounts.map(t => t.max).filter(val => val > 0);
  const maxCurrent = nonZeroCurrents.length > 0 ? Math.max(...nonZeroCurrents) : 0;
  const maxMax = nonZeroMaxs.length > 0 ? Math.max(...nonZeroMaxs) : 0;

  return (
    <Card outerClassName="h-full" className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm h-64 flex flex-col">
      <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center">
        <span className="mr-2">📈</span>
        Trailing Count
      </h3>
      
      <div className="space-y-3 flex-1">
        {/* Max Trail Count */}
        {/* <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="text-sm font-semibold text-gray-300 mb-1">Max Trail Count</div>
          <div className="text-white text-lg font-bold">{maxTrailCount} spin(s)</div>
        </div> */}

        {/* Max Trail Type */}
        {/* <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="text-sm font-semibold text-gray-300 mb-1">Max Trail Type</div>
          <div className="text-white text-lg font-bold">{maxTrailType}</div>
        </div> */}

        {/* Trailing Counts - Table Layout */}
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-400 border-b border-gray-600 pb-1">
            <div>Spins</div>
            <div className="text-right">Current</div>
            <div className="text-right">Max</div>
          </div>

          {/* Table Rows */}
          {trailingCounts.map(({ type, current, max }) => (
            <div key={type} className="grid grid-cols-3 gap-2 text-xs">
              {/* Label with color indicator */}
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  type === "Red" ? "bg-red-500" :
                  type === "Black" ? "bg-gray-800" :
                  type === "Odd" ? "bg-blue-500" :
                  type === "Even" ? "bg-purple-500" :
                  type === "Low" ? "bg-green-500" :
                  "bg-orange-500"
                }`}></div>
                <span className="text-gray-300">{type}</span>
              </div>
              
              {/* Current count */}
              <div className={`text-right font-semibold ${
                current === maxCurrent && current > 0 ? "text-yellow-400" : "text-white"
              }`}>
                {current}
              </div>
              
              {/* Max count */}
              <div className={`text-right font-semibold ${
                max === maxMax && max > 0 ? "text-yellow-400" : "text-white"
              }`}>
                {max}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
