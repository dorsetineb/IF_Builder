import React, { useState, useEffect } from 'react';
import { GameData } from '../types';

interface UIEditorProps {
  html: string;
  css: string;
  layoutOrientation: 'vertical' | 'horizontal';
  layoutOrder: 'image-first' | 'image-last';
  actionButtonText: string;
  commandInputPlaceholder: string;
  diaryPlayerName: string;
  splashButtonText: string;
  restartButtonText: string;
  onUpdate: (field: keyof GameData, value: any) => void;
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
}

const UIEditor: React.FC<UIEditorProps> = (props) => {
  const { 
      html, css, layoutOrientation, layoutOrder, splashButtonText,
      actionButtonText, commandInputPlaceholder, diaryPlayerName, restartButtonText, onUpdate, isDirty, onSetDirty 
  } = props;

  const [localHtml, setLocalHtml] = useState(html);
  const [localCss, setLocalCss] = useState(css);
  const [localLayoutOrientation, setLocalLayoutOrientation] = useState(layoutOrientation);
  const [localLayoutOrder, setLocalLayoutOrder] = useState(layoutOrder);
  const [localActionButtonText, setLocalActionButtonText] = useState(actionButtonText);
  const [localCommandInputPlaceholder, setLocalCommandInputPlaceholder] = useState(commandInputPlaceholder);
  const [localDiaryPlayerName, setLocalDiaryPlayerName] = useState(diaryPlayerName);
  const [localSplashButtonText, setLocalSplashButtonText] = useState(splashButtonText);
  const [localRestartButtonText, setLocalRestartButtonText] = useState(restartButtonText);
  const [activeTab, setActiveTab] = useState('layout');

  useEffect(() => {
    setLocalHtml(html);
    setLocalCss(css);
    setLocalLayoutOrientation(layoutOrientation);
    setLocalLayoutOrder(layoutOrder);
    setLocalActionButtonText(actionButtonText);
    setLocalCommandInputPlaceholder(commandInputPlaceholder);
    setLocalDiaryPlayerName(diaryPlayerName);
    setLocalSplashButtonText(splashButtonText);
    setLocalRestartButtonText(restartButtonText);
  }, [html, css, layoutOrientation, layoutOrder, actionButtonText, commandInputPlaceholder, diaryPlayerName, splashButtonText, restartButtonText]);

  useEffect(() => {
    const dirty = localHtml !== html ||
                  localCss !== css ||
                  localLayoutOrientation !== layoutOrientation ||
                  localLayoutOrder !== layoutOrder ||
                  localSplashButtonText !== splashButtonText ||
                  localRestartButtonText !== restartButtonText ||
                  localActionButtonText !== actionButtonText ||
                  localCommandInputPlaceholder !== commandInputPlaceholder ||
                  localDiaryPlayerName !== diaryPlayerName;
    onSetDirty(dirty);
  }, [localHtml, localCss, localLayoutOrientation, localLayoutOrder, localActionButtonText, localCommandInputPlaceholder, localDiaryPlayerName, localSplashButtonText, localRestartButtonText, props, onSetDirty]);

  const handleSave = () => {
    if (localHtml !== html) onUpdate('gameHTML', localHtml);
    if (localCss !== css) onUpdate('gameCSS', localCss);
    if (localLayoutOrientation !== layoutOrientation) onUpdate('gameLayoutOrientation', localLayoutOrientation);
    if (localLayoutOrder !== layoutOrder) onUpdate('gameLayoutOrder', localLayoutOrder);
    if (localSplashButtonText !== splashButtonText) onUpdate('gameSplashButtonText', localSplashButtonText);
    if (localRestartButtonText !== restartButtonText) onUpdate('gameRestartButtonText', localRestartButtonText);
    if (localActionButtonText !== actionButtonText) onUpdate('gameActionButtonText', localActionButtonText);
    if (localCommandInputPlaceholder !== commandInputPlaceholder) onUpdate('gameCommandInputPlaceholder', localCommandInputPlaceholder);
    if (localDiaryPlayerName !== diaryPlayerName) onUpdate('gameDiaryPlayerName', localDiaryPlayerName);
  };
  
  const handleUndo = () => {
    setLocalHtml(html);
    setLocalCss(css);
    setLocalLayoutOrientation(layoutOrientation);
    setLocalLayoutOrder(layoutOrder);
    setLocalSplashButtonText(splashButtonText);
    setLocalRestartButtonText(restartButtonText);
    setLocalActionButtonText(actionButtonText);
    setLocalCommandInputPlaceholder(commandInputPlaceholder);
    setLocalDiaryPlayerName(diaryPlayerName);
  };

  const TABS = {
    layout: 'Layout',
    textos: 'Textos da Interface',
    codigo: 'Código-Fonte',
  };


  return (
    <div className="space-y-6 pb-24">
      <div>
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-text">Aparência e Interface</h2>
            {isDirty && (
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Alterações não salvas"></div>
            )}
        </div>
        <p className="text-brand-text-dim mt-1">
            Personalize o layout, as cores e os textos da interface do seu jogo. Para personalizações avançadas, edite o código-fonte.
        </p>
      </div>
      
      <div>
        <div className="border-b border-brand-border flex space-x-1">
          {Object.entries(TABS).map(([key, name]) => (
              <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`px-4 py-2 font-semibold text-sm rounded-t-md transition-colors ${
                      activeTab === key
                          ? 'bg-brand-surface text-brand-primary'
                          : 'text-brand-text-dim hover:text-brand-text'
                  }`}
              >
                  {name}
              </button>
          ))}
        </div>

        <div className="bg-brand-surface -mt-px p-6">
          {activeTab === 'layout' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center">
                  <div className="space-y-6">
                      <div>
                          <label htmlFor="orientation-select" className="block text-sm font-medium text-brand-text-dim mb-1">Orientação</label>
                          <select
                              id="orientation-select"
                              value={localLayoutOrientation}
                              onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                              className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                          >
                              <option value="vertical">Vertical</option>
                              <option value="horizontal">Horizontal</option>
                          </select>
                      </div>
                      <div>
                          <label htmlFor="order-select" className="block text-sm font-medium text-brand-text-dim mb-1">Posição da Imagem</label>
                          <select
                              id="order-select"
                              value={localLayoutOrder}
                              onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                              className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                          >
                              <option value="image-first">{localLayoutOrientation === 'vertical' ? 'Esquerda' : 'Acima'}</option>
                              <option value="image-last">{localLayoutOrientation === 'vertical' ? 'Direita' : 'Abaixo'}</option>
                          </select>
                      </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                      <p className="text-sm text-brand-text-dim mb-2">Pré-visualização do Layout</p>
                      <div 
                          className={`w-full max-w-sm aspect-video bg-brand-bg border-2 border-brand-border rounded-lg flex p-2 gap-2`}
                          style={{ flexDirection: localLayoutOrientation === 'horizontal' ? 'column' : 'row' }}
                      >
                          <div className={`flex-1 bg-green-500/30 border border-green-400 rounded flex items-center justify-center text-center text-sm p-2 text-green-200 font-semibold ${localLayoutOrder === 'image-first' ? 'order-1' : 'order-2'}`}>
                              Imagem
                          </div>
                          <div className={`flex-1 bg-brand-primary/30 border border-brand-primary rounded flex items-center justify-center text-center text-sm p-2 text-brand-primary-hover font-semibold ${localLayoutOrder === 'image-first' ? 'order-2' : 'order-1'}`}>
                              Descrição
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'textos' && (
              <div className="space-y-8">
                  <div>
                      <h3 className="text-lg font-semibold text-brand-text mb-4">Textos da Interface</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div>
                              <label htmlFor="actionButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Ação</label>
                              <input
                                  type="text"
                                  id="actionButtonText"
                                  value={localActionButtonText}
                                  onChange={(e) => setLocalActionButtonText(e.target.value)}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              />
                          </div>
                          <div>
                              <label htmlFor="commandInputPlaceholder" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Campo de Comando</label>
                              <input
                                  type="text"
                                  id="commandInputPlaceholder"
                                  value={localCommandInputPlaceholder}
                                  onChange={(e) => setLocalCommandInputPlaceholder(e.target.value)}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              />
                          </div>
                          <div>
                              <label htmlFor="diaryPlayerName" className="block text-sm font-medium text-brand-text-dim mb-1">Nome do Jogador no Diário</label>
                              <input
                                  type="text"
                                  id="diaryPlayerName"
                                  value={localDiaryPlayerName}
                                  onChange={(e) => setLocalDiaryPlayerName(e.target.value)}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              />
                          </div>
                          <div>
                              <label htmlFor="splashButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Início</label>
                              <input
                                  type="text"
                                  id="splashButtonText"
                                  value={localSplashButtonText}
                                  onChange={(e) => setLocalSplashButtonText(e.target.value)}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  placeholder="INICIAR"
                              />
                          </div>
                          <div>
                              <label htmlFor="restartButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Reiniciar (Fim de Jogo)</label>
                              <input
                                  type="text"
                                  id="restartButtonText"
                                  value={localRestartButtonText}
                                  onChange={(e) => setLocalRestartButtonText(e.target.value)}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  placeholder="Reiniciar Aventura"
                              />
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'codigo' && (
              <div className="h-[60vh] flex flex-col gap-6">
                  <div className="flex-1 flex flex-col">
                      <label htmlFor="html-editor" className="block text-sm font-medium text-brand-text-dim mb-1">
                          HTML do Jogo (index.html)
                      </label>
                      <textarea
                          id="html-editor"
                          value={localHtml}
                          onChange={(e) => setLocalHtml(e.target.value)}
                          className="w-full flex-1 bg-brand-bg border border-brand-border rounded-md p-3 font-mono text-sm resize-none focus:ring-0"
                          spellCheck="false"
                      />
                  </div>
                  <div className="flex-1 flex flex-col">
                      <label htmlFor="css-editor" className="block text-sm font-medium text-brand-text-dim mb-1">
                          CSS do Jogo (style.css)
                      </label>
                      <textarea
                          id="css-editor"
                          value={localCss}
                          onChange={(e) => setLocalCss(e.target.value)}
                          className="w-full flex-1 bg-brand-bg border border-brand-border rounded-md p-3 font-mono text-sm resize-none focus:ring-0"
                          spellCheck="false"
                      />
                  </div>
              </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-10 z-10 flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!isDirty}
            className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text-dim font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title={isDirty ? "Desfazer alterações" : "Nenhuma alteração para desfazer"}
          >
            Desfazer
        </button>
          <button
              onClick={handleSave}
              disabled={!isDirty}
              className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
              title={isDirty ? "Salvar alterações na interface" : "Nenhuma alteração para salvar"}
          >
              Salvar
          </button>
      </div>
    </div>
  );
};

export default UIEditor;