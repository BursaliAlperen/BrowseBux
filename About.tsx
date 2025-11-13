import React from 'react';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="p-4 bg-white dark:bg-black text-black dark:text-white h-full overflow-y-auto">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        <h1 className="text-3xl font-bold">About BrowseBux</h1>
      </header>
      
      <div className="text-gray-700 dark:text-gray-300 space-y-4">
        <p className="text-md">
          BrowseBux is not just a browser; it's a revolutionary platform designed for the modern web user. Our mission is to create a faster, safer, and more rewarding internet experience for everyone.
        </p>
        
        <h2 className="text-xl font-bold pt-4">Our Vision</h2>
        <p>
          We believe that your time and attention are valuable. That's why we've built a system that rewards you for what you already do: browsing the web. By integrating a seamless rewards system with a state-of-the-art browser, we empower our users to earn while they explore the digital world.
        </p>
        
        <h2 className="text-xl font-bold pt-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Earn While You Browse:</strong> Get rewarded with Robux and USD for your regular online activity.</li>
            <li><strong>AI-Powered Search:</strong> Our intelligent search assistant provides safe, relevant, and summarized results to help you find what you need faster.</li>
            <li><strong>Privacy First:</strong> We block intrusive ads and trackers, ensuring your browsing experience is clean and your data is protected.</li>
            <li><strong>Community Driven:</strong> BrowseBux is built for its users. We are constantly innovating and adding new features based on your feedback.</li>
        </ul>
        
        <p className="pt-6 text-center text-gray-500">
          Thank you for being a part of the BrowseBux community. Together, we're redefining the future of browsing.
        </p>
      </div>
    </div>
  );
};

export default About;
