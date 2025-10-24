"use client";

import { SpinResult } from "@/types";
import { RED_NUMBERS, BLACK_NUMBERS } from "@/constants/roulette";
import Card from "./common/Card";

interface SpinHistoryProps {
  spinHistory: SpinResult[];
}

export default function SpinHistory({ spinHistory }: SpinHistoryProps) {
  const getNumberColor = (num: number): string => {
    if (RED_NUMBERS.includes(num)) return "bg-roulette-red text-white";
    if (BLACK_NUMBERS.includes(num)) return "bg-roulette-black text-white";
    return "bg-roulette-green text-white";
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm">
      <div className="flex flex-col h-full max-h-[500px]">
        <h3 className="text-yellow-400 font-bold text-sm mb-3">Spin History</h3>

        <div className="flex-1 overflow-y-auto space-y-1">
          {spinHistory.length === 0 ? (
            <div className="text-gray-500 text-xs text-center py-4">
              No spins yet
            </div>
          ) : (
            spinHistory.slice(0, 7).map((spin, index) => (
              <div
                key={spin.id}
                className="flex items-center justify-between p-2 hover:bg-gray-700/30 transition-colors rounded"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full ${getNumberColor(
                      spin.number
                    )} flex items-center justify-center font-bold text-xs shadow-md border-2 border-white`}
                  >
                    {spin.number}
                  </div>
                  {/* <div className="text-xs text-gray-400">
                    {spin.color.toUpperCase()}
                  </div> */}
                </div>
                <div className="text-md">
                  {spin.netProfit > 0 ? (
                    <span className="text-green-400">
                      +${Math.abs(spin.netProfit)}
                    </span>
                  ) : spin.netProfit < 0 ? (
                    <span className="text-red-400">
                      -${Math.abs(spin.netProfit)}
                    </span>
                  ) : (
                    <span className="text-gray-400">$0</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* {spinHistory.length > 7 && (
          <div className="text-gray-500 text-xs text-center mt-2 pt-2 border-t border-gray-700">
            Showing latest 7 of {spinHistory.length} spins
          </div>
        )} */}
      </div>
    </Card>
  );
}
