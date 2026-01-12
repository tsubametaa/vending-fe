import { useEffect, useRef, useState } from "preact/hooks";
import type {
  SimulationData,
  SimulationStatistics,
} from "./stores/simulationStore";
import {
  LineChart,
  BarChart3,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-preact";
import { motion } from "framer-motion";

interface QueueChartProps {
  data: SimulationData[];
  statistics: SimulationStatistics;
}

declare global {
  interface Window {
    Chart: any;
  }
}

export default function QueueChart({ data, statistics }: QueueChartProps) {
  const queueTimeChartRef = useRef<HTMLCanvasElement>(null);
  const timelineChartRef = useRef<HTMLCanvasElement>(null);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [activeChart, setActiveChart] = useState<
    "queueTime" | "timeline" | "distribution"
  >("queueTime");

  const chartInstances = useRef<{
    queueTime?: any;
    timeline?: any;
    distribution?: any;
  }>({});

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Chart) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
      script.async = true;
      script.onload = () => {
        setChartLoaded(true);
      };
      document.head.appendChild(script);
    } else if (window.Chart) {
      setChartLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!chartLoaded || !window.Chart) return;

    createCharts();

    return () => {
      Object.values(chartInstances.current).forEach((chart) => {
        if (chart) chart.destroy();
      });
    };
  }, [chartLoaded, data, activeChart]);

  const createCharts = () => {
    const Chart = window.Chart;

    Object.values(chartInstances.current).forEach((chart) => {
      if (chart) chart.destroy();
    });
    chartInstances.current = {};

    if (queueTimeChartRef.current && activeChart === "queueTime") {
      const ctx = queueTimeChartRef.current.getContext("2d");
      if (ctx) {
        chartInstances.current.queueTime = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.map((d) => `#${d.customerNumber}`),
            datasets: [
              {
                label: "Time in Queue (min)",
                data: data.map((d) => d.timeInQueue),
                backgroundColor: data.map((d) =>
                  d.timeInQueue > 2
                    ? "rgba(239, 68, 68, 0.7)"
                    : d.timeInQueue > 1
                      ? "rgba(234, 179, 8, 0.7)"
                      : "rgba(34, 197, 94, 0.7)"
                ),
                borderColor: data.map((d) =>
                  d.timeInQueue > 2
                    ? "rgb(239, 68, 68)"
                    : d.timeInQueue > 1
                      ? "rgb(234, 179, 8)"
                      : "rgb(34, 197, 94)"
                ),
                borderWidth: 1,
                borderRadius: 4,
              },
              {
                label: "Time in System (min)",
                data: data.map((d) => d.timeInSystem),
                backgroundColor: "rgba(14, 165, 233, 0.5)",
                borderColor: "rgb(14, 165, 233)",
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: { color: "rgba(255,255,255,0.8)" },
              },
              title: {
                display: true,
                text: "Waktu Antrian per Pelanggan",
                color: "rgba(255,255,255,0.9)",
                font: { size: 16, weight: "bold" },
              },
              annotation: {
                annotations: {
                  line1: {
                    type: "line",
                    yMin: 2,
                    yMax: 2,
                    borderColor: "rgba(239, 68, 68, 0.8)",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    label: {
                      display: true,
                      content: "Target: 2 min",
                      position: "end",
                    },
                  },
                },
              },
            },
            animation: {
              duration: 1000,
              easing: "easeOutQuart",
            },
            scales: {
              x: {
                ticks: { color: "rgba(255,255,255,0.6)" },
                grid: { color: "rgba(255,255,255,0.1)" },
              },
              y: {
                beginAtZero: true,
                ticks: { color: "rgba(255,255,255,0.6)" },
                grid: { color: "rgba(255,255,255,0.1)" },
                title: {
                  display: true,
                  text: "Waktu (menit)",
                  color: "rgba(255,255,255,0.7)",
                },
              },
            },
          },
        });
      }
    }

    if (timelineChartRef.current && activeChart === "timeline") {
      const ctx = timelineChartRef.current.getContext("2d");
      if (ctx) {
        chartInstances.current.timeline = new Chart(ctx, {
          type: "line",
          data: {
            labels: data.map((d) => `#${d.customerNumber}`),
            datasets: [
              {
                label: "Arrival Time",
                data: data.map((d) => d.arrivalTime),
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: false,
                tension: 0.1,
                pointRadius: 4,
              },
              {
                label: "Begin Service",
                data: data.map((d) => d.beginServiceTime),
                borderColor: "rgb(234, 179, 8)",
                backgroundColor: "rgba(234, 179, 8, 0.1)",
                fill: false,
                tension: 0.1,
                pointRadius: 4,
              },
              {
                label: "Departure Time",
                data: data.map((d) => d.departureTime),
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                fill: false,
                tension: 0.1,
                pointRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: { color: "rgba(255,255,255,0.8)" },
              },
              title: {
                display: true,
                text: "Timeline Kejadian per Pelanggan",
                color: "rgba(255,255,255,0.9)",
                font: { size: 16, weight: "bold" },
              },
            },
            animation: {
              duration: 1000,
              easing: "easeOutQuart",
            },
            scales: {
              x: {
                ticks: { color: "rgba(255,255,255,0.6)" },
                grid: { color: "rgba(255,255,255,0.1)" },
              },
              y: {
                beginAtZero: true,
                ticks: { color: "rgba(255,255,255,0.6)" },
                grid: { color: "rgba(255,255,255,0.1)" },
                title: {
                  display: true,
                  text: "Waktu (menit dari mulai simulasi)",
                  color: "rgba(255,255,255,0.7)",
                },
              },
            },
          },
        });
      }
    }
  };

  const chartTypes = [
    { id: "queueTime", label: "Waktu Antrian", Icon: BarChart3 },
    { id: "timeline", label: "Timeline", Icon: LineChart },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 class="font-display text-xl font-bold gradient-text mb-4 flex items-center gap-2">
        <LineChart class="w-5 h-5" />
        Grafik Simulasi
      </h3>

      <div class="flex gap-2 mb-4">
        {chartTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveChart(type.id as typeof activeChart)}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeChart === type.id
                ? "bg-primary-500 text-white"
                : "bg-dark-300/50 text-white/60 hover:text-white hover:bg-dark-200"
            }`}
          >
            <type.Icon class="w-4 h-4" />
            {type.label}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        class="h-80 md:h-96 bg-dark-300/30 rounded-xl p-4"
      >
        {!chartLoaded ? (
          <div class="flex items-center justify-center h-full">
            <div class="text-center">
              <Loader2 class="w-10 h-10 text-primary-400 animate-spin mx-auto mb-2" />
              <p class="text-white/60">Loading Chart.js...</p>
            </div>
          </div>
        ) : (
          <>
            <canvas
              ref={queueTimeChartRef}
              class={activeChart === "queueTime" ? "block" : "hidden"}
            />
            <canvas
              ref={timelineChartRef}
              class={activeChart === "timeline" ? "block" : "hidden"}
            />
          </>
        )}
      </motion.div>

      <div class="mt-4 grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          class="p-3 rounded-lg bg-success-500/10 border border-success-500/20 text-center"
        >
          <div class="flex items-center justify-center gap-2 text-sm text-white/60 mb-1">
            <CheckCircle class="w-4 h-4 text-success-400" />
            Queue Time &lt; 1 min
          </div>
          <div class="text-lg font-bold text-success-400">
            {data.filter((d) => d.timeInQueue < 1).length} pelanggan
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          class="p-3 rounded-lg bg-warning-500/10 border border-warning-500/20 text-center"
        >
          <div class="flex items-center justify-center gap-2 text-sm text-white/60 mb-1">
            <AlertTriangle class="w-4 h-4 text-warning-400" />
            Queue Time 1-2 min
          </div>
          <div class="text-lg font-bold text-warning-400">
            {data.filter((d) => d.timeInQueue >= 1 && d.timeInQueue < 2).length}{" "}
            pelanggan
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          class="p-3 rounded-lg bg-danger-500/10 border border-danger-500/20 text-center"
        >
          <div class="flex items-center justify-center gap-2 text-sm text-white/60 mb-1">
            <XCircle class="w-4 h-4 text-danger-400" />
            Queue Time &gt; 2 min
          </div>
          <div class="text-lg font-bold text-danger-400">
            {data.filter((d) => d.timeInQueue >= 2).length} pelanggan
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
