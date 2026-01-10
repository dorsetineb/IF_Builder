
import React, { useState } from 'react';
import { GameData } from '../types';
import { Eye, Plus, CircleHelp, LogOut, ChevronLeft, ChevronRight, PanelLeft } from 'lucide-react';
import UserManualModal from './UserManualModal';

const Header: React.FC<{
  gameData: GameData;
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onNewGame: () => void;
  onLogout: () => void;
  sidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
}> = ({ gameData, isPreviewing, onTogglePreview, onNewGame, onLogout, sidebarCollapsed, onToggleCollapse }) => {
  const [isManualOpen, setIsManualOpen] = useState(false);

  return (
    <header className="flex w-full h-[61px]">
      {/* Left Pane - Sidebar Alignment */}
      <div
        className={`flex-shrink-0 bg-card border-b border-r border-border flex items-center relative transition-all duration-300 ${sidebarCollapsed ? 'w-20 justify-center' : 'w-64 px-4'}`}
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60" />

        {sidebarCollapsed ? (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-foreground text-xs">IF</div>
        ) : (
          <h1 className="text-xl font-bold text-foreground truncate">IF Builder</h1>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all z-50 shadow-sm"
            title={sidebarCollapsed ? "Expandir Sidebar" : "Recolher Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Right Pane - Top Bar Content */}
      <div className="flex-1 flex items-center justify-between bg-zinc-950 border-b border-border px-6">
        <div className="flex items-center h-full gap-4">
          <span
            className="text-muted-foreground text-sm font-medium truncate max-w-[400px]"
            title={gameData.gameTitle}
          >
            {gameData.gameTitle}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isPreviewing ? (
            <button onMouseDown={onTogglePreview} className="flex items-center px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all text-xs uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 mr-2" /> Fechar Preview
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsManualOpen(true)}
                className="flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider gap-2"
                title="Ver manual de instruções"
              >
                <CircleHelp className="w-4 h-4" /> Manual
              </button>

              <button
                onClick={onNewGame}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all text-xs shadow-lg shadow-purple-900/20 hover:-translate-y-0.5"
              >
                <Plus className="w-3.5 h-3.5 mr-2" /> Novo Jogo
              </button>

              <button
                onClick={onLogout}
                className="flex items-center justify-center p-2 text-muted-foreground hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </header>
  );
};

export default Header;
