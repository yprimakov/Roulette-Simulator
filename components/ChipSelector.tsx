"use client";

import { ChipValue } from "@/types";
import { CHIP_VALUES } from "@/constants/roulette";
import Chip from "./Chip";

interface ChipSelectorProps {
  selectedChip: ChipValue;
  onSelectChip: (value: ChipValue) => void;
  onClearBets?: () => void;
  onDoubleBets?: () => void;
  onRepeatBets?: () => void;
}

export default function ChipSelector({
  selectedChip,
  onSelectChip,
  onClearBets,
  onDoubleBets,
  onRepeatBets,
}: ChipSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {/* Value Chips */}
      {CHIP_VALUES.map((value) => (
        <Chip
          key={value}
          value={value}
          size="medium"
          onClick={() => onSelectChip(value)}
          selected={selectedChip === value}
        />
      ))}
      
      {/* Spacer */}
      <div className="w-4"></div>
      
      {/* Action Chips */}
      <Chip
        value="clear"
        size="medium"
        onClick={onClearBets}
        tooltip="Clear all bets"
      />
      <Chip
        value="double"
        size="medium"
        onClick={onDoubleBets}
        tooltip="Double all bets"
      />
      <Chip
        value="repeat"
        size="medium"
        onClick={onRepeatBets}
        tooltip="Repeat last bet"
      />
    </div>
  );
}
