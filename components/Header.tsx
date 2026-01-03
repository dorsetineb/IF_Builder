
import React, { useState } from 'react';
import { GameData } from '../types';
import { Eye, Plus, CircleHelp, LogOut } from 'lucide-react';
import UserManualModal from './UserManualModal';

const Header: React.FC<{
  gameData: GameData;
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onNewGame: () => void;
  onLogout: () => void;
}> = ({ gameData, isPreviewing, onTogglePreview, onNewGame, onLogout }) => {
  const [isManualOpen, setIsManualOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-zinc-950 p-4 flex justify-between items-center border-b border-zinc-800 relative">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60" />
      <div className="flex items-center">
        <h1 className="text-xl font-bold pr-4 text-white">IF Builder</h1>
        <span
          className="text-zinc-400 text-sm font-medium border-l border-zinc-800 pl-4 truncate max-w-[300px]"
          title={gameData.gameTitle}
        >
          {gameData.gameTitle}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {isPreviewing ? (
          <button onMouseDown={onTogglePreview} className="flex items-center px-4 py-2 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-all text-sm">
            <Eye className="w-4 h-4 mr-2" /> Fechar Pré-visualização
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsManualOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold rounded-lg hover:bg-zinc-800 transition-all text-sm"
              title="Ver manual de instruções"
            >
              <CircleHelp className="w-5 h-5 mr-2" /> Manual de Uso
            </button>
            <button
              onClick={onNewGame}
              className="flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all text-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Jogo
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center p-2 text-zinc-500 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </header>
  );
};

export default Header;
