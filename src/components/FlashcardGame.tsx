import React, { useState, useEffect } from 'react';
import { Character, FlashcardQuestion } from '../types/character';
import { loadCharactersByScript } from '../utils/dataLoader';
import { generateFlashcardQuestion, selectNextCharacter } from '../utils/questionGenerator';
import { useProgress } from '../hooks/useProgress';

interface FlashcardGameProps {
  selectedScript: string;
  includeTravellers: boolean;
}

export const FlashcardGame: React.FC<FlashcardGameProps> = ({ selectedScript, includeTravellers }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<FlashcardQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  const { progress, updateProgress, getProgress } = useProgress();

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setLoading(true);
        const scriptCharacters = await loadCharactersByScript(selectedScript);
        
        // Filter out travellers and fabled if not included
        const filteredCharacters = scriptCharacters.filter(character => {
          if (!includeTravellers && (character.type === 'travellers' || character.type === 'fabled')) {
            return false;
          }
          return true;
        });
        
        setCharacters(filteredCharacters);
        
        if (filteredCharacters.length > 0) {
          generateNextQuestion(filteredCharacters);
        }
      } catch (error) {
        console.error('Failed to load characters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [selectedScript, includeTravellers]);

  const generateNextQuestion = (availableCharacters: Character[]) => {
    const nextCharacter = selectNextCharacter(availableCharacters, progress);
    const question = generateFlashcardQuestion(nextCharacter, availableCharacters);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestion?.correctAnswer;
    
    if (currentQuestion) {
      updateProgress(currentQuestion.character.name, isCorrect);
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
    }
  };

  const handleNextQuestion = () => {
    if (characters.length > 0) {
      generateNextQuestion(characters);
    }
  };

  const getCharacterImagePath = (character: Character): string => {
    return `/data/images/${character.icon}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Failed to load image: ${e.currentTarget.src}`);
    // Hide the image element if it fails to load
    e.currentTarget.style.display = 'none';
  };

  if (loading) {
    return <div className="loading">Loading characters...</div>;
  }

  if (characters.length === 0) {
    return <div className="no-characters">No characters found for this script.</div>;
  }

  if (!currentQuestion) {
    return <div className="loading">Generating question...</div>;
  }

  const characterProgress = getProgress(currentQuestion.character.name);

  return (
    <div className="flashcard-game">
      <div className="game-header">
        <h2>{selectedScript}</h2>
        <div className="score">
          Score: {score.correct}/{score.total}
        </div>
      </div>

      <div className="flashcard">
        <div className="character-info">
          <div className="character-image-container">
            <div className="character-image-background"></div>
            <img
              src={getCharacterImagePath(currentQuestion.character)}
              alt={currentQuestion.character.name}
              className="character-image"
              onError={handleImageError}
            />
          </div>
          <h3 className="character-name">{currentQuestion.character.name}</h3>
          <p className="character-type">{currentQuestion.character.type}</p>
        </div>

        <div className="question">
          <h4>What is this character's ability?</h4>
        </div>

        <div className="options">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = 'option-button';
            
            if (showResult) {
              if (option === currentQuestion.correctAnswer) {
                buttonClass += ' correct';
              } else if (option === selectedAnswer) {
                buttonClass += ' incorrect';
              }
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="result">
            <div className={`result-message ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
            </div>
            
            {characterProgress && (
              <div className="progress-info">
                Previous attempts: {characterProgress.correct} correct, {characterProgress.incorrect} incorrect
              </div>
            )}
            
            <button
              className="next-button"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};