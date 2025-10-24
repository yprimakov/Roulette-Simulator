// Roulette number color types
export type RouletteColor = "red" | "black" | "green";

// Bet types
export type BetType =
  // Inside bets
  | "straight"
  | "split"
  | "street"
  | "corner"
  | "line"
  // Outside bets
  | "red"
  | "black"
  | "odd"
  | "even"
  | "low"
  | "high"
  | "dozen1"
  | "dozen2"
  | "dozen3"
  | "column1"
  | "column2"
  | "column3";

// Roulette number configuration
export interface RouletteNumber {
  number: number;
  color: RouletteColor;
  isOdd: boolean;
  isHigh: boolean; // 19-36 vs 1-18
  dozen: 1 | 2 | 3 | null; // null for 0/00
  column: 1 | 2 | 3 | null; // null for 0/00
}

// Individual bet
export interface Bet {
  id: string;
  type: BetType;
  amount: number;
  numbers: number[]; // Numbers covered by this bet
  payoutRatio: number;
  position?: { x: number; y: number }; // Position on table for UI
}

// Spin result
export interface SpinResult {
  id: string;
  number: number;
  color: RouletteColor;
  isOdd: boolean;
  isHigh: boolean;
  timestamp: Date;
  winningBets: Bet[];
  totalWinnings: number;
  totalBetAmount: number;
  netProfit: number;
}

// Game statistics
export interface GameStatistics {
  totalSpins: number;
  totalBets: number;
  totalWagered: number;
  totalWinnings: number;
  netProfit: number;

  // Color distribution
  redCount: number;
  blackCount: number;
  greenCount: number;
  redPercentage: number;
  blackPercentage: number;
  greenPercentage: number;

  // Odd/Even distribution
  oddCount: number;
  evenCount: number;
  oddPercentage: number;
  evenPercentage: number;

  // High/Low distribution
  highCount: number;
  lowCount: number;
  highPercentage: number;
  lowPercentage: number;

  // Consecutive counters (current)
  consecutiveRed: number;
  consecutiveBlack: number;
  consecutiveOdd: number;
  consecutiveEven: number;
  consecutiveHigh: number;
  consecutiveLow: number;

  // Maximum consecutive counters (all-time)
  maxConsecutiveRed: number;
  maxConsecutiveBlack: number;
  maxConsecutiveOdd: number;
  maxConsecutiveEven: number;
  maxConsecutiveHigh: number;
  maxConsecutiveLow: number;

  // Bankroll tracking
  startingBalance: number;
  currentBalance: number;
  maxBalance: number;
  minBalance: number;
}

// Strategy configuration
export interface StrategyConfig {
  enabled: boolean;
  initialBet: number;
  patternThreshold: number; // Consecutive spins before betting
  maxLossStreak: number; // Max consecutive losses before stopping
  targetProfit: number; // Auto-cashout target
  betType: "red" | "black" | "odd" | "even" | "low" | "high";
}

// Strategy state
export interface StrategyState {
  isActive: boolean;
  currentBet: number;
  consecutiveLosses: number;
  lastPattern: string | null;
  shouldBet: boolean;
  targetBetType: BetType | null;
}

// Game session
export interface GameSession {
  id: string;
  userId?: string;
  sessionName: string;
  startingBalance: number;
  currentBalance: number;
  maxBalance: number;
  totalSpins: number;
  totalBets: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  statistics: GameStatistics;
  spins: SpinResult[];
}

// Chip denomination
export type ChipValue = 1 | 5 | 10 | 25 | 100;

// Bet placement on table
export interface BetPlacement {
  type: BetType;
  numbers: number[];
  payoutRatio: number;
  label: string;
}
