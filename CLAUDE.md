# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a comprehensive data collection for Blood on the Clocktower characters, a social deduction game. The project stores character information in structured JSON format with corresponding images.

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

## Repository Structure

```
/
├── data/
│   ├── characters/     # JSON files for each character
│   └── images/         # PNG images for each character
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

## Data Validation

When working with character data:
- Ensure all required fields are present
- Validate that character types are one of the four valid options
- Check that boolean fields (`first_night`, `other_nights`, `affects_setup`) are properly set
- Verify image references exist in the `data/images/` directory

## Flashcard Application

This repository also contains a Progressive Web App (PWA) for learning character abilities through flashcards.

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
2. Images are served from `data/images/`
3. Questions are generated using similarity algorithms for wrong answers
4. User progress is stored in localStorage and used to prioritize difficult characters

### File Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```