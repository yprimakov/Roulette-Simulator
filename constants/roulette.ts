import { RouletteNumber, ChipValue, BetPlacement } from "@/types";

// European Roulette wheel layout (American includes 00)
export const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

// Red numbers on roulette wheel
export const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

// Black numbers on roulette wheel
export const BLACK_NUMBERS = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

// Green numbers (0 and 00 for American)
export const GREEN_NUMBERS = [0];

// Generate complete roulette number configuration
export const ROULETTE_NUMBERS: RouletteNumber[] = Array.from(
  { length: 37 },
  (_, i) => {
    const number = i;
    let color: "red" | "black" | "green" = "green";

    if (RED_NUMBERS.includes(number)) color = "red";
    else if (BLACK_NUMBERS.includes(number)) color = "black";

    const isOdd = number !== 0 && number % 2 !== 0;
    const isHigh = number >= 19 && number <= 36;

    let dozen: 1 | 2 | 3 | null = null;
    if (number >= 1 && number <= 12) dozen = 1;
    else if (number >= 13 && number <= 24) dozen = 2;
    else if (number >= 25 && number <= 36) dozen = 3;

    let column: 1 | 2 | 3 | null = null;
    if (number !== 0) {
      column = ((number - 1) % 3) + 1 as 1 | 2 | 3;
    }

    return {
      number,
      color,
      isOdd,
      isHigh,
      dozen,
      column,
    };
  }
);

// Chip denominations
export const CHIP_VALUES: ChipValue[] = [1, 5, 10, 25, 100];

// Payout ratios for different bet types
export const PAYOUT_RATIOS = {
  straight: 35, // Single number
  split: 17, // 2 numbers
  street: 11, // 3 numbers
  corner: 8, // 4 numbers
  line: 5, // 6 numbers
  red: 1, // Red/Black
  black: 1,
  odd: 1, // Odd/Even
  even: 1,
  low: 1, // 1-18 / 19-36
  high: 1,
  dozen1: 2, // Dozens
  dozen2: 2,
  dozen3: 2,
  column1: 2, // Columns
  column2: 2,
  column3: 2,
} as const;

// Default starting balance
export const DEFAULT_STARTING_BALANCE = 10000;

// Default strategy configuration (from original .NET app)
export const DEFAULT_STRATEGY_CONFIG = {
  enabled: false,
  initialBet: 10,
  patternThreshold: 2, // Bet after 2 consecutive patterns
  maxLossStreak: 7, // Stop after 7 consecutive losses
  targetProfit: 1000,
  betType: "red" as const,
};

// Required bankroll for Modified Martingale (from original .NET app)
// $10 initial bet with 7 loss limit: $10 + $20 + $40 + $80 + $160 + $320 + $640 = $1,270
export const REQUIRED_BANKROLL = 1280;

// Bet type definitions for table layout
export const BET_DEFINITIONS: Record<string, BetPlacement> = {
  // Inside bets
  straight: {
    type: "straight",
    numbers: [], // Will be set dynamically for each individual number
    payoutRatio: 35,
    label: "Straight",
  },
  // Outside bets
  red: {
    type: "red",
    numbers: RED_NUMBERS,
    payoutRatio: 1,
    label: "Red",
  },
  black: {
    type: "black",
    numbers: BLACK_NUMBERS,
    payoutRatio: 1,
    label: "Black",
  },
  odd: {
    type: "odd",
    numbers: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
    payoutRatio: 1,
    label: "Odd",
  },
  even: {
    type: "even",
    numbers: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
    payoutRatio: 1,
    label: "Even",
  },
  low: {
    type: "low",
    numbers: Array.from({ length: 18 }, (_, i) => i + 1),
    payoutRatio: 1,
    label: "1-18",
  },
  high: {
    type: "high",
    numbers: Array.from({ length: 18 }, (_, i) => i + 19),
    payoutRatio: 1,
    label: "19-36",
  },
  dozen1: {
    type: "dozen1",
    numbers: Array.from({ length: 12 }, (_, i) => i + 1),
    payoutRatio: 2,
    label: "1st 12",
  },
  dozen2: {
    type: "dozen2",
    numbers: Array.from({ length: 12 }, (_, i) => i + 13),
    payoutRatio: 2,
    label: "2nd 12",
  },
  dozen3: {
    type: "dozen3",
    numbers: Array.from({ length: 12 }, (_, i) => i + 25),
    payoutRatio: 2,
    label: "3rd 12",
  },
  column1: {
    type: "column1",
    numbers: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    payoutRatio: 2,
    label: "2 to 1",
  },
  column2: {
    type: "column2",
    numbers: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    payoutRatio: 2,
    label: "2 to 1",
  },
  column3: {
    type: "column3",
    numbers: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    payoutRatio: 2,
    label: "2 to 1",
  },
};

// Table layout numbers (in order for display)
export const TABLE_NUMBERS = [
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
];
