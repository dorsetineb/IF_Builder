import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  startOpen?: boolean;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ title, children, startOpen = false }) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-5 text-left focus:outline-none transition-all group ${isOpen ? 'bg-purple-500/5' : 'hover:bg-zinc-800/50'}`}
        aria-expanded={isOpen}
      >
        <h3 className={`text-xs font-bold uppercase tracking-widest transition-colors ${isOpen ? 'text-purple-400' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{title}</h3>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-zinc-600 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
      </button>
      <div
        className={`transition-[grid-template-rows] duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="p-6 border-t border-zinc-800/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCard;