import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import "./Home.css";
import Layout from "../components/Layout";

const Home: React.FC = () => {
  return (
    <Layout title="Home">
      <IonContent className="home-content" fullscreen>
        <IonGrid className="home-grid">
          <IonRow className="ion-justify-content-center ion-align-items-center full-height">
            <IonCol offset="3" size="12" sizeMd="8" sizeLg="6">
              <IonCard className="home-card">
                <IonCardHeader>
                  <IonCardTitle>Welcome to the Simulation App!</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>
                    This is your hub for creating and reviewing simulations.
                    Whether you're initiating a new simulation run or checking
                    on past results, everything you need is here.
                  </p>
                  <IonButton
                    routerLink="/simulations/create"
                    expand="block"
                    className="home-btn"
                    style={{ marginTop: "20px" }}
                  >
                    Create New Simulation
                  </IonButton>
                  <IonButton
                    routerLink="/simulations"
                    expand="block"
                    color="secondary"
                    className="home-btn"
                    style={{ marginTop: "10px" }}
                  >
                    View Existing Simulations
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </Layout>
  );
};

export default Home;
