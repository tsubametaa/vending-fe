import { useState, useEffect, useRef } from "preact/hooks";
import { motion } from "framer-motion";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.02);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
  }, [volume]);

  useEffect(() => {
    const tryAutoplay = () => {
      if (!audioRef.current || hasStarted) return;

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
          document.removeEventListener("click", tryAutoplay);
          document.removeEventListener("touchstart", tryAutoplay);
          document.removeEventListener("keydown", tryAutoplay);
          document.removeEventListener("scroll", tryAutoplay);
        })
        .catch(() => {});
    };
    tryAutoplay();

    document.addEventListener("click", tryAutoplay);
    document.addEventListener("touchstart", tryAutoplay);
    document.addEventListener("keydown", tryAutoplay);
    document.addEventListener("scroll", tryAutoplay);

    return () => {
      document.removeEventListener("click", tryAutoplay);
      document.removeEventListener("touchstart", tryAutoplay);
      document.removeEventListener("keydown", tryAutoplay);
      document.removeEventListener("scroll", tryAutoplay);
    };
  }, [hasStarted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => {
          console.log("Audio play failed:", err);
        });
    }
  };

  const handleVolumeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/assets/songs/backsongs.mp3" preload="auto" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        class="fixed bottom-4 right-4 z-50 group"
      >
        <div class="relative">
          <div class="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
            <div class="bg-dark-400/95 backdrop-blur-lg border border-white/10 rounded-lg p-3 shadow-xl">
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={volume}
                onInput={handleVolumeChange}
                class="w-24 h-1.5 bg-dark-300 rounded-full appearance-none cursor-pointer accent-primary-500"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${volume * 200}%, #374151 ${volume * 200}%, #374151 100%)`,
                }}
              />
              <p class="text-xs text-white/50 mt-1 text-center">
                {Math.round(volume * 200)}%
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            class={`
              p-3 rounded-full shadow-lg transition-all duration-300
              ${
                isPlaying
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 shadow-primary-500/30"
                  : "bg-dark-400/90 border border-white/10 hover:border-primary-500/50"
              }
            `}
            title={isPlaying ? "Pause Music" : "Play Music"}
          >
            {isPlaying ? (
              <PixelVolume2 class="w-5 h-5 text-white" />
            ) : (
              <PixelVolumeX class="w-5 h-5 text-white/70" />
            )}

            {isPlaying && (
              <motion.div
                class="absolute inset-0 rounded-full border-2 border-primary-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

function PixelVolume2(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      <path d="M2 9h4v-3h2v-2h2v16h-2v-2h-2v-3h-4z" />
      <rect x="15" y="10" width="2" height="4" />
      <rect x="14" y="8" width="2" height="2" />
      <rect x="14" y="14" width="2" height="2" />
      <rect x="19" y="9" width="2" height="6" />
      <rect x="18" y="6" width="2" height="3" />
      <rect x="18" y="15" width="2" height="3" />
    </svg>
  );
}

function PixelVolumeX(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      <path d="M2 9h4v-3h2v-2h2v16h-2v-2h-2v-3h-4z" />
      <path d="M14 8h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2z" />
    </svg>
  );
}
