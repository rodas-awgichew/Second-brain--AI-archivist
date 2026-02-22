
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/app/welcome');

    } catch (err) {
      const error = err as { code?: string };
      if (error.code === 'auth/email-already-in-use') {
        setError("User already exists. Please sign in");
      } else {
        setError("Failed to create an account. Please try again.");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto bg-brand-white border border-brand-gray-dark rounded-medium p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-black uppercase text-center mb-2 text-brand-text">Create Archive</h1>
        <p className="text-center text-brand-text-light mb-8">Start your second brain.</p>

        {error && <p className="bg-red-100 border border-red-300 text-red-700 p-3 mb-4 text-sm rounded-soft">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-6">
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input id="confirm-password" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-brand-text-light">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-text underline hover:text-brand-black">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
