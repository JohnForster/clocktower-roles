# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a comprehensive data collection for Blood on the Clocktower characters, a social deduction game. The project includes both structured character data and a Progressive Web App (PWA) for learning character abilities through flashcards.

**Live Application**: https://johnforster.github.io/clocktower-roles/

The project stores character information in structured JSON format with corresponding images, and provides an interactive flashcard quiz system for learning character abilities.

## Data Structure

### Character Data Format
Each character is defined by a JSON file in `data/characters/` with the following structure:
- `name`: Character name
- `ability`: Character's game ability description
- `type`: Character type ("townsfolk", "outsider", "minion", "demon")
- `icon`: Filename of the character's image (in `data/images/`)
- `first_night`: Boolean indicating if the character acts on the first night
- `other_nights`: Boolean indicating if the character acts on subsequent nights
- `reminders`: Array of reminder tokens used by the Storyteller
- `affects_setup`: Boolean indicating if the character affects game setup
- `home_script`: The script/edition where this character originates

### Character Types
- **Townsfolk**: Good team players with helpful abilities
- **Outsider**: Good team players with potentially harmful abilities
- **Minion**: Evil team support players
- **Demon**: Evil team killing players
- **Fabled**: Special characters that modify game rules
- **Travellers**: Optional characters that can join mid-game

## Repository Structure

```
/
├── data/
│   ├── characters/     # JSON files for each character
│   └── images/         # PNG images for each character
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── App.tsx        # Main application component
├── public/            # Static assets
├── dist/              # Production build output
└── package.json       # Project dependencies and scripts
```

## Working with Character Data

### Adding New Characters
1. Create a new JSON file in `data/characters/` following the established format
2. Add the corresponding PNG image to `data/images/`
3. Ensure the `icon` field matches the image filename

### Modifying Character Data
- All character data is stored as single-line JSON files
- Maintain consistency with existing character structure
- Verify that `icon` references match actual image files

### Character Naming Convention
- JSON filenames should be lowercase versions of character names
- Remove spaces and special characters from filenames
- Images should use the same naming convention with `.png` extension

## Available Scripts

The application supports the following game scripts:
- **Trouble Brewing** - Base game script for beginners
- **Bad Moon Rising** - Intermediate complexity with more chaos
- **Sects and Violets** - Advanced script with complex interactions
- **The Carousel** - Combined experimental characters from Kickstarter and Carousel
- **Fabled** - Special rule-modifying characters

## Data Validation

When working with character data:
- Ensure all required fields are present
- Validate that character types are one of the valid options (townsfolk, outsider, minion, demon, fabled, travellers)
- Check that boolean fields (`first_night`, `other_nights`, `affects_setup`) are properly set
- Verify image references exist in the `data/images/` directory
- Ensure `home_script` matches one of the available scripts

## Flashcard Application

The primary feature of this repository is a Progressive Web App (PWA) for learning character abilities through interactive flashcards.

### Key Features
- **Script Selection** - Choose from 5 different game scripts
- **Multiple Choice Quiz** - Test knowledge of character abilities
- **Progress Tracking** - localStorage-based progress system
- **Responsive Design** - Works on desktop and mobile devices
- **Offline Support** - PWA capabilities with service worker
- **Smart Image Preloading** - Background loading for smooth gameplay
- **Centered Desktop Layout** - Optimal viewing experience

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Application Architecture

The flashcard app is built with:
- **Vite** - Build tool and development server
- **React** - UI framework
- **TypeScript** - Type safety
- **PWA** - Offline capability with service worker

### Key Components
- `ScriptSelector` - Allows users to choose which script to study
- `FlashcardGame` - Main game component with multiple choice questions
- `useProgress` - Hook for tracking user progress in localStorage

### Data Flow
1. Character data is loaded from JSON files in `data/characters/`
2. Images are served from `data/images/` with proper base path handling
3. Questions are generated using similarity algorithms for wrong answers
4. User progress is stored in localStorage and used to prioritize difficult characters
5. Images are preloaded in background in quiz order for smooth experience

### Recent Improvements
- **Background Image Preloading** - Eliminates loading delays during gameplay
- **Fixed Fabled Script Bug** - Fabled characters now load correctly
- **Mobile UI Enhancements** - Improved responsive design and layout consistency
- **Deployment Path Fix** - Images load correctly on GitHub Pages
- **Centered Desktop Layout** - Better desktop user experience

### Deployment
- **Production URL**: https://johnforster.github.io/clocktower-roles/
- **Deployment**: Automated via GitHub Actions
- **Base Path**: `/clocktower-roles` for GitHub Pages compatibility