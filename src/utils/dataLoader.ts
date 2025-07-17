import { Character, Script } from "../types/character";

// Import character data
const characterModules = import.meta.glob("../../data/characters/*.json");

export async function loadAllCharacters(): Promise<Character[]> {
  const characterPromises = Object.values(characterModules).map(
    async (moduleLoader) => {
      const module = (await moduleLoader()) as any;
      return module.default || module;
    }
  );

  return Promise.all(characterPromises);
}

export async function loadCharactersByScript(
  scriptName: string
): Promise<Character[]> {
  const allCharacters = await loadAllCharacters();
  return allCharacters.filter(
    (character) => character.home_script === scriptName
  );
}

export async function getAvailableScripts(): Promise<string[]> {
  const allCharacters = await loadAllCharacters();
  const scriptNames = new Set<string>();

  allCharacters.forEach((character) => {
    scriptNames.add(character.home_script);
  });

  return Array.from(scriptNames).sort();
}

export async function loadScriptData(): Promise<Script[]> {
  const allCharacters = await loadAllCharacters();
  const scriptMap = new Map<string, Character[]>();

  // Group characters by script
  allCharacters.forEach((character) => {
    if (!scriptMap.has(character.home_script)) {
      scriptMap.set(character.home_script, []);
    }
    scriptMap.get(character.home_script)!.push(character);
  });

  // Convert to Script objects
  const scripts: Script[] = [];
  for (const [scriptName, characters] of scriptMap) {
    scripts.push({
      name: scriptName,
      characters: characters.sort((a, b) => a.name.localeCompare(b.name)),
    });
  }

  return scripts.sort((a, b) => a.name.localeCompare(b.name));
}

// Helper function to get character image path
export function getCharacterImagePath(character: Character): string {
  // Use relative path that works with Vite base configuration
  return `${import.meta.env.BASE_URL}data/images/${character.icon}`;
}
