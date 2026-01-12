import { useState, useEffect } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  simulationStore,
  type SimulationState,
  type SimulationData,
} from "../stores/simulationStore";
import {
  Users,
  Timer,
  ChevronDown,
  ChevronUp,
  Printer,
  Coffee,
  Zap,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Target,
  CheckCircle,
  Rocket,
  Hourglass,
  Lightbulb,
  PartyPopper,
  Trophy,
  Star,
  AlertTriangle,
} from "lucide-preact";

import { StatusBadge, getWaitStatus } from "./service/Status";
import { TimelineBar } from "./service/TimelineBar";
import { CustomerDetail } from "./service/Detail";
import { calculateWaitingStats } from "./service/WaitingCostumer";

interface CustomerJourneyProps {
  customer: SimulationData;
  index: number;
  maxTime: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function CustomerJourney({
  customer,
  index,
  maxTime,
  isExpanded,
  onToggle,
}: CustomerJourneyProps) {
  const status = getWaitStatus(customer.timeInQueue);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border transition-all duration-300 ${
        isExpanded
          ? `bg-${status.color}-500/10 border-${status.color}-500/30`
          : "bg-dark-300/30 border-dark-200/50 hover:bg-dark-300/50"
      }`}
    >
      <div
        className="p-4 cursor-pointer flex items-center gap-4"
        onClick={onToggle}
      >
        <div
          className={`w-10 h-10 rounded-lg bg-${status.color}-500/20 flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-lg font-bold text-white">
            #{customer.customerNumber}
          </span>
        </div>

        <TimelineBar customer={customer} maxTime={maxTime} />
        <StatusBadge customer={customer} />

        <div className="flex-shrink-0 text-white/50">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      <CustomerDetail customer={customer} isExpanded={isExpanded} />
    </motion.div>
  );
}

function GanttChart({ data }: { data: SimulationData[] }) {
  const maxTime = Math.max(...data.map((d) => d.departureTime));

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-white flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary-400" />
        Gantt Chart - Visualisasi Timeline
      </h4>

      <div className="relative h-8 mb-2">
        <div className="absolute inset-x-0 h-px bg-white/20 top-4" />
        {[0, 0.25, 0.5, 0.75, 1].map((percent) => (
          <div
            key={percent}
            className="absolute transform -translate-x-1/2"
            style={{ left: `${percent * 100}%` }}
          >
            <div className="w-px h-3 bg-white/40 mb-1" />
            <span className="text-[10px] text-white/50 font-mono">
              {(maxTime * percent).toFixed(1)}m
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {data.map((customer, i) => {
          const arrivalPercent = (customer.arrivalTime / maxTime) * 100;
          const serviceStartPercent =
            (customer.beginServiceTime / maxTime) * 100;
          const departurePercent = (customer.departureTime / maxTime) * 100;

          return (
            <div key={i} className="flex items-center gap-2 group">
              <span className="text-[10px] text-white/50 w-6 text-right font-mono">
                #{customer.customerNumber}
              </span>
              <div className="flex-1 h-4 bg-dark-400/30 rounded relative overflow-hidden">
                <div
                  className="absolute top-0 h-full bg-amber-500/70 group-hover:bg-amber-500 transition-colors"
                  style={{
                    left: `${arrivalPercent}%`,
                    width: `${serviceStartPercent - arrivalPercent}%`,
                  }}
                  title={`Queue: ${(customer.timeInQueue * 60).toFixed(1)}s`}
                />

                <div
                  className="absolute top-0 h-full bg-emerald-500/70 group-hover:bg-emerald-500 transition-colors"
                  style={{
                    left: `${serviceStartPercent}%`,
                    width: `${departurePercent - serviceStartPercent}%`,
                  }}
                  title={`Service: ${(customer.serviceTime * 60).toFixed(1)}s`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded bg-amber-500" />
          <span className="text-white/60">Waktu Tunggu (Antri)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded bg-emerald-500" />
          <span className="text-white/60">Waktu Layanan</span>
        </div>
      </div>
    </div>
  );
}

function WaitTimeDistribution({ data }: { data: SimulationData[] }) {
  const fastCount = data.filter((d) => d.timeInQueue < 1).length;
  const normalCount = data.filter(
    (d) => d.timeInQueue >= 1 && d.timeInQueue < 2
  ).length;
  const slowCount = data.filter((d) => d.timeInQueue >= 2).length;
  const total = data.length || 1;

  const distribution = [
    {
      label: "Cepat (<1 menit)",
      count: fastCount,
      percent: (fastCount / total) * 100,
      color: "success",
      icon: Rocket,
      barColor: "bg-emerald-500",
      textColor: "text-emerald-400",
    },
    {
      label: "Normal (1-2 menit)",
      count: normalCount,
      percent: (normalCount / total) * 100,
      color: "warning",
      icon: Timer,
      barColor: "bg-amber-500",
      textColor: "text-amber-400",
    },
    {
      label: "Lama (>2 menit)",
      count: slowCount,
      percent: (slowCount / total) * 100,
      color: "danger",
      icon: Hourglass,
      barColor: "bg-rose-500",
      textColor: "text-rose-400",
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-white flex items-center gap-2">
        <PieChart className="w-4 h-4 text-accent-400" />
        Distribusi Waktu Tunggu
      </h4>

      <div className="space-y-4">
        {distribution.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.textColor}`} />
                <span className="text-sm font-medium text-white/90">
                  {item.label}
                </span>
              </div>
              <span className={`font-mono font-bold ${item.textColor}`}>
                {item.count} orang ({item.percent.toFixed(1)}%)
              </span>
            </div>
            <div className="h-4 bg-dark-400/50 rounded-full overflow-hidden border border-white/5 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className={`h-full rounded-full ${item.barColor} shadow-lg relative overflow-hidden`}
              >
                <div
                  className="absolute inset-0 bg-white/20"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)",
                    backgroundSize: "1rem 1rem",
                  }}
                ></div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function KeyInsights({ data }: { data: SimulationData[] }) {
  const {
    avgQueue,
    maxQueue,
    minQueue,
    avgService,
    longestWaitCustomer,
    shortestWaitCustomer,
  } = calculateWaitingStats(data);

  const insights = [
    {
      icon: Timer,
      label: "Rata-rata Waktu Tunggu",
      value: `${(avgQueue * 60).toFixed(1)}s`,
      subtext: `${avgQueue.toFixed(4)} menit`,
      color: "primary",
    },
    {
      icon: TrendingUp,
      label: "Waktu Tunggu Terlama",
      value: `${(maxQueue * 60).toFixed(1)}s`,
      subtext: `Pelanggan #${longestWaitCustomer.customerNumber}`,
      color: "danger",
    },
    {
      icon: Zap,
      label: "Waktu Tunggu Tercepat",
      value: `${(minQueue * 60).toFixed(1)}s`,
      subtext: `Pelanggan #${shortestWaitCustomer.customerNumber}`,
      color: "success",
    },
    {
      icon: Coffee,
      label: "Rata-rata Waktu Layanan",
      value: `${(avgService * 60).toFixed(1)}s`,
      subtext: `${avgService.toFixed(4)} menit`,
      color: "accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {insights.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`p-4 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20`}
        >
          <item.icon className={`w-5 h-5 text-${item.color}-400 mb-2`} />
          <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">
            {item.label}
          </div>
          <div className={`text-xl font-bold text-${item.color}-400`}>
            {item.value}
          </div>
          <div className="text-[10px] text-white/40 mt-1">{item.subtext}</div>
        </motion.div>
      ))}
    </div>
  );
}

function GameResume({ state }: { state: SimulationState }) {
  const { results } = state;
  if (!results) return null;

  const { parameters, statistics, theoretical, score, badge } = results;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-white text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-warning-400" />
          Resume Permainan
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-dark-300/50 text-white/60 hover:text-white hover:bg-dark-200/50 transition-all text-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-warning-500/10 border border-primary-500/20">
        <div className="text-center">
          <div className="mb-2 flex justify-center">
            {badge.name === "Vending Hero" && (
              <Trophy className="w-12 h-12 text-warning-400" />
            )}
            {badge.name === "Queue Master" && (
              <Star className="w-12 h-12 text-warning-400" />
            )}
            {badge.name === "Efficiency Pro" && (
              <BarChart3 className="w-12 h-12 text-accent-400" />
            )}
            {badge.name === "Crowd Manager" && (
              <Users className="w-12 h-12 text-primary-400" />
            )}
            {badge.name !== "Vending Hero" &&
              badge.name !== "Queue Master" &&
              badge.name !== "Efficiency Pro" &&
              badge.name !== "Crowd Manager" && (
                <AlertTriangle className="w-12 h-12 text-danger-400" />
              )}
          </div>
          <div className="text-sm font-bold text-white">{badge.name}</div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-white/60">Skor Anda</div>
          <div className="text-4xl font-bold gradient-text">{score}</div>
          <div className="text-xs text-white/50 mt-1">{badge.description}</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-dark-300/30 border border-dark-200/50">
        <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-400" />
          Parameter Simulasi
        </h5>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-400 font-mono">
              {parameters.lambda}
            </div>
            <div className="text-xs text-white/50">Lambda (λ)</div>
            <div className="text-[10px] text-white/30">pelanggan/menit</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent-400 font-mono">
              {parameters.mu}
            </div>
            <div className="text-xs text-white/50">Mu (μ)</div>
            <div className="text-[10px] text-white/30">layanan/menit</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success-400 font-mono">
              {parameters.numCustomers}
            </div>
            <div className="text-xs text-white/50">Pelanggan</div>
            <div className="text-[10px] text-white/30">total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning-400 font-mono">
              {(parameters.utilization * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-white/50">Utilitas (ρ)</div>
            <div className="text-[10px] text-white/30">penggunaan mesin</div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-dark-300/30 border border-dark-200/50">
        <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent-400" />
          Perbandingan Hasil
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/50 border-b border-white/10">
                <th className="text-left py-2 px-3">Metrik</th>
                <th className="text-center py-2 px-3">Simulasi</th>
                <th className="text-center py-2 px-3">Teoritis</th>
                <th className="text-center py-2 px-3">Error</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3 text-white/80">Waktu Tunggu (Wq)</td>
                <td className="py-2 px-3 text-center font-mono text-primary-400">
                  {statistics.avgTimeInQueue.toFixed(4)} min
                </td>
                <td className="py-2 px-3 text-center font-mono text-accent-400">
                  {theoretical.avgQueueTime.toFixed(4)} min
                </td>
                <td className="py-2 px-3 text-center font-mono text-warning-400">
                  {Math.abs(
                    ((statistics.avgTimeInQueue - theoretical.avgQueueTime) /
                      theoretical.avgQueueTime) *
                      100
                  ).toFixed(2)}
                  %
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3 text-white/80">Waktu Sistem (W)</td>
                <td className="py-2 px-3 text-center font-mono text-primary-400">
                  {statistics.avgTimeInSystem.toFixed(4)} min
                </td>
                <td className="py-2 px-3 text-center font-mono text-accent-400">
                  {theoretical.avgSystemTime.toFixed(4)} min
                </td>
                <td className="py-2 px-3 text-center font-mono text-warning-400">
                  {Math.abs(
                    ((statistics.avgTimeInSystem - theoretical.avgSystemTime) /
                      theoretical.avgSystemTime) *
                      100
                  ).toFixed(2)}
                  %
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-white/80">Waktu Simulasi</td>
                <td
                  className="py-2 px-3 text-center font-mono text-primary-400"
                  colSpan={3}
                >
                  {statistics.totalSimulationTime.toFixed(2)} menit
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-r from-success-500/5 to-success-500/10 border border-success-500/20">
        <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success-400" />
          Kesimpulan
        </h5>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-success-400">•</span>
            <span>
              Simulasi Monte Carlo menghasilkan rata-rata waktu tunggu{" "}
              <span className="font-mono text-primary-400">
                {(statistics.avgTimeInQueue * 60).toFixed(1)} detik
              </span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success-400">•</span>
            <span>
              {statistics.avgTimeInQueue < 2 ? (
                <span className="flex items-center gap-1">
                  Target waktu tunggu &lt; 2 menit TERCAPAI!
                  <PartyPopper className="w-4 h-4 text-warning-400" />
                </span>
              ) : (
                "Target waktu tunggu < 2 menit belum tercapai. Coba sesuaikan parameter."
              )}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-success-400">•</span>
            <span>
              Utilisasi mesin vending{" "}
              <span className="font-mono text-accent-400">
                {(parameters.utilization * 100).toFixed(1)}%
              </span>{" "}
              menunjukkan{" "}
              {parameters.utilization > 0.9
                ? "sistem sangat sibuk, perlu penambahan mesin"
                : parameters.utilization > 0.7
                  ? "tingkat penggunaan optimal"
                  : "masih ada kapasitas tersisa"}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function Summary() {
  const [state, setState] = useState<SimulationState>(
    simulationStore.getState()
  );
  const [activeView, setActiveView] = useState<
    "journey" | "gantt" | "distribution" | "resume"
  >("journey");
  const [expandedCustomer, setExpandedCustomer] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = simulationStore.subscribe(setState);
    return unsubscribe;
  }, []);

  const { results } = state;

  if (!results) {
    return (
      <div className="text-center py-16">
        <Users className="w-16 h-16 text-primary-400 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2 text-white/80">
          Belum Ada Data Simulasi
        </h3>
        <p className="text-white/50">
          Jalankan simulasi terlebih dahulu untuk melihat ringkasan detail
        </p>
      </div>
    );
  }

  const { simulationData } = results;
  const maxTime = Math.max(...simulationData.map((d) => d.departureTime));

  const filteredData = searchQuery
    ? simulationData.filter((d) =>
        d.customerNumber.toString().includes(searchQuery)
      )
    : simulationData;

  const viewOptions = [
    { id: "journey", label: "Perjalanan Pelanggan", icon: Users },
    { id: "gantt", label: "Gantt Chart", icon: Activity },
    { id: "distribution", label: "Distribusi", icon: PieChart },
    { id: "resume", label: "Resume", icon: Award },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <KeyInsights data={simulationData} />

      <div className="flex flex-wrap gap-2 p-1 bg-dark-300/50 rounded-xl">
        {viewOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveView(option.id as typeof activeView)}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeView === option.id
                ? "bg-primary-500 text-white"
                : "text-white/60 hover:text-white hover:bg-dark-200/50"
            }`}
          >
            <option.icon className="w-4 h-4" />
            <span className="hidden md:inline">{option.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="card"
        >
          {activeView === "journey" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary-400" />
                  Detail Perjalanan Setiap Pelanggan
                </h4>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari #..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery((e.target as HTMLInputElement).value)
                    }
                    className="w-24 md:w-32 px-3 py-1.5 rounded-lg bg-dark-300/50 border border-dark-200/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredData.map((customer, index) => (
                  <CustomerJourney
                    key={customer.customerNumber}
                    customer={customer}
                    index={index}
                    maxTime={maxTime}
                    isExpanded={expandedCustomer === customer.customerNumber}
                    onToggle={() =>
                      setExpandedCustomer(
                        expandedCustomer === customer.customerNumber
                          ? null
                          : customer.customerNumber
                      )
                    }
                  />
                ))}
              </div>

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-white/50">
                  Tidak ditemukan pelanggan dengan nomor tersebut
                </div>
              )}
            </div>
          )}

          {activeView === "gantt" && <GanttChart data={simulationData} />}

          {activeView === "distribution" && (
            <WaitTimeDistribution data={simulationData} />
          )}

          {activeView === "resume" && <GameResume state={state} />}
        </motion.div>
      </AnimatePresence>

      <div className="text-center text-xs text-white/40 flex items-center justify-center gap-1">
        <Lightbulb className="w-3 h-3" />
        Klik pada pelanggan di tab "Perjalanan Pelanggan" untuk melihat detail
        lengkapnya
      </div>
    </motion.div>
  );
}
