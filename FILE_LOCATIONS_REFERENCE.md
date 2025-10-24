# File Locations Reference - Original.NET Roulette Simulator

## Core Game Logic Files

### Primary Game Engine
- **GameEngineController.js** (506 lines)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/Scripts/controllers/GameEngineController.js`
  - Contains: Modified Martingale strategy, bet placement, statistics, game loop
  - Key Functions: autoPlaceBet(), evaluateBet(), getTrailing*(), settleBets(), spin()

### Betting System
- **RouletteTable.js** (495 lines)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/Scripts/controllers/RouletteTable.js`
  - Contains: Bet types (46 total), payout ratios, placed bets management
  - Key Functions: placeBet(), totalBets(), isPlacedBet(), doubleBets()
  - Data: possibleBets array with all bet definitions

### Wheel Simulation
- **RouletteWheel.js** (225 lines)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/Scripts/controllers/RouletteWheel.js`
  - Contains: 38-position wheel (0-36, 00), random spin logic
  - Key Functions: spin()
  - Data: numbers array with color and odd/even properties

### Global Utilities
- **global.js** (53 lines)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/Scripts/global.js`
  - Contains: Message display utility for Bootstrap Growl notifications
  - Key Functions: displayMessage()

## Frontend View Files

### Main Game UI
- **Index.cshtml** (438 lines)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/Views/Home/Index.cshtml`
  - Contains: Interactive roulette table, betting controls, statistics panels, event log
  - AngularJS Controller: RouletteGameController as game
  - Layout: 3-column stats + history sidebar

## Backend C# Files

### MVC Controller
- **HomeController.cs** (30 lines)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/Controllers/HomeController.cs`
  - Contains: Index(), About(), Contact() action methods
  - Role: Minimal - serves as entry point for AngularJS app

### Configuration Files
- **BundleConfig.cs** (72 lines)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/App_Start/BundleConfig.cs`
  - Bundles: globalStyles, globalScripts, gameScripts
  - gameScripts Bundle: RouletteTable.js, RouletteWheel.js, CasinoController.js, GameEngineController.js

## Configuration Files

### ASP.NET Configuration
- **Web.config**
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/Web.config`
  - Contains: Connection strings, Entity Framework config, authentication settings
  - Key: DefaultConnection (LocalDb: aspnet-Roulette Simulator-20170222072306.mdf)

### NuGet Dependencies
- **packages.config** (40 lines)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/packages.config`
  - Key packages: ASP.NET MVC 5.2.3, Entity Framework 6.1.3, AngularJS, Bootstrap 3, jQuery 1.10.2

### Project File
- **Roulette Simulator.csproj** (177KB)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator/Roulette Simulator.csproj`
  - .NET Framework 4.5.2 project configuration

### Solution File
- **Roulette Simulator.sln**
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/Original.NET/Roulette Simulator.sln`

## Directory Structure

```
/Original.NET/
├── Roulette Simulator/
│   ├── Scripts/
│   │   ├── controllers/
│   │   │   ├── GameEngineController.js        <- MAIN GAME LOGIC
│   │   │   ├── RouletteTable.js               <- BETTING SYSTEM
│   │   │   ├── RouletteWheel.js               <- WHEEL SIMULATION
│   │   │   └── CasinoController.js
│   │   ├── global.js                          <- UTILITIES
│   │   └── [jQuery, Bootstrap, AngularJS libs]
│   ├── Views/
│   │   ├── Home/
│   │   │   └── Index.cshtml                   <- MAIN UI
│   │   └── Shared/
│   ├── Controllers/
│   │   └── HomeController.cs                  <- MVC CONTROLLER
│   ├── App_Start/
│   │   ├── BundleConfig.cs                    <- SCRIPT BUNDLING
│   │   ├── RouteConfig.cs
│   │   ├── FilterConfig.cs
│   │   ├── IdentityConfig.cs
│   │   └── Startup.Auth.cs
│   ├── Models/
│   │   ├── AccountViewModels.cs
│   │   ├── IdentityModels.cs
│   │   └── ManageViewModels.cs
│   ├── Content/
│   │   └── metronic_v4.7/                    <- THEME ASSETS
│   ├── Web.config                             <- CONFIGURATION
│   ├── packages.config                        <- DEPENDENCIES
│   ├── Global.asax                            <- APP START
│   ├── Startup.cs
│   └── ApplicationInsights.config
├── packages/                                  <- NuGet PACKAGES
└── Roulette Simulator.sln
```

## Key Line References in GameEngineController.js

- **Line 1-15**: File header and strategy description
- **Line 23-70**: AngularJS controller definition and variable initialization
- **Line 90-108**: vm.spin() - Wheel spin function
- **Line 152-183**: vm.settleBets() - Bet settlement loop
- **Line 185-204**: vm.evaluateBet() - Individual bet evaluation
- **Line 253-299**: vm.autoPlaceBet() - Auto betting logic (MARTINGALE STRATEGY)
- **Line 304-356**: Statistics calculation methods (getStatsRed, etc.)
- **Line 357-477**: Trailing/consecutive detection methods (getTrailingRed, etc.)
- **Line 101-102**: DEBUGGER STATEMENT - Needs removal for production
- **Line 500-504**: AngularJS module registration

## Important Constants by Location

### In GameEngineController.js:
```
Line 37: startingBankroll = 1280
Line 44: firstBetAmount = 10
Line 52: betFormula = "2x"
Line 65: consecutivePatternMin = 2
Line 70: consecutiveLossLimit = 7
```

### In RouletteTable.js:
```
Lines 6-407: possibleBets array definition
  - 37 inside bets (winratio: 35)
  - 10 outside bets (winratio: 1 or 2)
```

### In RouletteWheel.js:
```
Lines 6-197: numbers array definition
  - 38 positions (0-36, 00)
  - Each with: name, color, oddeven properties
```

## Analysis Document

- **ORIGINAL_CODEBASE_ANALYSIS.md** (23KB comprehensive analysis)
  - Path: `/Users/prime/Desktop/Projects/Dev/Roulette-Simulator/ORIGINAL_CODEBASE_ANALYSIS.md`
  - Contains: Project overview, architecture, components, strategy details, data structures

