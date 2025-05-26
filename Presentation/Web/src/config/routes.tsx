// src/config/routes.tsx
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Simulations from '../pages/Simulations';
import CreateSimulationPage from '../pages/CreateSimulationPage';


export interface RouteItem {
  path: string;
  component: React.ComponentType;
  name: string;
  isNav: boolean;
  isAuth: boolean;
}


const routes: RouteItem[] = [
  {
    path: "/",
    component: Home,
    name: "Home",
    isNav: true,
    isAuth: false,
  },
  {
    path: "/about",
    component: About,
    name: "About",
    isNav: true,
    isAuth: false,
  },
  {
    path: "/contact",
    component: Contact,
    name: "Contact",
    isNav: true,
    isAuth: false, // for example, Contact requires authentication
  },
  {
    path: "/simulations",
    component: Simulations,
    name: "Simulations",
    isNav: true,
    isAuth: false,
  },
  {
    path: "/new",
    component: CreateSimulationPage,
    name: "Create Simulations",
    isNav: true,
    isAuth: false,
  },
];


export default routes;
