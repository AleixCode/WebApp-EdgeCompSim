import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonLoading,
} from "@ionic/react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [segment, setSegment] = useState<"logIn" | "signUp">("logIn");

  // SignUp states
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State for loading and error messages
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Redirect when authenticated.
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/simulations");
    }
  }, [auth.isAuthenticated, navigate]);

  // Clear error when switching segments.
  useEffect(() => {
    setErrorMessage("");
  }, [segment]);

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      await auth.signup(signUpName, signUpEmail, signUpPassword);
    } catch (err: any) {
      console.error("Signup failed", err);
      setErrorMessage(err?.message || "Signup failed. Please try again.");
    }
    setLoading(false);
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      await auth.login(loginEmail, loginPassword);
    } catch (err: any) {
      console.error("Login failed", err);
      setErrorMessage(
        err?.message || "Login failed. Please check your credentials."
      );
    }
    setLoading(false);
  };

  return (
    <Layout title="Login">
      <IonCard
        style={{
          width: "90%",
          maxWidth: "500px",
          margin: "50px auto",
          padding: "24px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value as "logIn" | "signUp")}
        >
          <IonSegmentButton value="logIn">
            <IonLabel>Login</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="signUp">
            <IonLabel>Sign Up</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segment === "logIn" ? (
          <form onSubmit={onLogin} style={{ marginTop: "16px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Login</h2>
            <IonItem lines="none" style={{ "--background": "transparent" }}>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={loginEmail}
                placeholder="Enter your email"
                onIonChange={(e) => setLoginEmail(e.detail.value || "")}
                required
              />
            </IonItem>
            <IonItem lines="none" style={{ "--background": "transparent" }}>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                type="password"
                value={loginPassword}
                placeholder="Enter your password"
                onIonChange={(e) => setLoginPassword(e.detail.value || "")}
                required
              />
            </IonItem>
            {errorMessage && (
              <IonText
                color="danger"
                style={{
                  marginTop: "8px",
                  display: "block",
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </IonText>
            )}
            <IonButton
              type="submit"
              expand="block"
              style={{ marginTop: "16px" }}
            >
              Login
            </IonButton>
          </form>
        ) : (
          <form onSubmit={onSignUp} style={{ marginTop: "16px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
              Sign Up
            </h2>
            <IonItem lines="none" style={{ "--background": "transparent" }}>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                value={signUpName}
                placeholder="Enter your name"
                onIonChange={(e) => setSignUpName(e.detail.value || "")}
                required
              />
            </IonItem>
            <IonItem lines="none" style={{ "--background": "transparent" }}>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={signUpEmail}
                placeholder="Enter your email"
                onIonChange={(e) => setSignUpEmail(e.detail.value || "")}
                required
              />
            </IonItem>
            <IonItem lines="none" style={{ "--background": "transparent" }}>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                type="password"
                value={signUpPassword}
                placeholder="Enter your password"
                onIonChange={(e) => setSignUpPassword(e.detail.value || "")}
                required
              />
            </IonItem>
            {errorMessage && (
              <IonText
                color="danger"
                style={{
                  marginTop: "8px",
                  display: "block",
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </IonText>
            )}
            <IonButton
              type="submit"
              expand="block"
              style={{ marginTop: "16px" }}
            >
              Sign Up
            </IonButton>
          </form>
        )}
      </IonCard>
      <IonLoading isOpen={loading} message="Please wait..." />
    </Layout>
  );
};

export default Login;
