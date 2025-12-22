import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { App } from './App.tsx';
import { FilterProvider } from './utils/FilterContext.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <FilterProvider>
      <App />
    </FilterProvider>
  </Router>,
);