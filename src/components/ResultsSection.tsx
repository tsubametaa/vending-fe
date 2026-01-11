import { useState, useEffect } from 'preact/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { simulationStore, type SimulationState } from './stores/simulationStore';
import ResultsTable from './ResultsTable';
import QueueChart from './QueueChart';
import Badge from './Badge';
import Leaderboard from './Leaderboard';
import { 
  PartyPopper, 
  Timer, 
  RefreshCw, 
  TrendingUp, 
  Trophy,
  BarChart3,
  Table,
  LineChart,
  Crown,
  Dice5,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Calculator
} from 'lucide-preact';

export default function ResultsSection() {
  const [state, setState] = useState<SimulationState>(simulationStore.getState());
  const [activeTab, setActiveTab] = useState<'stats' | 'table' | 'chart' | 'leaderboard'>('stats');

  useEffect(() => {
    const unsubscribe = simulationStore.subscribe(setState);
    return unsubscribe;
  }, []);

  const { results } = state;

  if (!results) {
    return (
      <div class="card text-center py-16">
        <BarChart3 class="w-16 h-16 text-primary-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold mb-2">Belum Ada Hasil Simulasi</h3>
        <p class="text-white/60">
          Jalankan simulasi terlebih dahulu untuk melihat hasil di sini
        </p>
      </div>
    );
  }

  const { parameters, statistics, theoretical, score, badge } = results;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      class="space-y-6"
    >
      <div class="card">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="text-center md:text-left">
            <h2 class="font-display text-2xl font-bold gradient-text mb-2 flex items-center gap-2 justify-center md:justify-start">
              Hasil Simulasi
            </h2>
            <p class="text-white/60">
              Simulasi selesai dengan {parameters.numCustomers} pelanggan
            </p>
          </div>

          <Badge badge={badge} score={score} />
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            icon: Timer, 
            value: `${(statistics.avgTimeInQueue * 60).toFixed(1)}s`, 
            label: 'Avg Queue Time', 
            color: 'text-primary-400',
            sub: (
              <div class={`text-xs mt-1 flex items-center justify-center gap-1 ${statistics.avgTimeInQueue < 2 ? 'text-success-400' : 'text-warning-400'}`}>
                {statistics.avgTimeInQueue < 2 ? (
                  <><CheckCircle class="w-3 h-3" /> Target tercapai!</>
                ) : (
                  <><AlertTriangle class="w-3 h-3" /> Di atas target</>
                )}
              </div>
            )
          },
          { 
            icon: RefreshCw, 
            value: `${(statistics.avgTimeInSystem * 60).toFixed(1)}s`, 
            label: 'Avg System Time', 
            color: 'text-accent-400' 
          },
          { 
            icon: TrendingUp, 
            value: `${(parameters.utilization * 100).toFixed(1)}%`, 
            label: 'Utilization (ρ)', 
            color: 'text-success-400' 
          },
          { 
            icon: Trophy, 
            value: score, 
            label: 'Score', 
            color: 'text-warning-400' 
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            class="card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
          >
            <item.icon class={`w-8 h-8 ${item.color} mx-auto mb-2`} />
            <div class={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div class="text-xs text-white/50">{item.label}</div>
            {item.sub}
          </motion.div>
        ))}
      </div>

      <div class="flex flex-wrap gap-2 p-1 bg-dark-300/50 rounded-xl">
        {[
          { id: 'stats', label: 'Statistik', Icon: BarChart3 },
          { id: 'table', label: 'Tabel Data', Icon: Table },
          { id: 'chart', label: 'Grafik', Icon: LineChart },
          { id: 'leaderboard', label: 'Leaderboard', Icon: Crown },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            class={`relative flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 z-10 ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-white/60 hover:text-white hover:bg-dark-200/50'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                class="absolute inset-0 bg-primary-500 rounded-lg -z-10 shadow-lg"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <tab.Icon class="w-4 h-4" />
            <span class="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div class="card overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'stats' && (
              <div class="space-y-6">
                <h3 class="font-display text-xl font-bold gradient-text flex items-center gap-2">
                  <BarChart3 class="w-5 h-5" />
                  Statistik Simulasi
                </h3>

                <div class="p-4 rounded-lg bg-dark-300/50">
                  <h4 class="font-semibold mb-3 text-primary-300">Parameter Input</h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span class="text-white/50">Lambda (λ)</span>
                      <div class="font-mono text-lg">{parameters.lambda} /min</div>
                    </div>
                    <div>
                      <span class="text-white/50">Mu (μ)</span>
                      <div class="font-mono text-lg">{parameters.mu} /min</div>
                    </div>
                    <div>
                      <span class="text-white/50">Customers</span>
                      <div class="font-mono text-lg">{parameters.numCustomers}</div>
                    </div>
                  </div>
                </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
                <h4 class="font-semibold mb-3 text-primary-300 flex items-center gap-2">
                  <Dice5 class="w-4 h-4" />
                  Hasil Simulasi (Monte Carlo)
                </h4>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-white/60">Avg Interarrival Time</span>
                    <span class="font-mono">{statistics.avgInterarrivalTime.toFixed(4)} min</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/60">Avg Service Time</span>
                    <span class="font-mono">{statistics.avgServiceTime.toFixed(4)} min</span>
                  </div>
                  <hr class="border-white/10" />
                  <div class="flex justify-between font-semibold">
                    <span class="text-white/80">Avg Queue Time (Wq)</span>
                    <span class="font-mono text-primary-400">
                      {statistics.avgTimeInQueue.toFixed(4)} min
                    </span>
                  </div>
                  <div class="flex justify-between font-semibold">
                    <span class="text-white/80">Avg System Time (W)</span>
                    <span class="font-mono text-primary-400">
                      {statistics.avgTimeInSystem.toFixed(4)} min
                    </span>
                  </div>
                  <hr class="border-white/10" />
                  <div class="flex justify-between">
                    <span class="text-white/60">Max Queue Time</span>
                    <span class="font-mono">{statistics.maxTimeInQueue.toFixed(4)} min</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/60">Total Simulation Time</span>
                    <span class="font-mono">{statistics.totalSimulationTime.toFixed(2)} min</span>
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-lg bg-accent-500/10 border border-accent-500/20">
                <h4 class="font-semibold mb-3 text-accent-300 flex items-center gap-2">
                  <BookOpen class="w-4 h-4" />
                  Nilai Teoritis M/M/1
                </h4>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-white/60">E[Interarrival] = 1/λ</span>
                    <span class="font-mono">{(1/parameters.lambda).toFixed(4)} min</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/60">E[Service] = 1/μ</span>
                    <span class="font-mono">{(1/parameters.mu).toFixed(4)} min</span>
                  </div>
                  <hr class="border-white/10" />
                  <div class="flex justify-between font-semibold">
                    <span class="text-white/80">Wq = ρ/(μ-λ)</span>
                    <span class="font-mono text-accent-400">
                      {theoretical.avgQueueTime.toFixed(4)} min
                    </span>
                  </div>
                  <div class="flex justify-between font-semibold">
                    <span class="text-white/80">W = 1/(μ-λ)</span>
                    <span class="font-mono text-accent-400">
                      {theoretical.avgSystemTime.toFixed(4)} min
                    </span>
                  </div>
                  <hr class="border-white/10" />
                  <div class="flex justify-between">
                    <span class="text-white/60">Lq (Queue Length)</span>
                    <span class="font-mono">{theoretical.avgQueueLength.toFixed(4)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/60">L (System Length)</span>
                    <span class="font-mono">{theoretical.avgSystemLength.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-lg bg-success-500/10 border border-success-500/20">
              <h4 class="font-semibold mb-3 text-success-300 flex items-center gap-2">
                <Calculator class="w-4 h-4" />
                Perbandingan Simulasi vs Teori
              </h4>
              <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-white/60">Wq Error</span>
                  <div class="font-mono text-lg">
                    {Math.abs(((statistics.avgTimeInQueue - theoretical.avgQueueTime) / theoretical.avgQueueTime) * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <span class="text-white/60">W Error</span>
                  <div class="font-mono text-lg">
                    {Math.abs(((statistics.avgTimeInSystem - theoretical.avgSystemTime) / theoretical.avgSystemTime) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
              <p class="text-xs text-white/50 mt-3">
                * Semakin kecil error, semakin akurat simulasi Monte Carlo terhadap nilai teoritis M/M/1
              </p>
            </div>
          </div>
        )}

        {activeTab === 'table' && <ResultsTable data={results.simulationData} statistics={statistics} />}
        
        {activeTab === 'chart' && <QueueChart data={results.simulationData} statistics={statistics} />}
        
        {activeTab === 'leaderboard' && <Leaderboard />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
