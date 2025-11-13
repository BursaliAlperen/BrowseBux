import React, { useContext, useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Withdrawal, WithdrawalStatus } from '../types';
import { UserContext } from '../contexts/UserContext';
import { db } from '../firebaseConfig';
import { ref, push, onValue, update } from 'firebase/database';

const weeklyData = [
  { name: 'Mon', earnings: 15 }, { name: 'Tue', earnings: 22 }, { name: 'Wed', earnings: 18 },
  { name: 'Thu', earnings: 25 }, { name: 'Fri', earnings: 30 }, { name: 'Sat', earnings: 45 },
  { name: 'Sun', earnings: 40 },
];

const StatusBadge: React.FC<{ status: WithdrawalStatus }> = ({ status }) => {
    const statusClasses = useMemo(() => {
        switch (status) {
            case WithdrawalStatus.Approved: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case WithdrawalStatus.Pending: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case WithdrawalStatus.Rejected: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }, [status]);
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses}`}>{status}</span>;
};

const WithdrawalSection: React.FC = () => {
    const { user, updateUser } = useContext(UserContext);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [amount, setAmount] = useState(50);
    const [gamepassLink, setGamepassLink] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feeAccepted, setFeeAccepted] = useState(false);

    useEffect(() => {
      if (!user) return;
      const withdrawalsRef = ref(db, `withdrawals/${user.uid}`);
      const unsubscribe = onValue(withdrawalsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedWithdrawals: Withdrawal[] = Object.entries(data || {}).map(([key, value]) => ({ id: key, ...(value as Omit<Withdrawal, 'id'>) }));
        setWithdrawals(loadedWithdrawals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
      return () => unsubscribe();
    }, [user]);

    const withdrawalFee = useMemo(() => amount * 0.4, [amount]);
    const netAmount = useMemo(() => amount - withdrawalFee, [amount, withdrawalFee]);

    const isRequestDisabled = useMemo(() => {
        if (amount < 50 || !gamepassLink || !user || user.balanceRobux < amount) return true;
        try {
            const url = new URL(gamepassLink);
            return !(url.hostname.includes('roblox.com') && url.pathname.includes('/game-pass/'));
        } catch (_) {
            return true;
        }
    }, [amount, gamepassLink, user]);

    const handleConfirmWithdrawal = async () => {
      if (!user) return;
      await updateUser({ balanceRobux: user.balanceRobux - amount });
      const newWithdrawalRequest = {
          date: new Date().toISOString().split('T')[0],
          amount, fee: withdrawalFee, status: WithdrawalStatus.Pending, gamepassLink,
      };
      await push(ref(db, `withdrawals/${user.uid}`), newWithdrawalRequest);
      setIsModalOpen(false); setFeeAccepted(false); setAmount(50); setGamepassLink('');
    };
    
    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mt-6">
            <h2 className="text-lg font-bold mb-2">New Withdrawal Request</h2>
            <div className="space-y-3">
                <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Amount (Minimum: 50)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(Math.max(50, parseInt(e.target.value) || 0))} className="w-full bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-lg font-bold text-center" min="50" />
                </div>
                <div>
                     <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Roblox Gamepass Link</label>
                     <input type="url" placeholder="https://www.roblox.com/game-pass/..." value={gamepassLink} onChange={(e) => setGamepassLink(e.target.value)} className="w-full bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm" />
                </div>
            </div>
            <div className="text-sm mt-3 space-y-1 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between"><span>Çekim Ücreti (40%):</span> <span>{withdrawalFee.toFixed(2)} R$</span></div>
                <div className="flex justify-between font-bold"><span>You will receive:</span> <span>{netAmount.toFixed(2)} R$</span></div>
            </div>
            <button onClick={() => setIsModalOpen(true)} disabled={isRequestDisabled} className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg mt-4 hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                Request Withdrawal
            </button>
            
            <div className="mt-4">
                <h3 className="text-md font-bold mb-2">History</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {withdrawals.length === 0 && <p className="text-xs text-gray-400">No withdrawal history.</p>}
                    {withdrawals.map(w => (
                        <div key={w.id} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-xs">
                            <div className="flex justify-between items-center">
                                <div><p className="font-bold">{w.amount.toFixed(2)} R$</p><p className="text-gray-500 dark:text-gray-400">{w.date}</p></div>
                                <StatusBadge status={w.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-2">Confirm Withdrawal</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">You are about to withdraw <span className="font-bold">{amount} R$</span>. After a 40% fee, you will receive <span className="font-bold">{netAmount.toFixed(2)} R$</span>. This will be deducted now.</p>
                        <div className="flex items-start mb-4">
                            <input type="checkbox" id="fee-accept" checked={feeAccepted} onChange={() => setFeeAccepted(!feeAccepted)} className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-700" />
                            <label htmlFor="fee-accept" className="ml-2 block text-sm text-gray-700 dark:text-gray-400">I understand and accept the 40% withdrawal fee (Roblox fee).</label>
                        </div>
                        <div className="flex space-x-3">
                             <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-200 dark:bg-gray-600 text-black dark:text-white font-bold py-2 rounded-lg">Cancel</button>
                            <button onClick={handleConfirmWithdrawal} disabled={!feeAccepted} className="w-full bg-gray-800 text-white font-bold py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const BalanceTab: React.FC = () => {
    const { user } = useContext(UserContext);
    const [showWithdrawals, setShowWithdrawals] = useState(false);
    const xpPercentage = user ? (user.experience / user.experienceToNextLevel) * 100 : 0;

    return (
        <div className="p-4 bg-white dark:bg-black text-black dark:text-white h-full overflow-y-auto">
            <header className="mb-4">
                <h1 className="text-3xl font-bold">Balance</h1>
                <p className="text-gray-500 dark:text-gray-400">Your earnings and activity overview.</p>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
                    <p className="text-sm text-blue-200">Robux Balance</p>
                    <p className="text-2xl font-bold tracking-tight mt-1">{user?.balanceRobux.toFixed(2)} R$</p>
                </div>
                 <div className="bg-green-600 text-white p-4 rounded-2xl shadow-lg">
                    <p className="text-sm text-green-200">USD Balance</p>
                    <p className="text-2xl font-bold tracking-tight mt-1">${user?.balanceUSD.toFixed(2)}</p>
                </div>
            </div>
            
             <div className="bg-yellow-500 text-white p-4 rounded-2xl shadow-lg mb-4">
                <p className="text-sm text-yellow-200">BrowBux Rewards Points</p>
                <p className="text-3xl font-bold tracking-tight mt-1">{user?.bonusPoints || 0}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
                 <div className="flex justify-between items-center mb-1">
                    <p className="font-bold">Level {user?.level}</p>
                    <p className="text-xs text-gray-400">{user?.experience} / {user?.experienceToNextLevel} XP</p>
                 </div>
                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                </div>
            </div>

            <button onClick={() => setShowWithdrawals(!showWithdrawals)} className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                {showWithdrawals ? 'Hide Withdrawals' : 'Robux Withdrawal'}
            </button>
            
            {showWithdrawals && <WithdrawalSection />}

            <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">Weekly Earnings (Robux)</h2>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: '#1F2937', border: 'none', borderRadius: '8px', color: 'white' }} cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} />
                            <Bar dataKey="earnings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default BalanceTab;