import { Routes, Route } from 'react-router-dom';
import './App.scss';

import { HomePage } from './pages/HomePage/HomePage';
import { CatalogPage } from './pages/CatalogPage/CatalogPage';

export const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<CatalogPage />} />
        <Route path="/filter" element={<CatalogPage />} />
      </Routes>
    </div>
  );
};