
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import Input from '../components/Input';
import Button from '../components/Button';
import GoogleIcon from '../components/icons/GoogleIcon';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate('/app/welcome');

    } catch (err) {
      const error = err as { code?: string };
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        setError("Email or password is incorrect");
      } else {
        setError("Failed to log in. Please try again.");
        console.error(err);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
        const provider = new GoogleAuthProvider();
        // For Google Sign-in, verification is assumed.
        await signInWithPopup(auth, provider);
        navigate('/app/welcome');
    } catch (err) {
      const error = err as { message?: string };
        setError(error.message || 'An unknown error occurred');
        console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto bg-brand-white border border-brand-gray-dark rounded-medium p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-black uppercase text-center mb-2 text-brand-text">Login</h1>
        <p className="text-center text-brand-text-light mb-8">Access your archive.</p>
        
        {error && <p className="bg-red-100 border border-red-300 text-red-700 p-3 mb-4 text-sm rounded-soft">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="primary" className="w-full">
            Login
          </Button>
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-gray-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-brand-white text-brand-text-light uppercase font-bold tracking-wider">Or</span>
            </div>
        </div>
        
        <Button variant="secondary" onClick={handleGoogleLogin} className="w-full">
          <GoogleIcon /> Login with Google
        </Button>

        <p className="text-center mt-8 text-sm text-brand-text-light">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-brand-text underline hover:text-brand-black">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
