import { ShoppingCart, Hourglass } from "lucide-preact";
import type { SimulationData } from "../../stores/simulationStore";

interface ServiceTimeBarProps {
  customer: SimulationData;
  serviceStartPercent: number;
  serviceWidth: number;
}

export function ServiceTimeBar({
  customer,
  serviceStartPercent,
  serviceWidth,
}: ServiceTimeBarProps) {
  return (
    <div
      className="absolute top-0 h-full bg-gradient-to-r from-emerald-500/80 to-emerald-400/80 flex items-center justify-center"
      style={{
        left: `${serviceStartPercent}%`,
        width: `${Math.max(serviceWidth, 0.5)}%`,
      }}
    >
      {serviceWidth > 8 && (
        <span className="text-[10px] text-white font-medium px-1 truncate flex items-center gap-1">
          <ShoppingCart className="w-3 h-3" />{" "}
          {(customer.serviceTime * 60).toFixed(0)}s
        </span>
      )}
    </div>
  );
}

interface QueueTimeBarProps {
  customer: SimulationData;
  arrivalPercent: number;
  queueWidth: number;
}

export function QueueTimeBar({
  customer,
  arrivalPercent,
  queueWidth,
}: QueueTimeBarProps) {
  return (
    <div
      className="absolute top-0 h-full bg-gradient-to-r from-amber-500/60 to-amber-400/60 flex items-center justify-center"
      style={{
        left: `${arrivalPercent}%`,
        width: `${Math.max(queueWidth, 0.5)}%`,
      }}
    >
      {queueWidth > 8 && (
        <span className="text-[10px] text-white font-medium px-1 truncate flex items-center gap-1">
          <Hourglass className="w-3 h-3" />{" "}
          {(customer.timeInQueue * 60).toFixed(0)}s
        </span>
      )}
    </div>
  );
}

export default ServiceTimeBar;
