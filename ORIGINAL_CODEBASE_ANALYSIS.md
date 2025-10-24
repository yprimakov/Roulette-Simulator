# Roulette Simulator - Comprehensive Codebase Analysis

## Project Overview

This is an **ASP.NET MVC5 web application** that simulates and tests the Modified Martingale betting strategy on roulette. The application was developed by Yury Primakov (Date: 3/11/2017) and is designed to allow users to simulate roulette betting with automatic bet placement and comprehensive statistical analysis.

---

## Project Architecture & Structure

### Technology Stack
- **Backend**: ASP.NET MVC 5 (.NET Framework 4.5.2)
- **Frontend**: AngularJS, jQuery, Bootstrap 3
- **Database**: LocalDb (MSSQL)
- **UI Theme**: Metronic v4.7
- **Authentication**: ASP.NET Identity

### Directory Structure
```
/Original.NET/
├── Roulette Simulator/
│   ├── App_Start/                 # MVC configuration
│   │   ├── BundleConfig.cs       # Script/CSS bundling
│   │   ├── FilterConfig.cs
│   │   ├── IdentityConfig.cs
│   │   ├── RouteConfig.cs
│   │   └── Startup.Auth.cs
│   ├── Controllers/
│   │   └── HomeController.cs      # Single MVC controller
│   ├── Models/                    # Identity & View Models
│   │   ├── AccountViewModels.cs
│   │   ├── IdentityModels.cs
│   │   └── ManageViewModels.cs
│   ├── Views/
│   │   ├── Home/
│   │   │   └── Index.cshtml       # Main game UI (RAZOR template)
│   │   ├── Shared/                # Layout files
│   │   └── Web.config
│   ├── Scripts/
│   │   ├── global.js              # Global utility functions
│   │   └── controllers/           # Game logic controllers
│   │       ├── GameEngineController.js    # Core betting engine
│   │       ├── RouletteWheel.js           # Wheel simulation
│   │       ├── RouletteTable.js           # Betting table logic
│   │       └── CasinoController.js        # AngularJS controller
│   ├── Content/                   # Stylesheets & theme assets
│   ├── Web.config                 # ASP.NET configuration
│   ├── ApplicationInsights.config  # Telemetry config
│   ├── packages.config            # NuGet dependencies
│   └── Global.asax                # Application initialization
├── packages/                       # NuGet packages
└── Roulette Simulator.sln         # Solution file
```

---

## Core Components & Responsibilities

### 1. BACKEND (C#)

#### HomeController.cs
- **Purpose**: Single ASP.NET MVC controller
- **Methods**:
  - `Index()` - Returns the main game view
  - `About()` - About page
  - `Contact()` - Contact page
- **Role**: Minimal backend; mostly serves as entry point for static HTML/AngularJS app

#### Startup.cs & Configuration
- Configures OWIN middleware
- Sets up Identity authentication
- Minimal game logic here

### 2. FRONTEND (JavaScript - AngularJS)

#### GameEngineController.js (PRIMARY GAME ENGINE)
**Location**: `/Scripts/controllers/GameEngineController.js`

This is the heart of the application, containing all betting logic, statistics, and strategy implementation.

**Key Responsibilities**:
1. Game state management
2. Wheel spinning
3. Bet placement and evaluation
4. Statistics calculation
5. Modified Martingale strategy implementation

**Main Controller Instance** (AngularJS):
```javascript
RouletteGameController
```

#### GameEngineController.js - Detailed Properties & Variables

**GAME STATE**:
```javascript
vm.isEuropeanTable = true           // Betting table type
vm.showOptions = false              // Settings visibility
vm.viewMode = "GAME"                // View mode (GAME or SETTINGS)
vm.isPlaying = false                // Game active state
```

**TIMING**:
```javascript
vm.timeBetweenSpins = 3             // Seconds between spins (default: 3)
vm.timeRemainingBeforeNextSpin = 0  // Countdown timer
vm.timer = null                     // Interval reference
```

**BANKROLL & BALANCE**:
```javascript
vm.startingBankroll = 1280          // Initial player balance
vm.playerBalance = 1280             // Current balance
vm.playerBalanceRecordHigh = 1280   // Maximum balance achieved
vm.totalBets = 0                    // Current round bets
vm.totalWinnings = 0                // Current round winnings
```

**BETTING CONFIGURATION**:
```javascript
vm.firstBetAmount = 10              // Initial bet amount ($10)
vm.secondBetAmount = 5              // Secondary bet (optional)
vm.thirdBetAmount = 3               // Tertiary bet (optional)
vm.betFormula = "2x"                // Doubling formula for losing bets
vm.autoBet = true                   // Enable automatic betting
vm.isBetsSettled = true             // Bet settlement status
```

**HISTORY & TRACKING**:
```javascript
vm.history = []                     // Array of all spins
// Structure: { id, number, placedBets }

vm.message = []                     // Event log
vm.trailingHistory = []             // Consecutive pattern history
vm.consecutiveLossHistory = []      // Loss streak history
vm.trailingUniques = {}             // Count by pattern type
vm.consecutiveLossUniques = {}      // Count by loss streak
```

**PATTERN DETECTION THRESHOLDS**:
```javascript
vm.minTrail = 5                     // Min consecutive spins to track
vm.consecutivePatternMin = 2        // Pattern established at 2 consecutive
vm.consecutiveLossLimit = 7         // Max loss count before stopping
```

**STATISTICS COUNTERS**:
```javascript
vm.percentRed = 0;
vm.percentBlack = 0;
vm.percentGreen = 0;
vm.percentOdd = 0;
vm.percentEven = 0;
vm.percentLow = 0;                  // 1-18
vm.percentHigh = 0;                 // 19-36

vm.trailingRedCount = 0;
vm.trailingBlackCount = 0;
vm.trailingOddCount = 0;
vm.trailingEvenCount = 0;
vm.trailingLowCount = 0;
vm.trailingHighCount = 0;

vm.maxTrailingCount = 0;            // Longest consecutive streak
vm.maxTrailingType = "";            // Type of longest streak
vm.maxConsecutiveLossCount = 0;     // Max consecutive losses
vm.maxConsecutiveLossType = "";
vm.totalNumberOfBets = 0;           // Total bets placed & settled
```

---

## Modified Martingale Strategy Implementation

### Strategy Overview

The Modified Martingale strategy uses **outside bets** (50/50 probability) with automatic bet doubling on losses:

**Outside Bets Available**:
- Red/Black
- Odd/Even
- Low (1-18) / High (19-36)

**NOT Used**:
- Single number bets (35:1 payoff)
- Combination bets
- 2:1 and 12:1 payoffs

### Strategy Flow

1. **Pattern Detection** (`getTrailing*` methods):
   - Monitors last N consecutive spins of same type
   - Triggers when N >= `consecutivePatternMin` (default: 2)
   - Available patterns: Red, Black, Odd, Even, Low, High

2. **Bet Placement** (`autoPlaceBet` function):
   ```javascript
   // When 2+ consecutive reds detected → place $10 on black
   if (vm.trailingRedCount >= vm.consecutivePatternMin && 
       !vm.table.isPlacedBet("black")) {
       vm.table.placeBet("black", vm.firstBetAmount);
   }
   ```

3. **Loss Handling** (`evaluateBet` function):
   - On loss: Double the bet amount
   - Formula: `doubleAmount = lastBets[i].amount * 2`
   - Loss count calculation: `Math.log(bet.amount / vm.firstBetAmount) / Math.log(2) + 1`
   - Continues until: 
     - Win occurs (resets to initial bet)
     - Loss limit reached (stops betting, `consecutiveLossLimit = 7`)
     - Insufficient bankroll

4. **Win Handling**:
   - Winnings = `bet.amount * tile.winratio` (winratio = 1 for 50/50 bets)
   - Balance updated: `playerBalance - totalBets + totalWinnings`
   - Resets to initial bet amount after win

### Critical Constants

```javascript
INITIAL BET: $10
BANKROLL REQUIREMENT: $1280
  - Covers up to 6 consecutive losses
  - 6 doubles: 10 → 20 → 40 → 80 → 160 → 320 → 640 = $1,270

PATTERN THRESHOLD: 2 consecutive spins
LOSS LIMIT: 7 consecutive losses
```

---

## Betting System Architecture

### RouletteTable.js
**Purpose**: Manages the roulette table state, bet placement, and payout calculations.

**Key Data Structure - possibleBets Array**:
Contains 46 bet types with properties:
```javascript
{
  name: "red",                    // Bet identifier
  color: "",                      // Display color
  type: "outside",                // "inside" or "outside"
  winratio: 1,                    // Payout multiplier
  winningnumbers: [array]         // Winning number list
}
```

**Inside Bets** (36 individual numbers):
- winratio: 35 (35:1 payout)
- Examples: "0", "1", "2", ..., "36", "00"

**Outside Bets** (10 groups):
- **Red/Black**: winratio 1 (1:1 payout)
  - Red: [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
  - Black: [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]
  
- **Odd/Even**: winratio 1
  - Odd: [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35]
  - Even: [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36]
  
- **Low (1-18)/High (19-36)**: winratio 1
  
- **Dozens** (1st/2nd/3rd 12): winratio 2 (2:1 payout)
  
- **Columns** (2:1): winratio 2 (3 columns of 12 numbers)

**Key Methods**:
```javascript
placeBet(name, amount)          // Place or add to bet
totalBets()                     // Sum of all bets
selectWinningNumber(number)     // Highlight winning number
updateBetsOnTable()             // Update UI display
doubleBets()                    // Double all current bets
clearBets()                     // Remove all bets
getPlacedBets()                 // Return current bets
setPlacedBets(bets)             // Restore bet state
isPlacedBet(name)               // Check if bet exists
```

**Bet Structure**:
```javascript
{
  amount: 10,                 // Bet amount in dollars
  tile: {                     // Reference to bet type object
    name: "red",
    winratio: 1,
    winningnumbers: [...]
  },
  isWin: true/false           // Set during evaluation
}
```

### RouletteWheel.js
**Purpose**: Simulates a roulette wheel with 38 positions (European 37 + American 00).

**Wheel Configuration**:
```javascript
positions = [
  // 0-36: All numbers with color and odd/even
  { name: "0", color: "green", oddeven: "" },
  { name: "1", color: "red", oddeven: "odd" },
  { name: "2", color: "black", oddeven: "even" },
  // ... continues through 36
  { name: "00", color: "green", oddeven: "" }
]
```

**Key Method**:
```javascript
spin()                          // Returns random number object
// Uses: Math.floor(Math.random() * 38)
```

**Return Object**:
```javascript
{
  name: "17",                 // Number 0-36, "00"
  color: "black",             // "red", "black", "green"
  oddeven: "odd"              // "odd", "even", or ""
}
```

---

## Statistics & Analytics System

### Statistics Calculation Methods

**Percentage Calculations** (last N spins):
```javascript
getStatsRed()       // Percent of reds in history
getStatsBlack()     // Percent of blacks in history
getStatsGreen()     // Percent of zeros in history
getStatsOdd()       // Percent of odd numbers
getStatsEven()      // Percent of even numbers
getStatsLow()       // Percent of 1-18
getStatsHigh()      // Percent of 19-36

// Formula: (count / vm.history.length) * 100
```

**Trailing Consecutive Counters** (recent streak):
```javascript
getTrailingRed()    // Consecutive reds at end of history
getTrailingBlack()  // Consecutive blacks at end of history
getTrailingOdd()    // Consecutive odds
getTrailingEven()   // Consecutive evens
getTrailingLow()    // Consecutive 1-18
getTrailingHigh()   // Consecutive 19-36

// Logic: Loop from history.length backwards until type changes
```

**Streak Recording**:
```javascript
newTrailRecord(count, type)
// Adds to vm.trailingHistory when count >= vm.minTrail (5)
// Tracks: count, type, spinCount, betCount

updateTrailingUniques()
// Creates frequency map: { 5: 3, 6: 1, 7: 2, ... }
// Shows how many times each streak length occurred
```

**Loss Streak Tracking**:
```javascript
newConsecutiveLossRecord(count, type)
// Records consecutive losses during betting
// Condition: count >= vm.minTrail - vm.consecutivePatternMin (3)

updateConsecutiveLossUniques()
// Frequency map of loss streaks
```

**Probability Calculation**:
```javascript
getPercentageByBets(count)
// (count / vm.totalNumberOfBets) * 100
// Observed percentage vs theoretical

getExpectedPercentage(key, val)
// ((1 / 2^key) * 100).toFixed(2)
// Theoretical probability for streak length
// Example: 2^2 = 1/4 = 25% chance of 2 streak
```

---

## Game Loop & Spin Cycle

### Core Game Flow

1. **User initiates**: Clicks "Play" button → `playGame()`

2. **Timer Setup**: 
   ```javascript
   vm.timer = $interval(function() { ... }, 1000)  // Every 1 second
   ```

3. **Spin Cycle** (every 3 seconds by default):
   ```
   Countdown (2s) 
   → Auto-place bets 
   → Spin 
   → Evaluate bets 
   → Update stats 
   → Repeat
   ```

4. **Spin Execution** (`vm.spin()`):
   - Get random number from wheel: `vm.wheel.spin()`
   - Store in history
   - Update UI to show winning number
   - Call `vm.settleBets()`

5. **Settlement** (`vm.settleBets()`):
   - Loop through placed bets with 250ms delays
   - Call `vm.evaluateBet()` for each
   - Calculate winnings or losses
   - Update player balance
   - Increment bet counter

6. **Bet Evaluation** (`vm.evaluateBet(bet)`):
   - Check if bet wins: `vm.isWinningBet(bet, currentNumber)`
   - If WIN:
     - Calculate winnings: `bet.amount * bet.tile.winratio`
     - Add to total: `vm.totalWinnings += amount + winnings`
     - Visual effect: Green highlight + fade
   - If LOSS:
     - Calculate loss count (for Martingale tracking)
     - Record in loss history
     - Visual effect: Red highlight + fade

7. **Auto-bet Logic** (`vm.autoPlaceBet()`):
   - **Doubling losing bets**:
     ```javascript
     if (!vm.isWinningBet(lastBets[i], lastNumber.name) &&
         !vm.table.isPlacedBet(lastBets[i].tile.name)) {
       doubleAmount = lastBets[i].amount * 2
       if (doubleCount <= vm.consecutiveLossLimit && 
           sufficicientBalance) {
         vm.table.placeBet(tile.name, doubleAmount)
       }
     }
     ```
   
   - **Pattern-based initial bets**:
     ```javascript
     if (vm.trailingBlackCount >= vm.consecutivePatternMin && 
         !vm.table.isPlacedBet("red")) {
       vm.table.placeBet("red", vm.firstBetAmount)
     }
     // Similar for red→black, odd→even, low→high, high→low
     ```

---

## UI Components & Views

### Index.cshtml (Main Game View)
**Location**: `/Views/Home/Index.cshtml`

**Layout Sections**:

1. **Roulette Table** (Interactive betting grid):
   - 36 inside numbers (0-36, 00)
   - 10 outside betting areas
   - Click handlers: `ng-click="game.placeBet('name')"`

2. **Betting Controls**:
   - Denomination buttons: $1, $5, $10, $25, $100
   - Action buttons: Clear, x2 (double), Refresh (repeat last)
   - Spin button: Manual spin
   - Play/Stop buttons: Control game loop

3. **Statistics Panel** (3 columns):
   - **Basic Statistics**:
     - Total spins, total bets
     - Starting/max balance
     - Color percentages (Red, Black, Zero)
     - Odd/Even percentages
     - Low/High percentages
   
   - **Consecutive Counters**:
     - Current trailing counts for each type
     - Max consecutive streak & type
     - Max consecutive losses & type
     - Frequency tables (Trailing x2, x3, ... and Losses)
   
   - **Event Log**:
     - Scrollable history of game events
     - Latest events at top
     - Spin results and messages

4. **Spin History Sidebar**:
   - Last 10-20 spins
   - Color-coded by result
   - Ordered newest first

### Dynamic Bindings (AngularJS):
```html
{{game.playerBalance}}              <!-- Current balance -->
{{game.totalBets}}                  <!-- Current round bets -->
{{game.totalWinnings}}              <!-- Winnings this spin -->
{{game.history.length}}             <!-- Total spins -->
{{game.trailingRedCount}}           <!-- Current red streak -->
ng-show="game.isPlaying"            <!-- Show when playing -->
ng-class="game.betAmount==10?'active':''"  <!-- Bet selection -->
```

---

## Important Constants & Configuration

### Financial Constants
```javascript
STARTING_BANKROLL = 1280            // Minimum for 6-loss streak
INITIAL_BET = 10                    // First bet amount
DOUBLING_FORMULA = 2x               // Each loss doubles bet

REQUIRED_BALANCE_FOR_6_LOSSES:
  Loss 1: $10 (total: $10)
  Loss 2: $20 (total: $30)
  Loss 3: $40 (total: $70)
  Loss 4: $80 (total: $150)
  Loss 5: $160 (total: $310)
  Loss 6: $320 (total: $630)
  Loss 7: $640 (total: $1,270)
```

### Game Parameters
```javascript
LOSS_LIMIT = 7                      // Stop betting after 7 losses
PATTERN_THRESHOLD = 2               // Minimum consecutive to trigger
MIN_TRAIL = 5                       // Record streak only if >= 5
SPIN_INTERVAL = 3 seconds           // Adjustable between spins
PAYOUT_RATIO = 1:1                  // For outside 50/50 bets
ZERO_ADVANTAGE = 2.7%               // House edge (2 greens on 38)
```

### UI/Timing
```javascript
BET_SETTLEMENT_DELAY = 250ms        // Per bet evaluation
WINNINGS_DISPLAY_FADE = 1000ms      // Win animation duration
MESSAGE_DELAY = 5000ms              // Event log message timeout
```

---

## Data Structures

### History Entry
```javascript
{
  id: 1,                          // Spin number
  number: {                       // Current spin result
    name: "17",
    color: "black",
    oddeven: "odd"
  },
  placedBets: [                   // Bets placed before spin
    {
      amount: 10,
      tile: { name: "black", winratio: 1, ... },
      isWin: true/false
    }
  ]
}
```

### Trailing History Entry
```javascript
{
  count: 5,                       // Streak length
  type: "Red",                    // Streak type
  spinCount: 42,                  // Which spin recorded this
  betCount: 12                    // How many bets by then
}
```

### Trailing Uniques Map
```javascript
{
  "2": 5,                         // 2-streak occurred 5 times
  "3": 3,                         // 3-streak occurred 3 times
  "5": 1,                         // 5-streak occurred 1 time
  "7": 2                          // 7-streak occurred 2 times
}
```

### Consecutive Loss History Entry
```javascript
{
  count: 3,                       // Loss count (doubling iterations)
  spinCount: 45,                  // At which spin
  betCount: 15                    // How many total bets made
}
```

---

## Key Algorithms

### Martingale Loss Detection
```javascript
// In evaluateBet():
var doubleCount = Math.log(bet.amount / vm.firstBetAmount) / Math.log(2) + 1;
// Example: $80 bet
// log(80/10) / log(2) + 1 = log(8) / log(2) + 1 = 3 + 1 = 4 losses

vm.newConsecutiveLossRecord(doubleCount, bet.tile.name);
```

### Trailing Pattern Detection
```javascript
// In getTrailingRed():
var count = 0;
for (var i = vm.history.length - 1; i >= 0; i--) {
  if (vm.history[i].number.color == "red") {
    count += 1;
  } else break;  // Stop at first non-red
}
if (count >= vm.minTrail) {
  vm.newTrailRecord(count, "Red");  // Record if significant
}
return count;  // Return for display
```

### Probability Distribution Analysis
The application calculates observed vs expected percentages for streak lengths:
- **Observed**: `(frequency / totalNumberOfBets) * 100`
- **Expected**: `(1 / 2^streakLength) * 100`
- Shows how actual matches theoretical distribution

---

## ASP.NET Configuration

### Web.config Key Settings
```xml
<compilation debug="true" targetFramework="4.5.2" />
<authentication mode="None" />  <!-- No auth required -->
<connectionString name="DefaultConnection">
  LocalDb: aspnet-Roulette Simulator-20170222072306.mdf
</connectionString>
```

### Bundle Configuration (BundleConfig.cs)
**Global Styles Bundle**:
- Font Awesome icons
- Bootstrap CSS
- Metronic theme CSS

**Global Scripts Bundle**:
- jQuery 1.10.2
- Bootstrap JS
- AngularJS + angular-sanitize
- jQuery plugins (slimscroll, blockui, bootstrap-switch)
- Bootstrap Growl notifications
- Metronic app scripts

**Game Scripts Bundle** (specific load):
1. RouletteTable.js
2. RouletteWheel.js
3. CasinoController.js
4. GameEngineController.js

---

## Dependencies & Libraries

### Backend (.NET)
- ASP.NET MVC 5.2.3
- Entity Framework 6.1.3
- ASP.NET Identity 2.2.1
- OWIN/Katana 3.0.1

### Frontend (JavaScript)
- AngularJS (Angular-sanitize for HTML binding)
- jQuery 1.10.2
- jQuery Validate
- Bootstrap 3.0.0
- Bootstrap Switch
- Bootstrap Growl (notifications)
- jQuery Slimscroll
- jQuery BlockUI

### CSS Framework
- Metronic v4.7 (premium Bootstrap theme)
- Font Awesome icons
- Simple Line Icons

---

## Important Code Notes

### Known Issues/Comments in Code

1. **Line 101 in GameEngineController.js**:
   ```javascript
   // THIS IS A MAINTENANCE NIGHTMARE!! Don't do this again!
   debugger;
   ```
   - Hardcoded HTML string building for spin display
   - Uses string concatenation instead of templates
   - Creates complex color class logic

2. **Line 102 (debugger statement)**:
   - Currently enabled - would break in production
   - Needs removal for release

3. **AngularJS Module Definition** (Line 500-504):
   ```javascript
   var casinoApp = angular.module('casinoApp', []);
   // Currently minimal - commented out ngResource, ngSanitize
   // Actually uses ngSanitize in template (ng-bind-html)
   ```

### Code Quality Notes
- Inconsistent variable naming (vm. prefix for Angular, global Wheel/Table objects)
- Global objects not properly namespaced
- Mixing jQuery and vanilla JavaScript
- Event log builds HTML strings dynamically (security consideration)
- Debugger statement left in production code

---

## Game Workflow Example

**Scenario: Player starts with $1280, bets $10 on Black after 2 Reds**

```
Spin 1: Red → No pattern yet
Spin 2: Red → Pattern detected (2 reds)
        Auto-places: $10 on Black

Spin 3: Black → WIN!
        Winnings: $10 × 1 = $10
        New balance: $1280 - $10 + ($10 + $10) = $1290
        Reset to $10 bet

Spin 4: Red → No pattern
Spin 5: Black → No pattern
Spin 6: Black → Pattern detected (2 blacks)
        Auto-places: $10 on Red

Spin 7: Red → WIN!
        Winnings: $10 × 1 = $10
        New balance: $1290 - $10 + ($10 + $10) = $1300

Spin 8: Red → Pattern detected (2 reds)
        Auto-places: $10 on Black

Spin 9: Red → LOSS!
        Loss count: 1 (first loss)
        Next bet auto-placed: $20 on Black

Spin 10: Red → LOSS!
         Loss count: 2
         Next bet auto-placed: $40 on Black

Spin 11: Red → LOSS!
         Loss count: 3
         Next bet auto-placed: $80 on Black

Spin 12: Black → WIN!
         Total loss streak: 4 losses
         Winnings: $80 × 1 = $80
         Total paid: $10 + $20 + $40 + $80 = $150
         Gross: $80 (payoff) = -$150 + $80 = -$70 net from streak
         New balance: Lower than before
```

---

## Summary

This is a complete **web-based roulette simulation platform** implementing an automated Modified Martingale betting strategy. The architecture cleanly separates:

- **Backend**: Minimal ASP.NET MVC (just serving views)
- **Frontend**: AngularJS with game logic in pure JavaScript
- **Game Engine**: Comprehensive betting, tracking, and statistical analysis
- **UI**: Rich Bootstrap/Metronic interface with real-time updates

The strategy focuses on **outside even-money bets** with automatic doubling after losses, pattern detection triggers, and comprehensive statistical analysis. The application tracks everything from raw spin results to probability distribution analysis and loss streaks.

