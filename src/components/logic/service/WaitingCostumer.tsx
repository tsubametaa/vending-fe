import type { SimulationData } from "../../stores/simulationStore";

export interface WaitingCustomerStats {
  avgQueue: number;
  maxQueue: number;
  minQueue: number;
  avgService: number;
  longestWaitCustomer: SimulationData;
  shortestWaitCustomer: SimulationData;
}

export function findLongestWaitCustomer(
  data: SimulationData[]
): SimulationData {
  return data.reduce((max, d) => (d.timeInQueue > max.timeInQueue ? d : max));
}

export function findShortestWaitCustomer(
  data: SimulationData[]
): SimulationData {
  return data.reduce((min, d) => (d.timeInQueue < min.timeInQueue ? d : min));
}

export function calculateWaitingStats(
  data: SimulationData[]
): WaitingCustomerStats {
  const avgQueue =
    data.reduce((sum, d) => sum + d.timeInQueue, 0) / data.length;
  const maxQueue = Math.max(...data.map((d) => d.timeInQueue));
  const minQueue = Math.min(...data.map((d) => d.timeInQueue));
  const avgService =
    data.reduce((sum, d) => sum + d.serviceTime, 0) / data.length;

  const longestWaitCustomer = findLongestWaitCustomer(data);
  const shortestWaitCustomer = findShortestWaitCustomer(data);

  return {
    avgQueue,
    maxQueue,
    minQueue,
    avgService,
    longestWaitCustomer,
    shortestWaitCustomer,
  };
}

export default calculateWaitingStats;
