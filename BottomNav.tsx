import React from 'react';
import { Tab } from '../types';
import { BrowserIcon } from './icons/BrowserIcon';
import { WalletIcon } from './icons/WalletIcon';
import { TasksIcon } from './icons/TasksIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const activeClasses = 'text-black dark:text-white';
    const inactiveClasses = 'text-gray-400 dark:text-gray-500';

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-1/5 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span className={`text-xs mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </button>
    );
};


const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full h-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center px-1">
        <NavItem 
            icon={<BrowserIcon className="w-6 h-6" />}
            label="Browser"
            isActive={activeTab === Tab.Browser}
            onClick={() => setActiveTab(Tab.Browser)}
        />
        <NavItem 
            icon={<WalletIcon className="w-6 h-6" />}
            label="Balance"
            isActive={activeTab === Tab.Balance}
            onClick={() => setActiveTab(Tab.Balance)}
        />
        <NavItem 
            icon={<TasksIcon className="w-6 h-6" />}
            label="Tasks"
            isActive={activeTab === Tab.Tasks}
            onClick={() => setActiveTab(Tab.Tasks)}
        />
        <NavItem 
            icon={<ProfileIcon className="w-6 h-6" />}
            label="Profile"
            isActive={activeTab === Tab.Profile}
            onClick={() => setActiveTab(Tab.Profile)}
        />
         <NavItem 
            icon={<SettingsIcon className="w-6 h-6" />}
            label="Settings"
            isActive={activeTab === Tab.Settings}
            onClick={() => setActiveTab(Tab.Settings)}
        />
    </div>
  );
};

export default BottomNav;