import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import CreateSimulation from "../components/CreateSimulation";
import { useAuth } from "../contexts/AuthContext";
import type { CreateSimulationPayload } from "../interfaces";
import { createSimulation } from "../api/backendClient";

const CreateSimulationPage: React.FC = () => {
  const { updateUserData } = useAuth();
  const navigate = useNavigate();

  const handleCreate = async (data: CreateSimulationPayload) => {
    await createSimulation(data, updateUserData);
    navigate("/simulations");
  };

  return (
    <Layout title="Create Simulation">
      <CreateSimulation onCreate={handleCreate} />
    </Layout>
  );
};

export default CreateSimulationPage;
