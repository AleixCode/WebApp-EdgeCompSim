import React, { useState } from 'react';
import { IonButton, IonItem, IonLabel, IonInput } from '@ionic/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Login: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    auth.login();
    navigate('/home');
  };

  return (
    <Layout title="Login">
      <form >
        <IonItem>
          <IonLabel position="floating">Username</IonLabel>
          <IonInput value={username} onIonChange={e => setUsername(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
        </IonItem>
        <IonButton type="submit" expand="block" style={{ marginTop: '16px' }}>
          Login
        </IonButton>
      </form>
    </Layout>
  );
};

<div class="container" id="container">
	<div class="form-container sign-up-container">
		<form onSubmit={handleSingUp}>
			<h1>Create Account</h1>
			<input type="text" placeholder="Name" />
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
			<button>Sign Up</button>
		</form>
	</div>
	<div class="form-container sign-in-container">
		<form onSubmit={handleLogin}>
			<h1>Sign in</h1>
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
			<a href="#">Forgot your password?</a>
			<button>Sign In</button>
		</form>
	</div>
</div>

export default Login;
