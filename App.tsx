import Overlay from './pages/Overlay';
import ControlPanel from './pages/ControlPanel';

export default function App() {
  const path = window.location.pathname;
  if (path === '/overlay') return <Overlay />;
  return <ControlPanel />;
}
