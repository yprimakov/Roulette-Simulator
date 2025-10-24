import { useState, useCallback, useEffect, useRef } from "react";
import {
  Bet,
  BetType,
  ChipValue,
  SpinResult,
  GameStatistics,
  StrategyConfig,
  StrategyState,
} from "@/types";
import {
  spinWheel,
  processSpin,
  calculateStatistics,
} from "@/lib/rouletteEngine";
import {
  createBet,
  calculateTotalBetAmount,
  validateBetPlacement,
} from "@/lib/bettingSystem";
import {
  shouldPlaceBet,
  calculateBetAmount,
  updateStrategyState,
  getInitialStrategyState,
} from "@/lib/strategyEngine";
import { DEFAULT_STARTING_BALANCE, DEFAULT_STRATEGY_CONFIG } from "@/constants/roulette";
import { v4 as uuidv4 } from "uuid";

export function useGameEngine() {
  // Settings state
  const [startingBalance, setStartingBalance] = useState(DEFAULT_STARTING_BALANCE);
  const [isEuropean, setIsEuropean] = useState(false);

  // Game state
  const [balance, setBalance] = useState(DEFAULT_STARTING_BALANCE);
  const [maxBalance, setMaxBalance] = useState(DEFAULT_STARTING_BALANCE);
  const [minBalance, setMinBalance] = useState(DEFAULT_STARTING_BALANCE);
  const [currentBets, setCurrentBets] = useState<Bet[]>([]);
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinNumber, setCurrentSpinNumber] = useState<number | null>(null);
  const [selectedChip, setSelectedChip] = useState<ChipValue>(10);
  const [lastBets, setLastBets] = useState<Bet[]>([]);

  // Strategy state
  const [strategyConfig, setStrategyConfig] = useState<StrategyConfig>(
    DEFAULT_STRATEGY_CONFIG
  );
  const [strategyState, setStrategyState] = useState<StrategyState>(
    getInitialStrategyState(DEFAULT_STRATEGY_CONFIG)
  );

  // Auto-play state
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(2500); // 2.5 seconds between spins
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Statistics
  const [statistics, setStatistics] = useState<GameStatistics>(
    calculateStatistics([], startingBalance, balance, maxBalance, minBalance)
  );

  // Update statistics whenever spin history or balance changes
  useEffect(() => {
    const newStats = calculateStatistics(
      spinHistory,
      startingBalance,
      balance,
      maxBalance,
      minBalance
    );
    setStatistics(newStats);
  }, [spinHistory, balance, startingBalance, maxBalance, minBalance]);

  // Update max/min balance
  useEffect(() => {
    if (balance > maxBalance) {
      setMaxBalance(balance);
    }
    if (balance < minBalance) {
      setMinBalance(balance);
    }
  }, [balance, maxBalance, minBalance]);

  /**
   * Place a bet on the table
   */
  const placeBet = useCallback(
    (type: BetType, numbers?: number[]) => {
      try {
        // Check if a bet already exists on this position
        const existingBet = currentBets.find((bet) => {
          if (bet.type !== type) return false;
          if (numbers && numbers.length > 0) {
            // For straight bets, check if numbers match exactly
            return JSON.stringify(bet.numbers.sort()) === JSON.stringify(numbers.sort());
          }
          return true; // For outside bets, just check type
        });

        if (existingBet) {
          // Increment existing bet
          const newAmount = existingBet.amount + selectedChip;
          
          // Check if we have enough balance for the increment
          if (newAmount > balance) {
            console.warn("Insufficient balance to increment bet");
            return false;
          }

          setCurrentBets((prev) =>
            prev.map((bet) =>
              bet.id === existingBet.id
                ? { ...bet, amount: newAmount as ChipValue }
                : bet
            )
          );
        } else {
          // Create new bet
          const bet = createBet(type, selectedChip, numbers);
          const validation = validateBetPlacement(bet, currentBets, balance);

          if (!validation.valid) {
            console.warn("Bet placement failed:", validation.reason);
            return false;
          }

          setCurrentBets((prev) => [...prev, bet]);
        }

        return true;
      } catch (error) {
        console.error("Error placing bet:", error);
        return false;
      }
    },
    [selectedChip, currentBets, balance]
  );

  /**
   * Reduce a bet by the selected chip amount
   */
  const reduceBet = useCallback(
    (type: BetType, numbers?: number[]) => {
      try {
        // Find bets matching the type and numbers
        const matchingBets = currentBets.filter((bet) => {
          if (bet.type !== type) return false;
          if (numbers && numbers.length > 0) {
            // For straight bets, check if numbers match
            return JSON.stringify(bet.numbers.sort()) === JSON.stringify(numbers.sort());
          }
          return true;
        });

        if (matchingBets.length === 0) return false;

        // Calculate total amount of matching bets
        const totalAmount = matchingBets.reduce((sum, bet) => sum + bet.amount, 0);
        const newAmount = totalAmount - selectedChip;

        // Remove all matching bets
        setCurrentBets((prev) =>
          prev.filter((bet) => !matchingBets.includes(bet))
        );

        // If new amount is positive, add back a bet with reduced amount
        if (newAmount > 0) {
          const newBet = createBet(type, newAmount as ChipValue, numbers);
          setCurrentBets((prev) => [...prev, newBet]);
        }

        return true;
      } catch (error) {
        console.error("Error reducing bet:", error);
        return false;
      }
    },
    [selectedChip, currentBets]
  );

  /**
   * Clear all bets
   */
  const clearBets = useCallback(() => {
    setCurrentBets([]);
  }, []);

  /**
   * Double all current bets
   */
  const doubleBets = useCallback(() => {
    const totalBetAmount = calculateTotalBetAmount(currentBets || []) * 2;

    if (totalBetAmount > balance) {
      console.warn("Insufficient balance to double bets");
      return;
    }

    setCurrentBets((prev) =>
      prev.map((bet) => ({
        ...bet,
        id: uuidv4(),
        amount: (bet.amount * 2) as ChipValue,
      }))
    );
  }, [currentBets, balance]);

  /**
   * Repeat the last placed bets
   */
  const repeatBets = useCallback(() => {
    if (lastBets.length === 0) {
      console.warn("No previous bets to repeat");
      return;
    }

    const totalBetAmount = calculateTotalBetAmount(lastBets || []);

    if (totalBetAmount > balance) {
      console.warn("Insufficient balance to repeat bets");
      return;
    }

    setCurrentBets(
      lastBets.map((bet) => ({
        ...bet,
        id: uuidv4(), // Generate new IDs
      }))
    );
  }, [lastBets, balance]);

  /**
   * Execute a spin
   */
  const spin = useCallback(async (bets?: Bet[]) => {
    if (isSpinning) return;

    const betsToUse = bets || currentBets || [];
    const totalBetAmount = calculateTotalBetAmount(betsToUse);

    if (totalBetAmount > balance && betsToUse.length > 0) {
      console.warn("Insufficient balance for bets");
      return;
    }

    // Generate random number BEFORE spinning starts
    const winningNumber = spinWheel();
    setCurrentSpinNumber(winningNumber);

    setIsSpinning(true);

    // Save current bets for repeat functionality
    setLastBets(betsToUse);

    // Deduct bet amount from balance
    setBalance((prev) => prev - totalBetAmount);

    // Simulate spin delay for animation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Process spin results
    const spinResult = processSpin(winningNumber, betsToUse);

    // Create spin result with ID and timestamp
    const completeSpinResult: SpinResult = {
      ...spinResult,
      id: uuidv4(),
      timestamp: new Date(),
    };

    // Add to history (most recent first)
    setSpinHistory((prev) => [completeSpinResult, ...prev]);

    // Update balance with winnings
    setBalance((prev) => prev + spinResult.totalWinnings);

    // Update strategy state if enabled
    if (strategyConfig.enabled) {
      const betWon = spinResult.netProfit > 0;
      const newStrategyState = updateStrategyState(
        strategyState,
        completeSpinResult,
        betWon,
        strategyConfig
      );
      setStrategyState(newStrategyState);
    }

    // Clear current bets AFTER processing
    setCurrentBets([]);

    setIsSpinning(false);
  }, [isSpinning, currentBets, balance, strategyConfig, strategyState]);

  /**
   * Auto-play functionality
   */
  const performAutoPlay = useCallback(async () => {
    if (!isAutoPlaying || isSpinning) return;

    let betsToProcess: Bet[] = [];

    // If strategy is enabled, place bets automatically
    if (strategyConfig.enabled) {
      const decision = shouldPlaceBet(spinHistory, strategyConfig, strategyState);

      if (decision.shouldBet && decision.betType) {
        const betAmount = calculateBetAmount(strategyConfig, strategyState);

        // Create the strategy bet
        const bet = createBet(decision.betType, betAmount as ChipValue);
        betsToProcess = [bet];

        // Update state
        setCurrentBets([]);
        setCurrentBets([bet]);
        setStrategyState((prev) => ({
          ...prev,
          targetBetType: decision.betType,
        }));
      } else {
        // No bet to place, continue to next spin
        console.log("Strategy: No bet placed -", decision.reason);
        return;
      }
    } else if (currentBets.length === 0) {
      // No bets and strategy disabled, can't spin
      console.warn("Auto-play: No bets placed");
      setIsAutoPlaying(false);
      return;
    } else {
      // Use existing bets
      betsToProcess = currentBets;
    }

    // Execute the spin with the correct bets
    await spin(betsToProcess);
  }, [isAutoPlaying, isSpinning, strategyConfig, strategyState, spinHistory, currentBets, spin]);

  /**
   * Toggle auto-play
   */
  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => {
      const newState = !prev;
      // When turning on auto-play, enable Martingale strategy
      if (newState) {
        setStrategyConfig((prevConfig) => ({ ...prevConfig, enabled: true }));
        setStrategyState(getInitialStrategyState({ ...strategyConfig, enabled: true }));
      }
      return newState;
    });
  }, [strategyConfig]);

  /**
   * Auto-play timer effect
   */
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        performAutoPlay();
      }, autoPlaySpeed);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, autoPlaySpeed, performAutoPlay]);

  /**
   * Update strategy configuration
   */
  const updateStrategyConfig = useCallback((config: Partial<StrategyConfig>) => {
    setStrategyConfig((prev) => ({ ...prev, ...config }));
    setStrategyState(getInitialStrategyState({ ...strategyConfig, ...config }));
  }, [strategyConfig]);

  /**
   * Reset the game
   */
  const resetGame = useCallback(() => {
    setBalance(startingBalance);
    setMaxBalance(startingBalance);
    setMinBalance(startingBalance);
    setCurrentBets([]);
    setSpinHistory([]);
    setLastBets([]);
    setIsAutoPlaying(false);
    setStrategyState(getInitialStrategyState(strategyConfig));
  }, [strategyConfig, startingBalance]);

  /**
   * Update game settings
   */
  const updateSettings = useCallback(
    (settings: {
      startingBalance: number;
      autoPlaySpeed: number;
      isEuropean: boolean;
      strategyConfig: StrategyConfig;
    }) => {
      setStartingBalance(settings.startingBalance);
      setAutoPlaySpeed(settings.autoPlaySpeed);
      setIsEuropean(settings.isEuropean);
      setStrategyConfig(settings.strategyConfig);
      setStrategyState(getInitialStrategyState(settings.strategyConfig));
      // Reset game with new balance
      setBalance(settings.startingBalance);
      setMaxBalance(settings.startingBalance);
      setMinBalance(settings.startingBalance);
      setCurrentBets([]);
      setSpinHistory([]);
      setLastBets([]);
    },
    []
  );

  return {
    // State
    balance,
    currentBets,
    spinHistory,
    statistics,
    isSpinning,
    currentSpinNumber,
    selectedChip,
    isAutoPlaying,
    autoPlaySpeed,
    strategyConfig,
    strategyState,
    startingBalance,
    isEuropean,

    // Actions
    placeBet,
    reduceBet,
    clearBets,
    doubleBets,
    repeatBets,
    spin,
    toggleAutoPlay,
    setSelectedChip,
    setAutoPlaySpeed,
    updateStrategyConfig,
    resetGame,
    updateSettings,
  };
}
