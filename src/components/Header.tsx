
import React, { useRef } from 'react';
import { GameData } from '../types';
import { Eye, Plus, CircleHelp, LogOut, ChevronLeft, ChevronRight, PanelLeft, Upload, Download } from 'lucide-react';

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
  onHome?: () => void;
  currentView: 'scenes' | 'interface' | 'map' | 'global_objects' | 'trackers' | 'settings' | 'about';
}> = ({ gameData, isPreviewing, onTogglePreview, onNewGame, onLogout, sidebarCollapsed, onToggleCollapse, onExport, onImport, onHome, currentView }) => {
  const importInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex w-full h-[61px]">
      {/* Left Pane - Sidebar Alignment */}
      <div
        className={`flex-shrink-0 bg-card border-b border-r border-muted-foreground/50 flex items-center relative transition-all duration-300 ${sidebarCollapsed ? 'w-20 justify-center' : 'w-64 px-4'}`}
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-primary opacity-60" />

        <div
          onClick={onHome}
          className={`flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          {sidebarCollapsed ? (
            <h1 className="text-xl font-bold text-foreground">IF</h1>
          ) : (
            <h1 className="text-xl font-bold text-foreground truncate">IF Builder</h1>
          )}
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-card border border-muted-foreground/50 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-50 shadow-sm"
            title={sidebarCollapsed ? "Expandir Sidebar" : "Recolher Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Right Pane - Top Bar Content */}
      <div className="flex-1 flex items-center justify-between bg-card border-b border-muted-foreground/50 px-6">
        <div className="flex items-center h-full gap-4">
          <span
            className="text-muted-foreground text-sm font-medium truncate max-w-[400px]"
            title={gameData.gameTitle}
          >
            {/* Dynamic Title based on View */}
            {currentView === 'settings' ? (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground tracking-tight">Configurações</span>
                <p className="text-[10px] text-muted-foreground hidden md:block">Gerencie suas preferências e conta.</p>
              </div>
            ) : currentView === 'about' ? (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground tracking-tight">Sobre o Projeto</span>
                <p className="text-[10px] text-muted-foreground hidden md:block">Conheça a missão e os valores por trás do IF Builder.</p>
              </div>
            ) : (
              <span className="text-sm font-medium text-muted-foreground truncate max-w-[400px]" title={gameData.gameTitle}>
                {gameData.gameTitle}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Only show Game Controls if NOT in Settings or About */}
          {(currentView !== 'settings' && currentView !== 'about') && (
            <>
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
                    onClick={onNewGame}
                    className="flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider gap-2"
                    title="Novo Jogo"
                  >
                    <Plus className="w-4 h-4" /> Novo Jogo
                  </button>

                  <button
                    onClick={() => importInputRef.current?.click()}
                    className="flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider gap-2"
                    title="Importar Jogo"
                  >
                    <Download className="w-4 h-4" /> Importar
                  </button>

                  <button
                    onClick={onExport}
                    className="flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider gap-2"
                    title="Exportar Jogo"
                  >
                    <Upload className="w-4 h-4" /> Exportar
                  </button>

                  <button
                    onClick={onTogglePreview}
                    className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all text-xs shadow-sm active:scale-95 border border-primary/50"
                    title="Pré-visualizar Jogo"
                  >
                    <Eye className="w-3.5 h-3.5 mr-2" /> Pré-visualizar
                  </button>

                </>
              )}
            </>
          )}

          {currentView === 'settings' && (
            <button
              onClick={onLogout}
              className="flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white border border-red-500/20 transition-all text-xs"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </button>
          )}
        </div>
      </div>
    </header >
  );
};

export default Header;
