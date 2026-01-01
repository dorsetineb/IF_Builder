
import React, { useState } from 'react';
import { GameData } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { PlusIcon } from './icons/PlusIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import UserManualModal from './UserManualModal';

const Header: React.FC<{ 
  gameData: GameData; 
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onNewGame: () => void;
}> = ({ gameData, isPreviewing, onTogglePreview, onNewGame }) => {
  const [isManualOpen, setIsManualOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-brand-sidebar p-4 flex justify-between items-center border-b border-brand-border">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold pr-4">IF Builder</h1>
        <span 
            className="text-brand-primary-hover text-lg font-medium border-l border-brand-border pl-4 truncate max-w-[300px]"
            title={gameData.gameTitle}
        >
            {gameData.gameTitle}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {isPreviewing ? (
          <button onMouseDown={onTogglePreview} className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors">
            <EyeIcon className="w-5 h-5 mr-2" /> Fechar Pré-visualização
          </button>
        ) : (
          <>
            <button
                onClick={() => setIsManualOpen(true)}
                className="flex items-center justify-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text-dim font-semibold rounded-md hover:bg-brand-border/50 transition-colors duration-200"
                title="Ver manual de instruções"
            >
                <QuestionMarkCircleIcon className="w-5 h-5 mr-2" /> Manual de Uso
            </button>
            <button
                onClick={onNewGame}
                className="flex items-center justify-center px-4 py-2 bg-brand-bg border-2 border-solid border-brand-primary text-brand-primary font-semibold rounded-md hover:bg-brand-primary/20 transition-colors duration-200"
            >
                <PlusIcon className="w-5 h-5 mr-2" /> Novo Jogo
            </button>
          </>
        )}
      </div>

      <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </header>
  );
};
    
export default Header;
