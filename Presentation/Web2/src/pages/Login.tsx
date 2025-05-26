import React, { useState } from "react";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";

const Login: React.FC = () => {
  const auth = useAuth();
  const [segment, setSegment] = useState<"logIn" | "signUp">("logIn");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const onSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    auth.signUp({ name: signUpName, email: signUpEmail, password: signUpPassword });
  };

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    auth.login({ email: loginEmail, password: loginPassword });
  };

  return (
    <Layout title="Login">
      <IonCard>
        <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as "logIn" | "signUp")}>
          <IonSegmentButton value="logIn">
            <IonLabel>Login</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="signUp">
            <IonLabel>Sign Up</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segment === "logIn" ? (
          <form onSubmit={onLogin}>
            <h2>Login</h2>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={loginEmail}
                placeholder="Enter your email"
                onIonChange={(e) => setLoginEmail(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput type="password" value={loginPassword} onIonChange={(e) => setLoginPassword(e.detail.value!)} />
            </IonItem>
            <IonButton type="submit" expand="block" style={{ marginTop: "16px" }}>
              Login
            </IonButton>
          </form>
        ) : (
          <form onSubmit={onSignUp} style={{ marginTop: "32px" }}>
            <h2>Sign Up</h2>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput value={signUpName} onIonChange={(e) => setSignUpName(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput value={signUpEmail} onIonChange={(e) => setSignUpEmail(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput type="password" value={signUpPassword} onIonChange={(e) => setSignUpPassword(e.detail.value!)} />
            </IonItem>
            <IonButton type="submit" expand="block" style={{ marginTop: "16px" }}>
              Sign Up
            </IonButton>
          </form>
        )}
      </IonCard>
    </Layout>
  );
};

export default Login;
