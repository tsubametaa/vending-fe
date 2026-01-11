import { useEffect, useState } from 'preact/hooks';
import { motion } from 'framer-motion';
import { GamepadIcon } from './Icons';

import { CHARACTER_DATA, handleCharacterClick } from './logic/CharacterClick';


export default function HeroSection() {

  return (
    <section class="relative min-h-[700px] flex flex-col items-center justify-center overflow-hidden py-16 px-4">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-800/50 to-dark-900/80"></div>

        <motion.div
          class="absolute bottom-0 w-full h-[300px]"
          style={{
            backgroundImage: `
              linear-gradient(transparent 95%, rgba(6, 182, 212, 0.2) 95%),
              linear-gradient(90deg, transparent 95%, rgba(6, 182, 212, 0.2) 95%)
            `,
            backgroundSize: '40px 40px',
            transformOrigin: 'bottom center',
            maskImage: 'linear-gradient(to top, black, transparent)'
          }}
          initial={{ rotateX: 60, y: 100, scale: 2, opacity: 0 }}
          animate={{ rotateX: 60, y: 100, scale: 2, opacity: 1 }}
          transition={{ duration: 1.5 }}
        ></motion.div>

        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_) => (
            <motion.div class="particle-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }} />
          ))}
        </div>
      </div>

      <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">

        <motion.div
          class="text-center mb-24"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >

          <h1 class="font-['VT323'] text-6xl md:text-8xl font-bold mb-4 tracking-wider leading-none">
            <span class="block gradient-text drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
              QUEUE QUEST
            </span>
          </h1>

          <p class="font-['VT323'] text-2xl text-white/60 tracking-widest uppercase">
            Choose Your Character • Modeling and Simulation
          </p>
        </motion.div>

      <div class="relative w-full">

        <div class="flex justify-center items-end gap-6 md:gap-12 lg:gap-16 flex-wrap px-4 perspective-1000">
          {CHARACTER_DATA.map((char, index) => (
            <motion.div
              key={char.id}
              class="group relative flex flex-col items-center cursor-pointer"
              onClick={() => handleCharacterClick(index)}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <motion.div
                class="relative z-10"
                whileHover={{ scale: 1.1, y: -16 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div class="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/20 blur-xl rounded-full transition-all duration-300"></div>

                <div class="character-sprite relative">
                  <img
                    src={char.asset}
                    alt={char.name}
                    class="h-40 md:h-52 lg:h-64 w-auto object-contain pixelated drop-shadow-2xl" />
                </div>
              </motion.div>

              <motion.div
                class="w-16 h-3 bg-black/40 rounded-[100%] blur-sm mt-4"
                animate={{ scale: [1, 0.8, 1], opacity: [0.4, 0.2, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    <style>{`
        .pixelated {
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        }

        .perspective-1000 {
            perspective: 1000px;
        }

        @keyframes pixel-walk {
            0% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-2px) rotate(-1deg); }
            50% { transform: translateY(0) rotate(0deg); }
            75% { transform: translateY(-2px) rotate(1deg); }
            100% { transform: translateY(0) rotate(0deg); }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes shadow-pulse {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(0.8); opacity: 0.2; }
        }
        
        @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-down {
            animation: fade-in-down 0.8s ease-out forwards;
        }

        .particle-star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            opacity: 0.3;
            animation: twinkle 4s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
