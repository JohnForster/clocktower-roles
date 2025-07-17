export interface Character {
  name: string;
  ability: string;
  type: 'townsfolk' | 'outsider' | 'minion' | 'demon' | 'travellers' | 'fabled';
  icon: string;
  first_night: boolean;
  other_nights: boolean;
  reminders: string[];
  affects_setup: boolean;
  home_script: string;
}

export interface Script {
  name: string;
  characters: Character[];
}

export interface FlashcardQuestion {
  character: Character;
  options: string[];
  correctAnswer: string;
  type: 'ability-from-name' | 'name-from-ability';
}

export interface UserProgress {
  characterId: string;
  correct: number;
  incorrect: number;
  lastSeen: Date;
}