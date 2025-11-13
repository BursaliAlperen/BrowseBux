
import React from 'react';

interface SupportProps {
  onBack: () => void;
}

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
    <details className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer">
        <summary className="font-semibold">{question}</summary>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{answer}</p>
    </details>
);

const Support: React.FC<SupportProps> = ({ onBack }) => {
  return (
    <div className="p-4 bg-white dark:bg-black text-black dark:text-white h-full">
       <header className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        <h1 className="text-3xl font-bold">Support</h1>
      </header>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        <FaqItem 
            question="How do I earn Robux?" 
            answer="You earn Robux by actively using the browser, allowing banner ads to be displayed, and completing special tasks that may become available."
        />
        <FaqItem 
            question="How does the withdrawal process work?" 
            answer="Once you reach the minimum of 50 Robux, you can request a withdrawal. We process payments via Roblox Gamepasses. A 40% fee is deducted to cover Roblox's platform fees."
        />
        <FaqItem 
            question="Is BrowseBux safe to use?" 
            answer="Yes! We use a sandboxed browser to protect you from malicious sites, and our AI-powered search provides safety ratings to help you navigate the web securely."
        />
      </div>

      <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Need more help?</h2>
            <button className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Contact Support
            </button>
      </div>
    </div>
  );
};

export default Support;
