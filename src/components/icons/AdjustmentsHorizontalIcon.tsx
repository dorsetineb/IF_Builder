import React from 'react';

export const AdjustmentsHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {/* Tracks */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h3m4 0h11M3 12h13m4 0h1M3 18h5m4 0h9" />
    {/* Knobs */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6a2 2 0 11-4 0 2 2 0 014 0zM20 12a2 2 0 11-4 0 2 2 0 014 0zM12 18a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);