import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const ProfileTab: React.FC = () => {
    const { user, logout } = useContext(UserContext);

    const copyReferralLink = () => {
        if (user?.referralLink) {
            navigator.clipboard.writeText(user.referralLink);
            alert("Referral link copied!");
        }
    };

    if (!user) {
        return <div className="p-4 text-center">Loading user...</div>;
    }
    
    const xpPercentage = (user.experience / user.experienceToNextLevel) * 100;

    return (
        <div className="p-4 bg-white dark:bg-black text-black dark:text-white h-full overflow-y-auto">
            <div className="flex flex-col items-center pt-8">
                <img src={user.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full mb-4 border-4 border-gray-200 dark:border-gray-700" />
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>

            <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                 <div className="flex justify-between items-center mb-1">
                    <p className="font-bold">Level {user.level}</p>
                    <p className="text-xs text-gray-400">{user.experience} / {user.experienceToNextLevel} XP</p>
                 </div>
                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                </div>
            </div>
            
            <div className="mt-6">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">BrowBux Rewards</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center">
                    <p className="text-4xl font-bold text-yellow-500">{user.bonusPoints}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bonus Points</p>
                    <button className="mt-3 w-full bg-yellow-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
                        Convert Points
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Referrals</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Invite friends and earn rewards!</p>
                    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-2">
                        <input type="text" readOnly value={user.referralLink} className="bg-transparent flex-grow text-sm outline-none" />
                        <button onClick={copyReferralLink} className="bg-gray-800 text-white text-xs font-bold py-1 px-3 rounded-md ml-2">Copy</button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                 <button onClick={logout} className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileTab;