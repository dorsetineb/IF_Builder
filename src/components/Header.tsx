
import React, { useRef } from 'react';
import { GameData } from '../types';
import { Eye, Plus, CircleHelp, LogOut, ChevronLeft, ChevronRight, PanelLeft, FileUp, Download } from 'lucide-react';

const Header: React.FC<{
  gameData: GameData;
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onNewGame: () => void;
  onLogout: () => void;
  sidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}> = ({ gameData, isPreviewing, onTogglePreview, onNewGame, onLogout, sidebarCollapsed, onToggleCollapse, onExport, onImport }) => {
  const importInputRef = useRef<HTMLInputElement>(null);

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
          {/* Hidden Import Input */}
          <input
            type="file"
            ref={importInputRef}
            className="hidden"
            accept=".json,.zip"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
              e.target.value = '';
            }}
          />

          {isPreviewing ? (
            <button onMouseDown={onTogglePreview} className="flex items-center px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all text-xs uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 mr-2" /> Fechar Preview
            </button>
          ) : (
            <>
              <button
                onClick={() => importInputRef.current?.click()}
                className="flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider gap-2"
                title="Importar Jogo"
              >
                <FileUp className="w-4 h-4" /> Importar
              </button>

              <button
                onClick={onExport}
                className="flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider gap-2"
                title="Exportar Jogo"
              >
                <Download className="w-4 h-4" /> Exportar
              </button>

              <button
                onClick={onTogglePreview}
                className="flex items-center justify-center px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-lg transition-all text-xs shadow-sm hover:shadow-md border border-zinc-200"
                title="Pré-visualizar Jogo"
              >
                <Eye className="w-3.5 h-3.5 mr-2" /> Pré-visualizar
              </button>

            </>
          )}
        </div>
      </div>
    </header >
  );
};

export default Header;
