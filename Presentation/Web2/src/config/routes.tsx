import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Simulations from "../pages/Simulations";
import CreateSimulationPage from "../pages/CreateSimulationPage";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

export interface AppRoute {
  path: string;
  component: React.FC;
  name: string;
  isAuth: boolean;
  isAuthNav: boolean;
  isNoAuthNav: boolean;
}

const routes: AppRoute[] = [
  {
    path: "/home",
    component: Home,
    name: "Home",
    isAuth: false,
    isAuthNav: true,
    isNoAuthNav: true,
  },
  {
    path: "/about",
    component: About,
    name: "About",
    isAuth: false,
    isAuthNav: true,
    isNoAuthNav: true,
  },
  {
    path: "/contact",
    component: Contact,
    name: "Contact",
    isAuth: false,
    isAuthNav: true,
    isNoAuthNav: true,
  },
  {
    path: "/simulations",
    component: Simulations,
    name: "Simulations",
    isAuth: true,
    isAuthNav: true,
    isNoAuthNav: false,
  },
  {
    path: "/simulations/create",
    component: CreateSimulationPage,
    name: "Create Simulation",
    isAuth: true,
    isAuthNav: true,
    isNoAuthNav: false,
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
    isAuth: false,
    isAuthNav: false,
    isNoAuthNav: true,
  },
  {
    path: "*",
    component: NotFound,
    name: "",
    isAuth: false,
    isAuthNav: false,
    isNoAuthNav: false,
  },
];

export default routes;
