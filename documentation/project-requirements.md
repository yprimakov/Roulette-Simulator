# Roulette Strategy Simulator - Project Requirements Document

## Project Overview

### Project Name
Roulette Strategy Simulator

### Project Description
A comprehensive web-based roulette simulation application designed to test, analyze, and record statistical data on various roulette betting strategies. The application recreates the functionality of the original .NET-based roulette simulator, providing users with a realistic casino environment to test betting strategies, particularly focusing on the Modified Martingale Strategy.

**Important Note**: The `/Original.NET/` folder contains the reference implementation and should be used as a guide for understanding the original functionality, game logic, and user interface design. **Do not alter any files in the `/Original.NET/` folder** - it serves as the authoritative reference for recreating the application's behavior and features.

### Technology Stack
- **Frontend Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL + Real-time subscriptions)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended) or similar platform

## Core Functionality Requirements

### 1. Roulette Game Engine

#### 1.1 Wheel Mechanics
- **European Roulette Layout**: 37 numbers (0-36) with single zero
- **American Roulette Option**: 38 numbers (0, 00, 1-36) with double zero
- **Random Number Generation**: Cryptographically secure random number generation
- **Spin Animation**: Visual wheel spinning animation with ball physics
- **Number Properties**: Each number must have:
  - Color (red, black, green)
  - Odd/Even classification
  - High/Low classification (1-18 vs 19-36)

#### 1.2 Betting System
- **Inside Bets**:
  - Straight up (single number) - 35:1 payout
  - Split bets (2 numbers) - 17:1 payout
  - Street bets (3 numbers) - 11:1 payout
  - Corner bets (4 numbers) - 8:1 payout
  - Line bets (6 numbers) - 5:1 payout

- **Outside Bets**:
  - Red/Black - 1:1 payout
  - Odd/Even - 1:1 payout
  - High/Low (1-18/19-36) - 1:1 payout
  - Dozens (1st/2nd/3rd 12) - 2:1 payout
  - Columns (1st/2nd/3rd 2:1) - 2:1 payout

#### 1.3 Betting Interface
- **Chip Selection**: $1, $5, $10, $25, $100 denominations
- **Bet Placement**: Click-to-place betting on roulette table
- **Bet Management**:
  - Clear all bets
  - Double all bets (x2)
  - Repeat last bet
  - Individual bet removal
- **Bet Validation**: Ensure sufficient balance before placing bets
- **Visual Feedback**: Animated chip placement and bet highlighting

### 2. Game Controls

#### 2.1 Manual Play
- **Single Spin**: Manual spin button for individual spins
- **Bet Placement**: Interactive table for placing bets
- **Balance Management**: Real-time balance updates

#### 2.2 Automated Play
- **Auto-Play Mode**: Continuous automated spinning
- **Configurable Timing**: Adjustable time between spins (1-10 seconds)
- **Auto-Betting**: Automated bet placement based on strategy
- **Play/Pause Controls**: Start/stop automated gameplay

### 3. Strategy Engine

#### 3.1 Modified Martingale Strategy
- **Pattern Detection**: Identify consecutive patterns (red/black, odd/even, high/low)
- **Trigger Conditions**: Minimum consecutive spins before betting (default: 2)
- **Bet Doubling**: Double losing bets on subsequent spins
- **Loss Limits**: Maximum consecutive losses before stopping (default: 7)
- **Bankroll Management**: Required bankroll calculation based on bet denomination

#### 3.2 Strategy Configuration
- **Bet Amounts**: Configurable initial bet amounts
- **Pattern Thresholds**: Adjustable consecutive pattern requirements
- **Loss Limits**: Customizable maximum loss streaks
- **Cashout Limits**: Profit targets for automatic cashout

### 4. Statistics & Analytics

#### 4.1 Basic Statistics
- **Spin History**: Complete record of all spins with timestamps
- **Color Distribution**: Percentage breakdown of red/black/green
- **Odd/Even Distribution**: Statistical analysis of odd/even outcomes
- **High/Low Distribution**: Analysis of 1-18 vs 19-36 outcomes
- **Total Spins**: Count of all spins in current session
- **Total Bets**: Number of bets placed

#### 4.2 Advanced Analytics
- **Consecutive Counters**: Track consecutive streaks for each category
- **Pattern Analysis**: Statistical analysis of consecutive patterns
- **Loss Streak Tracking**: Record and analyze consecutive losses
- **Expected vs Actual**: Compare actual percentages to expected probabilities
- **Maximum Streaks**: Track longest streaks in each category
- **Bankroll Tracking**: Starting balance, current balance, maximum balance achieved

#### 4.3 Visual Analytics
- **History Display**: Visual representation of recent spins
- **Statistics Dashboard**: Real-time updating statistics panels
- **Trend Analysis**: Visual charts showing patterns over time
- **Performance Metrics**: Win/loss ratios and profitability analysis

### 5. User Interface Requirements

#### 5.1 Main Game Interface
- **Roulette Table**: Accurate visual representation of casino roulette table
- **Betting Chips**: Visual chip denominations with selection interface
- **Game Controls**: Play/pause, spin, bet management buttons
- **Balance Display**: Current balance, total bets, winnings display
- **Statistics Panel**: Real-time statistics and analytics

#### 5.2 Layout Components
- **Header**: Game title and navigation
- **Main Game Area**: Roulette table and betting interface
- **Sidebar**: Statistics, history, and controls
- **Footer**: Game information and credits

#### 5.3 Responsive Design
- **Desktop**: Full-featured interface with all components visible
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Simplified interface with essential features

### 6. Data Management

#### 6.1 Session Management
- **Game Sessions**: Save and resume game sessions
- **Session History**: Track multiple game sessions
- **Data Persistence**: Maintain statistics across sessions
- **Export Functionality**: Export session data for analysis

#### 6.2 User Accounts (Optional)
- **User Registration**: Optional user account creation
- **Session Storage**: Cloud-based session storage
- **Statistics History**: Long-term statistics tracking
- **Preferences**: Save user preferences and settings

### 7. Technical Requirements

#### 7.1 Performance
- **Real-time Updates**: Instant UI updates for all game events
- **Smooth Animations**: 60fps animations for wheel spinning and bet placement
- **Fast Statistics**: Real-time calculation of all statistics
- **Responsive UI**: Sub-100ms response times for user interactions

#### 7.2 Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Core functionality works without JavaScript

#### 7.3 Security
- **Client-side Validation**: Prevent invalid bet placements
- **Secure Random**: Cryptographically secure random number generation
- **Data Validation**: Server-side validation of all game data
- **Session Security**: Secure session management

## Database Schema (Supabase)

### 7.1 Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Game Sessions Table
```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_name VARCHAR(255),
  starting_balance DECIMAL(10,2),
  current_balance DECIMAL(10,2),
  max_balance DECIMAL(10,2),
  total_spins INTEGER DEFAULT 0,
  total_bets INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

#### Spins Table
```sql
CREATE TABLE spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id),
  spin_number INTEGER,
  winning_number INTEGER,
  color VARCHAR(10),
  is_odd BOOLEAN,
  is_high BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Bets Table
```sql
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id),
  spin_id UUID REFERENCES spins(id),
  bet_type VARCHAR(50),
  bet_amount DECIMAL(10,2),
  payout_ratio DECIMAL(5,2),
  is_winning BOOLEAN,
  winnings DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Statistics Table
```sql
CREATE TABLE session_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id),
  red_percentage DECIMAL(5,2),
  black_percentage DECIMAL(5,2),
  green_percentage DECIMAL(5,2),
  odd_percentage DECIMAL(5,2),
  even_percentage DECIMAL(5,2),
  high_percentage DECIMAL(5,2),
  low_percentage DECIMAL(5,2),
  max_consecutive_red INTEGER,
  max_consecutive_black INTEGER,
  max_consecutive_odd INTEGER,
  max_consecutive_even INTEGER,
  max_consecutive_high INTEGER,
  max_consecutive_low INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7.2 Real-time Subscriptions
- **Game State Updates**: Real-time updates for active game sessions
- **Statistics Updates**: Live statistics updates during gameplay
- **Multiplayer Support**: Optional real-time multiplayer functionality

## Implementation Phases

### Phase 1: Core Game Engine (Weeks 1-2)
- [ ] Next.js project setup with Tailwind CSS
- [ ] Supabase project configuration
- [ ] Basic roulette wheel implementation
- [ ] Number generation and validation
- [ ] Basic betting system
- [ ] Simple UI layout

### Phase 2: Game Mechanics (Weeks 3-4)
- [ ] Complete betting system implementation
- [ ] Bet validation and payout calculation
- [ ] Game controls (play/pause/spin)
- [ ] Balance management
- [ ] Basic statistics tracking

### Phase 3: Strategy Engine (Weeks 5-6)
- [ ] Modified Martingale strategy implementation
- [ ] Pattern detection algorithms
- [ ] Automated betting system
- [ ] Strategy configuration interface
- [ ] Advanced statistics and analytics

### Phase 4: UI/UX Enhancement (Weeks 7-8)
- [ ] Professional roulette table design
- [ ] Smooth animations and transitions
- [ ] Responsive design implementation
- [ ] Visual statistics dashboard
- [ ] User experience optimization

### Phase 5: Data Management (Weeks 9-10)
- [ ] Session management system
- [ ] Data persistence implementation
- [ ] Export functionality
- [ ] User account system (optional)
- [ ] Performance optimization

### Phase 6: Testing & Deployment (Weeks 11-12)
- [ ] Comprehensive testing
- [ ] Bug fixes and optimization
- [ ] Deployment configuration
- [ ] Documentation completion
- [ ] Final polish and launch

## Success Criteria

### Functional Requirements
- ✅ Complete recreation of original .NET application functionality
- ✅ Accurate roulette game mechanics and betting system
- ✅ Functional Modified Martingale strategy implementation
- ✅ Comprehensive statistics and analytics
- ✅ Responsive design across all devices

### Performance Requirements
- ✅ Sub-100ms response times for user interactions
- ✅ Smooth 60fps animations
- ✅ Real-time statistics updates
- ✅ Fast page load times (<3 seconds)

### User Experience Requirements
- ✅ Intuitive and user-friendly interface
- ✅ Professional casino-like appearance
- ✅ Clear visual feedback for all actions
- ✅ Accessible design principles

## Risk Mitigation

### Technical Risks
- **Random Number Generation**: Use cryptographically secure random number generation
- **Performance**: Implement efficient algorithms for statistics calculation
- **Browser Compatibility**: Test across multiple browsers and devices
- **Data Integrity**: Implement proper validation and error handling

### Project Risks
- **Scope Creep**: Maintain focus on core functionality first
- **Timeline**: Build in buffer time for unexpected challenges
- **Quality**: Implement comprehensive testing throughout development
- **User Feedback**: Gather feedback early and iterate based on user needs

## Conclusion

This project requirements document outlines the complete recreation of the original .NET roulette simulator using modern web technologies. The focus is on maintaining all original functionality while improving the user experience and adding modern features like real-time statistics and responsive design.

The implementation will be done in phases to ensure steady progress and allow for iterative improvements based on testing and user feedback. The use of Next.js, Tailwind CSS, and Supabase provides a solid foundation for building a scalable, maintainable, and performant application.
