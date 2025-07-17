import { useState, useEffect } from 'react';
import { UserProgress } from '../types/character';

const PROGRESS_STORAGE_KEY = 'botc-flashcard-progress';

export function useProgress() {
  const [progress, setProgress] = useState<Map<string, UserProgress>>(new Map());

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        const progressMap = new Map<string, UserProgress>();
        
        for (const [key, value] of Object.entries(parsed)) {
          progressMap.set(key, {
            ...(value as UserProgress),
            lastSeen: new Date((value as UserProgress).lastSeen)
          });
        }
        
        setProgress(progressMap);
      } catch (error) {
        console.error('Failed to load progress from localStorage:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const progressObject = Object.fromEntries(progress);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressObject));
  }, [progress]);

  const updateProgress = (characterId: string, correct: boolean) => {
    setProgress(prev => {
      const newProgress = new Map(prev);
      const current = newProgress.get(characterId) || {
        characterId,
        correct: 0,
        incorrect: 0,
        lastSeen: new Date()
      };

      if (correct) {
        current.correct += 1;
      } else {
        current.incorrect += 1;
      }
      
      current.lastSeen = new Date();
      newProgress.set(characterId, current);
      
      return newProgress;
    });
  };

  const getProgress = (characterId: string): UserProgress | undefined => {
    return progress.get(characterId);
  };

  const resetProgress = () => {
    setProgress(new Map());
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  };

  return {
    progress,
    updateProgress,
    getProgress,
    resetProgress
  };
}