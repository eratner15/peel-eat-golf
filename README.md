# Peel & Eat Golf Scorecards

A modern, mobile-friendly web application for tracking various golf betting games and calculating settlements.

![Golf Scorecard App](https://via.placeholder.com/800x400?text=Golf+Scorecard+App)

## 🏌️ Features

- **8 Popular Golf Games**:
  - **Nassau**: Front 9, Back 9, and Total match with presses
  - **Skins**: Individual hole prizes with optional carryovers
  - **Wolf**: Team selection game with lone wolf multipliers
  - **Bingo Bango Bongo**: Points for first on green, closest to pin, first in hole
  - **Bloodsome (Chapman)**: Team alternate shot match play
  - **Stableford**: Points system based on score relative to par
  - **Banker/Quota**: Points vs. quota for each player
  - **Vegas**: Team numeric scoring with point differentials

- **User-Friendly Experience**:
  - Easy game selection interface
  - Mobile-responsive design works on all devices
  - Automatic score calculations and status updates
  - Settlement summary shows who owes what to whom

- **Data Management**:
  - Save games automatically to your device
  - Resume previous rounds
  - Export/import data as JSON files
  - Copy settlement summaries to clipboard

## 🚀 Quick Start

1. Visit [https://yourusername.github.io/peel-eat-golf/](https://yourusername.github.io/peel-eat-golf/)
2. Select a game type
3. Enter player names and game options
4. Start entering scores
5. View real-time calculations and settlements

## 💻 Local Development

To run this app locally:

1. Clone the repository
   ```
   git clone https://github.com/yourusername/peel-eat-golf.git
   ```

2. Open index.html in your browser
   ```
   cd peel-eat-golf
   open index.html   # macOS
   # or
   start index.html  # Windows
   ```

3. No build process or server required!

## 📱 Game Instructions

### Nassau

A 3-bet match play game with separate wagers for Front 9, Back 9, and Overall match.
- Enter player names, wager amount, and press rule
- Input scores hole-by-hole
- Presses can be added manually or automatically (when 2-down)
- Settlement shows breakdown of match results and presses

### Skins

Players compete for individual hole prizes; lowest score on a hole wins that hole's "skin."
- Enter player names and skin value
- Optional: Enable "validation" (requiring par or better to win)
- Optional: Enable "carryovers" (tied holes carry over to next hole)
- Settlement shows skins won and amounts owed

### Wolf

A team-selection game where the "Wolf" rotates each hole.
- Wolf can choose a partner or play alone against others
- Playing alone has higher risk/reward (multiplier)
- Points earned based on team vs. team matchups
- Settlement shows net points and amounts owed

### Bingo Bango Bongo

Three points available on each hole:
- Bingo: First player on the green
- Bango: Closest to the pin once all balls are on green
- Bongo: First player to hole out
- Track achievements with checkboxes
- Settlement based on total points earned

### Bloodsome (Chapman)

Team match play format where:
- Each team member hits a tee shot
- Teams choose which ball to play
- Teams alternate shots until hole completion
- Score matchup determines hole winner
- Settlement shows final match result

### Stableford

Point system based on performance relative to par:
- Standard: Double-Bogey=0, Bogey=1, Par=2, Birdie=3, Eagle=4
- Modified: Double-Bogey=-1, Bogey=0, Par=1, Birdie=2, Eagle=3
- Higher points are better
- Settlement based on point differentials

### Banker/Quota

Players have quotas to beat based on handicaps:
- Enter each player's quota (target points)
- Score using Stableford points system
- Compare final points to initial quota
- Settlement based on points above/below quota

### Vegas

Team best-ball format with unique scoring:
- Teams of 2 players create a combined score
- Combined score = Lower score × 10 + Higher score
- Example: Scores of 4 and 5 = 45
- Compare team numbers for point difference
- Settlement based on total point differential

## 🧰 Tech Stack

- **HTML5** for structure
- **CSS3** with Tailwind utility classes for styling
- **Vanilla JavaScript** for calculations and UI management
- **LocalStorage API** for saving game state
- **Web Storage API** for import/export functionality

## 📋 Future Enhancements

- Dark mode
- Handicap integration
- Additional golf games
- Round history
- Statistic tracking
- PDF export of scorecards
- PWA for offline functionality

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- All the golf buddies who inspired and tested this app
- The developers of Tailwind CSS for their utility classes
- You, for using and improving the app!

---

Made with ❤️ for golfers who like to keep score and settle bets
