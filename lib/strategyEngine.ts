import { StrategyConfig, StrategyState, SpinResult, BetType, Bet } from "@/types";
import { calculateConsecutiveStreaks } from "./rouletteEngine";
import { v4 as uuidv4 } from "uuid";

/**
 * Modified Martingale Strategy Engine
 *
 * Based on the original .NET implementation:
 * - Monitors consecutive patterns (red/black, odd/even, high/low)
 * - Triggers betting after patternThreshold consecutive results
 * - Doubles bet on each loss (Martingale)
 * - Stops after maxLossStreak consecutive losses
 * - Resets to initial bet on win
 */

/**
 * Determine if the strategy should place a bet based on pattern detection
 * SIMPLE MARTINGALE: Bet opposite of the last spin color
 */
export function shouldPlaceBet(
  spinHistory: SpinResult[],
  config: StrategyConfig,
  currentState: StrategyState
): { shouldBet: boolean; betType: BetType | null; reason: string } {
  if (!config.enabled) {
    return { shouldBet: false, betType: null, reason: "Strategy disabled" };
  }

  // Check if we've hit the max loss streak
  if (currentState.consecutiveLosses >= config.maxLossStreak) {
    return { shouldBet: false, betType: null, reason: "Max loss streak reached" };
  }

  // SIMPLE MARTINGALE: Always bet, choose color based on last spin
  let betType: BetType = "red"; // default

  // If we're in a losing streak, keep betting the same color
  if (currentState.consecutiveLosses > 0 && currentState.targetBetType) {
    betType = currentState.targetBetType;
  } else if (spinHistory.length > 0) {
    // Otherwise, bet opposite of the last spin
    const lastSpin = spinHistory[0];
    if (lastSpin.color === "red") {
      betType = "black";
    } else if (lastSpin.color === "black") {
      betType = "red";
    } else {
      // If last was green (0), bet red by default
      betType = "red";
    }
  }

  return {
    shouldBet: true,
    betType,
    reason: `Martingale: Betting ${betType}`,
  };
}

/**
 * Calculate the bet amount using Martingale progression
 */
export function calculateBetAmount(
  config: StrategyConfig,
  currentState: StrategyState
): number {
  if (currentState.consecutiveLosses === 0) {
    return config.initialBet;
  }

  // Double the bet for each consecutive loss
  // Formula: initialBet * (2 ^ consecutiveLosses)
  return config.initialBet * Math.pow(2, currentState.consecutiveLosses);
}

/**
 * Calculate required bankroll for the strategy
 */
export function calculateRequiredBankroll(config: StrategyConfig): number {
  let totalRequired = 0;

  for (let i = 0; i <= config.maxLossStreak; i++) {
    totalRequired += config.initialBet * Math.pow(2, i);
  }

  return totalRequired;
}

/**
 * Update strategy state after a spin
 */
export function updateStrategyState(
  currentState: StrategyState,
  spinResult: SpinResult,
  betWon: boolean,
  config: StrategyConfig
): StrategyState {
  const newState: StrategyState = { ...currentState };

  if (betWon) {
    // Reset on win
    newState.consecutiveLosses = 0;
    newState.currentBet = config.initialBet;
    newState.targetBetType = null;
    newState.lastPattern = null;
  } else {
    // Increment losses
    newState.consecutiveLosses += 1;
    newState.currentBet = calculateBetAmount(config, newState);

    // Check if we've hit the limit
    if (newState.consecutiveLosses >= config.maxLossStreak) {
      newState.isActive = false;
      newState.shouldBet = false;
    }
  }

  return newState;
}

/**
 * Get initial strategy state
 */
export function getInitialStrategyState(config: StrategyConfig): StrategyState {
  return {
    isActive: config.enabled,
    currentBet: config.initialBet,
    consecutiveLosses: 0,
    lastPattern: null,
    shouldBet: false,
    targetBetType: null,
  };
}

/**
 * Validate if balance is sufficient for strategy
 */
export function haseSufficientBankroll(
  balance: number,
  config: StrategyConfig
): { sufficient: boolean; required: number; shortfall: number } {
  const required = calculateRequiredBankroll(config);
  const sufficient = balance >= required;
  const shortfall = sufficient ? 0 : required - balance;

  return { sufficient, required, shortfall };
}

/**
 * Get strategy recommendation based on current state
 */
export function getStrategyRecommendation(
  spinHistory: SpinResult[],
  config: StrategyConfig,
  balance: number
): {
  shouldActivate: boolean;
  reason: string;
  suggestedBet?: { type: BetType; amount: number };
} {
  const bankrollCheck = haseSufficientBankroll(balance, config);

  if (!bankrollCheck.sufficient) {
    return {
      shouldActivate: false,
      reason: `Insufficient bankroll. Need $${bankrollCheck.required.toFixed(2)}, short by $${bankrollCheck.shortfall.toFixed(2)}`,
    };
  }

  if (spinHistory.length < config.patternThreshold) {
    return {
      shouldActivate: false,
      reason: `Need at least ${config.patternThreshold} spins to detect patterns`,
    };
  }

  const state = getInitialStrategyState(config);
  const decision = shouldPlaceBet(spinHistory, config, state);

  if (decision.shouldBet && decision.betType) {
    return {
      shouldActivate: true,
      reason: decision.reason,
      suggestedBet: {
        type: decision.betType,
        amount: config.initialBet,
      },
    };
  }

  return {
    shouldActivate: false,
    reason: "No betting pattern detected yet",
  };
}
