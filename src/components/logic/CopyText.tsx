import type {
  SimulationParameters,
  SimulationStatistics,
  TheoreticalValues,
  Badge,
} from "../stores/simulationStore";

export interface GenerateCopyTextParams {
  parameters: SimulationParameters;
  statistics: SimulationStatistics;
  theoretical: TheoreticalValues;
  score: number;
  badge: Badge;
  wqError: number;
  wError: number;
  performanceNarrative: string;
  queueTimeNarrative: string;
  accuracyNarrative: string;
  recommendations: { text: string }[];
}

export function generateCopyText({
  parameters,
  statistics,
  theoretical,
  score,
  badge,
  wqError,
  wError,
  performanceNarrative,
  queueTimeNarrative,
  accuracyNarrative,
  recommendations,
}: GenerateCopyTextParams): string {
  const utilization = parameters.utilization;
  const avgQueueSeconds = statistics.avgTimeInQueue * 60;
  const performanceStatus =
    utilization < 0.7 ? "Optimal" : utilization < 0.85 ? "Moderat" : "Tinggi";
  const queueStatus =
    avgQueueSeconds < 60
      ? "Cepat"
      : avgQueueSeconds < 120
        ? "Normal"
        : "Lambat";

  const text = `KESIMPULAN & ANALISIS SIMULASI ANTRIAN
========================================

Tanggal: ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
Model: M/M/1 (Single Server Queue)
Metode: Simulasi Monte Carlo


PARAMETER INPUT
---------------
- Tingkat Kedatangan (λ): ${parameters.lambda} pelanggan/menit
- Tingkat Pelayanan (μ): ${parameters.mu} pelanggan/menit  
- Jumlah Pelanggan: ${parameters.numCustomers} pelanggan
- Utilisasi (ρ): ${(utilization * 100).toFixed(1)}%


RINGKASAN HASIL SIMULASI
------------------------
- Rata-rata Waktu Tunggu (Wq): ${avgQueueSeconds.toFixed(1)} detik (${statistics.avgTimeInQueue.toFixed(4)} menit)
- Rata-rata Waktu dalam Sistem (W): ${(statistics.avgTimeInSystem * 60).toFixed(1)} detik (${statistics.avgTimeInSystem.toFixed(4)} menit)
- Total Waktu Simulasi: ${statistics.totalSimulationTime.toFixed(2)} menit
- Status Utilisasi: ${performanceStatus}
- Status Waktu Tunggu: ${queueStatus}


ANALISIS UTILISASI SISTEM
-------------------------
${performanceNarrative.replace(/\*\*/g, "")}


ANALISIS WAKTU TUNGGU
---------------------
${queueTimeNarrative.replace(/\*\*/g, "")}


PERBANDINGAN SIMULASI VS TEORI M/M/1
------------------------------------
${accuracyNarrative.replace(/\*\*/g, "")}

Nilai Simulasi vs Teoritis:
- Waktu Antri (Wq): ${statistics.avgTimeInQueue.toFixed(4)} min vs ${theoretical.avgQueueTime.toFixed(4)} min (Error: ${wqError.toFixed(2)}%)
- Waktu Sistem (W): ${statistics.avgTimeInSystem.toFixed(4)} min vs ${theoretical.avgSystemTime.toFixed(4)} min (Error: ${wError.toFixed(2)}%)


REKOMENDASI
-----------
${recommendations.map((rec, i) => `${i + 1}. ${rec.text}`).join("\n")}


KESIMPULAN AKHIR
----------------
Badge: ${badge.name}
Skor: ${score}/100 poin
${badge.description}

========================================
Simulasi dilakukan menggunakan QueueQuest Simulator
`;

  return text;
}
