import { useState, useEffect, useRef } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  RefreshCw,
  Medal,
  Award,
  AlertTriangle,
  Download,
  Crown,
  Star,
  Sparkles,
  Gamepad2,
  Target,
  Zap,
} from "lucide-preact";

interface LeaderboardEntry {
  name: string;
  avgQueueTime: number;
  score: number;
  badge: string;
  timestamp: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://vending-be.vercel.app/api/leaderboard?limit=3"
      );
      const data = await response.json();

      if (data.success && data.leaderboard) {
        setLeaderboard(data.leaderboard);
        if (data.source === "mongodb") {
          console.log("Leaderboard loaded from MongoDB");
        }
      } else {
        setLeaderboard([]);
        setError(data.message || "Belum ada data di leaderboard.");
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setLeaderboard([]);
      setError("Tidak dapat terhubung ke server. Cek koneksi internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div class="relative">
            <Crown class="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
            <Sparkles class="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        );
      case 2:
        return (
          <Medal class="w-7 h-7 text-gray-300 drop-shadow-[0_0_6px_rgba(209,213,219,0.4)]" />
        );
      case 3:
        return (
          <Medal class="w-6 h-6 text-amber-600 drop-shadow-[0_0_4px_rgba(217,119,6,0.4)]" />
        );
      default:
        return <span class="text-white/50 font-mono">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/30 via-amber-500/20 to-yellow-500/30 border-yellow-500/50 shadow-lg shadow-yellow-500/20";
      case 2:
        return "bg-gradient-to-r from-gray-400/25 via-slate-400/15 to-gray-400/25 border-gray-400/40";
      case 3:
        return "bg-gradient-to-r from-amber-700/25 via-orange-700/15 to-amber-700/25 border-amber-700/40";
      default:
        return "bg-dark-300/30 border-white/5";
    }
  };

  const getRankGlow = (rank: number) => {
    switch (rank) {
      case 1:
        return "ring-2 ring-yellow-500/30";
      case 2:
        return "ring-1 ring-gray-400/20";
      case 3:
        return "ring-1 ring-amber-600/20";
      default:
        return "";
    }
  };

  const handleDownloadAsImage = async () => {
    if (!leaderboardRef.current) return;

    setIsDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(leaderboardRef.current, {
        backgroundColor: "#1a1a2e",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `queuequest-leaderboard-${new Date().toISOString().split("T")[0]}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (err) {
      console.error("Error downloading image:", err);
      setError("Gagal mengunduh gambar. Pastikan html2canvas terinstall.");
    } finally {
      setIsDownloading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-xl font-bold gradient-text flex items-center gap-2">
          <Trophy class="w-5 h-5" />
          Top 3 Leaderboard
        </h3>
        <div class="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadAsImage}
            disabled={isDownloading || leaderboard.length === 0}
            class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 hover:border-primary-500/50 text-primary-300 hover:text-primary-200 text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download sebagai gambar"
          >
            {isDownloading ? (
              <RefreshCw class="w-4 h-4 animate-spin" />
            ) : (
              <Download class="w-4 h-4" />
            )}
            <span class="hidden sm:inline">Download</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchLeaderboard}
            disabled={isLoading}
            class="px-3 py-1.5 rounded-lg bg-dark-300/50 hover:bg-dark-200 text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw class={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            class="mb-4 p-3 rounded-lg bg-warning-500/10 border border-warning-500/20 text-warning-300 text-sm flex items-center gap-2 overflow-hidden"
          >
            <AlertTriangle class="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={leaderboardRef}
        class="p-4 rounded-xl bg-dark-400/50 border border-white/5"
      >
        <div class="text-center mb-4 pb-3 border-b border-white/10">
          <div class="flex items-center justify-center gap-2 mb-1">
            <Trophy class="w-6 h-6 text-warning-400" />
            <span class="font-display text-lg font-bold gradient-text">
              QueueQuest Champions
            </span>
            <Trophy class="w-6 h-6 text-warning-400" />
          </div>
          <p class="text-xs text-white/50">
            Top 3 Players • {new Date().toLocaleDateString("id-ID")}
          </p>
        </div>

        {isLoading ? (
          <div class="flex items-center justify-center py-12">
            <RefreshCw class="w-10 h-10 text-primary-400 animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            class="text-center py-12 text-white/60"
          >
            <Trophy class="w-12 h-12 text-primary-400 mx-auto mb-4" />
            <p>Belum ada data di leaderboard.</p>
            <p class="text-sm mt-2">
              Jadilah yang pertama dengan menjalankan simulasi!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            class="space-y-3"
          >
            <AnimatePresence>
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    layout
                    whileHover={{ scale: 1.02, x: 5 }}
                    class={`
                      p-4 rounded-xl border-2 transition-colors cursor-default
                      ${getRankStyle(rank)} ${getRankGlow(rank)}
                      ${rank === 1 ? "relative overflow-hidden" : ""}
                    `}
                  >
                    {rank === 1 && (
                      <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 animate-pulse" />
                    )}

                    <div class="flex items-center gap-4 relative z-10">
                      <div
                        class={`${rank === 1 ? "w-14" : "w-12"} flex items-center justify-center`}
                      >
                        {getRankIcon(rank)}
                      </div>

                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span
                            class={`font-bold truncate ${rank === 1 ? "text-lg text-yellow-300" : "text-white"}`}
                          >
                            {entry.name}
                          </span>
                          <span
                            class={`text-sm flex items-center gap-1 ${rank === 1 ? "text-yellow-400/80" : "text-white/60"}`}
                          >
                            <Award class="w-3 h-3" />
                            {entry.badge}
                          </span>
                        </div>
                        <div class="text-xs text-white/50 mt-1 flex items-center gap-2">
                          <span>{entry.timestamp}</span>
                          <span>•</span>
                          <span>{entry.avgQueueTime.toFixed(2)} min avg</span>
                        </div>
                      </div>

                      <div class="text-right">
                        <div
                          class={`font-bold ${rank === 1 ? "text-3xl text-yellow-400" : rank === 2 ? "text-2xl text-gray-300" : "text-xl text-amber-500"}`}
                        >
                          {entry.score}
                          <span
                            class={`text-sm ${rank === 1 ? "text-yellow-400/60" : "text-white/40"}`}
                          >
                            {" "}
                            pts
                          </span>
                        </div>
                        {rank === 1 && (
                          <div class="flex items-center justify-end gap-1 mt-1">
                            <Star class="w-3 h-3 text-yellow-400" />
                            <Star class="w-3 h-3 text-yellow-400" />
                            <Star class="w-3 h-3 text-yellow-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {leaderboard.length > 0 && (
          <div class="mt-4 pt-3 border-t border-white/10 text-center">
            <p class="text-xs text-white/40 flex items-center justify-center gap-1">
              <Gamepad2 class="w-3 h-3" /> QueueQuest - Simulasi Antrian M/M/1
            </p>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        class="mt-4 p-4 rounded-lg bg-primary-500/10 border border-primary-500/20"
      >
        <h4 class="font-semibold text-primary-300 mb-2 flex items-center gap-2">
          <Star class="w-4 h-4" />
          Cara Naik Leaderboard
        </h4>
        <ul class="text-sm text-white/60 space-y-2">
          <li class="flex items-center gap-2">
            <Target class="w-4 h-4 text-primary-400 flex-shrink-0" />
            <span>Optimalkan parameter λ dan μ untuk efisiensi tertinggi</span>
          </li>
          <li class="flex items-center gap-2">
            <Zap class="w-4 h-4 text-warning-400 flex-shrink-0" />
            <span>Waktu tunggu rendah = skor tinggi</span>
          </li>
          <li class="flex items-center gap-2">
            <RefreshCw class="w-4 h-4 text-accent-400 flex-shrink-0" />
            <span>Mainkan ulang untuk memperbarui skormu</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
