# Roulette Strategy Simulator

A comprehensive web-based roulette simulation application built with Next.js 14, designed to test, analyze, and record statistical data on various roulette betting strategies, particularly the Modified Martingale Strategy.

## Features

### Core Game Engine
- **European Roulette**: 37 numbers (0-36) with single zero
- **Cryptographically Secure RNG**: Uses Web Crypto API for fair random number generation
- **Complete Betting System**: All inside and outside bets supported
- **Real-time Statistics**: Comprehensive tracking of all game metrics

### Betting Options
**Inside Bets:**
- Straight up (35:1)
- Split (17:1)
- Street (11:1)
- Corner (8:1)
- Line (5:1)

**Outside Bets:**
- Red/Black (1:1)
- Odd/Even (1:1)
- High/Low (1:1)
- Dozens (2:1)
- Columns (2:1)

### Modified Martingale Strategy
- Pattern detection (consecutive red/black, odd/even, high/low)
- Automatic bet doubling on losses
- Configurable loss limits
- Bankroll management

### Statistics & Analytics
- Color distribution tracking
- Odd/Even analysis
- High/Low patterns
- Consecutive streak tracking
- Maximum streak records
- Bankroll performance
- Win/loss ratios

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Database**: Supabase (planned)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Roulette-Simulator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── RouletteWheel.tsx # Wheel visualization
│   ├── RouletteTable.tsx # Betting table
│   ├── GameControls.tsx  # Game controls
│   └── Statistics.tsx    # Statistics display
├── hooks/                # Custom React hooks
│   └── useGameEngine.ts  # Main game logic hook
├── lib/                  # Core game logic
│   ├── rouletteEngine.ts # Roulette mechanics
│   ├── bettingSystem.ts  # Betting logic
│   └── strategyEngine.ts # Martingale strategy
├── types/                # TypeScript types
│   └── index.ts          # Type definitions
├── constants/            # Game constants
│   └── roulette.ts       # Roulette configuration
└── documentation/        # Project documentation
```

## How to Play

1. **Place Bets**: Click on numbers or betting areas on the roulette table
2. **Spin**: Click the "SPIN" button to spin the wheel
3. **Win**: Winning bets are automatically calculated and added to your balance
4. **Repeat**: Use "Repeat Last" to quickly place the same bets again
5. **Auto Play**: Enable auto-play for continuous spins (useful for strategy testing)

## Game Controls

- **SPIN**: Execute a single spin
- **AUTO PLAY**: Enable automatic continuous play
- **Clear Bets**: Remove all current bets
- **Double (x2)**: Double all current bet amounts
- **Repeat Last**: Repeat the last set of bets placed

## Statistics Tracked

- Total spins and bets
- Color distribution (Red/Black/Green)
- Odd/Even distribution
- High/Low distribution (1-18 vs 19-36)
- Current consecutive streaks
- Maximum consecutive streaks
- Bankroll performance (current, max, min)
- Net profit/loss

## Modified Martingale Strategy

The simulator includes the Modified Martingale betting strategy:

- **Initial Bet**: $10 (configurable)
- **Pattern Threshold**: 2 consecutive results (configurable)
- **Bet Doubling**: Doubles on each loss
- **Loss Limit**: 7 consecutive losses max (configurable)
- **Required Bankroll**: $1,280 minimum

### How It Works

1. Monitors for consecutive patterns (e.g., 2+ consecutive reds)
2. Bets on the opposite outcome (e.g., black after 2 reds)
3. Doubles the bet on each consecutive loss
4. Resets to initial bet on win
5. Stops after reaching max loss limit

## Future Enhancements

- [ ] Supabase integration for session persistence
- [ ] User accounts and authentication
- [ ] Session history and replay
- [ ] Advanced analytics and charts
- [ ] Custom strategy builder
- [ ] Export data to CSV/JSON
- [ ] Mobile app version
- [ ] Multiplayer mode

## Reference

This project is based on the original .NET Roulette Simulator found in `/Original.NET/`. The original implementation has been modernized using Next.js and TypeScript while maintaining all core functionality.

## License

This project is for educational purposes only. Gambling can be addictive - please gamble responsibly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
