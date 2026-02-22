
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import HomeIcon from './icons/HomeIcon';
import UploadIcon from './icons/UploadIcon';
import ChatIcon from './icons/ChatIcon';
import LogoutIcon from './icons/LogoutIcon';
import LogIcon from './icons/LogIcon';

const navItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/app/log', label: 'Log', icon: LogIcon },
  { path: '/app/upload', label: 'Upload', icon: UploadIcon },
  { path: '/app/chat', label: 'Chat', icon: ChatIcon },
];

const Layout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

  return (
    <div className="flex h-screen bg-brand-gray font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-brand-white border-r border-brand-gray-dark">
        <div className="flex items-center justify-center h-20 border-b border-brand-gray-dark">
          <h1 className="text-xl font-black uppercase tracking-widest text-brand-text">ARCHIVIST</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 text-sm font-bold uppercase transition-colors duration-200 rounded-soft ${
                  isActive ? 'bg-brand-black text-brand-white' : 'text-brand-text hover:bg-brand-gray-light'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-brand-gray-dark">
            <button onClick={handleLogout} className="flex items-center w-full p-3 text-sm font-bold uppercase text-brand-text bg-brand-gray-light rounded-soft hover:bg-brand-gray-dark transition-colors duration-200">
                <LogoutIcon className="w-5 h-5 mr-3" />
                Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-white border-t border-brand-gray-dark flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-3 w-full text-xs font-bold transition-colors duration-200 ${
                isActive ? 'text-brand-black' : 'text-brand-text-light'
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="uppercase">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
