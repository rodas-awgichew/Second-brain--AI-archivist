
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-gray flex flex-col items-center justify-center p-8 text-center font-sans">
      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-brand-black mb-4">
          Your Personal AI Archivist
        </h1>
        <p className="text-lg md:text-xl text-brand-black max-w-2xl mx-auto mb-10">
          Capture everything. Forget nothing. Unleash your knowledge with a 'Second Brain' powered by AI.
        </p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/signup')}
          className="text-lg px-10 py-4"
        >
          Get Started
        </Button>
      </div>
      <footer className="absolute bottom-8 text-center text-sm text-brand-black uppercase font-bold tracking-wider">
        Built with Brutalist-Minimalism
      </footer>
    </div>
  );
};

export default Landing;
