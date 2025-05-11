import React from 'react';
import SimulationsCard from '../components/SimulationCard';

const Simulations = () => {
  return (
    <div>
      <h1>Welcome to the Simulations Page</h1>
      <p>This is the Simulations page of our React application.</p>
      <SimulationsCard
  title="EdgeSim #1"
  description="Simulation of edge devices under high load."
  status="pending"
/>

<SimulationsCard
  title="EdgeSim #2"
  description="Optimized simulation with 5 nodes."
  status="running"
/>

    </div>
  );
};

export default Simulations;
