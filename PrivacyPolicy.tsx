
import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col">
       <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <button onClick={onBack} className="mr-4 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
       </header>

       <div className="p-4 overflow-y-auto text-gray-700 dark:text-gray-300">
            <p className="mb-2 text-sm text-gray-500">Last Updated: 2024-07-22</p>
            
            <h2 className="text-xl font-bold mt-4 mb-2">1. Introduction</h2>
            <p className="mb-4">
                Welcome to BrowseBux. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
            </p>

            <h2 className="text-xl font-bold mt-4 mb-2">2. Information We Collect</h2>
            <p className="mb-4">
                We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the application, the choices you make and the products and features you use. The personal information we collect may include the following: Google Account Information (Name, Email, Profile Picture).
            </p>
            
             <h2 className="text-xl font-bold mt-4 mb-2">3. How We Use Your Information</h2>
            <p className="mb-4">
                We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
            </p>
            
            <h2 className="text-xl font-bold mt-4 mb-2">4. Will Your Information Be Shared?</h2>
            <p className="mb-4">
               We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

             <h2 className="text-xl font-bold mt-4 mb-2">5. Do We Use Cookies?</h2>
            <p className="mb-4">
               We may use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.
            </p>
       </div>
    </div>
  );
};

export default PrivacyPolicy;
