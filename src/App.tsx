import './App.scss';

// import { CafeCard } from './components/CafeCard/CafeCard.tsx';
import { CafeSection } from './components/CafeSection/CafeSection.tsx';
import { Footer } from './components/Footer/Footer.tsx';
import { Header } from './components/Header/Header.tsx';
import { Hero } from './components/Hero/Hero.tsx';
import { bestOffers, chosenForYou, newAndNoteworthy } from './utils/mockData.ts';

export const App = () => {
  return (
    <div className='App'>
      <Header />
      <div className='container'>
        <Hero />

        <CafeSection 
          title='Our best offers'
          cafes={bestOffers}
        />
        <CafeSection 
          title='Cafés chosen for you'
          cafes={chosenForYou}
        />
        <CafeSection 
          title='New and noteworthy'
          cafes={newAndNoteworthy}
        />

      </div>
      <Footer />
    </div>
  );
};
