import React from "react";
import SimulationsCard from "../components/SimulationCard";
import Layout from "../components/Layout";
import { useSimulationData } from "../contexts/SimulationDataContext";

const Simulations = () => {
  const { simulations, loading, refreshSimulations } = useSimulationData();

  return (
    <Layout title="My simulations">
      <h1>Welcome to the Simulations Page</h1>

      {loading ? (
        <p>Loading simulations...</p>
      ) : !simulations || simulations.length === 0 ? (
        <p>No simulations found.</p>
      ) : (
        simulations.map((sim) => (
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
