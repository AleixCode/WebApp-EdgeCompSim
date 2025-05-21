import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Simulations from '../pages/Simulations';
import CreateSimulationPage from '../pages/CreateSimulationPage';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

export interface AppRoute {
  path: string;
  component: React.FC;
  name: string;
  isAuth: boolean;
  isNav: boolean;
}

const routes: AppRoute[] = [
  { path: '/home', component: Home,   name: 'Home',               isAuth: false, isNav: true },
  { path: '/about', component: About, name: 'About',              isAuth: false, isNav: true },
  { path: '/contact', component: Contact, name: 'Contact',        isAuth: true,  isNav: true },
  { path: '/simulations', component: Simulations, name: 'Simulations', isAuth: false, isNav: true },
  { path: '/simulations/create', component: CreateSimulationPage, name: 'Create Simulation', isAuth: false, isNav: true },
  { path: '/login', component: Login, name: 'Login',              isAuth: false, isNav: false },
  { path: '*', component: NotFound, name: '',                   isAuth: false, isNav: false },
];

export default routes;
