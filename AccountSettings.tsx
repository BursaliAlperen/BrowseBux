
import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

interface AccountSettingsProps {
  onBack: () => void;
}

const InputField: React.FC<{ label: string; value: string; type?: string; disabled?: boolean }> = ({ label, value, type = 'text', disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <input 
            type={type} 
            defaultValue={value}
            disabled={disabled}
            className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm disabled:opacity-50"
        />
    </div>
);


const AccountSettings: React.FC<AccountSettingsProps> = ({ onBack }) => {
    const { user } = useContext(UserContext);

    return (
    <div className="p-4 bg-white dark:bg-black text-black dark:text-white h-full">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </header>
      
      <div className="space-y-6">
        <InputField label="Full Name" value={user?.name || ''} />
        <InputField label="Email Address" value={user?.email || ''} disabled />
        
        <div>
            <h2 className="text-xl font-bold mt-8 mb-4">Change Password</h2>
            <div className="space-y-4">
                <InputField label="Current Password" value="" type="password" />
                <InputField label="New Password" value="" type="password" />
                <InputField label="Confirm New Password" value="" type="password" />
            </div>
        </div>

        <div className="pt-4">
            <button className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
