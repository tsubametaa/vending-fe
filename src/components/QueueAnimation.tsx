import { useState, useEffect, useRef } from 'preact/hooks';
import { simulationStore, type SimulationState, type SimulationData } from './stores/simulationStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Gamepad2, 
  Zap,
  Settings,
  CheckCircle,
  Clock,
  Users
} from 'lucide-preact';

const CHARACTERS = [
  '/assets/character/character_1.svg',
  '/assets/character/character_2.svg',
  '/assets/character/character_3.svg',
  '/assets/character/character_4.svg',
  '/assets/character/character_5.svg',
  '/assets/character/character_6.svg',
  '/assets/character/character_7.svg',
  '/assets/character/character_8.svg',
  '/assets/character/character_9.svg',
  '/assets/character/character_10.svg',
];

const BACKGROUNDS = {
  efficient: '/assets/background/efficient.svg',
  overloaded: '/assets/background/overloaded.svg',
  park: '/assets/background/park.svg',
  rush_hour: '/assets/background/rush_hour.svg',
};

interface QueuePerson {
  id: number;
  character: string;
  status: 'waiting' | 'serving' | 'done';
  customerData?: SimulationData;
}

export default function QueueAnimation() {
  const [state, setState] = useState<SimulationState>(simulationStore.getState());
  const [queuePeople, setQueuePeople] = useState<QueuePerson[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const animationRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const unsubscribe = simulationStore.subscribe(setState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (state.results && state.isSimulating) {
      initializeQueue();
      startAnimation();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.results, state.isSimulating]);

  const initializeQueue = () => {
    if (!state.results) return;

    const people: QueuePerson[] = state.results.simulationData.map((data, index) => ({
      id: data.customerNumber,
      character: CHARACTERS[index % CHARACTERS.length],
      status: 'waiting' as const,
      customerData: data
    }));

    setQueuePeople(people);
    setCurrentTime(0);
  };

  const startAnimation = () => {
    if (!state.results) return;

    const totalTime = state.results.statistics.totalSimulationTime;
    const startTime = performance.now();
    const duration = (totalTime / animationSpeed) * 1000;

    const animate = (currentFrameTime: number) => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentFrameTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const simTime = progress * totalTime;
      
      setCurrentTime(simTime);

      setQueuePeople(prev => prev.map(person => {
        if (!person.customerData) return person;
        
        const { arrivalTime, beginServiceTime, departureTime } = person.customerData;
        
        if (simTime >= departureTime) {
          return { ...person, status: 'done' };
        } else if (simTime >= beginServiceTime) {
          return { ...person, status: 'serving' };
        } else if (simTime >= arrivalTime) {
          return { ...person, status: 'waiting' };
        }
        return person;
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        simulationStore.setIsSimulating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const getQueuedPeople = () => {
    return queuePeople.filter(p => {
      if (!p.customerData) return false;
      return (
        currentTime >= p.customerData.arrivalTime && 
        currentTime < p.customerData.departureTime
      );
    });
  };

  const getServingPerson = () => {
    return queuePeople.find(p => p.status === 'serving');
  };

  const queuedPeople = getQueuedPeople();
  const servingPerson = getServingPerson();
  const waitingPeople = queuedPeople.filter(p => p.status === 'waiting');
  const donePeople = queuePeople.filter(p => p.status === 'done');

  const formatTime = (minutes: number) => {
    const startHour = 8;
    const totalSeconds = Math.round(minutes * 60);
    const hours = Math.floor(totalSeconds / 3600) + startHour;
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused && state.isSimulating) {
      startAnimation();
    }
  };

  const resetAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCurrentTime(0);
    setIsPaused(false);
    if (state.results) {
      initializeQueue();
      simulationStore.setIsSimulating(true);
      startAnimation();
    }
  };

  const getBackgroundImage = () => {
    if (state.selectedPreset) {
      switch (state.selectedPreset) {
        case 'Rush Hour':
          return BACKGROUNDS.rush_hour;
        case 'Efficient':
          return BACKGROUNDS.efficient;
        case 'Relaxed Park':
          return BACKGROUNDS.park;
        case 'Overloaded':
          return BACKGROUNDS.overloaded;
        default:
          break;
      }
    }
    
    if (!state.results) return BACKGROUNDS.park;
    
    const avgWaitTime = state.results.statistics.averageWaitingTime;
    const avgQueueLength = state.results.statistics.averageQueueLength;
    
    if (avgWaitTime > 10 && avgQueueLength > 5) {
      return BACKGROUNDS.overloaded;
    }
    if (avgWaitTime > 5 || avgQueueLength > 3) {
      return BACKGROUNDS.rush_hour;
    }
    return BACKGROUNDS.efficient;
  };

  const getSceneName = () => {
    if (state.selectedPreset) {
      switch (state.selectedPreset) {
        case 'Rush Hour':
          return 'Rush Hour';
        case 'Efficient':
          return 'Efficient';
        case 'Relaxed Park':
          return 'Relaxed Park';
        case 'Overloaded':
          return 'Overloaded';
        default:
          break;
      }
    }
    
    const bg = getBackgroundImage();
    if (bg === BACKGROUNDS.overloaded) return 'Overloaded';
    if (bg === BACKGROUNDS.rush_hour) return 'Rush Hour';
    if (bg === BACKGROUNDS.efficient) return 'Efficient';
    return 'Park';
  };

  return (
    <div class="card h-full">
      <div class="flex items-center justify-between mb-4 pb-4 border-b-2 border-primary-500/20">
        <h3 class="font-display text-2xl font-bold gradient-text flex items-center gap-3 pixel-text">
          <Gamepad2 class="w-6 h-6" />
          <span>Antrian Vending Machine</span>
        </h3>
        
        {state.results && (
          <div class="flex items-center gap-2">
            <button
              onClick={togglePause}
              class="p-2.5 rounded-lg bg-gradient-to-br from-primary-500/30 to-primary-500/10 hover:from-primary-500/50 hover:to-primary-500/20 border-2 border-primary-500/40 transition-all hover:scale-110 shadow-lg"
              title={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play class="w-5 h-5" /> : <Pause class="w-5 h-5" />}
            </button>
            <button
              onClick={resetAnimation}
              class="p-2.5 rounded-lg bg-gradient-to-br from-accent-500/30 to-accent-500/10 hover:from-accent-500/50 hover:to-accent-500/20 border-2 border-accent-500/40 transition-all hover:scale-110 shadow-lg"
              title="Restart"
            >
              <RotateCcw class="w-5 h-5" />
            </button>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat((e.target as HTMLSelectElement).value))}
              class="px-4 py-2.5 rounded-lg bg-gradient-to-br from-dark-300/70 to-dark-300/50 text-sm font-bold text-white border-2 border-white/20 pixel-text hover:border-primary-500/40 transition-all cursor-pointer"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="5">5x</option>
            </select>
          </div>
        )}
      </div>

      {state.results && (
        <div class="mb-4 p-4 rounded-lg bg-gradient-to-r from-dark-300/70 via-dark-300/50 to-dark-300/70 border-2 border-primary-500/30 flex items-center justify-between shadow-lg">
          <div class="flex items-center gap-4">
            <div>
              <span class="text-xs text-white/50 pixel-text">Waktu Simulasi</span>
              <div class="font-mono text-xl font-bold text-primary-400 pixel-text">{formatTime(currentTime)}</div>
            </div>
            <div class="h-12 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <div>
              <span class="text-xs text-white/50 pixel-text">Progress</span>
              <div class="font-mono text-xl font-bold text-accent-400 pixel-text">
                {donePeople.length}/{queuePeople.length}
              </div>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-white/50 pixel-text">Dalam Antrian</span>
            <div class="font-mono text-xl font-bold text-warning-400 pixel-text">{waitingPeople.length}</div>
          </div>
        </div>
      )}

      <div class="relative h-64 md:h-96 rounded-xl border-4 border-dark-200/80 overflow-hidden shadow-2xl scanlines">
        <div class="absolute inset-0">
          <img 
            src={getBackgroundImage()} 
            alt="Vending Machine Scene" 
            class="w-full h-full object-cover pixel-art transition-opacity duration-500"
            style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
          
          {state.results && (
            <div class="absolute top-4 right-4 bg-gradient-to-br from-dark-400/95 to-dark-300/95 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-primary-500/40 shadow-xl animate-pulse-slow">
              <span class="text-sm font-bold text-white pixel-text">{getSceneName()}</span>
            </div>
          )}
        </div>

        {!state.results ? (
          
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div class="absolute inset-0 backdrop-blur-md bg-dark-400/60" />
            <div class="relative z-10">
              <Gamepad2 class="w-16 h-16 text-primary-400 mb-4 animate-bounce mx-auto" />
              <p class="text-white text-xl font-bold pixel-text mb-2">Atur parameter dan jalankan simulasi</p>
              <p class="text-white/70 text-sm">
                Lihat animasi pelanggan mengantri di depan vending machine!
              </p>
            </div>
          </div>
        ) : (
          <div class="absolute inset-0 flex items-end pb-4">
            {servingPerson && (
              <div class="absolute left-[15%] md:left-[18%] bottom-[15%] z-20">
                <div class="relative pixel-character">
                  <img 
                    src={servingPerson.character} 
                    alt={`Customer ${servingPerson.id}`} 
                    class="h-16 md:h-24 w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] pixel-art"
                    style="image-rendering: pixelated; filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.4));"
                  />
                  <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-success-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg border-2 border-success-300 pixel-text">
                    <span class="flex items-center gap-1">
                      <Zap class="w-3 h-3" />
                      Dilayani #{servingPerson.id}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div class="absolute right-4 left-[35%] md:left-[40%] bottom-[12%] flex items-end justify-start gap-1 md:gap-2 flex-row-reverse z-10">
              {waitingPeople.slice(0, 6).map((person, index) => (
                <div 
                  key={person.id}
                  class="relative animate-queue-walk pixel-character"
                  style={`animation-delay: ${index * 0.15}s`}
                >
                  <img 
                    src={person.character} 
                    alt={`Customer ${person.id}`} 
                    class="h-12 md:h-20 w-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] pixel-art hover:scale-110 transition-transform"
                    style="image-rendering: pixelated;"
                  />
                  <div class="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-dark-400/90 px-2 py-0.5 rounded-full border border-white/20 pixel-text">
                    #{person.id}
                  </div>
                </div>
              ))}
              {waitingPeople.length > 6 && (
                <div class="flex items-center justify-center h-12 md:h-20 px-3 bg-gradient-to-br from-primary-500/90 to-accent-500/90 rounded-lg border-2 border-white/30 shadow-lg pixel-badge">
                  <span class="text-white font-bold text-sm md:text-base">+{waitingPeople.length - 6}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {state.isLoading && (
          <div class="absolute inset-0 bg-dark-400/80 flex items-center justify-center z-30">
            <div class="text-center">
              <Settings class="w-10 h-10 text-primary-400 animate-spin mx-auto mb-2" />
              <p class="text-white/60">Menjalankan simulasi...</p>
            </div>
          </div>
        )}
      </div>

      {state.results && currentTime > 0 && (
        <div class="mt-4 grid grid-cols-3 gap-4">
          <div class="text-center p-4 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-500/5 border-2 border-primary-500/40 shadow-lg hover:shadow-primary-500/30 transition-all hover:scale-105">
            <div class="flex items-center justify-center gap-2 text-3xl font-bold text-primary-400 pixel-text">
              <CheckCircle class="w-6 h-6" />
              {donePeople.length}
            </div>
            <div class="text-sm text-white/70 mt-1 pixel-text">Selesai Dilayani</div>
          </div>   
          <div class="text-center p-4 rounded-lg bg-gradient-to-br from-warning-500/20 to-warning-500/5 border-2 border-warning-500/40 shadow-lg hover:shadow-warning-500/30 transition-all hover:scale-105">
            <div class="flex items-center justify-center gap-2 text-3xl font-bold text-warning-400 pixel-text">
              <Clock class="w-6 h-6" />
              {waitingPeople.length}
            </div>
            <div class="text-sm text-white/70 mt-1 pixel-text">Dalam Antrian</div>
          </div>
          <div class="text-center p-4 rounded-lg bg-gradient-to-br from-accent-500/20 to-accent-500/5 border-2 border-accent-500/40 shadow-lg hover:shadow-accent-500/30 transition-all hover:scale-105">
            <div class="flex items-center justify-center gap-2 text-3xl font-bold text-accent-400 pixel-text">
              <Users class="w-6 h-6" />
              {servingPerson ? 1 : 0}
            </div>
            <div class="text-sm text-white/70 mt-1 pixel-text">Sedang Dilayani</div>
          </div>
        </div>
      )}
    </div>
  );
}
