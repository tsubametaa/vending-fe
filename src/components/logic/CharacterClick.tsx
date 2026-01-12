export interface CharacterData {
  id: number;
  name: string;
  preset: string; // The name of the preset
  description: string;
  asset: string;
}

export const CHARACTER_DATA: CharacterData[] = [
  {
    id: 1,
    name: "Farhan",
    preset: "Rush Hour",
    description: "High traffic expert",
    asset: "/assets/hero/hero_1.svg",
  },
  {
    id: 2,
    name: "Alvin",
    preset: "Efficient",
    description: "Optimization guru",
    asset: "/assets/hero/hero_2.svg",
  },
  {
    id: 3,
    name: "Ilham",
    preset: "Relaxed Park",
    description: "Chill vibes only",
    asset: "/assets/hero/hero_3.svg",
  },
  {
    id: 4,
    name: "Rakka",
    preset: "Overloaded",
    description: "Stress test specialist",
    asset: "/assets/hero/hero_4.svg",
  },
];

type Listener = (character: CharacterData) => void;
const listeners: Listener[] = [];

export const characterStore = {
  subscribe: (callback: Listener) => {
    listeners.push(callback);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  emit: (character: CharacterData) => {
    listeners.forEach((callback) => callback(character));
  },
};

// --- Handler ---

export function handleCharacterClick(index: number) {
  // Ensure index is within bounds of our defined character data
  // The index passed from the loop (0 to 3) maps directly to CHARACTER_DATA
  const character = CHARACTER_DATA[index];

  if (character) {
    console.log(
      `Character clicked: ${character.name}, Preset: ${character.preset}`
    );
    characterStore.emit(character);

    // Smooth scroll to simulator
    const simulatorSection = document.getElementById("simulator");
    if (simulatorSection) {
      simulatorSection.scrollIntoView({ behavior: "smooth" });
    }
  }
}
