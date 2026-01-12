import type {
  SimulationData,
  SimulationStatistics,
} from "./stores/simulationStore";
import {
  Table,
  Lightbulb,
  Info,
  Download,
  FileSpreadsheet,
  X,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
} from "lucide-preact";
import { useState } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";

interface ResultsTableProps {
  data: SimulationData[];
  statistics: SimulationStatistics;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SimulationData[];
  statistics: SimulationStatistics;
}

function ExportModal({ isOpen, onClose, data, statistics }: ExportModalProps) {
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [sheetId, setSheetId] = useState<string | null>(null);

  const extractSheetId = (url: string): string | null => {
    const patterns = [
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
      /^([a-zA-Z0-9-_]+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleUrlChange = (e: Event) => {
    const url = (e.target as HTMLInputElement).value;
    setSheetsUrl(url);
    setSheetId(extractSheetId(url));
    setExportStatus("idle");
    setErrorMessage("");
  };

  const handleExport = async () => {
    if (!sheetId) return;

    setIsExporting(true);
    setExportStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/export-to-sheets",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheetId,
            simulationData: data,
            statistics,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setExportStatus("success");
      } else {
        setExportStatus("error");
        setErrorMessage(
          result.message ||
            "Export gagal. Pastikan spreadsheet sudah di-share dengan service account."
        );
      }
    } catch (error) {
      setExportStatus("error");
      setErrorMessage(
        "Tidak dapat terhubung ke server. Pastikan backend berjalan."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Customer #",
      "U1 (Random)",
      "X1 (Interarrival)",
      "U2 (Random)",
      "X2 (Service)",
      "Arrival Time",
      "Arrival (Jam)",
      "Begin Service",
      "Begin (Jam)",
      "Service Time",
      "Departure Time",
      "Departure (Jam)",
      "Time in Queue",
      "Time in System",
    ];

    const rows = data.map((row) => [
      row.customerNumber,
      row.randomU1.toFixed(4),
      row.interarrivalTime.toFixed(4),
      row.randomU2.toFixed(4),
      row.serviceTimeX2.toFixed(4),
      row.arrivalTime.toFixed(4),
      row.arrivalTimeFormatted,
      row.beginServiceTime.toFixed(4),
      row.beginServiceTimeFormatted,
      row.serviceTime.toFixed(4),
      row.departureTime.toFixed(4),
      row.departureTimeFormatted,
      row.timeInQueue.toFixed(4),
      row.timeInSystem.toFixed(4),
    ]);

    rows.push([
      "Average",
      "-",
      statistics.avgInterarrivalTime.toFixed(4),
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      statistics.avgServiceTime.toFixed(4),
      "-",
      "-",
      statistics.avgTimeInQueue.toFixed(4),
      statistics.avgTimeInSystem.toFixed(4),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `simulation_results_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const copyToClipboard = () => {
    const headers = [
      "Customer #",
      "U1",
      "X1",
      "U2",
      "X2",
      "Arrival",
      "Begin",
      "Service",
      "Departure",
      "Queue Time",
      "System Time",
    ];

    const rows = data
      .map((row) =>
        [
          row.customerNumber,
          row.randomU1.toFixed(4),
          row.interarrivalTime.toFixed(4),
          row.randomU2.toFixed(4),
          row.serviceTimeX2.toFixed(4),
          row.arrivalTime.toFixed(4),
          row.beginServiceTime.toFixed(4),
          row.serviceTime.toFixed(4),
          row.departureTime.toFixed(4),
          row.timeInQueue.toFixed(4),
          row.timeInSystem.toFixed(4),
        ].join("\t")
      )
      .join("\n");

    const tableData = headers.join("\t") + "\n" + rows;
    navigator.clipboard.writeText(tableData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            class="relative w-full max-w-lg bg-dark-200 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div class="p-6 border-b border-white/10">
              <div class="flex items-center justify-between">
                <h3 class="font-display text-xl font-bold gradient-text flex items-center gap-2">
                  <Download class="w-5 h-5" />
                  Export Data Simulasi
                </h3>
                <button
                  onClick={onClose}
                  class="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
              <p class="text-sm text-white/60 mt-2">
                Export {data.length} data pelanggan ke berbagai format
              </p>
            </div>

            <div class="p-6 space-y-6">
              <div class="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadCSV}
                  class="flex items-center justify-center gap-2 p-4 rounded-xl bg-success-500/10 border border-success-500/30 hover:bg-success-500/20 transition-all group"
                >
                  <Download class="w-5 h-5 text-success-400 group-hover:scale-110 transition-transform" />
                  <div class="text-left">
                    <div class="font-semibold text-success-300">
                      Download CSV
                    </div>
                    <div class="text-xs text-white/50">File lokal</div>
                  </div>
                </button>

                <button
                  onClick={copyToClipboard}
                  class="flex items-center justify-center gap-2 p-4 rounded-xl bg-accent-500/10 border border-accent-500/30 hover:bg-accent-500/20 transition-all group"
                >
                  <Copy class="w-5 h-5 text-accent-400 group-hover:scale-110 transition-transform" />
                  <div class="text-left">
                    <div class="font-semibold text-accent-300">Copy Table</div>
                    <div class="text-xs text-white/50">Paste ke Excel</div>
                  </div>
                </button>
              </div>

              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-white/10" />
                </div>
                <div class="relative flex justify-center">
                  <span class="px-3 bg-dark-200 text-sm text-white/40">
                    atau
                  </span>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center gap-2 text-primary-300">
                  <FileSpreadsheet class="w-5 h-5" />
                  <span class="font-semibold">Export ke Google Sheets</span>
                </div>

                <div class="p-4 rounded-xl bg-dark-300/50 border border-white/5 space-y-4">
                  <div>
                    <label class="block text-sm text-white/70 mb-2">
                      Masukkan URL atau ID Google Spreadsheet
                    </label>
                    <input
                      type="text"
                      value={sheetsUrl}
                      onInput={handleUrlChange}
                      placeholder="https://docs.google.com/spreadsheets/d/xxx... atau sheet_id"
                      class="w-full px-4 py-3 rounded-lg bg-dark-400/50 border border-white/10 text-white placeholder:text-white/30 focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {sheetId && (
                    <div class="flex items-center gap-2 text-sm text-success-400">
                      <CheckCircle class="w-4 h-4" />
                      <span>
                        Sheet ID terdeteksi:{" "}
                        <code class="bg-dark-400 px-2 py-0.5 rounded">
                          {sheetId.slice(0, 20)}...
                        </code>
                      </span>
                    </div>
                  )}

                  <div class="p-3 rounded-lg bg-warning-500/10 border border-warning-500/20">
                    <div class="flex items-start gap-2 text-sm">
                      <AlertTriangle class="w-4 h-4 text-warning-400 flex-shrink-0 mt-0.5" />
                      <div class="text-warning-300">
                        <p class="font-semibold mb-1">Penting!</p>
                        <p class="text-white/60">
                          Pastikan spreadsheet sudah di-share dengan service
                          account email dari Google Cloud. Data akan ditulis ke
                          sheet "Simulation Results".
                        </p>
                      </div>
                    </div>
                  </div>

                  {exportStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      class="p-3 rounded-lg bg-success-500/10 border border-success-500/20"
                    >
                      <div class="flex items-center gap-2 text-success-400">
                        <CheckCircle class="w-5 h-5" />
                        <span class="font-semibold">Export berhasil!</span>
                      </div>
                      <a
                        href={`https://docs.google.com/spreadsheets/d/${sheetId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1 mt-2 text-sm text-primary-400 hover:text-primary-300"
                      >
                        Buka Spreadsheet <ExternalLink class="w-3 h-3" />
                      </a>
                    </motion.div>
                  )}

                  {exportStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      class="p-3 rounded-lg bg-danger-500/10 border border-danger-500/20"
                    >
                      <div class="flex items-start gap-2 text-danger-400">
                        <AlertTriangle class="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p class="font-semibold">Export gagal</p>
                          <p class="text-sm text-white/60">{errorMessage}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={handleExport}
                    disabled={!sheetId || isExporting}
                    class={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      sheetId && !isExporting
                        ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/25"
                        : "bg-dark-400 text-white/30 cursor-not-allowed"
                    }`}
                  >
                    {isExporting ? (
                      <>
                        <Loader2 class="w-5 h-5 animate-spin" />
                        Mengexport...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet class="w-5 h-5" />
                        Export ke Google Sheets
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ResultsTable({ data, statistics }: ResultsTableProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const formatNum = (num: number, decimals: number = 4) => {
    return num.toFixed(decimals);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-xl font-bold gradient-text flex items-center gap-2">
          <Table class="w-5 h-5" />
          Tabel Data Simulasi
        </h3>
        <div class="flex items-center gap-3">
          <span class="text-sm text-white/50">
            Total: {data.length} pelanggan
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExportModalOpen(true)}
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 hover:border-primary-500/50 text-primary-300 hover:text-primary-200 transition-all group"
          >
            <Download class="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span class="font-medium">Export</span>
          </motion.button>
        </div>
      </div>

      <div class="mb-4 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20 text-sm flex items-start gap-2">
        <Lightbulb class="w-4 h-4 text-primary-300 flex-shrink-0 mt-0.5" />
        <p class="text-primary-300">
          Format tabel ini identik dengan spreadsheet simulasi akademik. Gunakan
          scroll horizontal untuk melihat semua kolom.
        </p>
      </div>

      <div class="overflow-x-auto rounded-lg border border-white/10">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-dark-300/80">
              <th class="px-3 py-3 text-left font-semibold text-white/80 whitespace-nowrap border-b border-white/10">
                Customer #
              </th>
              <th class="px-3 py-3 text-right font-semibold text-primary-300 whitespace-nowrap border-b border-white/10">
                U1 (Random)
              </th>
              <th class="px-3 py-3 text-right font-semibold text-primary-300 whitespace-nowrap border-b border-white/10">
                X1 (Interarrival)
              </th>
              <th class="px-3 py-3 text-right font-semibold text-accent-300 whitespace-nowrap border-b border-white/10">
                U2 (Random)
              </th>
              <th class="px-3 py-3 text-right font-semibold text-accent-300 whitespace-nowrap border-b border-white/10">
                X2 (Service)
              </th>
              <th class="px-3 py-3 text-right font-semibold text-white/80 whitespace-nowrap border-b border-white/10">
                Arrival Time
              </th>
              <th class="px-3 py-3 text-center font-semibold text-white/60 whitespace-nowrap border-b border-white/10">
                Arrival (Jam)
              </th>
              <th class="px-3 py-3 text-right font-semibold text-white/80 whitespace-nowrap border-b border-white/10">
                Begin Service
              </th>
              <th class="px-3 py-3 text-center font-semibold text-white/60 whitespace-nowrap border-b border-white/10">
                Begin (Jam)
              </th>
              <th class="px-3 py-3 text-right font-semibold text-white/80 whitespace-nowrap border-b border-white/10">
                Service Time
              </th>
              <th class="px-3 py-3 text-right font-semibold text-white/80 whitespace-nowrap border-b border-white/10">
                Departure Time
              </th>
              <th class="px-3 py-3 text-center font-semibold text-white/60 whitespace-nowrap border-b border-white/10">
                Departure (Jam)
              </th>
              <th class="px-3 py-3 text-right font-semibold text-warning-300 whitespace-nowrap border-b border-white/10">
                Time in Queue
              </th>
              <th class="px-3 py-3 text-right font-semibold text-success-300 whitespace-nowrap border-b border-white/10">
                Time in System
              </th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 100).map((row, index) => (
              <motion.tr
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.01 }}
                key={row.customerNumber}
                class={`
                  ${index % 2 === 0 ? "bg-dark-400/30" : "bg-dark-300/30"}
                  hover:bg-primary-500/10 transition-colors
                `}
              >
                <td class="px-3 py-2 font-medium text-white whitespace-nowrap">
                  {row.customerNumber}
                </td>
                <td class="px-3 py-2 text-right font-mono text-primary-200 whitespace-nowrap">
                  {formatNum(row.randomU1)}
                </td>
                <td class="px-3 py-2 text-right font-mono text-primary-200 whitespace-nowrap">
                  {formatNum(row.interarrivalTime)}
                </td>
                <td class="px-3 py-2 text-right font-mono text-accent-200 whitespace-nowrap">
                  {formatNum(row.randomU2)}
                </td>
                <td class="px-3 py-2 text-right font-mono text-accent-200 whitespace-nowrap">
                  {formatNum(row.serviceTimeX2)}
                </td>
                <td class="px-3 py-2 text-right font-mono text-white/80 whitespace-nowrap">
                  {formatNum(row.arrivalTime)}
                </td>
                <td class="px-3 py-2 text-center font-mono text-white/60 whitespace-nowrap">
                  {row.arrivalTimeFormatted}
                </td>
                <td class="px-3 py-2 text-right font-mono text-white/80 whitespace-nowrap">
                  {formatNum(row.beginServiceTime)}
                </td>
                <td class="px-3 py-2 text-center font-mono text-white/60 whitespace-nowrap">
                  {row.beginServiceTimeFormatted}
                </td>
                <td class="px-3 py-2 text-right font-mono text-white/80 whitespace-nowrap">
                  {formatNum(row.serviceTime)}
                </td>
                <td class="px-3 py-2 text-right font-mono text-white/80 whitespace-nowrap">
                  {formatNum(row.departureTime)}
                </td>
                <td class="px-3 py-2 text-center font-mono text-white/60 whitespace-nowrap">
                  {row.departureTimeFormatted}
                </td>
                <td
                  class={`px-3 py-2 text-right font-mono whitespace-nowrap ${
                    row.timeInQueue > 2
                      ? "text-danger-400"
                      : row.timeInQueue > 1
                        ? "text-warning-400"
                        : "text-success-400"
                  }`}
                >
                  {formatNum(row.timeInQueue)}
                </td>
                <td class="px-3 py-2 text-right font-mono text-success-200 whitespace-nowrap">
                  {formatNum(row.timeInSystem)}
                </td>
              </motion.tr>
            ))}
            {data.length > 100 && (
              <tr class="bg-dark-400/30">
                <td colSpan={14} class="px-3 py-4 text-center text-white/50">
                  ... {data.length - 100} more rows ...
                </td>
              </tr>
            )}

            <tr class="bg-primary-500/20 font-semibold border-t-2 border-primary-500/50">
              <td class="px-3 py-3 text-white whitespace-nowrap">Average</td>
              <td class="px-3 py-3 text-center text-white/40" colSpan={2}>
                {formatNum(statistics.avgInterarrivalTime)}
              </td>
              <td class="px-3 py-3 text-center text-white/40" colSpan={2}>
                -
              </td>
              <td class="px-3 py-3 text-center text-white/40" colSpan={2}>
                -
              </td>
              <td class="px-3 py-3 text-center text-white/40" colSpan={2}>
                -
              </td>
              <td class="px-3 py-3 text-right font-mono text-white/80">
                {formatNum(statistics.avgServiceTime)}
              </td>
              <td class="px-3 py-3 text-center text-white/40" colSpan={2}>
                -
              </td>
              <td class="px-3 py-3 text-right font-mono text-warning-300">
                {formatNum(statistics.avgTimeInQueue)}
              </td>
              <td class="px-3 py-3 text-right font-mono text-success-300">
                {formatNum(statistics.avgTimeInSystem)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 p-4 rounded-lg bg-dark-300/30 text-xs">
        <h4 class="font-semibold mb-2 text-white/80 flex items-center gap-2">
          <Info class="w-4 h-4" />
          Keterangan Kolom:
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-white/60">
          <div>
            <span class="text-primary-300">U1</span>: Random number stream 1
            (kedatangan)
          </div>
          <div>
            <span class="text-primary-300">X1</span>: Interarrival time =
            -ln(U1)/λ
          </div>
          <div>
            <span class="text-accent-300">U2</span>: Random number stream 2
            (pelayanan)
          </div>
          <div>
            <span class="text-accent-300">X2</span>: Service time = -ln(U2)/μ
          </div>
          <div>
            <span class="text-warning-300">Time in Queue</span>: Waktu tunggu
            dalam antrian
          </div>
          <div>
            <span class="text-success-300">Time in System</span>: Total waktu
            dalam sistem
          </div>
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        statistics={statistics}
      />
    </motion.div>
  );
}
