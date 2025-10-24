import { Bet, BetType, ChipValue } from "@/types";
import { BET_DEFINITIONS, PAYOUT_RATIOS } from "@/constants/roulette";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a new bet
 */
export function createBet(
  type: BetType,
  amount: ChipValue,
  numbers?: number[]
): Bet {
  const betDef = BET_DEFINITIONS[type];

  if (!betDef) {
    throw new Error(`Invalid bet type: ${type}`);
  }

  return {
    id: uuidv4(),
    type,
    amount,
    numbers: numbers || betDef.numbers,
    payoutRatio: betDef.payoutRatio,
  };
}

/**
 * Create a straight bet (single number)
 */
export function createStraightBet(number: number, amount: ChipValue): Bet {
  if (number < 0 || number > 36) {
    throw new Error(`Invalid number: ${number}`);
  }

  return {
    id: uuidv4(),
    type: "straight",
    amount,
    numbers: [number],
    payoutRatio: PAYOUT_RATIOS.straight,
  };
}

/**
 * Create a split bet (2 adjacent numbers)
 */
export function createSplitBet(
  number1: number,
  number2: number,
  amount: ChipValue
): Bet {
  return {
    id: uuidv4(),
    type: "split",
    amount,
    numbers: [number1, number2],
    payoutRatio: PAYOUT_RATIOS.split,
  };
}

/**
 * Create a street bet (row of 3 numbers)
 */
export function createStreetBet(
  startNumber: number,
  amount: ChipValue
): Bet {
  // Street bets cover 3 consecutive numbers in a row
  const numbers = [startNumber, startNumber + 1, startNumber + 2];

  return {
    id: uuidv4(),
    type: "street",
    amount,
    numbers,
    payoutRatio: PAYOUT_RATIOS.street,
  };
}

/**
 * Create a corner bet (4 numbers)
 */
export function createCornerBet(
  topLeftNumber: number,
  amount: ChipValue
): Bet {
  // Corner bets cover 4 numbers in a square
  const numbers = [
    topLeftNumber,
    topLeftNumber + 1,
    topLeftNumber + 3,
    topLeftNumber + 4,
  ];

  return {
    id: uuidv4(),
    type: "corner",
    amount,
    numbers,
    payoutRatio: PAYOUT_RATIOS.corner,
  };
}

/**
 * Create a line bet (2 rows of 3 numbers = 6 numbers)
 */
export function createLineBet(
  startNumber: number,
  amount: ChipValue
): Bet {
  // Line bets cover 6 numbers (2 rows of 3)
  const numbers = [
    startNumber,
    startNumber + 1,
    startNumber + 2,
    startNumber + 3,
    startNumber + 4,
    startNumber + 5,
  ];

  return {
    id: uuidv4(),
    type: "line",
    amount,
    numbers,
    payoutRatio: PAYOUT_RATIOS.line,
  };
}

/**
 * Validate if a bet can be placed given the current balance
 */
export function canPlaceBet(bet: Bet, currentBalance: number): boolean {
  return bet.amount <= currentBalance;
}

/**
 * Calculate total bet amount from an array of bets
 */
export function calculateTotalBetAmount(bets: Bet[]): number {
  return bets.reduce((total, bet) => total + bet.amount, 0);
}

/**
 * Double all current bets
 */
export function doubleBets(bets: Bet[]): Bet[] {
  return bets.map((bet) => ({
    ...bet,
    id: uuidv4(), // New ID for doubled bet
    amount: (bet.amount * 2) as ChipValue,
  }));
}

/**
 * Find if a bet already exists at a location
 */
export function findBetByType(bets: Bet[], type: BetType): Bet | undefined {
  return bets.find((bet) => bet.type === type);
}

/**
 * Find bets that cover a specific number
 */
export function findBetsByNumber(bets: Bet[], number: number): Bet[] {
  return bets.filter((bet) => bet.numbers.includes(number));
}

/**
 * Remove a specific bet
 */
export function removeBet(bets: Bet[], betId: string): Bet[] {
  return bets.filter((bet) => bet.id !== betId);
}

/**
 * Validate bet placement rules
 */
export function validateBetPlacement(
  bet: Bet,
  currentBets: Bet[],
  balance: number
): { valid: boolean; reason?: string } {
  // Check if balance is sufficient
  const totalBetAmount = calculateTotalBetAmount([...currentBets, bet]);
  if (totalBetAmount > balance) {
    return {
      valid: false,
      reason: `Insufficient balance. Need $${totalBetAmount}, have $${balance}`,
    };
  }

  // Note: Duplicate bet checking is now handled in placeBet function
  // This validation only checks balance and amount validity

  // Validate bet amount
  if (bet.amount <= 0) {
    return {
      valid: false,
      reason: "Bet amount must be greater than 0",
    };
  }

  return { valid: true };
}

/**
 * Get bet description for UI
 */
export function getBetDescription(bet: Bet): string {
  const betDef = BET_DEFINITIONS[bet.type];

  if (bet.type === "straight") {
    return `Straight: ${bet.numbers[0]}`;
  }

  if (betDef) {
    return `${betDef.label}: $${bet.amount}`;
  }

  return `${bet.type}: $${bet.amount}`;
}

/**
 * Get total potential winnings for all bets
 */
export function calculatePotentialWinnings(bets: Bet[]): number {
  return bets.reduce((total, bet) => {
    return total + bet.amount * bet.payoutRatio;
  }, 0);
}
