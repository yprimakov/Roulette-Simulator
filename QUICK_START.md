# Quick Start Guide

## Running the Application

### Development Mode

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Basic Usage

### 1. Place Your Bets

Click on any number or betting area on the roulette table to place a bet:

- **Straight Bets**: Click directly on any number (0-36)
- **Outside Bets**: Click on Red, Black, Odd, Even, 1-18, 19-36
- **Dozens**: Click "1st 12", "2nd 12", or "3rd 12"
- **Columns**: Click the "2:1" buttons on the right side

Each click places a bet with the currently selected chip value ($10 by default).

### 2. Spin the Wheel

Once you've placed your bets, click the **SPIN** button. The wheel will spin for 2 seconds and land on a random number.

### 3. View Results

- **Winning Number**: Displayed in the center of the wheel area
- **Winnings**: Automatically calculated and added to your balance
- **Statistics**: Updated in real-time on the left sidebar

### 4. Continue Playing

After a spin, you can:
- Place new bets manually
- Click **Repeat Last** to place the same bets again
- Click **Double (x2)** to double all current bets
- Click **Clear Bets** to remove all bets

## Auto-Play Mode

For automated strategy testing:

1. Place your initial bets
2. Click **AUTO PLAY**
3. The game will automatically:
   - Spin the wheel every 2 seconds
   - Repeat your bets after each spin
   - Update statistics continuously
4. Click **STOP AUTO** to stop automatic play

## Modified Martingale Strategy

The simulator includes an automated Martingale betting strategy:

### Default Configuration
- **Initial Bet**: $10
- **Pattern Threshold**: 2 consecutive results
- **Max Loss Streak**: 7 losses
- **Required Bankroll**: $1,280

### How It Works
1. Waits for 2+ consecutive outcomes (e.g., 2 reds in a row)
2. Bets on the opposite (e.g., black)
3. Doubles the bet on each loss
4. Resets to $10 on each win
5. Stops after 7 consecutive losses

### Enabling the Strategy
Currently, the strategy is built into the code but not yet exposed in the UI. Future updates will add a configuration panel.

## Understanding the Statistics

### Bankroll Panel
- **Current**: Your current balance
- **Starting**: Initial balance ($10,000)
- **Max**: Highest balance reached
- **Min**: Lowest balance reached
- **Net Profit**: Total profit/loss

### Recent Spins
Shows the last 20 spins with color-coded numbers.

### Color Distribution
Percentage breakdown of Red/Black/Green outcomes with progress bars.

### Odd/Even & High/Low
Statistical analysis of number patterns.

### Current Streaks
Shows how many consecutive times each pattern has occurred.

### Max Streaks
Records the longest streaks for each category during the session.

### Overall Stats
- Total number of spins
- Total amount wagered
- Total winnings

## Tips for Testing Strategies

1. **Use Auto-Play**: Great for running long simulations
2. **Watch Streaks**: Monitor the "Current Streaks" panel to identify patterns
3. **Track Bankroll**: Keep an eye on max/min balance to understand volatility
4. **Record Results**: Note down interesting patterns or outcomes for analysis

## Keyboard Shortcuts

Currently, all interactions are click-based. Keyboard shortcuts may be added in future updates.

## Troubleshooting

### "Insufficient balance" warning
You don't have enough balance to place the current bets. Either:
- Reduce your bet amounts
- Clear some bets
- Reset the game (refresh the page)

### Auto-play not working
Make sure you have bets placed before clicking AUTO PLAY.

### Page is slow
If you've run thousands of spins, the history might be large. Refresh the page to start a new session.

## Next Steps

- Review the full [README.md](./README.md) for complete documentation
- Check out the [project requirements](./documentation/project-requirements.md) for planned features
- Explore the [original .NET implementation](./ORIGINAL_CODEBASE_ANALYSIS.md) for reference

## Support

For issues or questions, please check the README.md or open an issue on GitHub.

Happy spinning! 🎰
