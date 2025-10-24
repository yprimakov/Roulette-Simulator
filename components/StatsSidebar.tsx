"use client";

import { GameStatistics, SpinResult } from "@/types";
import Statistics from "@/components/Statistics";

interface StatsSidebarProps {
  statistics: GameStatistics;
  spinHistory: SpinResult[];
  balance: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function StatsSidebar({
  statistics,
  spinHistory,
  balance,
  isOpen,
  onToggle,
}: StatsSidebarProps) {

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full bg-gradient-to-b from-gray-900 to-gray-800
          border-l border-gray-700 shadow-2xl z-40 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ width: "380px" }}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-900 py-2 z-10">
            <h2 className="text-xl font-bold text-yellow-400">Statistics</h2>
            <button
              onClick={() => onToggle(false)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close statistics"
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

          {/* Statistics Content */}
          <Statistics
            statistics={statistics}
            spinHistory={spinHistory}
            balance={balance}
          />
        </div>
      </aside>

      {/* Toggle Button - Shows when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => onToggle(true)}
          className="
            fixed top-20 right-0 z-30
            bg-gradient-to-l from-yellow-600 to-yellow-700
            text-white px-3 py-8 rounded-l-lg
            shadow-lg hover:from-yellow-500 hover:to-yellow-600
            transition-all duration-200
            flex items-center gap-2
          "
          aria-label="Open statistics"
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-sm font-bold whitespace-nowrap transform -rotate-0">
            Stats
          </span>
        </button>
      )}

      {/* Overlay - when sidebar is open on smaller screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => onToggle(false)}
        />
      )}
    </>
  );
}
