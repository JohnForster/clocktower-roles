import { Character, FlashcardQuestion } from "../types/character";

// Function to calculate text similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

// Function to find similar characters based on ability text
function findSimilarCharacters(
  targetCharacter: Character,
  allCharacters: Character[],
  count: number
): Character[] {
  const similarities = allCharacters
    .filter((char) => char.name !== targetCharacter.name)
    .map((char) => ({
      character: char,
      similarity: calculateSimilarity(targetCharacter.ability, char.ability),
    }))
    .sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, count).map((item) => item.character);
}

// Function to replace the target character's name in ability text
function replaceOwnNameInAbility(
  ability: string,
  characterName: string
): string {
  // Use word boundaries to match whole words only
  const regex = new RegExp(`\\b${characterName}\\b`, "gi");
  return ability.replace(regex, "<This Character>");
}

// Function to generate slightly modified versions of an ability
function generateModifiedAbility(ability: string): string {
  const modifications = [
    // Change "each night" to "each day" or vice versa
    (text: string) => text.replace(/each night/gi, "each day"),
    (text: string) => text.replace(/each day/gi, "each night"),

    // Change "you" to "a player" or vice versa
    (text: string) => text.replace(/\byou\b/gi, "a player"),
    (text: string) => text.replace(/\ba player\b/gi, "you"),

    // Change "may" to "must" or vice versa
    (text: string) => text.replace(/\bmay\b/gi, "must"),
    (text: string) => text.replace(/\bmust\b/gi, "may"),

    // Change "alive" to "dead" or vice versa
    (text: string) => text.replace(/\balive\b/gi, "dead"),
    (text: string) => text.replace(/\bdead\b/gi, "alive"),

    // Change "good" to "evil" or vice versa
    (text: string) => text.replace(/\bgood\b/gi, "evil"),
    (text: string) => text.replace(/\bevil\b/gi, "good"),
  ];

  // Apply a random modification
  const randomModification =
    modifications[Math.floor(Math.random() * modifications.length)];
  const modified = randomModification(ability);

  // Only return the modified version if it's actually different
  return modified !== ability ? modified : ability;
}

export function generateFlashcardQuestion(
  targetCharacter: Character,
  scriptCharacters: Character[],
  allCharacters?: Character[]
): FlashcardQuestion {
  // Randomly choose question type
  const questionType =
    Math.random() < 0.5 ? "ability-from-name" : "name-from-ability";

  if (questionType === "ability-from-name") {
    // For ability-from-name questions, use all characters if available, otherwise fall back to script characters
    const charactersForIncorrectAnswers = allCharacters || scriptCharacters;
    return generateAbilityFromNameQuestion(targetCharacter, charactersForIncorrectAnswers);
  } else {
    // For name-from-ability questions, use only script characters to maintain difficulty balance
    return generateNameFromAbilityQuestion(targetCharacter, scriptCharacters);
  }
}

function generateAbilityFromNameQuestion(
  targetCharacter: Character,
  allCharacters: Character[]
): FlashcardQuestion {
  // Filter to same type characters for wrong answers
  const sameTypeCharacters = allCharacters.filter(
    (char) => char.type === targetCharacter.type && char.name !== targetCharacter.name
  );
  
  // Find similar characters for wrong answers
  const similarCharacters = findSimilarCharacters(
    targetCharacter,
    sameTypeCharacters,
    3
  );

  // Generate options - start with correct answer
  const options: string[] = [targetCharacter.ability];
  const usedAbilities = new Set([targetCharacter.ability]);

  // Add abilities from similar characters (avoid duplicates)
  similarCharacters.forEach((char) => {
    if (options.length < 4) {
      // Replace the incorrect character's name with the target character's name
      const modifiedAbility = replaceOwnNameInAbility(
        char.ability,
        char.name
      ).replace(/<This Character>/g, targetCharacter.name);
      
      if (!usedAbilities.has(modifiedAbility)) {
        options.push(modifiedAbility);
        usedAbilities.add(modifiedAbility);
      }
    }
  });

  // If we need more options, try to generate modified versions
  while (options.length < 4) {
    const modifiedAbility = generateModifiedAbility(targetCharacter.ability);
    if (!usedAbilities.has(modifiedAbility)) {
      options.push(modifiedAbility);
      usedAbilities.add(modifiedAbility);
    } else {
      // If we can't generate a unique modified ability, find more characters
      const additionalCharacters = findSimilarCharacters(
        targetCharacter,
        sameTypeCharacters,
        10
      );
      let added = false;

      for (const char of additionalCharacters) {
        if (options.length < 4) {
          // Replace the incorrect character's name with the target character's name
          const modifiedAbility = replaceOwnNameInAbility(
            char.ability,
            char.name
          ).replace(/<This Character>/g, targetCharacter.name);
          
          if (!usedAbilities.has(modifiedAbility)) {
            options.push(modifiedAbility);
            usedAbilities.add(modifiedAbility);
            added = true;
            break;
          }
        }
      }

      if (!added) {
        // Last resort: try random characters from the same type
        const randomCharacters = [...sameTypeCharacters]
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);
        
        for (const char of randomCharacters) {
          if (options.length < 4) {
            const modifiedAbility = replaceOwnNameInAbility(
              char.ability,
              char.name
            ).replace(/<This Character>/g, targetCharacter.name);
            
            if (!usedAbilities.has(modifiedAbility)) {
              options.push(modifiedAbility);
              usedAbilities.add(modifiedAbility);
              added = true;
              break;
            }
          }
        }
        
        if (!added) break; // Prevent infinite loop
      }
    }
  }

  // Shuffle the options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    character: targetCharacter,
    options,
    correctAnswer: targetCharacter.ability,
    type: "ability-from-name",
  };
}

function generateNameFromAbilityQuestion(
  targetCharacter: Character,
  allCharacters: Character[]
): FlashcardQuestion {
  // Find characters from the same type only
  const sameTypeCharacters = allCharacters.filter(
    (char) =>
      char.type === targetCharacter.type && char.name !== targetCharacter.name
  );

  // Find similar characters based on ability text similarity
  const similarCharacters = findSimilarCharacters(
    targetCharacter,
    sameTypeCharacters,
    3
  );

  // Generate options - start with correct answer
  const options: string[] = [targetCharacter.name];
  const usedNames = new Set([targetCharacter.name]);

  // Add names from similar characters (avoid duplicates)
  similarCharacters.forEach((char) => {
    if (!usedNames.has(char.name) && options.length < 4) {
      options.push(char.name);
      usedNames.add(char.name);
    }
  });

  // If we need more options, add remaining same-type characters
  if (options.length < 4) {
    const remainingCharacters = sameTypeCharacters.filter(
      (char) => !usedNames.has(char.name)
    );
    const shuffledRemaining = [...remainingCharacters].sort(
      () => Math.random() - 0.5
    );

    for (const char of shuffledRemaining) {
      if (options.length < 4) {
        options.push(char.name);
        usedNames.add(char.name);
      }
    }
  }

  // Shuffle the options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Create a modified character object with ability text that has own name replaced
  const modifiedCharacter = {
    ...targetCharacter,
    ability: replaceOwnNameInAbility(
      targetCharacter.ability,
      targetCharacter.name
    ),
  };

  return {
    character: modifiedCharacter,
    options,
    correctAnswer: targetCharacter.name,
    type: "name-from-ability",
  };
}

export function generateQuestionsFromCharacters(
  characters: Character[],
  allCharacters?: Character[]
): FlashcardQuestion[] {
  return characters.map((character) =>
    generateFlashcardQuestion(character, characters, allCharacters)
  );
}

// Function to select next character based on progress (prioritize incorrect answers)
export function selectNextCharacter(
  characters: Character[],
  progressMap: Map<
    string,
    { correct: number; incorrect: number; lastSeen: Date }
  >
): Character {
  // Calculate priority scores for each character
  const characterScores = characters.map((character) => {
    const progress = progressMap.get(character.name);

    if (!progress) {
      // Never seen before - highest priority
      return { character, score: 1000 };
    }

    const { correct, incorrect, lastSeen } = progress;
    const totalAttempts = correct + incorrect;

    // Higher score for more incorrect answers
    const incorrectScore = incorrect * 10;

    // Lower score for more correct answers
    const correctScore = correct * -5;

    // Time factor - characters not seen recently get higher priority
    const daysSinceLastSeen =
      (Date.now() - lastSeen.getTime()) / (1000 * 60 * 60 * 24);
    const timeScore = Math.min(daysSinceLastSeen * 2, 20);

    // Accuracy factor - characters with low accuracy get higher priority
    const accuracy = totalAttempts > 0 ? correct / totalAttempts : 0;
    const accuracyScore = (1 - accuracy) * 15;

    const totalScore =
      incorrectScore + correctScore + timeScore + accuracyScore;

    return { character, score: totalScore };
  });

  // Sort by score (highest first)
  characterScores.sort((a, b) => b.score - a.score);

  // Select from top 3 characters with some randomness
  const topCharacters = characterScores.slice(
    0,
    Math.min(3, characterScores.length)
  );
  const randomIndex = Math.floor(Math.random() * topCharacters.length);

  return topCharacters[randomIndex].character;
}
