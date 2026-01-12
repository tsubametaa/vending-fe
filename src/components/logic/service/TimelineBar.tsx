import type { SimulationData } from "../../stores/simulationStore";
import { QueueTimeBar, ServiceTimeBar } from "./ServiceTime";

interface TimelineBarProps {
  customer: SimulationData;
  maxTime: number;
}

export function calculateTimelinePercentages(
  customer: SimulationData,
  maxTime: number
) {
  const arrivalPercent = (customer.arrivalTime / maxTime) * 100;
  const serviceStartPercent = (customer.beginServiceTime / maxTime) * 100;
  const departurePercent = (customer.departureTime / maxTime) * 100;

  const queueWidth = serviceStartPercent - arrivalPercent;
  const serviceWidth = departurePercent - serviceStartPercent;

  return {
    arrivalPercent,
    serviceStartPercent,
    departurePercent,
    queueWidth,
    serviceWidth,
  };
}

export function TimelineBar({ customer, maxTime }: TimelineBarProps) {
  const { arrivalPercent, serviceStartPercent, queueWidth, serviceWidth } =
    calculateTimelinePercentages(customer, maxTime);

  return (
    <div className="flex-1 min-w-0">
      <div className="h-6 bg-dark-400/50 rounded-full overflow-hidden relative">
        <QueueTimeBar
          customer={customer}
          arrivalPercent={arrivalPercent}
          queueWidth={queueWidth}
        />

        <ServiceTimeBar
          customer={customer}
          serviceStartPercent={serviceStartPercent}
          serviceWidth={serviceWidth}
        />
      </div>
    </div>
  );
}

export default TimelineBar;
