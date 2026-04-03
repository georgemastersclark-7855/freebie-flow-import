import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preload the matching page chunk immediately (before React mounts)
const preloadMap: Record<string, () => Promise<unknown>> = {
  '/producer-blueprint': () => import('./pages/TheProducerBlueprint001'),
  '/build-your-music-catalog': () => import('./pages/TheProducerBlueprint002Spotify'),
  '/make-money-with-music': () => import('./pages/TheProducerBlueprint003Career'),
  '/produce-without-expensive-gear': () => import('./pages/TheProducerBlueprint004Gear'),
  '/finish-more-tracks': () => import('./pages/TheProducerBlueprint005Workflow'),
  '/links': () => import('./pages/LinkInBio'),
  '/mentorship': () => import('./pages/Mentorship'),
};
preloadMap[window.location.pathname]?.();

createRoot(document.getElementById("root")!).render(<App />);
