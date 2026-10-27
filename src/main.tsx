import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Global styles first so component stylesheets can override them.
import './styles/global.css';
import './components/common.css';
import './sections/sections.css';
import './pages/pages.css';
import App from './app/App';
import { captureUtm } from './lib/utm';

captureUtm();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
