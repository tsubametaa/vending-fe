import { useState, useEffect } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { simulationStore } from "./stores/simulationStore";
import { characterStore } from "./logic/CharacterClick";
import ChooseChar from "./logic/ChooseChar";
import {
  Settings,
  User,
  Rocket,
  Loader2,
  Clock,
  Train,
  TreeDeciduous,
  AlertTriangle,
  Zap,
  Gauge,
} from "lucide-preact";

interface FormData {
  lambda: number;
  mu: number;
  numCustomers: number;
  playerName: string;
}

interface ValidationErrors {
  lambda?: string;
  mu?: string;
  numCustomers?: string;
  playerName?: string;
  general?: string;
}

export default function SimulationForm() {
  const [formData, setFormData] = useState<FormData>({
    lambda: 0.5,
    mu: 0.8,
    numCustomers: 20,
    playerName: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [utilization, setUtilization] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  useEffect(() => {
    if (formData.mu > 0) {
      setUtilization(formData.lambda / formData.mu);
    }
  }, [formData.lambda, formData.mu]);

  useEffect(() => {
    const unsubscribe = characterStore.subscribe((character) => {
      const preset = presets.find((p) => p.name === character.preset);
      if (preset) {
        setFormData((prev) => ({
          ...prev,
          lambda: preset.lambda,
          mu: preset.mu,
          numCustomers: preset.customers,
          playerName: character.name,
        }));
        setSelectedPreset(preset.name);
        simulationStore.setSelectedPreset(preset.name);
        setErrors({});
      }
    });

    return () => unsubscribe();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.playerName) {
      newErrors.playerName = "Pilih karakter terlebih dahulu";
    }

    if (formData.lambda <= 0) {
      newErrors.lambda = "Lambda harus lebih besar dari 0";
    }

    if (formData.mu <= 0) {
      newErrors.mu = "Mu harus lebih besar dari 0";
    }

    if (formData.lambda >= formData.mu) {
      newErrors.general =
        "Lambda (λ) harus lebih kecil dari Mu (μ) untuk sistem stabil";
    }

    if (formData.numCustomers < 1 || formData.numCustomers > 1000) {
      newErrors.numCustomers = "Jumlah pelanggan harus antara 1-1000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value =
      field === "playerName" ? target.value : parseFloat(target.value) || 0;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field !== "playerName") {
      setSelectedPreset(null);
      simulationStore.setSelectedPreset(null);
    }

    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    simulationStore.setLoading(true);
    simulationStore.setError(null);

    try {
      const response = await fetch(
        "https://vending-be.vercel.app/api/simulate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lambda: formData.lambda,
            mu: formData.mu,
            numCustomers: formData.numCustomers,
            playerName: formData.playerName || "Anonymous",
            saveToSheets: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Simulation failed");
      }

      const data = await response.json();

      simulationStore.setResults(data.simulation);
      simulationStore.setIsSimulating(true);

      console.log("Simulation completed:", data);
    } catch (error) {
      console.error("Simulation error:", error);
      simulationStore.setError(
        error instanceof Error ? error.message : "Unknown error"
      );
      setErrors({
        general: error instanceof Error ? error.message : "Simulation failed",
      });
    } finally {
      setIsLoading(false);
      simulationStore.setLoading(false);
    }
  };

  const presets = [
    {
      name: "Rush Hour",
      icon: Train,
      lambda: 0.8,
      mu: 1.0,
      customers: 30,
      desc: "Jam sibuk stasiun",
    },
    {
      name: "Relaxed Park",
      icon: TreeDeciduous,
      lambda: 0.3,
      mu: 0.6,
      customers: 15,
      desc: "Taman santai",
    },
    {
      name: "Overloaded",
      icon: AlertTriangle,
      lambda: 0.9,
      mu: 1.0,
      customers: 25,
      desc: "Sistem hampir penuh",
    },
    {
      name: "Efficient",
      icon: Zap,
      lambda: 0.4,
      mu: 1.2,
      customers: 20,
      desc: "Server cepat",
    },
  ];

  const applyPreset = (preset: (typeof presets)[0]) => {
    setFormData((prev) => ({
      ...prev,
      lambda: preset.lambda,
      mu: preset.mu,
      numCustomers: preset.customers,
    }));
    setSelectedPreset(preset.name);
    simulationStore.setSelectedPreset(preset.name);
    setErrors({});
  };

  const getUtilizationColor = () => {
    if (utilization >= 1) return "text-danger-400";
    if (utilization >= 0.8) return "text-warning-400";
    if (utilization >= 0.5) return "text-primary-400";
    return "text-success-400";
  };

  const getUtilizationStatus = () => {
    if (utilization >= 1) return "Tidak Stabil!";
    if (utilization >= 0.8) return "Hampir Penuh";
    if (utilization >= 0.5) return "Normal";
    return "Optimal";
  };

  return (
    <motion.div
      class="card h-full"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 class="font-display text-xl font-bold mb-6 gradient-text flex items-center gap-2">
        <Settings class="w-5 h-5" />
        <span>Parameter Simulasi</span>
      </h3>

      <div class="mb-6">
        <label class="block text-sm font-bold text-white/70 mb-3 pixel-text">
          Quick Presets
        </label>
        <div class="grid grid-cols-2 gap-3">
          {presets.map((preset, i) => (
            <motion.button
              key={i}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => applyPreset(preset)}
              class={`text-left p-3 rounded-lg border-2 transition-all group ${
                selectedPreset === preset.name
                  ? "bg-gradient-to-br from-primary-500/30 to-primary-500/10 border-primary-500 shadow-lg shadow-primary-500/50 scale-105"
                  : "bg-dark-300/50 border-white/10 hover:border-primary-500/40 hover:bg-dark-200/50 hover:scale-102"
              }`}
            >
              <div
                class={`flex items-center gap-2 text-sm font-bold transition-colors pixel-text ${
                  selectedPreset === preset.name
                    ? "text-primary-300"
                    : "group-hover:text-primary-300"
                }`}
              >
                <preset.icon class="w-5 h-5" />
                {preset.name}
              </div>
              <div class="text-xs text-white/50 mt-1">{preset.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} class="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label class="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <User class="w-4 h-4" />
            Nama Pemain
          </label>
          <ChooseChar />
          {errors.playerName ? (
            <p class="text-danger-400 text-xs mt-2 flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              {errors.playerName}
            </p>
          ) : (
            <p class="text-xs text-white/40 mt-2">
              Klik karakter di Hero Section untuk memilih pemain
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label class="block text-sm font-medium text-white/80 mb-2">
            <span class="text-primary-400">λ</span> Arrival Rate
            (pelanggan/menit)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            value={formData.lambda}
            onInput={handleChange("lambda")}
            class={`input-field ${errors.lambda ? "border-danger-500" : ""}`}
          />
          {errors.lambda && (
            <p class="text-danger-400 text-xs mt-1">{errors.lambda}</p>
          )}
          <p class="text-xs text-white/40 mt-1">
            Rata-rata kedatangan pelanggan per menit
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label class="block text-sm font-medium text-white/80 mb-2">
            <span class="text-accent-400">μ</span> Service Rate
            (pelanggan/menit)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            value={formData.mu}
            onInput={handleChange("mu")}
            class={`input-field ${errors.mu ? "border-danger-500" : ""}`}
          />
          {errors.mu && <p class="text-danger-400 text-xs mt-1">{errors.mu}</p>}
          <p class="text-xs text-white/40 mt-1">
            Rata-rata pelanggan yang bisa dilayani per menit
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label class="block text-sm font-medium text-white/80 mb-2">
            <span class="text-success-400">N</span> Jumlah Pelanggan
          </label>
          <input
            type="number"
            step="1"
            min="1"
            max="1000"
            value={formData.numCustomers}
            onInput={handleChange("numCustomers")}
            class={`input-field ${errors.numCustomers ? "border-danger-500" : ""}`}
          />
          {errors.numCustomers && (
            <p class="text-danger-400 text-xs mt-1">{errors.numCustomers}</p>
          )}
        </motion.div>

        <motion.div
          class="p-4 rounded-xl bg-dark-300/50 border border-white/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div class="flex justify-between items-center mb-2">
            <span class="flex items-center gap-2 text-sm text-white/60">
              <Gauge class="w-4 h-4" />
              Utilization (ρ = λ/μ)
            </span>
            <span class={`font-mono font-bold ${getUtilizationColor()}`}>
              {(utilization * 100).toFixed(1)}%
            </span>
          </div>
          <div class="w-full h-2 bg-dark-400 rounded-full overflow-hidden">
            <motion.div
              class={`h-full transition-colors duration-500 ${
                utilization >= 1
                  ? "bg-danger-500"
                  : utilization >= 0.8
                    ? "bg-warning-500"
                    : utilization >= 0.5
                      ? "bg-primary-500"
                      : "bg-success-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(utilization * 100, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p class={`text-xs mt-2 ${getUtilizationColor()}`}>
            {getUtilizationStatus()}
          </p>
        </motion.div>

        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              class="p-3 rounded-lg bg-danger-500/20 border border-danger-500/30 text-danger-400 text-sm flex items-center gap-2"
            >
              <AlertTriangle class="w-4 h-4" />
              {errors.general}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isLoading || utilization >= 1 || !formData.playerName}
          class="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <Loader2 class="w-5 h-5 animate-spin" />
              <span>Menjalankan Simulasi...</span>
            </>
          ) : (
            <>
              <Rocket class="w-5 h-5" />
              <span>Jalankan Simulasi</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
