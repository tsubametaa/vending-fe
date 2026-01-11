export interface SimulationData {
  customerNumber: number;
  randomU1: number;
  interarrivalTime: number;
  randomU2: number;
  serviceTimeX2: number;
  arrivalTime: number;
  arrivalTimeFormatted: string;
  beginServiceTime: number;
  beginServiceTimeFormatted: string;
  serviceTime: number;
  departureTime: number;
  departureTimeFormatted: string;
  timeInQueue: number;
  timeInSystem: number;
}

export interface SimulationStatistics {
  averageQueueLength: any;
  averageWaitingTime: any;
  avgInterarrivalTime: number;
  avgServiceTime: number;
  avgTimeInQueue: number;
  avgTimeInQueueMinutes: number;
  avgTimeInQueueSeconds: number;
  avgTimeInSystem: number;
  avgTimeInSystemMinutes: number;
  avgTimeInSystemSeconds: number;
  maxTimeInQueue: number;
  maxTimeInSystem: number;
  totalSimulationTime: number;
}

export interface Badge {
  name: string;
  emoji: string;
  description: string;
  minTime: number;
  maxTime: number;
}

export interface SimulationParameters {
  lambda: number;
  mu: number;
  numCustomers: number;
  utilization: number;
  seed1?: number;
  seed2?: number;
}

export interface TheoreticalValues {
  avgQueueTime: number;
  avgSystemTime: number;
  avgQueueLength: number;
  avgSystemLength: number;
}

export interface SimulationResult {
  parameters: SimulationParameters;
  simulationData: SimulationData[];
  statistics: SimulationStatistics;
  theoretical: TheoreticalValues;
  score: number;
  badge: Badge;
  timestamp: string;
}

export interface SimulationState {
  results: SimulationResult | null;
  isLoading: boolean;
  isSimulating: boolean;
  error: string | null;
  currentCustomerIndex: number;
  selectedPreset: string | null;
}

type Subscriber = (state: SimulationState) => void;
const subscribers: Subscriber[] = [];

let state: SimulationState = {
  results: null,
  isLoading: false,
  isSimulating: false,
  error: null,
  currentCustomerIndex: 0,
  selectedPreset: null
};

function notify() {
  subscribers.forEach(callback => callback({ ...state }));
}

export const simulationStore = {
  getState: (): SimulationState => ({ ...state }),

  subscribe: (callback: Subscriber): (() => void) => {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  },

  setResults: (results: SimulationResult | null) => {
    state = { ...state, results, currentCustomerIndex: 0 };
    notify();
  },
  setLoading: (isLoading: boolean) => {
    state = { ...state, isLoading };
    notify();
  },
  setIsSimulating: (isSimulating: boolean) => {
    state = { ...state, isSimulating };
    notify();
  },

  setError: (error: string | null) => {
    state = { ...state, error };
    notify();
  },

  setCurrentCustomerIndex: (index: number) => {
    state = { ...state, currentCustomerIndex: index };
    notify();
  },

  incrementCustomerIndex: () => {
    if (state.results && state.currentCustomerIndex < state.results.simulationData.length - 1) {
      state = { ...state, currentCustomerIndex: state.currentCustomerIndex + 1 };
      notify();
    } else {
      state = { ...state, isSimulating: false };
      notify();
    }
  },

  setSelectedPreset: (preset: string | null) => {
    state = { ...state, selectedPreset: preset };
    notify();
  },

  reset: () => {
    state = {
      results: null,
      isLoading: false,
      isSimulating: false,
      error: null,
      currentCustomerIndex: 0,
      selectedPreset: null
    };
    notify();
  }
};
