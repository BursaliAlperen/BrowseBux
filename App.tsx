import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { User, Tab, View } from './types';
import LoginScreen from './components/LoginScreen';
import BrowserTab from './components/BrowserTab';
import BalanceTab from './components/BalanceTab';
import TasksTab from './components/TasksTab';
import ProfileTab from './components/ProfileTab';
import SettingsTab from './components/SettingsTab';
import BottomNav from './components/BottomNav';
import { UserContext } from './contexts/UserContext';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get, set, update } from 'firebase/database';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>(View.Browser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = ref(db, 'users/' + firebaseUser.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          // Create new user in the database according to v10 spec
          const newUser: User = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email || '',
            avatarUrl: firebaseUser.photoURL || 'https://picsum.photos/100',
            balanceRobux: 0,
            balanceUSD: 0,
            bonusPoints: 0,
            referralLink: `browbux.com/ref/${firebaseUser.uid.slice(0, 7)}`,
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
            totalEarned: 0,
            tasksCompleted: 0,
            activityTime: 0,
          };
          await set(userRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  // Activity earning timer
  useEffect(() => {
    if (!user) return;

    const EARNING_INTERVAL = 5 * 60 * 1000; // 5 minutes
    const ROBUX_PER_INTERVAL = 0.1;
    const USD_PER_INTERVAL = 0.01;
    const XP_PER_INTERVAL = 10; 

    const timer = setInterval(() => {
      // Fetch the latest user data to avoid stale state issues
      const userRef = ref(db, 'users/' + user.uid);
      get(userRef).then(snapshot => {
        if(snapshot.exists()) {
          const latestUser: User = snapshot.val();
          
          // Level multiplier: 1x at Lvl 1, 2x at Lvl 100
          const levelMultiplier = 1 + ((latestUser.level - 1) / 99); 
          const earnedRobux = ROBUX_PER_INTERVAL * levelMultiplier;
          const earnedUsd = USD_PER_INTERVAL * levelMultiplier;
          
          const updates: Partial<User> = {
            balanceRobux: (latestUser.balanceRobux || 0) + earnedRobux,
            balanceUSD: (latestUser.balanceUSD || 0) + earnedUsd,
            experience: (latestUser.experience || 0) + XP_PER_INTERVAL,
            activityTime: (latestUser.activityTime || 0) + 5,
          };

          update(userRef, updates).then(() => {
             // Optimistically update local state to reflect change immediately
             setUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
          });
        }
      });
    }, EARNING_INTERVAL);

    return () => clearInterval(timer);
  }, [user?.uid]);


  const handleLogout = useCallback(async () => {
    await signOut(auth);
    setCurrentView(View.Browser);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const userRef = ref(db, 'users/' + user.uid);

    let finalUpdates = { ...updates };
    let currentUserState = { ...user, ...updates };

    // Handle level-up logic
    if (typeof updates.experience === 'number') {
      while (currentUserState.experience >= currentUserState.experienceToNextLevel) {
        currentUserState.experience -= currentUserState.experienceToNextLevel;
        currentUserState.level += 1;
        currentUserState.experienceToNextLevel = Math.floor(currentUserState.experienceToNextLevel * 1.5);
      }
      finalUpdates = { ...finalUpdates, ...currentUserState };
    }

    await update(userRef, finalUpdates);
    setUser(prevUser => prevUser ? { ...prevUser, ...finalUpdates } : null);
  }, [user]);

  const userContextValue = useMemo(() => ({ user, updateUser, logout: handleLogout }), [user, updateUser, handleLogout]);

  const activeTab = useMemo(() => {
    if (Object.values(Tab).includes(currentView as Tab)) {
      return currentView as Tab;
    }
    // Handle settings sub-views if they exist
    return Tab.Browser;
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case View.Browser:
        return <BrowserTab />;
      case View.Balance:
        return <BalanceTab />;
      case View.Tasks:
        return <TasksTab />;
      case View.Profile:
        return <ProfileTab />;
      case View.Settings:
        return <SettingsTab />;
      default:
        return <BrowserTab />;
    }
  };

  if (isLoading) {
     return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <UserContext.Provider value={userContextValue}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-sm h-[800px] max-h-[90vh] bg-white dark:bg-black rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans">
          <main className="flex-grow overflow-y-auto">
            {renderView()}
          </main>
          <BottomNav activeTab={activeTab} setActiveTab={(tab) => setCurrentView(tab as View)} />
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;