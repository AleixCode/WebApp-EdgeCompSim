// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Layout from './components/Layout';
import routes from './config/routes';
import Header from './components/Header';

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
        <Nav collapsed={collapsed} setCollapsed={setCollapsed} />
        <Header/>
        <Layout collapsed={collapsed}>
          <Routes>
            {routes.map((route, index) =>
              route.element ? (
                <Route key={index} path={route.path} element={route.element} />
              ) : null
            )}
          </Routes>
        </Layout>
    </Router>
  );
};

export default App;
