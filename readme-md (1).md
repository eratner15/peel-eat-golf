# Peel & Eat Golf Scorecards

A static web application for tracking various golf betting games and calculating settlements.

## Features

- Support for 8 popular golf betting games:
  - **Nassau**: Front 9, Back 9, and Total match with optional presses
  - **Skins**: Individual prize for each hole with optional carryovers
  - **Wolf**: Team selection game with lone wolf options
  - **Bingo Bango Bongo**: Points for first on green, closest to pin, and first in hole
  - **Bloodsome (Chapman)**: Team alternate shot match play
  - **Stableford**: Point system based on score relative to par
  - **Banker/Quota**: Points vs. quota for each player
  - **Vegas**: Team numeric scoring with point differentials

- Additional functionality:
  - Save/restore rounds using local storage
  - Export/import round data as JSON files
  - Copy settlement summaries to clipboard
  - Mobile-responsive design
  - No server required - works entirely in the browser

## Project Structure

```
peel-eat-golf/
├── index.html        (main HTML file)
├── css/
│   └── style.css     (combined styles)
├── js/
│   ├── script.js     (main script with core functionality)
│   ├── utils.js      (utility functions)
│   └── games/        (folder for game implementations)
│       ├── nassau.js
│       ├── skins.js
│       ├── wolf.js
│       ├── bingo.js
│       ├── bloodsome.js
│       ├── stableford.js
│       ├── banker.js
│       └── vegas.js
└── README.md         (this file)
```

## Setup & Development

1. Clone the repository or download the source code
2. No build steps required - this is a purely static application
3. Open `index.html` in a web browser to use the application locally
4. For development, you can use any web server to serve the files:
   - VS Code Live Server extension
   - Python's `http.server` module: `python -m http.server`
   - Node.js `http-server` package: `npx http-server`

## Deployment Options

### GitHub Pages

1. Create a GitHub repository for the project
2. Push the code to the repository
3. Go to the repository settings
4. Under "GitHub Pages", select the branch you want to deploy (usually `main`)
5. Choose the folder (root directory) and click Save
6. Your site will be available at `https://<username>.github.io/<repository>/`

### Netlify

1. Create an account on [Netlify](https://www.netlify.com/)
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Configure deploy settings (usually no configuration needed)
5. Click "Deploy site"
6. Your site will be available at a Netlify subdomain, with the option to set up a custom domain

### Vercel

1. Create an account on [Vercel](https://vercel.com/)
2. Click "New Project"
3. Import your repository
4. Configure deploy settings (usually no configuration needed)
5. Click "Deploy"
6. Your site will be available at a Vercel subdomain, with the option to set up a custom domain

## Browser Compatibility

The application should work on all modern browsers:
- Chrome/Edge (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Mobile browsers (Chrome/Safari for iOS and Android)

## Future Enhancements

Potential improvements that could be added:
- Dark mode
- Handicap calculations
- More golf games (Sixes, Arnies, etc.)
- Team management and history
- PDF export of scorecards
- PWA (Progressive Web App) support for offline use

## License

MIT License - Feel free to use, modify, and distribute as needed!

## Acknowledgments

- Tailwind CSS for utility classes
- Google Fonts for typography
