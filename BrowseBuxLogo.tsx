import React from 'react';

interface BrowseBuxLogoProps {
  size: 'small' | 'large';
}

export const BrowseBuxLogo: React.FC<BrowseBuxLogoProps> = ({ size }) => {
    const sizeClasses = size === 'large' ? 'w-48 h-48' : 'w-24 h-24';

    return (
        <div className={`${sizeClasses} flex items-center justify-center`}>
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                         <stop offset="0%" style={{ stopColor: '#3b82f6' }} />
                         <stop offset="100%" style={{ stopColor: '#1e3a8a' }} />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3"/>
                    </filter>
                </defs>
                
                <g filter="url(#shadow)">
                    {/* Shield */}
                    <path 
                        d="M100 10 C40 20, 20 70, 20 100 C20 160, 100 190, 100 190 C100 190, 180 160, 180 100 C180 70, 160 20, 100 10 Z" 
                        fill="url(#logoGradient)" 
                    />
                </g>

                {/* Stylized 'B' */}
                <text 
                    x="100" 
                    y="125" 
                    fontFamily="Poppins, sans-serif" 
                    fontSize="100" 
                    fontWeight="bold" 
                    fill="white" 
                    textAnchor="middle"
                    stroke="#ffffff55"
                    strokeWidth="2"
                >
                    B
                </text>

                {/* Reward Star */}
                <path 
                    d="M145 45 L151.9 58.3 L167 60.3 L156 70.8 L158.8 85.7 L145 78.5 L131.2 85.7 L134 70.8 L123 60.3 L138.1 58.3 Z" 
                    fill="#FFD700"
                />
            </svg>
        </div>
    );
};