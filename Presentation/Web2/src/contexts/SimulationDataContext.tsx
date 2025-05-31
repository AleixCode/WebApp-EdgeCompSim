import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { SimulationData } from "../interfaces"; // adjust import as needed
import { useAuth } from "./AuthContext"; // adjust path to your actual AuthContext
import { getSimulation } from "../api/backendClient";

interface SimulationDataContextType {
  simulations: SimulationData[] | null;
  loading: boolean;
  refreshSimulations: () => Promise<void>;
}

// ✅ Correct order: define the context before using it
const SimulationDataContext = createContext<SimulationDataContextType | null>(
  null
);

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

  const fetchSimulations = async () => {
    if (!user || !Array.isArray(user.simulationsId)) {
      setSimulations(null);
      return;
    }

    setLoading(true);
    try {
      const fetchedSimulations = await Promise.all(
        user.simulationsId.map(async (simId) => {
          try {
            return await getSimulation(simId);
          } catch (error) {
            console.error("Failed to fetch simulation:", error);
            return null;
          }
        })
      );
      const data = fetchedSimulations.filter((sim) => sim !== null);
      setSimulations(data);
    } catch (error) {
      console.error("Failed to fetch simulations", error);
      setSimulations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, [user]);

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
