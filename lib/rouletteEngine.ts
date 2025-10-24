import { RouletteNumber, SpinResult, Bet, GameStatistics } from "@/types";
import {
  ROULETTE_NUMBERS,
  RED_NUMBERS,
  BLACK_NUMBERS,
  WHEEL_NUMBERS,
} from "@/constants/roulette";

/**
 * Generate a cryptographically secure random roulette number
 * Uses Web Crypto API for true randomness
 */
export function spinWheel(): number {
  // Use crypto.getRandomValues for cryptographically secure random number
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomIndex = array[0] % 37; // 0-36 for European roulette
  return randomIndex;
}

/**
 * Get roulette number configuration
 */
export function getRouletteNumber(num: number): RouletteNumber {
  return ROULETTE_NUMBERS[num];
}

/**
 * Get the color of a roulette number
 */
export function getNumberColor(num: number): "red" | "black" | "green" {
  if (RED_NUMBERS.includes(num)) return "red";
  if (BLACK_NUMBERS.includes(num)) return "black";
  return "green";
}

/**
 * Check if a bet wins based on the spin result
 */
export function isBetWinning(bet: Bet, spinNumber: number): boolean {
  return bet.numbers.includes(spinNumber);
}

/**
 * Calculate winnings for a bet
 */
export function calculateWinnings(bet: Bet, spinNumber: number): number {
  if (isBetWinning(bet, spinNumber)) {
    return bet.amount * bet.payoutRatio + bet.amount; // Payout + original bet
  }
  return 0;
}

/**
 * Process a spin and calculate results
 */
export function processSpin(
  spinNumber: number,
  bets: Bet[]
): Omit<SpinResult, "id" | "timestamp"> {
  const rouletteNum = getRouletteNumber(spinNumber);
  const winningBets: Bet[] = [];
  let totalWinnings = 0;
  let totalBetAmount = 0;

  bets.forEach((bet) => {
    totalBetAmount += bet.amount;
    const winnings = calculateWinnings(bet, spinNumber);

    if (winnings > 0) {
      winningBets.push(bet);
      totalWinnings += winnings;
    }
  });

  return {
    number: spinNumber,
    color: rouletteNum.color,
    isOdd: rouletteNum.isOdd,
    isHigh: rouletteNum.isHigh,
    winningBets,
    totalWinnings,
    totalBetAmount,
    netProfit: totalWinnings - totalBetAmount,
  };
}

/**
 * Calculate consecutive streaks from spin history
 */
export function calculateConsecutiveStreaks(
  spinHistory: SpinResult[]
): {
  consecutiveRed: number;
  consecutiveBlack: number;
  consecutiveOdd: number;
  consecutiveEven: number;
  consecutiveHigh: number;
  consecutiveLow: number;
} {
  if (spinHistory.length === 0) {
    return {
      consecutiveRed: 0,
      consecutiveBlack: 0,
      consecutiveOdd: 0,
      consecutiveEven: 0,
      consecutiveHigh: 0,
      consecutiveLow: 0,
    };
  }

  const latest = spinHistory[0];
  let consecutiveRed = 0;
  let consecutiveBlack = 0;
  let consecutiveOdd = 0;
  let consecutiveEven = 0;
  let consecutiveHigh = 0;
  let consecutiveLow = 0;

  // Count consecutive streaks for current pattern
  for (const spin of spinHistory) {
    // Check color streak
    if (latest.color === "red" && spin.color === "red") {
      consecutiveRed++;
    } else if (latest.color === "black" && spin.color === "black") {
      consecutiveBlack++;
    } else if (spin.color !== "green") {
      break; // Color streak broken
    }

    // Check odd/even streak (ignore green)
    if (spin.color !== "green") {
      if (latest.isOdd && spin.isOdd) {
        consecutiveOdd++;
      } else if (!latest.isOdd && !spin.isOdd) {
        consecutiveEven++;
      } else {
        break; // Odd/even streak broken
      }
    }

    // Check high/low streak (ignore green)
    if (spin.color !== "green") {
      if (latest.isHigh && spin.isHigh) {
        consecutiveHigh++;
      } else if (!latest.isHigh && !spin.isHigh) {
        consecutiveLow++;
      } else {
        break; // High/low streak broken
      }
    }
  }

  return {
    consecutiveRed,
    consecutiveBlack,
    consecutiveOdd,
    consecutiveEven,
    consecutiveHigh,
    consecutiveLow,
  };
}

/**
 * Calculate comprehensive game statistics from spin history
 */
export function calculateStatistics(
  spinHistory: SpinResult[],
  startingBalance: number,
  currentBalance: number,
  maxBalance: number,
  minBalance: number
): GameStatistics {
  if (spinHistory.length === 0) {
    return {
      totalSpins: 0,
      totalBets: 0,
      totalWagered: 0,
      totalWinnings: 0,
      netProfit: 0,
      redCount: 0,
      blackCount: 0,
      greenCount: 0,
      redPercentage: 0,
      blackPercentage: 0,
      greenPercentage: 0,
      oddCount: 0,
      evenCount: 0,
      oddPercentage: 0,
      evenPercentage: 0,
      highCount: 0,
      lowCount: 0,
      highPercentage: 0,
      lowPercentage: 0,
      consecutiveRed: 0,
      consecutiveBlack: 0,
      consecutiveOdd: 0,
      consecutiveEven: 0,
      consecutiveHigh: 0,
      consecutiveLow: 0,
      maxConsecutiveRed: 0,
      maxConsecutiveBlack: 0,
      maxConsecutiveOdd: 0,
      maxConsecutiveEven: 0,
      maxConsecutiveHigh: 0,
      maxConsecutiveLow: 0,
      startingBalance,
      currentBalance,
      maxBalance,
      minBalance,
    };
  }

  // Count colors
  let redCount = 0;
  let blackCount = 0;
  let greenCount = 0;
  let oddCount = 0;
  let evenCount = 0;
  let highCount = 0;
  let lowCount = 0;

  // Track max consecutive streaks
  let maxConsecutiveRed = 0;
  let maxConsecutiveBlack = 0;
  let maxConsecutiveOdd = 0;
  let maxConsecutiveEven = 0;
  let maxConsecutiveHigh = 0;
  let maxConsecutiveLow = 0;

  let currentRedStreak = 0;
  let currentBlackStreak = 0;
  let currentOddStreak = 0;
  let currentEvenStreak = 0;
  let currentHighStreak = 0;
  let currentLowStreak = 0;

  let totalWagered = 0;
  let totalWinnings = 0;
  let totalBets = 0;

  // Process all spins (in reverse to track streaks correctly)
  const reversedHistory = [...spinHistory].reverse();

  reversedHistory.forEach((spin) => {
    // Count colors
    if (spin.color === "red") {
      redCount++;
      currentRedStreak++;
      currentBlackStreak = 0;
      maxConsecutiveRed = Math.max(maxConsecutiveRed, currentRedStreak);
    } else if (spin.color === "black") {
      blackCount++;
      currentBlackStreak++;
      currentRedStreak = 0;
      maxConsecutiveBlack = Math.max(maxConsecutiveBlack, currentBlackStreak);
    } else {
      greenCount++;
      currentRedStreak = 0;
      currentBlackStreak = 0;
    }

    // Count odd/even (ignore green)
    if (spin.color !== "green") {
      if (spin.isOdd) {
        oddCount++;
        currentOddStreak++;
        currentEvenStreak = 0;
        maxConsecutiveOdd = Math.max(maxConsecutiveOdd, currentOddStreak);
      } else {
        evenCount++;
        currentEvenStreak++;
        currentOddStreak = 0;
        maxConsecutiveEven = Math.max(maxConsecutiveEven, currentEvenStreak);
      }

      // Count high/low
      if (spin.isHigh) {
        highCount++;
        currentHighStreak++;
        currentLowStreak = 0;
        maxConsecutiveHigh = Math.max(maxConsecutiveHigh, currentHighStreak);
      } else {
        lowCount++;
        currentLowStreak++;
        currentHighStreak = 0;
        maxConsecutiveLow = Math.max(maxConsecutiveLow, currentLowStreak);
      }
    }

    // Accumulate wagered and winnings
    totalWagered += spin.totalBetAmount;
    totalWinnings += spin.totalWinnings;
    totalBets += spin.winningBets.length > 0 ? 1 : 0;
  });

  const totalSpins = spinHistory.length;

  // Calculate percentages
  const redPercentage = (redCount / totalSpins) * 100;
  const blackPercentage = (blackCount / totalSpins) * 100;
  const greenPercentage = (greenCount / totalSpins) * 100;

  const nonGreenSpins = totalSpins - greenCount;
  const oddPercentage = nonGreenSpins > 0 ? (oddCount / nonGreenSpins) * 100 : 0;
  const evenPercentage = nonGreenSpins > 0 ? (evenCount / nonGreenSpins) * 100 : 0;
  const highPercentage = nonGreenSpins > 0 ? (highCount / nonGreenSpins) * 100 : 0;
  const lowPercentage = nonGreenSpins > 0 ? (lowCount / nonGreenSpins) * 100 : 0;

  // Get current consecutive streaks
  const currentStreaks = calculateConsecutiveStreaks(spinHistory);

  return {
    totalSpins,
    totalBets,
    totalWagered,
    totalWinnings,
    netProfit: currentBalance - startingBalance,
    redCount,
    blackCount,
    greenCount,
    redPercentage,
    blackPercentage,
    greenPercentage,
    oddCount,
    evenCount,
    oddPercentage,
    evenPercentage,
    highCount,
    lowCount,
    highPercentage,
    lowPercentage,
    consecutiveRed: currentStreaks.consecutiveRed,
    consecutiveBlack: currentStreaks.consecutiveBlack,
    consecutiveOdd: currentStreaks.consecutiveOdd,
    consecutiveEven: currentStreaks.consecutiveEven,
    consecutiveHigh: currentStreaks.consecutiveHigh,
    consecutiveLow: currentStreaks.consecutiveLow,
    maxConsecutiveRed,
    maxConsecutiveBlack,
    maxConsecutiveOdd,
    maxConsecutiveEven,
    maxConsecutiveHigh,
    maxConsecutiveLow,
    startingBalance,
    currentBalance,
    maxBalance,
    minBalance,
  };
}
