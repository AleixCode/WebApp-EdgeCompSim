import React, { useEffect, useState } from "react";
import SimulationsCard from "../components/SimulationCard";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { getSimulation } from "../api/backendClient";
import { SimulationData } from "../interfaces";

const Simulations = () => {
  const auth = useAuth();
  const [simulations, setSimulations] = useState<SimulationData[]>([]);

  useEffect(() => {
    const fetchSimulations = async () => {
      if (!auth.user || !Array.isArray(auth.user.simulationsId)) return;

      const fetchedSimulations = await Promise.all(
        auth.user.simulationsId.map(async (simId) => {
          try {
            return await getSimulation(simId);
          } catch (error) {
            console.error("Failed to fetch simulation:", error);
            return null;
          }
        })
      );

      // Filter out any null values before updating state
      setSimulations(fetchedSimulations.filter((sim) => sim !== null));
    };

    fetchSimulations();
  }, [auth.user]);

  return (
    <Layout title="My simulations">
      <h1>Welcome to the Simulations Page</h1>
      {simulations.length === 0 ? (
        <p>No simulations found.</p>
      ) : (
        simulations.map((sim: SimulationData) => (
          <SimulationsCard
            key={sim.id}
            title={sim.name}
            status={sim.status}
            simulationId={sim.id}
            simulation={sim}
          />
        ))
      )}
    </Layout>
  );
};

export default Simulations;
