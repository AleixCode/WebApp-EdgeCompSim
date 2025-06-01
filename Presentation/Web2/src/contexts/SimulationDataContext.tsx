// src/contexts/SimulationDataContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { SimulationData } from "../interfaces";
import { useAuth } from "./AuthContext";
import { getSimulation } from "../api/backendClient";

interface SimulationDataContextType {
  simulations: SimulationData[] | null;
  loading: boolean;
  refreshSimulations: () => Promise<void>;
}

export const SimulationDataContext =
  createContext<SimulationDataContextType | null>(null);

export function useSimulationData() {
  const context = useContext(SimulationDataContext);
  if (!context) {
    throw new Error(
      "useSimulationData must be used within a SimulationDataProvider"
    );
  }
  return context;
}

export const SimulationDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState<SimulationData[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Ref to hold latest simulations array for use inside interval
  const simulationsRef = useRef<SimulationData[] | null>(null);
  simulationsRef.current = simulations;

  // Fetch all simulations once (when user changes)
  const fetchSimulations = async () => {
    if (!user || !Array.isArray(user.simulationsId)) {
      setSimulations(null);
      return;
    }

    setLoading(true);
    try {
      const fetched = await Promise.all(
        user.simulationsId.map(async (simId) => {
          try {
            return await getSimulation(simId);
          } catch (error) {
            console.error("Failed to fetch simulation:", error);
            return null;
          }
        })
      );
      const data: SimulationData[] = fetched.filter(
        (sim): sim is SimulationData => sim !== null
      );
      setSimulations(data);
    } catch (error) {
      console.error("Failed to fetch simulations", error);
      setSimulations([]);
    } finally {
      setLoading(false);
    }
  };

  // On mount or when user changes, load all simulations
  useEffect(() => {
    fetchSimulations();
  }, [user]);

  // Every 1 minute, refresh only those simulations with status === "Running"
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const current = simulationsRef.current;
      if (!current || current.length === 0) {
        return;
      }

      // Find IDs of running simulations
      const runningSims = current.filter((sim) => sim.status === "Running");
      if (runningSims.length === 0) {
        return;
      }

      try {
        // Fetch updated data for each running simulation
        const updatedList = await Promise.all(
          runningSims.map(async (sim) => {
            try {
              return await getSimulation(sim.id);
            } catch (error) {
              console.error(`Failed to refresh simulation ${sim.id}:`, error);
              return sim; // fallback to old data
            }
          })
        );

        // Merge updatedList back into the original simulations array
        setSimulations((prev) => {
          if (!prev) return prev;
          // Build a map from id → updated simulation
          const updatedMap: Record<string, SimulationData> = {};
          updatedList.forEach((u) => {
            if (u) {
              updatedMap[u.id] = u;
            }
          });
          // Replace only the running ones
          return prev.map((sim) => updatedMap[sim.id] ?? sim);
        });
      } catch (err) {
        console.error("Error during periodic refresh:", err);
      }
    }, 1000 * 60 * 1); // 1 minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SimulationDataContext.Provider
      value={{
        simulations,
        loading,
        refreshSimulations: fetchSimulations,
      }}
    >
      {children}
    </SimulationDataContext.Provider>
  );
};
