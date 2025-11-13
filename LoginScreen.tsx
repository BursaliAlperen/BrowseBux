import React, { useState, useEffect } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { BrowseBuxLogo } from './BrowseBuxLogo';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = Date.now();

    const animateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [end, duration]);

  return count;
};

const formatStat = (num: number, plus: boolean = true) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M${plus ? '+' : ''}`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K${plus ? '+' : ''}`;
    return num.toLocaleString();
};


const StatItem: React.FC<{ value: number; label: string }> = ({ value, label }) => {
    const animatedValue = useCountUp(value);
    return (
        <div className="text-center">
            <p className="text-2xl font-bold text-black dark:text-white">{formatStat(animatedValue)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
    );
};


const LoginScreen: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged in App.tsx will handle the rest
    } catch (error: any) {
      console.error("Error during Google sign-in:", error);
      if (error.code === 'auth/unauthorized-domain') {
          alert(
              "Sign-in failed: This domain is not authorized for authentication.\n\n" +
              "Developer Note: Please add this domain to the Firebase console under 'Authentication > Sign-in method > Authorized domains'."
          );
      } else {
          alert("Failed to sign in with Google. Please try again.");
      }
    }
  };
  
  const handleInstallClick = () => {
    if (!installPrompt) {
      alert("Uygulama tarayıcı menüsünden yüklenebilir (Ana Ekrana Ekle).");
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm h-[800px] max-h-[90vh] bg-white dark:bg-black rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-center items-center p-8 text-center">
        <BrowseBuxLogo size="large" />
        <h1 className="text-4xl font-bold text-black dark:text-white mt-4">BrowseBux</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
            Secure, Fast, AI-Powered, Rewarded Browser
        </p>

        <div className="w-full my-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
             <div className="flex items-center justify-center mb-4">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                 </span>
                 <p className="ml-2 text-sm font-semibold text-green-500">Live System Stats</p>
            </div>
            <div className="flex justify-around w-full">
                <StatItem value={12456} label="Total Users" />
                <StatItem value={5890123} label="Robux Earned" />
                <StatItem value={891} label="Users Online" />
            </div>
        </div>
        
        <div className="w-full space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-gray-800 text-white font-semibold py-4 px-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-700 transition-colors duration-300"
            >
              <GoogleIcon className="w-6 h-6" />
              <span>Google ile Giriş</span>
            </button>

            <button
              onClick={handleInstallClick}
              className="w-full bg-transparent border border-gray-700 dark:border-gray-300 text-gray-700 dark:text-gray-300 font-semibold py-4 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Uygulamayı Yükle
            </button>
            <p className="text-xs text-gray-400">
              İndirilemez, uygulama içi özellikleri/tam modülü açar.
            </p>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;