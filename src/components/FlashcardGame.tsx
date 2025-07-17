import React, { useState, useEffect } from "react";
import { Character, FlashcardQuestion } from "../types/character";
import { loadCharactersByScript, getCharacterImagePath } from "../utils/dataLoader";
import { generateFlashcardQuestion } from "../utils/questionGenerator";
import { useProgress } from "../hooks/useProgress";

interface FlashcardGameProps {
  selectedScript: string;
  includeTravellers: boolean;
  onReturnToSelection: () => void;
}

export const FlashcardGame: React.FC<FlashcardGameProps> = ({
  selectedScript,
  includeTravellers,
  onReturnToSelection,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<FlashcardQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answeredCharacters, setAnsweredCharacters] = useState<Set<string>>(
    new Set()
  );
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [shuffledCharacters, setShuffledCharacters] = useState<Character[]>([]);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  const { updateProgress, getProgress } = useProgress();

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Preload a single image
  const preloadSingleImage = (character: Character): Promise<void> => {
    return new Promise<void>((resolve) => {
      const imagePath = getCharacterImagePath(character);
      
      // Skip if already preloaded
      if (preloadedImages.has(imagePath)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, imagePath]));
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to preload image for ${character.name}: ${imagePath}`);
        resolve(); // Don't fail the process
      };
      img.src = imagePath;
    });
  };

  // Preload images in background, in order of appearance
  const startBackgroundPreloading = (characters: Character[]) => {
    const preloadNext = async (index: number) => {
      if (index >= characters.length) return;
      
      const character = characters[index];
      await preloadSingleImage(character);
      
      // Continue with next image after a small delay to not block the UI
      setTimeout(() => preloadNext(index + 1), 10);
    };

    // Start preloading from the beginning
    preloadNext(0);
  };

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setLoading(true);
        const scriptCharacters = await loadCharactersByScript(selectedScript);

        // Filter out travellers if not included
        const filteredCharacters = scriptCharacters.filter((character) => {
          if (
            !includeTravellers &&
            character.type === "travellers"
          ) {
            return false;
          }
          return true;
        });

        setCharacters(filteredCharacters);

        // Shuffle characters for randomized quiz order
        const shuffled = shuffleArray(filteredCharacters);
        setShuffledCharacters(shuffled);

        // Reset quiz state when characters change
        setAnsweredCharacters(new Set());
        setQuizCompleted(false);
        setScore({ correct: 0, total: 0 });
        setPreloadedImages(new Set());

        if (shuffled.length > 0) {
          generateNextQuestion(filteredCharacters, shuffled);
          // Start background preloading in the order questions will appear
          startBackgroundPreloading(shuffled);
        }
      } catch (error) {
        console.error("Failed to load characters:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [selectedScript, includeTravellers]);

  const generateNextQuestion = (
    availableCharacters: Character[],
    shuffledOrder?: Character[]
  ) => {
    const characterOrder = shuffledOrder || shuffledCharacters;

    // Check if all characters have been answered
    if (answeredCharacters.size >= availableCharacters.length) {
      setQuizCompleted(true);
      return;
    }

    // Find the next character in the shuffled order that hasn't been answered
    const nextCharacter = characterOrder.find(
      (char) => !answeredCharacters.has(char.name)
    );

    // If no unanswered character found, complete the quiz
    if (!nextCharacter) {
      setQuizCompleted(true);
      return;
    }

    const question = generateFlashcardQuestion(
      nextCharacter,
      availableCharacters
    );
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);

    // Preload the current question's image immediately if not already preloaded
    preloadSingleImage(nextCharacter);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion?.correctAnswer;

    if (currentQuestion) {
      updateProgress(currentQuestion.character.name, isCorrect);
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));

      // Mark this character as answered
      setAnsweredCharacters(
        (prev) => new Set([...prev, currentQuestion.character.name])
      );
    }
  };

  const handleNextQuestion = () => {
    if (characters.length > 0) {
      generateNextQuestion(characters);
    }
  };


  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Failed to load image: ${e.currentTarget.src}`);
    // Hide the image element if it fails to load
    e.currentTarget.style.display = "none";
  };

  if (loading) {
    return <div className="loading">Loading characters...</div>;
  }

  if (characters.length === 0) {
    return (
      <div className="no-characters">No characters found for this script.</div>
    );
  }

  if (!currentQuestion) {
    return <div className="loading">Generating question...</div>;
  }

  const characterProgress = getProgress(currentQuestion.character.name);

  const getScorePercentage = () => {
    return score.total > 0
      ? Math.round((score.correct / score.total) * 100)
      : 0;
  };

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage === 100) return "Perfect! 🎉";
    if (percentage >= 90) return "Excellent! 🌟";
    if (percentage >= 80) return "Great job! 👏";
    if (percentage >= 70) return "Good work! 👍";
    if (percentage >= 60) return "Not bad! 📚";
    return "Keep practicing! 💪";
  };

  // Show quiz completion screen
  if (quizCompleted) {
    return (
      <div className="flashcard-game">
        <div className="game-header">
          <h2>{selectedScript}</h2>
          <div className="score">
            Final Score: {score.correct}/{score.total}
          </div>
        </div>

        <div className="quiz-completed">
          <div className="completion-message">
            <h3>Quiz Complete!</h3>
            <div className="final-score">
              <div className="score-percentage">{getScorePercentage()}%</div>
              <div className="score-message">{getScoreMessage()}</div>
            </div>
            <div className="score-details">
              You answered {score.correct} out of {score.total} questions
              correctly
            </div>
          </div>

          <div className="completion-actions">
            <button className="return-button" onClick={onReturnToSelection}>
              Return to Script Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-game">
      <div className="game-header">
        <h2>{selectedScript}</h2>
        <div className="score">
          Score: {score.correct}/{score.total} ({answeredCharacters.size}/
          {characters.length} completed)
        </div>
      </div>

      <div className="flashcard">
        {currentQuestion.type === 'ability-from-name' && (
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
            <div className="character-details">
              <h3 className="character-name">{currentQuestion.character.name}</h3>
              <p className="character-type">{currentQuestion.character.type}</p>
            </div>
          </div>
        )}

        <div className="question">
          <h4>
            {currentQuestion.type === 'ability-from-name' 
              ? 'What is this character\'s ability?' 
              : 'Which character has this ability?'}
          </h4>
          {currentQuestion.type === 'name-from-ability' && (
            <div className="ability-text">
              "{currentQuestion.character.ability}"
            </div>
          )}
        </div>

        <div className="options">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "option-button";

            if (showResult) {
              if (option === currentQuestion.correctAnswer) {
                buttonClass += " correct";
              } else if (option === selectedAnswer) {
                buttonClass += " incorrect";
              }
            }

            // For name-from-ability questions, show character icons
            if (currentQuestion.type === 'name-from-ability') {
              const character = characters.find(char => char.name === option);
              
              return (
                <button
                  key={index}
                  className={`${buttonClass} option-with-icon`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  {character && (
                    <div className="option-icon-container">
                      <div className="option-icon-background"></div>
                      <img
                        src={getCharacterImagePath(character)}
                        alt={character.name}
                        className="option-icon"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  <span className="option-text">{option}</span>
                </button>
              );
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
            <div
              className={`result-message ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? "correct"
                  : "incorrect"
              }`}
            >
              {selectedAnswer === currentQuestion.correctAnswer
                ? "Correct!"
                : "Incorrect!"}
            </div>

            {characterProgress && (
              <div className="progress-info">
                Previous attempts: {characterProgress.correct} correct,{" "}
                {characterProgress.incorrect} incorrect
              </div>
            )}

            <button className="next-button" onClick={handleNextQuestion}>
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
