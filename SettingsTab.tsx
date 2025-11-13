import React, { useState, useEffect } from 'react';
import AccountSettings from './settings/AccountSettings';
import Support from './settings/Support';
import PrivacyPolicy from './settings/PrivacyPolicy';
import About from './settings/About';

type SubView = 'main' | 'account' | 'support' | 'privacy' | 'about';

const SettingsTab: React.FC = () => {
    const [subView, setSubView] = useState<SubView>('main');
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const onBack = () => setSubView('main');

    const SettingRow: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="font-medium">{title}</span>
            {children}
        </div>
    );

    const NavRow: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-left">
            <span className="font-medium">{title}</span>
            <span className="text-gray-400">&rarr;</span>
        </button>
    );

    if (subView === 'account') return <AccountSettings onBack={onBack} />;
    if (subView === 'support') return <Support onBack={onBack} />;
    if (subView === 'privacy') return <PrivacyPolicy onBack={onBack} />;
    if (subView === 'about') return <About onBack={onBack} />;
    
    return (
        <div className="p-4 bg-white dark:bg-black text-black dark:text-white h-full">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Configure your app experience.</p>
            </header>

            <div className="space-y-4">
                 <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">General</h2>
                 <SettingRow title="Dark Mode">
                    <button onClick={toggleDarkMode} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                 </SettingRow>
                 <SettingRow title="Notifications">
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                         <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                 </SettingRow>

                 <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-6 px-2">Information</h2>
                 <NavRow title="About BrowseBux" onClick={() => setSubView('about')} />
                 <NavRow title="Account" onClick={() => setSubView('account')} />
                 <NavRow title="FAQ / Support" onClick={() => setSubView('support')} />
                 <NavRow title="Privacy Policy" onClick={() => setSubView('privacy')} />
                 
                 <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-6 px-2">Application</h2>
                 <div className="pt-2">
                     <a href="/browbux-v10.apk" download="browbux-v10.apk" className="block text-center w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                        Download APK
                    </a>
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Opens all in-app features.
                    </p>
                 </div>
            </div>
        </div>
    );
};

export default SettingsTab;
