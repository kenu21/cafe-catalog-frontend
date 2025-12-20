import { Routes, Route } from 'react-router-dom';
import './App.scss';

import { HomePage } from './pages/HomePage/HomePage';
import { CatalogPage } from './pages/CatalogPage/CatalogPage';
import { CafePage } from './pages/CafePage/CafePage'; 
import { ScrollToTop } from './utils/ScrollToTop';

export const App = () => {
  return (
    <div className='App'>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<CatalogPage />} />
        <Route path="/filter" element={<CatalogPage />} />
        <Route path="/cafe/:id" element={<CafePage />} /> 
      </Routes>
    </div>
  );
};