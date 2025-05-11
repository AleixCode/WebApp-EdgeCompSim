// src/config/routes.tsx
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import { JSX } from 'react';
import Simulations from '../pages/Simulations';
import CreateSimulationPage from '../pages/CreateSimulationPage';


export interface RouteItem {
  path: string;
  element: JSX.Element;
  name: string;
  isNav: boolean;
  isAuth: boolean;
}

const routes: RouteItem[] = [
  {
    path: "/",
    element: <Home />,
    name: "Home",
    isNav: true,
    isAuth: false,
  },
  {
    path: "/about",
    element: <About />,
    name: "About",
    isNav: true,
    isAuth: false,
  },
  {
    path: "/contact",
    element: <Contact />,
    name: "Contact",
    isNav: true,
    isAuth: true, // for example, Contact requires authentication
  },
  {
    path: "/simulations",
    element: <Simulations />,
    name: "Simulations",
    isNav: true,
    isAuth: false,
  },
  {
    path: "/new",
    element: <CreateSimulationPage />,
    name: "Create Simulations",
    isNav: true,
    isAuth: false,
  },
  {
    path: "*",
    element: <NotFound />,
    name: "NotFound",
    isNav: false,
    isAuth: false,
  },
];

export default routes;
