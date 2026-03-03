
import React, { useRef } from 'react';
import { GameData, View } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Eye, Plus, CircleHelp, ChevronLeft, ChevronRight, PanelLeft, Upload, Download, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Header: React.FC<{
  gameData: GameData;
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onNewGame: () => void;
  sidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onHome?: () => void;
  currentView: View;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ gameData, isPreviewing, onTogglePreview, onNewGame, sidebarCollapsed, onToggleCollapse, onExport, onImport, onHome, currentView }) => {
  const { t } = useTranslation();
  const importInputRef = useRef<HTMLInputElement>(null);

  const totalConnectableNodes = Object.keys(gameData?.scenes || {}).length + (gameData?.vignettes?.length || 0);
  const isPreviewDisabled = totalConnectableNodes < 2;

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
            <h1 className="text-xl font-bold text-foreground notranslate" translate="no">IF</h1>
          ) : (
            <h1 className="text-xl font-bold text-foreground truncate notranslate" translate="no">IF Builder</h1>
          )}
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-card border border-muted-foreground/50 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-50 shadow-sm"
            title={sidebarCollapsed ? t('header.expandSidebar', 'Expandir Sidebar') : t('header.collapseSidebar', 'Recolher Sidebar')}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Right Pane - Top Bar Content */}
      <div className="flex-1 flex items-center justify-start gap-4 bg-card border-b border-muted-foreground/50 px-6">
        {['about', 'guide', 'settings'].includes(currentView) && (
          <div className="flex items-center h-full">
            <div className="flex items-center">
              {/* Context-aware Sub-header Text */}
              {currentView === 'guide' ? (
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground tracking-tight">{t('sidebar.quickGuide', 'Guia Rápido')}</span>
                  <p className="text-[10px] text-muted-foreground hidden md:block">{t('header.guideDesc', 'Aprenda como criar suas próprias histórias interativas.')}</p>
                </div>
              ) : currentView === 'settings' ? (
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground tracking-tight">{t('sidebar.settings', 'Configurações')}</span>
                  <p className="text-[10px] text-muted-foreground hidden md:block">{t('header.settingsDesc', 'Gerencie suas preferências e conta.')}</p>
                </div>
              ) : currentView === 'about' ? (
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground tracking-tight">{t('sidebar.aboutProject', 'Sobre o Projeto')}</span>
                  <p className="text-[10px] text-muted-foreground hidden md:block">{t('header.aboutDesc', 'Conheça a missão e os valores por trás do IF Builder.')}</p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {(!['about', 'guide', 'settings'].includes(currentView)) && (
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
                  <Eye className="w-3.5 h-3.5 mr-2" /> {t('header.closePreview', 'Fechar Preview')}
                </button>
              ) : (
                <>


                  <button
                    onClick={onExport}
                    className="flex items-center justify-center px-3 py-2 text-primary hover:text-primary/80 transition-colors text-xs font-semibold uppercase tracking-wider gap-2"
                    title={t('header.saveGame', 'Salvar Jogo')}
                  >
                    <Save className="w-4 h-4" /> {t('header.saveGameBtn', 'Salvar')}
                  </button>

                  <button
                    onClick={() => importInputRef.current?.click()}
                    className="flex items-center justify-center px-3 py-2 text-primary hover:text-primary/80 transition-colors text-xs font-semibold uppercase tracking-wider gap-2"
                    title={t('header.loadGame', 'Carregar')}
                  >
                    <Download className="w-4 h-4" /> {t('header.loadGameBtn', 'Carregar')}
                  </button>

                  <button
                    onClick={isPreviewDisabled ? undefined : onTogglePreview}
                    disabled={isPreviewDisabled}
                    className={`flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all text-xs shadow-sm uppercase tracking-wider ${isPreviewDisabled ? 'bg-muted text-muted-foreground cursor-not-allowed border border-muted-foreground/30' : 'bg-primary hover:bg-primary/90 text-primary-foreground active:scale-95 border border-primary/50'}`}
                    title={isPreviewDisabled ? t('header.previewDisabled', 'Adicione pelo menos 2 cenas ou vinhetas para usar o Preview.') : t('header.previewGame', 'Pré-visualizar Jogo')}
                  >
                    <Eye className="w-3.5 h-3.5 mr-2" /> {t('header.previewGameBtn', 'Pré-visualizar')}
                  </button>

                </>
              )}
            </>
          )}
        </div>
      </div>
    </header >
  );
};

export default Header;
