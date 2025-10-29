import React from 'react';
import type { View } from '../types';
import { UserIcon } from './icons';

const Logo: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-3 h-6 bg-cyan-400 rounded-sm"></div>
        <div className="w-3 h-6 bg-cyan-300 rounded-sm opacity-75"></div>
        <h1 className="text-2xl font-bold text-cyan-300 tracking-wider">Life OS</h1>
    </div>
)

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const inactiveButtonClass = "bg-transparent text-slate-300 hover:bg-slate-700/50";
  const dailyActiveButtonClass = "bg-cyan-500 text-white shadow-md shadow-cyan-500/20";
  const weeklyActiveButtonClass = "bg-indigo-500 text-white shadow-md shadow-indigo-500/20";
  
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Logo />
        <div className="flex items-center space-x-4">
            <div className="bg-slate-800 p-1 rounded-full">
            <button
                onClick={() => setActiveView('daily')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeView === 'daily' ? dailyActiveButtonClass : inactiveButtonClass}`}
            >
                Daily
            </button>
            <button
                onClick={() => setActiveView('weekly')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeView === 'weekly' ? weeklyActiveButtonClass : inactiveButtonClass}`}
            >
                Weekly
            </button>
            </div>
            <button 
                onClick={() => setActiveView('profile')} 
                title="View Profile" 
                className={`p-2 rounded-full transition-all duration-200 ${activeView === 'profile' ? 'bg-slate-700 text-cyan-300 ring-2 ring-cyan-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-cyan-300'}`}
            >
                <UserIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;