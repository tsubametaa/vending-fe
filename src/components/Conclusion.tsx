import { useState, useEffect } from "preact/hooks";
import { motion } from "framer-motion";
import {
  simulationStore,
  type SimulationState,
} from "./stores/simulationStore";
import { generateCopyText } from "./logic/CopyText";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target,
  Lightbulb,
  ArrowRight,
  Info,
  Trophy,
  Medal,
  Award,
  Star,
  Sparkles,
  Crown,
  Gauge,
  Timer,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  Square,
} from "lucide-preact";

function getBadgeIcon(badgeName: string, size: string = "w-12 h-12") {
  const iconMap: { [key: string]: typeof Trophy } = {
    "Speed Demon": Zap,
    "Lightning Fast": Zap,
    "Efficiency Master": Trophy,
    "Queue Master": Crown,
    "Quick Serve": Timer,
    Balanced: Gauge,
    "Needs Work": AlertTriangle,
    Critical: XCircle,
    Bronze: Medal,
    Silver: Medal,
    Gold: Medal,
    Platinum: Crown,
    Diamond: Sparkles,
  };

  const IconComponent =
    Object.entries(iconMap).find(([key]) =>
      badgeName.toLowerCase().includes(key.toLowerCase())
    )?.[1] || Award;

  return <IconComponent class={`${size} text-warning-400`} />;
}

interface ConclusionCardProps {
  icon: typeof BookOpen;
  title: string;
  children: preact.ComponentChildren;
  variant?: "success" | "warning" | "danger" | "info" | "primary";
  delay?: number;
}

function ConclusionCard({
  icon: Icon,
  title,
  children,
  variant = "info",
  delay = 0,
}: ConclusionCardProps) {
  const variantStyles = {
    success:
      "from-success-500/20 to-success-500/5 border-success-500/40 text-success-300",
    warning:
      "from-warning-500/20 to-warning-500/5 border-warning-500/40 text-warning-300",
    danger:
      "from-danger-500/20 to-danger-500/5 border-danger-500/40 text-danger-300",
    info: "from-accent-500/20 to-accent-500/5 border-accent-500/40 text-accent-300",
    primary:
      "from-primary-500/20 to-primary-500/5 border-primary-500/40 text-primary-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      class={`p-5 rounded-xl bg-gradient-to-br ${variantStyles[variant]} border-2`}
    >
      <div class="flex items-center gap-3 mb-3">
        <div class={`p-2 rounded-lg bg-${variant}-500/20`}>
          <Icon class="w-5 h-5" />
        </div>
        <h4 class="font-semibold text-lg">{title}</h4>
      </div>
      <div class="text-white/80 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </motion.div>
  );
}

export default function Conclusion() {
  const [state, setState] = useState<SimulationState>(
    simulationStore.getState()
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = simulationStore.subscribe(setState);
    return unsubscribe;
  }, []);

  const { results } = state;

  if (!results) {
    return (
      <div class="card text-center py-16">
        <BookOpen class="w-16 h-16 text-accent-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold mb-2">Kesimpulan Simulasi</h3>
        <p class="text-white/60">
          Jalankan simulasi terlebih dahulu untuk melihat kesimpulan dan
          analisis di sini
        </p>
      </div>
    );
  }

  const { parameters, statistics, theoretical, score, badge } = results;
  const utilization = parameters.utilization;

  const wqError = Math.abs(
    ((statistics.avgTimeInQueue - theoretical.avgQueueTime) /
      theoretical.avgQueueTime) *
      100
  );
  const wError = Math.abs(
    ((statistics.avgTimeInSystem - theoretical.avgSystemTime) /
      theoretical.avgSystemTime) *
      100
  );
  const avgError = (wqError + wError) / 2;

  const getPerformanceLevel = () => {
    if (utilization < 0.5) return "sangat_baik";
    if (utilization < 0.7) return "baik";
    if (utilization < 0.85) return "moderat";
    if (utilization < 0.95) return "tinggi";
    return "kritis";
  };

  const performanceLevel = getPerformanceLevel();

  const getQueueTimeAssessment = () => {
    const avgQueueSeconds = statistics.avgTimeInQueue * 60;
    if (avgQueueSeconds < 30) return "sangat_cepat";
    if (avgQueueSeconds < 60) return "cepat";
    if (avgQueueSeconds < 120) return "normal";
    if (avgQueueSeconds < 300) return "lambat";
    return "sangat_lambat";
  };

  const queueTimeAssessment = getQueueTimeAssessment();

  const getPerformanceNarrative = () => {
    const texts = {
      sangat_baik: `Dengan tingkat utilisasi sebesar **${(utilization * 100).toFixed(1)}%**, sistem vending machine Anda beroperasi dengan sangat efisien. Server memiliki cukup waktu idle untuk menangani lonjakan pelanggan yang tidak terduga. Ini berarti pelanggan hampir tidak perlu menunggu lama.`,
      baik: `Sistem menunjukkan performa yang baik dengan utilisasi **${(utilization * 100).toFixed(1)}%**. Keseimbangan antara kedatangan pelanggan (λ=${parameters.lambda}/menit) dan kecepatan pelayanan (μ=${parameters.mu}/menit) sudah optimal. Pelanggan umumnya merasa puas dengan waktu tunggu yang relatif singkat.`,
      moderat: `Dengan utilisasi **${(utilization * 100).toFixed(1)}%**, sistem berada dalam kondisi moderat. Antrian mulai terbentuk secara konsisten, namun masih dalam batas yang dapat diterima. Pertimbangkan untuk meningkatkan kecepatan pelayanan jika ingin mengurangi waktu tunggu.`,
      tinggi: `Perhatian! Utilisasi sistem mencapai **${(utilization * 100).toFixed(1)}%** yang tergolong tinggi. Pada level ini, antrian cenderung memanjang dan waktu tunggu meningkat signifikan. Sistem mendekati batas kapasitasnya.`,
      kritis: `PERINGATAN: Utilisasi sistem sudah mencapai **${(utilization * 100).toFixed(1)}%** yang sangat kritis! Pada kondisi ini, antrian akan terus membesar tanpa batas (teoretis). Segera perlukan penambahan kapasitas pelayanan.`,
    };
    return texts[performanceLevel];
  };

  const getQueueTimeNarrative = () => {
    const avgQueueSeconds = statistics.avgTimeInQueue * 60;
    const maxQueueSeconds = statistics.maxTimeInQueue * 60;

    const texts = {
      sangat_cepat: `Luar biasa! Rata-rata waktu tunggu hanya **${avgQueueSeconds.toFixed(1)} detik**. Pelanggan hampir tidak perlu mengantri dan langsung dilayani. Ini adalah pengalaman pelanggan yang sempurna!`,
      cepat: `Waktu tunggu rata-rata **${avgQueueSeconds.toFixed(1)} detik** menunjukkan sistem yang responsif. Sebagian besar pelanggan hanya perlu menunggu sebentar sebelum dilayani.`,
      normal: `Dengan rata-rata **${avgQueueSeconds.toFixed(1)} detik** (sekitar ${statistics.avgTimeInQueue.toFixed(2)} menit), waktu tunggu masih dalam batas normal. Namun, beberapa pelanggan mungkin merasa waktu tunggu sedikit lama.`,
      lambat: `Waktu tunggu rata-rata mencapai **${avgQueueSeconds.toFixed(1)} detik** (${statistics.avgTimeInQueue.toFixed(2)} menit). Beberapa pelanggan mungkin mulai tidak sabar. Waktu tunggu maksimum tercatat **${maxQueueSeconds.toFixed(1)} detik**.`,
      sangat_lambat: `Waktu tunggu sangat lama dengan rata-rata **${avgQueueSeconds.toFixed(1)} detik** (${statistics.avgTimeInQueue.toFixed(2)} menit). Hal ini dapat menyebabkan ketidakpuasan pelanggan dan potensi kehilangan pelanggan. Perlu evaluasi sistem segera!`,
    };
    return texts[queueTimeAssessment];
  };

  // Accuracy narrative
  const getAccuracyNarrative = () => {
    if (avgError < 5) {
      return `Simulasi Monte Carlo menunjukkan akurasi **sangat tinggi** dengan rata-rata error hanya **${avgError.toFixed(2)}%** dibandingkan nilai teoritis M/M/1. Ini membuktikan bahwa model simulasi sangat representatif terhadap teori antrian.`;
    } else if (avgError < 15) {
      return `Dengan rata-rata error **${avgError.toFixed(2)}%**, simulasi menunjukkan hasil yang **cukup akurat**. Perbedaan kecil dengan nilai teoritis adalah normal karena simulasi Monte Carlo menggunakan bilangan acak.`;
    } else if (avgError < 30) {
      return `Terdapat perbedaan **${avgError.toFixed(2)}%** antara hasil simulasi dan nilai teoritis. Hal ini dapat disebabkan oleh jumlah sampel yang terbatas (${parameters.numCustomers} pelanggan). Meningkatkan jumlah pelanggan dapat meningkatkan akurasi.`;
    } else {
      return `Perbedaan yang cukup besar (**${avgError.toFixed(2)}%**) antara simulasi dan teori mungkin disebabkan oleh jumlah sampel yang terlalu sedikit atau fluktuasi acak yang ekstrem. Disarankan untuk menjalankan simulasi dengan lebih banyak pelanggan.`;
    }
  };

  const getRecommendations = () => {
    const recs = [];

    if (utilization > 0.85) {
      recs.push({
        icon: Zap,
        text: "Tingkatkan kecepatan pelayanan (μ) atau tambah server untuk mengurangi utilisasi",
        priority: "high",
      });
    }

    if (statistics.avgTimeInQueue * 60 > 120) {
      recs.push({
        icon: Clock,
        text: "Waktu tunggu terlalu lama. Pertimbangkan sistem fast-track atau express lane",
        priority: "high",
      });
    }

    if (parameters.numCustomers < 50) {
      recs.push({
        icon: Users,
        text: "Jalankan simulasi dengan lebih banyak pelanggan (100+) untuk hasil yang lebih akurat",
        priority: "medium",
      });
    }

    if (utilization < 0.3) {
      recs.push({
        icon: Target,
        text: "Utilisasi sangat rendah. Sistem mungkin over-capacity. Bisa dioptimalkan untuk efisiensi biaya",
        priority: "low",
      });
    }

    if (recs.length === 0) {
      recs.push({
        icon: CheckCircle,
        text: "Sistem sudah berjalan optimal! Pertahankan parameter saat ini",
        priority: "success",
      });
    }

    return recs;
  };

  const recommendations = getRecommendations();

  const handleCopyConclusion = async () => {
    const text = generateCopyText({
      parameters,
      statistics,
      theoretical,
      score,
      badge,
      wqError,
      wError,
      performanceNarrative: getPerformanceNarrative(),
      queueTimeNarrative: getQueueTimeNarrative(),
      accuracyNarrative: getAccuracyNarrative(),
      recommendations,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      class="space-y-6"
    >
      <div class="card">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-center md:text-left">
            <h2 class="font-display text-2xl font-bold gradient-text mb-2 flex items-center gap-2 justify-center md:justify-start">
              <BookOpen class="w-6 h-6" />
              Kesimpulan & Analisis
            </h2>
            <p class="text-white/60">
              Interpretasi hasil simulasi untuk {parameters.numCustomers}{" "}
              pelanggan
            </p>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-4">
              <div class="text-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30">
                <div class="flex justify-center mb-1">
                  {getBadgeIcon(badge.name, "w-8 h-8")}
                </div>
                <div class="text-xs text-white/70 mt-1">{badge.name}</div>
              </div>
              <div class="text-center px-4 py-2 rounded-lg bg-warning-500/20 border border-warning-500/30">
                <div class="text-2xl font-bold text-warning-400">{score}</div>
                <div class="text-xs text-white/70 mt-1">Skor</div>
              </div>
              <button
                onClick={handleCopyConclusion}
                class={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  copied
                    ? "bg-success-500/20 border border-success-500/50 text-success-300"
                    : "bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 hover:border-primary-500/50 text-primary-300 hover:text-primary-200"
                }`}
                title="Copy kesimpulan untuk Word/PDF"
              >
                {copied ? (
                  <>
                    <Check class="w-4 h-4" />
                    <span class="text-sm font-medium">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy class="w-4 h-4" />
                    <span class="text-sm font-medium">Copy Kesimpulan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 class="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Info class="w-5 h-5 text-accent-400" />
            Ringkasan Simulasi
          </h3>

          <div class="p-5 rounded-xl bg-gradient-to-br from-dark-300/70 via-dark-300/50 to-dark-300/70 border border-white/10 mb-4">
            <p class="text-white/90 leading-relaxed">
              Berdasarkan simulasi{" "}
              <strong className="text-primary-300">Monte Carlo</strong> dengan
              model antrian <strong className="text-accent-300">M/M/1</strong>,
              sistem vending machine Anda telah melayani{" "}
              <strong className="text-success-300">
                {parameters.numCustomers} pelanggan
              </strong>{" "}
              dengan tingkat kedatangan{" "}
              <strong className="text-primary-300">
                λ = {parameters.lambda}
              </strong>{" "}
              pelanggan/menit dan tingkat pelayanan{" "}
              <strong className="text-accent-300">μ = {parameters.mu}</strong>{" "}
              pelanggan/menit.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-4 text-center">
            <div class="p-4 rounded-lg bg-primary-500/10 border border-primary-500/30">
              <TrendingUp class="w-8 h-8 text-primary-400 mx-auto mb-2" />
              <div class="text-3xl font-bold text-primary-400">
                {(utilization * 100).toFixed(1)}%
              </div>
              <div class="text-sm text-white/60 mt-1">Utilisasi (ρ)</div>
              <div
                class={`text-xs mt-2 flex items-center justify-center gap-1 ${utilization < 0.7 ? "text-success-400" : utilization < 0.85 ? "text-warning-400" : "text-danger-400"}`}
              >
                {utilization < 0.7 ? (
                  <>
                    <CheckCircle class="w-3 h-3" /> Optimal
                  </>
                ) : utilization < 0.85 ? (
                  <>
                    <AlertTriangle class="w-3 h-3" /> Moderat
                  </>
                ) : (
                  <>
                    <AlertTriangle class="w-3 h-3" /> Tinggi
                  </>
                )}
              </div>
            </div>
            <div class="p-4 rounded-lg bg-accent-500/10 border border-accent-500/30">
              <Timer class="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <div class="text-3xl font-bold text-accent-400">
                {(statistics.avgTimeInQueue * 60).toFixed(1)}s
              </div>
              <div class="text-sm text-white/60 mt-1">
                Rata-rata Waktu Tunggu
              </div>
              <div
                class={`text-xs mt-2 flex items-center justify-center gap-1 ${statistics.avgTimeInQueue * 60 < 60 ? "text-success-400" : statistics.avgTimeInQueue * 60 < 120 ? "text-warning-400" : "text-danger-400"}`}
              >
                {statistics.avgTimeInQueue * 60 < 60 ? (
                  <>
                    <CheckCircle class="w-3 h-3" /> Cepat
                  </>
                ) : statistics.avgTimeInQueue * 60 < 120 ? (
                  <>
                    <AlertTriangle class="w-3 h-3" /> Normal
                  </>
                ) : (
                  <>
                    <AlertTriangle class="w-3 h-3" /> Lambat
                  </>
                )}
              </div>
            </div>
            <div class="p-4 rounded-lg bg-success-500/10 border border-success-500/30">
              <RefreshCw class="w-8 h-8 text-success-400 mx-auto mb-2" />
              <div class="text-3xl font-bold text-success-400">
                {statistics.totalSimulationTime.toFixed(1)}m
              </div>
              <div class="text-sm text-white/60 mt-1">Total Waktu Simulasi</div>
              <div class="text-xs mt-2 text-white/50">Mulai 08:00 WIB</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <ConclusionCard
          icon={TrendingUp}
          title="Analisis Utilisasi Sistem"
          variant={
            performanceLevel === "sangat_baik" || performanceLevel === "baik"
              ? "success"
              : performanceLevel === "moderat"
                ? "warning"
                : "danger"
          }
          delay={0.3}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: getPerformanceNarrative().replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="text-white">$1</strong>'
              ),
            }}
          />
        </ConclusionCard>

        <ConclusionCard
          icon={Timer}
          title="Analisis Waktu Tunggu"
          variant={
            queueTimeAssessment === "sangat_cepat" ||
            queueTimeAssessment === "cepat"
              ? "success"
              : queueTimeAssessment === "normal"
                ? "info"
                : "warning"
          }
          delay={0.4}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: getQueueTimeNarrative().replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="text-white">$1</strong>'
              ),
            }}
          />
        </ConclusionCard>
      </div>

      <ConclusionCard
        icon={Target}
        title="Perbandingan Simulasi vs Teori M/M/1"
        variant={avgError < 10 ? "success" : avgError < 20 ? "info" : "warning"}
        delay={0.5}
      >
        <p
          dangerouslySetInnerHTML={{
            __html: getAccuracyNarrative().replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="text-white">$1</strong>'
            ),
          }}
        />

        <div class="grid grid-cols-2 gap-4 mt-4 p-4 rounded-lg bg-dark-400/30">
          <div>
            <div class="text-xs text-white/50 mb-1">Wq (Waktu Antri)</div>
            <div class="flex items-center gap-2">
              <span class="text-primary-300 font-mono">
                {statistics.avgTimeInQueue.toFixed(4)}
              </span>
              <ArrowRight class="w-4 h-4 text-white/30" />
              <span class="text-accent-300 font-mono">
                {theoretical.avgQueueTime.toFixed(4)}
              </span>
              <span
                class={`text-xs ${wqError < 10 ? "text-success-400" : "text-warning-400"}`}
              >
                ({wqError.toFixed(1)}% error)
              </span>
            </div>
          </div>
          <div>
            <div class="text-xs text-white/50 mb-1">W (Waktu Sistem)</div>
            <div class="flex items-center gap-2">
              <span class="text-primary-300 font-mono">
                {statistics.avgTimeInSystem.toFixed(4)}
              </span>
              <ArrowRight class="w-4 h-4 text-white/30" />
              <span class="text-accent-300 font-mono">
                {theoretical.avgSystemTime.toFixed(4)}
              </span>
              <span
                class={`text-xs ${wError < 10 ? "text-success-400" : "text-warning-400"}`}
              >
                ({wError.toFixed(1)}% error)
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 mt-3 text-xs text-white/50">
          <div class="flex items-center gap-1">
            <Square class="w-3 h-3 text-primary-300 fill-current" />{" "}
            <span>Simulasi Monte Carlo</span>
          </div>
          <div class="flex items-center gap-1 ml-3">
            <Square class="w-3 h-3 text-accent-300 fill-current" />{" "}
            <span>Nilai Teoritis M/M/1</span>
          </div>
        </div>
      </ConclusionCard>

      <div class="card">
        <h3 class="font-display text-xl font-bold gradient-text mb-4 flex items-center gap-2">
          <Lightbulb class="w-5 h-5" />
          Rekomendasi
        </h3>

        <div class="space-y-3">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              class={`flex items-start gap-3 p-4 rounded-lg ${
                rec.priority === "high"
                  ? "bg-danger-500/10 border border-danger-500/30"
                  : rec.priority === "medium"
                    ? "bg-warning-500/10 border border-warning-500/30"
                    : rec.priority === "success"
                      ? "bg-success-500/10 border border-success-500/30"
                      : "bg-accent-500/10 border border-accent-500/30"
              }`}
            >
              <div
                class={`p-2 rounded-lg ${
                  rec.priority === "high"
                    ? "bg-danger-500/20"
                    : rec.priority === "medium"
                      ? "bg-warning-500/20"
                      : rec.priority === "success"
                        ? "bg-success-500/20"
                        : "bg-accent-500/20"
                }`}
              >
                <rec.icon
                  class={`w-5 h-5 ${
                    rec.priority === "high"
                      ? "text-danger-400"
                      : rec.priority === "medium"
                        ? "text-warning-400"
                        : rec.priority === "success"
                          ? "text-success-400"
                          : "text-accent-400"
                  }`}
                />
              </div>
              <div>
                <p class="text-white/90">{rec.text}</p>
                <span
                  class={`text-xs mt-1 inline-block ${
                    rec.priority === "high"
                      ? "text-danger-400"
                      : rec.priority === "medium"
                        ? "text-warning-400"
                        : rec.priority === "success"
                          ? "text-success-400"
                          : "text-accent-400"
                  }`}
                >
                  {rec.priority === "high"
                    ? "Prioritas Tinggi"
                    : rec.priority === "medium"
                      ? "Prioritas Sedang"
                      : rec.priority === "success"
                        ? "Status Baik"
                        : "Saran Optimasi"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        class="card text-center"
      >
        <div class="flex justify-center mb-4">
          {getBadgeIcon(badge.name, "w-16 h-16")}
        </div>
        <h3 class="font-display text-2xl font-bold gradient-text mb-2">
          {badge.name}
        </h3>
        <p class="text-white/70 max-w-lg mx-auto">{badge.description}</p>
        <div class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30">
          <span class="text-white/70">Skor Akhir:</span>
          <span class="text-2xl font-bold text-warning-400">{score}</span>
          <span class="text-white/50">poin</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
