import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  ShoppingCart,
  Zap,
  CheckCircle,
  Hourglass,
} from "lucide-preact";
import type { SimulationData } from "../../stores/simulationStore";
import { getWaitStatus } from "./Status";

interface CustomerDetailProps {
  customer: SimulationData;
  isExpanded: boolean;
}

interface JourneyStepProps {
  icon: any;
  label: string;
  value: string;
  subValue: string;
  colorClass: string;
}

function JourneyStep({
  icon: Icon,
  label,
  value,
  subValue,
  colorClass,
}: JourneyStepProps) {
  return (
    <div className={`flex-1 text-center p-3 rounded-lg ${colorClass}`}>
      <div
        className={`text-xs mb-1 ${colorClass.replace("/10", "-400").replace("bg-", "text-")} flex items-center justify-center gap-1`}
      >
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="font-mono font-bold text-white">{value}</div>
      <div className="text-[10px] text-white/50">{subValue}</div>
    </div>
  );
}

export function CustomerDetail({ customer, isExpanded }: CustomerDetailProps) {
  const status = getWaitStatus(customer.timeInQueue);

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-4 space-y-4">
            <div className="flex items-center justify-between gap-2 text-sm">
              <JourneyStep
                icon={MapPin}
                label="Tiba Antri"
                value={customer.arrivalTimeFormatted}
                subValue={`(${customer.arrivalTime.toFixed(2)} min)`}
                colorClass="bg-primary-500/10"
              />

              <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />

              <div
                className={`flex-1 text-center p-3 rounded-lg bg-${status.color}-500/10`}
              >
                <div
                  className={`text-${status.color}-400 text-xs mb-1 flex items-center justify-center gap-1`}
                >
                  <Hourglass className="w-3 h-3" /> Waktu Tunggu
                </div>
                <div className="font-mono font-bold text-white">
                  {(customer.timeInQueue * 60).toFixed(1)}s
                </div>
                <div className="text-[10px] text-white/50">
                  ({customer.timeInQueue.toFixed(4)} min)
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />

              <JourneyStep
                icon={ShoppingCart}
                label="Dilayani"
                value={customer.beginServiceTimeFormatted}
                subValue={`(${customer.beginServiceTime.toFixed(2)} min)`}
                colorClass="bg-accent-500/10"
              />

              <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />

              <JourneyStep
                icon={Zap}
                label="Layanan"
                value={`${(customer.serviceTime * 60).toFixed(1)}s`}
                subValue={`(${customer.serviceTime.toFixed(4)} min)`}
                colorClass="bg-success-500/10"
              />

              <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />

              <JourneyStep
                icon={CheckCircle}
                label="Selesai"
                value={customer.departureTimeFormatted}
                subValue={`(${customer.departureTime.toFixed(2)} min)`}
                colorClass="bg-warning-500/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2 rounded-lg bg-dark-400/30">
                <span className="text-white/50">Random U1 (Arrival): </span>
                <span className="font-mono text-primary-300">
                  {customer.randomU1.toFixed(6)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-dark-400/30">
                <span className="text-white/50">Random U2 (Service): </span>
                <span className="font-mono text-accent-300">
                  {customer.randomU2.toFixed(6)}
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg bg-gradient-to-r from-${status.color}-500/10 to-${status.color}-500/5 border border-${status.color}-500/20`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">
                  Total Waktu di Sistem
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg text-white">
                    {(customer.timeInSystem * 60).toFixed(1)}s
                  </span>
                  <span className="text-white/50 text-xs">
                    ({customer.timeInSystem.toFixed(4)} min)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CustomerDetail;
