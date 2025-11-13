import React, { useState, useCallback, useEffect } from 'react';
import { getAiSearchResults } from '../services/geminiService';
import { AiSearchResult, AiSiteSuggestion } from '../types';
import { BrowseBuxLogo } from './BrowseBuxLogo';

const isUrl = (text: string): boolean => {
    try {
        new URL(text);
        if (!text.startsWith('http://') && !text.startsWith('https://')) {
            if (/\.[a-z]{2,}/.test(text)) {
                 return true;
            }
            return false;
        }
        return true;
    } catch (_) {
        return /\.[a-z]{2,}/.test(text) && !text.includes(' ');
    }
};

const AdBanner: React.FC<{ className?: string; height?: number }> = ({ className = '', height = 50 }) => (
    <div className={`my-3 rounded-lg overflow-hidden ${className}`} style={{ height: `${height}px` }}>
        <iframe
            src="/ad.html"
            className="w-full h-full border-0"
            title="Advertisement"
            scrolling="no"
            sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
        ></iframe>
    </div>
);


const SiteCard: React.FC<{site: AiSiteSuggestion, onOpen: (url: string) => void}> = ({ site, onOpen }) => {
    const safetyColor = site.safety === 'Güvenli' ? 'text-green-500' : site.safety === 'Potensiyel Risk' ? 'text-red-500' : 'text-yellow-500';

    return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-3">
            <div className="flex items-center mb-2">
                <img src={`https://www.google.com/s2/favicons?domain=${site.url}&sz=32`} alt="favicon" className="w-6 h-6 mr-3 rounded" />
                <h3 className="font-bold text-black dark:text-white truncate">{site.title}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{site.summary}</p>
            <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold ${safetyColor}`}>{site.safety}</span>
                <button onClick={() => onOpen(`https://${site.url.replace(/^https?:\/\//, '')}`)} className="bg-gray-800 dark:bg-gray-200 text-white dark:text-black text-xs font-bold py-1 px-3 rounded-md hover:opacity-80 transition-opacity">
                    Aç
                </button>
            </div>
        </div>
    );
};


const BrowserTab: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [view, setView] = useState<'search' | 'ai_results' | 'webview'>('search');
    const [aiResult, setAiResult] = useState<AiSearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [isSiteLoading, setIsSiteLoading] = useState(false);

    const handleSearch = useCallback(async () => {
        if (!inputValue.trim()) return;

        if (isUrl(inputValue)) {
            const formattedUrl = inputValue.startsWith('http') ? inputValue : `https://${inputValue}`;
            setCurrentUrl(formattedUrl);
            setView('webview');
            setIsSiteLoading(true);
        } else {
            setLoading(true);
            setView('ai_results');
            const result = await getAiSearchResults(inputValue);
            setAiResult(result);
            setLoading(false);
        }
    }, [inputValue]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    
    const openSite = (url: string) => {
        setCurrentUrl(url);
        setView('webview');
        setIsSiteLoading(true);
    }
    
    useEffect(() => {
        if (isSiteLoading) {
            const timer = setTimeout(() => {
                setIsSiteLoading(false);
            }, 1500); // Simulate site loading for 1.5 seconds
            return () => clearTimeout(timer);
        }
    }, [isSiteLoading]);


    const renderContent = () => {
        switch (view) {
            case 'webview':
                return (
                    <div className="relative w-full h-full bg-gray-300 dark:bg-gray-700">
                        {isSiteLoading ? (
                             <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-black">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                                <p className="mt-4 text-gray-500 dark:text-gray-400">Site Loading...</p>
                            </div>
                        ) : (
                             <div className="w-full h-full flex flex-col">
                                <AdBanner className="border-b-2 border-gray-200 dark:border-gray-800 rounded-none my-0" height={80} />
                                <div className="flex-grow flex flex-row min-h-0">
                                    <div className="flex-grow bg-black">
                                        <iframe src={currentUrl} className="w-full h-full border-0" title="Sandbox Browser" sandbox="allow-scripts allow-same-origin"></iframe>
                                    </div>
                                </div>
                                <AdBanner className="border-t-2 border-gray-200 dark:border-gray-800 rounded-none my-0" height={80} />
                            </div>
                        )}
                    </div>
                );
            case 'ai_results':
                 if (loading) {
                    return <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                        <p className="mt-2">AI is thinking...</p>
                    </div>;
                }
                if (!aiResult) {
                    return <p className="p-4 text-center text-red-500">Failed to load AI results. Please try again.</p>;
                }
                return (
                    <div className="p-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                            <h2 className="text-sm font-bold text-black dark:text-white mb-2">AI Answer</h2>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{aiResult.summary}</p>
                        </div>
                        {aiResult.sites.map((site, index) => (
                             <React.Fragment key={site.url}>
                                <SiteCard site={site} onOpen={openSite} />
                                {(index === 1 || index === 3) && <AdBanner />}
                             </React.Fragment>
                        ))}
                    </div>
                );
            case 'search':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8">
                        <BrowseBuxLogo size="small" />
                        <h1 className="text-2xl font-bold text-black dark:text-white mt-4">BrowseBux</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Search the web or enter a URL</p>
                         <div className="absolute bottom-4 w-full px-4">
                             <AdBanner />
                         </div>
                    </div>
                );
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                 {view === 'webview' && (
                    <button onClick={() => { setView('search'); setInputValue(''); }} className="text-sm text-blue-600 dark:text-blue-400 mb-2 hover:underline">
                        &larr; Back to Search
                    </button>
                 )}
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search or type URL"
                        className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 outline-none"
                    />
                </div>
            </header>
            <div className="flex-grow overflow-y-auto relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default BrowserTab;