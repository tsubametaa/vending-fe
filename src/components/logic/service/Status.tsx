import { CheckCircle, AlertTriangle, XCircle } from "lucide-preact";
import type { SimulationData } from "../../stores/simulationStore";

export interface WaitStatus {
  color: string;
  label: string;
  icon: typeof CheckCircle;
}

export function getWaitStatus(timeInQueue: number): WaitStatus {
  if (timeInQueue < 1)
    return { color: "success", label: "Cepat", icon: CheckCircle };
  if (timeInQueue < 2)
    return { color: "warning", label: "Normal", icon: AlertTriangle };
  return { color: "danger", label: "Lama", icon: XCircle };
}

interface StatusBadgeProps {
  customer: SimulationData;
}

export function StatusBadge({ customer }: StatusBadgeProps) {
  const status = getWaitStatus(customer.timeInQueue);
  const StatusIcon = status.icon;

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-${status.color}-500/20 flex-shrink-0`}
    >
      <StatusIcon className={`w-3 h-3 text-${status.color}-400`} />
      <span className={`text-xs font-medium text-${status.color}-400`}>
        {status.label}
      </span>
    </div>
  );
}

export default StatusBadge;
