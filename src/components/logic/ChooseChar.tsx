import { useState, useEffect } from "preact/hooks";
import { characterStore, type CharacterData } from "./CharacterClick";
import { motion, AnimatePresence } from "framer-motion";

interface ChooseCharProps {
  onCharacterChange?: (character: CharacterData | null) => void;
}

export default function ChooseChar({ onCharacterChange }: ChooseCharProps) {
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterData | null>(null);

  useEffect(() => {
    const unsubscribe = characterStore.subscribe((character) => {
      setSelectedCharacter(character);
      if (onCharacterChange) {
        onCharacterChange(character);
      }
    });

    return () => unsubscribe();
  }, [onCharacterChange]);

  return (
    <AnimatePresence mode="wait">
      {selectedCharacter ? (
        <motion.div
          key="selected"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          class="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-500/5 border-2 border-primary-500/40"
        >
          <div class="relative">
            <img
              src={selectedCharacter.asset}
              alt={selectedCharacter.name}
              class="h-12 w-12 object-contain pixelated"
            />
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-dark-300 animate-pulse"></div>
          </div>
          <div class="flex-1">
            <p class="text-sm font-bold text-primary-300 pixel-text">
              {selectedCharacter.name}
            </p>
            <p class="text-xs text-white/50">{selectedCharacter.description}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          class="flex items-center gap-3 p-3 rounded-lg bg-dark-300/50 border-2 border-dashed border-white/10"
        >
          <img
            src="/user.svg"
            alt="Choose character"
            class="w-12 h-12 opacity-30"
          />
          <div class="flex-1">
            <p class="text-sm font-medium text-white/50">
              Pilih karakter di atas
            </p>
            <p class="text-xs text-white/30">
              Klik salah satu karakter untuk memulai
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
