# Blood on the Clocktower Flashcards

A Progressive Web App for learning character abilities from the social deduction
game [Blood on the Clocktower](https://bloodontheclocktower.com/). Practice
identifying characters and their abilities through interactive flashcards with
smart question generation.

This is my first vibe-coded application, to test the capabilities of Claude CLI.

## Features

### 🎯 Interactive Flashcards

- **Multiple Choice Questions**: 4 options with intelligently generated similar
  abilities
- **Character Images**: Visual character icons with proper attribution
- **Smart Answer Generation**: Similar abilities and modified versions for
  realistic distractors
- **Progress Tracking**: Remembers which characters you've answered
  correctly/incorrectly

### 📚 Script Selection

- **Official Scripts**: Trouble Brewing, Bad Moon Rising, Sects and Violets,
  Kickstarter, Carousel Experimental
- **Character Filtering**: Toggle travellers and fabled characters on/off
- **Complete Coverage**: All 172+ characters from official releases

### 🎲 Quiz System

- **Randomized Order**: Characters appear in random sequence each quiz
- **Complete Coverage**: Each character appears exactly once per quiz
- **Final Scoring**: Percentage score with motivational messages
- **Progress Indicator**: Shows completed characters during quiz

### 📱 Mobile Optimized

- **Responsive Design**: Works on screens as small as 320px
- **Touch Friendly**: Properly sized buttons and touch targets
- **No Horizontal Scrolling**: Optimized layout for mobile devices
- **Horizontal Character Layout**: Efficient use of mobile screen space

### 🌓 Accessibility

- **Dark/Light Mode**: Automatic system preference detection
- **High Contrast**: Proper contrast ratios for all text
- **Keyboard Navigation**: Fully keyboard accessible
- **Screen Reader Support**: Semantic HTML and ARIA labels

### ⚡ Performance

- **Progressive Web App**: Offline capability and app-like experience
- **Fast Loading**: Optimized image loading and caching
- **Local Storage**: Progress saved locally on device
- **Efficient Rendering**: React-based with minimal re-renders

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/roles-revision.git
cd roles-revision

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Select a Script**: Choose from the available Blood on the Clocktower
   scripts
2. **Configure Options**: Toggle travellers/fabled characters if desired
3. **Start Quiz**: Click "Continue" to begin the flashcard quiz
4. **Answer Questions**: Select the correct ability for each character shown
5. **Complete Quiz**: Review your final score and return to script selection

## Project Structure

```
├── data/
│   ├── characters/     # JSON files for each character
│   └── images/         # Character artwork (PNG format)
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── App.tsx        # Main application component
├── public/            # Static assets
└── CLAUDE.md          # Development guidance
```

## Character Data Format

Each character is defined in JSON format:

```json
{
  "name": "Imp",
  "ability": "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.",
  "type": "demon",
  "icon": "imp.png",
  "first_night": false,
  "other_nights": true,
  "reminders": ["DEAD"],
  "affects_setup": false,
  "home_script": "Trouble Brewing"
}
```

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS with responsive design
- **PWA**: Service Worker, Web App Manifest
- **Build Tools**: Vite, ESLint
- **Data**: JSON files, image assets

### Adding New Characters

1. Add character JSON file to `data/characters/`
2. Add character image to `data/images/`
3. Follow the existing naming convention (lowercase, no spaces)
4. Ensure the `icon` field matches the image filename

## License

This project is for educational purposes. Blood on the Clocktower is a trademark
of Steven Medway and The Pandemonium Institute.

## Acknowledgments

- **The Pandemonium Institute** for creating Blood on the Clocktower
- **Character artwork** from the official game materials
- **Community** for feedback and suggestions

## Support

If you encounter any issues or have suggestions:

1. Check the [Issues](https://github.com/your-username/roles-revision/issues)
   page
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs

---

_Built with ❤️ for the Blood on the Clocktower community_
