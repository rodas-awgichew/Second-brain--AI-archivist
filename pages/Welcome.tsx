import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

const Welcome: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="w-full bg-brand-white text-brand-black min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-black uppercase tracking-tighter">
          Welcome, {currentUser?.displayName?.split(' ')[0] || 'Archivist'}
        </h1>
        <p className="text-xl text-brand-text max-w-2xl mx-auto">
          Your personal knowledge base is ready. Start by organizing your digital life and turning your information into insights.
        </p>
        <div className="flex justify-center">
          <Link to="/app/dashboard">
            <Button variant="inverted" size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="mt-24 text-center max-w-4xl">
        <h2 className="text-3xl font-bold uppercase mb-8">What You Can Do</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-brand-gray-light p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Archive Everything</h3>
            <p className="text-brand-text">Upload your documents, notes, and important files. Create a secure, centralized hub for all your information.</p>
          </div>
          <div className="bg-brand-gray-light p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Log Your Journey</h3>
            <p className="text-brand-text">See a chronological timeline of your archived knowledge. Track your progress and revisit past insights.</p>
          </div>
          <div className="bg-brand-gray-light p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Chat with Your Brain</h3>
            <p className="text-brand-text">Ask questions and get intelligent answers based on your own data. Your personal AI is here to help.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
