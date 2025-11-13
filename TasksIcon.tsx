import React from 'react';
export const TasksIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 15.91a4.5 4.5 0 0 1-6.364 0 4.5 4.5 0 0 1 0-6.364 4.5 4.5 0 0 1 6.364 0Zm-1.06-1.06a3 3 0 1 0-4.242 0 3 3 0 0 0 4.242 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v.008v-.008Z" />
  </svg>
);
