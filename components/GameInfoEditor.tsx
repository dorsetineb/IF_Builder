import React, { useState, useEffect } from 'react';
import { GameData } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface GameInfoEditorProps {
  title: string;
  logo: string;
  hideTitle: boolean;
  omitSplashTitle: boolean;
  splashImage: string;
  splashContentAlignment: 'left' | 'right';
  splashDescription: string;
  enableChances: boolean;
  maxChances: number;
  positiveEndingImage: string;
  positiveEndingContentAlignment: 'left' | 'right';
  positiveEndingDescription: string;
  negativeEndingImage: string;
  negativeEndingContentAlignment: 'left' | 'right';
  negativeEndingDescription: string;
  onUpdate: (field: keyof GameData, value: string | boolean | number) => void;
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
}

const GameInfoEditor: React.FC<GameInfoEditorProps> = (props) => {
    const { 
        title, logo, hideTitle, omitSplashTitle, 
        splashImage, splashContentAlignment, splashDescription,
        enableChances, maxChances,
        positiveEndingImage, positiveEndingContentAlignment, positiveEndingDescription,
        negativeEndingImage, negativeEndingContentAlignment, negativeEndingDescription,
        onUpdate, isDirty, onSetDirty 
    } = props;

    const [localTitle, setLocalTitle] = useState(title);
    const [localLogo, setLocalLogo] = useState(logo);
    const [localHideTitle, setLocalHideTitle] = useState(hideTitle);
    const [localOmitSplashTitle, setLocalOmitSplashTitle] = useState(omitSplashTitle);
    const [localSplashImage, setLocalSplashImage] = useState(splashImage);
    const [localSplashContentAlignment, setLocalSplashContentAlignment] = useState(splashContentAlignment);
    const [localSplashDescription, setLocalSplashDescription] = useState(splashDescription);
    const [localEnableChances, setLocalEnableChances] = useState(enableChances);
    const [localMaxChances, setLocalMaxChances] = useState(maxChances);
    const [localPositiveEndingImage, setLocalPositiveEndingImage] = useState(positiveEndingImage);
    const [localPositiveEndingContentAlignment, setLocalPositiveEndingContentAlignment] = useState(positiveEndingContentAlignment);
    const [localPositiveEndingDescription, setLocalPositiveEndingDescription] = useState(positiveEndingDescription);
    const [localNegativeEndingImage, setLocalNegativeEndingImage] = useState(negativeEndingImage);
    const [localNegativeEndingContentAlignment, setLocalNegativeEndingContentAlignment] = useState(negativeEndingContentAlignment);
    const [localNegativeEndingDescription, setLocalNegativeEndingDescription] = useState(negativeEndingDescription);
    const [activeTab, setActiveTab] = useState('geral');

    useEffect(() => {
        const hasChanged = localTitle !== title || 
                         localLogo !== logo || 
                         localHideTitle !== hideTitle ||
                         localOmitSplashTitle !== omitSplashTitle ||
                         localSplashImage !== splashImage ||
                         localSplashContentAlignment !== splashContentAlignment ||
                         localSplashDescription !== splashDescription ||
                         localEnableChances !== enableChances ||
                         localMaxChances !== maxChances ||
                         localPositiveEndingImage !== positiveEndingImage ||
                         localPositiveEndingContentAlignment !== positiveEndingContentAlignment ||
                         localPositiveEndingDescription !== positiveEndingDescription ||
                         localNegativeEndingImage !== negativeEndingImage ||
                         localNegativeEndingContentAlignment !== negativeEndingContentAlignment ||
                         localNegativeEndingDescription !== negativeEndingDescription;
        onSetDirty(hasChanged);
    }, [localTitle, localLogo, localHideTitle, localOmitSplashTitle, localSplashImage, localSplashContentAlignment, localSplashDescription, localEnableChances, localMaxChances, localPositiveEndingImage, localPositiveEndingContentAlignment, localPositiveEndingDescription, localNegativeEndingImage, localNegativeEndingContentAlignment, localNegativeEndingDescription, props, onSetDirty]);

    const handleSave = () => {
        if (localTitle !== title) onUpdate('gameTitle', localTitle);
        if (localLogo !== logo) onUpdate('gameLogo', localLogo);
        if (localHideTitle !== hideTitle) onUpdate('gameHideTitle', localHideTitle);
        if (localOmitSplashTitle !== omitSplashTitle) onUpdate('gameOmitSplashTitle', localOmitSplashTitle);
        if (localSplashImage !== splashImage) onUpdate('gameSplashImage', localSplashImage);
        if (localSplashContentAlignment !== splashContentAlignment) onUpdate('gameSplashContentAlignment', localSplashContentAlignment);
        if (localSplashDescription !== splashDescription) onUpdate('gameSplashDescription', localSplashDescription);
        if (localEnableChances !== enableChances) onUpdate('gameEnableChances', localEnableChances);
        if (localMaxChances !== maxChances) onUpdate('gameMaxChances', localMaxChances);
        if (localPositiveEndingImage !== positiveEndingImage) onUpdate('positiveEndingImage', localPositiveEndingImage);
        if (localPositiveEndingContentAlignment !== positiveEndingContentAlignment) onUpdate('positiveEndingContentAlignment', localPositiveEndingContentAlignment);
        if (localPositiveEndingDescription !== positiveEndingDescription) onUpdate('positiveEndingDescription', localPositiveEndingDescription);
        if (localNegativeEndingImage !== negativeEndingImage) onUpdate('negativeEndingImage', localNegativeEndingImage);
        if (localNegativeEndingContentAlignment !== negativeEndingContentAlignment) onUpdate('negativeEndingContentAlignment', localNegativeEndingContentAlignment);
        if (localNegativeEndingDescription !== negativeEndingDescription) onUpdate('negativeEndingDescription', localNegativeEndingDescription);
    };
    
    const handleUndo = () => {
        setLocalTitle(title);
        setLocalLogo(logo);
        setLocalHideTitle(hideTitle);
        setLocalOmitSplashTitle(omitSplashTitle);
        setLocalSplashImage(splashImage);
        setLocalSplashContentAlignment(splashContentAlignment);
        setLocalSplashDescription(splashDescription);
        setLocalEnableChances(enableChances);
        setLocalMaxChances(maxChances);
        setLocalPositiveEndingImage(positiveEndingImage);
        setLocalPositiveEndingContentAlignment(positiveEndingContentAlignment);
        setLocalPositiveEndingDescription(positiveEndingDescription);
        setLocalNegativeEndingImage(negativeEndingImage);
        setLocalNegativeEndingContentAlignment(negativeEndingContentAlignment);
        setLocalNegativeEndingDescription(negativeEndingDescription);
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  setter(event.target.result);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
    };

    const TABS = {
        geral: 'Geral',
        abertura: 'Abertura do Jogo',
        fim_de_jogo: 'Fim de Jogo',
    };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-text">Informações Gerais</h2>
            {isDirty && (
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Alterações não salvas"></div>
            )}
        </div>
        <p className="text-brand-text-dim mt-1">
          Configure o título, a tela de abertura e outras configurações globais do seu jogo.
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
                          ? 'bg-brand-surface border-brand-border border-t border-x text-brand-primary'
                          : 'text-brand-text-dim hover:text-brand-text'
                  }`}
              >
                  {name}
              </button>
          ))}
        </div>

        <div className="bg-brand-surface -mt-px p-6">
          {activeTab === 'geral' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brand-text mb-2">Título do Jogo</h4>
                          <input
                            type="text"
                            id="gameTitle"
                            value={localTitle}
                            onChange={(e) => setLocalTitle(e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                            placeholder="Ex: A Masmorra Esquecida"
                          />
                          <div className="flex items-center pt-1 space-x-6">
                              <div className="flex items-center">
                                  <input 
                                      type="checkbox" 
                                      id="hideTitle" 
                                      checked={localHideTitle} 
                                      onChange={(e) => setLocalHideTitle(e.target.checked)}
                                      className="custom-checkbox"
                                  />
                                  <label htmlFor="hideTitle" className="ml-2 text-sm text-brand-text-dim">Omitir título do cabeçalho</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="omitSplashTitle"
                                  checked={localOmitSplashTitle}
                                  onChange={(e) => setLocalOmitSplashTitle(e.target.checked)}
                                  className="custom-checkbox"
                                />
                                <label htmlFor="omitSplashTitle" className="ml-2 text-sm text-brand-text-dim">Omitir título da abertura</label>
                              </div>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brand-text mb-2">Logotipo do Jogo</h4>
                          <div className="flex items-center gap-4">
                              {localLogo && <img src={localLogo} alt="Pré-visualização do logo" className="h-16 w-auto bg-brand-bg p-1 border border-brand-border rounded" />}
                              <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                  <UploadIcon className="w-5 h-5 mr-2" /> 
                                  {logo ? 'Alterar Logo' : 'Carregar Logo'}
                                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalLogo)} className="hidden" />
                              </label>
                          </div>
                          <p className="text-xs text-brand-text-dim">Opcional.</p>
                      </div>
                  </div>
                  <div className="pt-6 border-t border-brand-border/50">
                      <h3 className="text-lg font-semibold text-brand-text mb-4">Sistema de Chances (Vidas)</h3>
                      <div className="flex items-center">
                          <input 
                              type="checkbox" 
                              id="enableChances" 
                              checked={localEnableChances} 
                              onChange={(e) => setLocalEnableChances(e.target.checked)}
                              className="custom-checkbox"
                          />
                          <label htmlFor="enableChances" className="ml-2 text-sm text-brand-text-dim">Habilitar sistema de chances</label>
                      </div>
                      {localEnableChances && (
                          <div className="mt-4 pl-6 border-l-2 border-brand-border/50">
                              <label htmlFor="maxChances" className="block text-sm font-medium text-brand-text-dim mb-1">Número de Chances</label>
                              <input
                                  type="number"
                                  id="maxChances"
                                  value={localMaxChances}
                                  onChange={(e) => setLocalMaxChances(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                                  min="1"
                                  max="10"
                                  className="w-full max-w-xs bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              />
                          </div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === 'abertura' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brand-text mb-2">Posicionamento do Conteúdo</h4>
                          <p className="text-xs text-brand-text-dim">Visualizador de alinhamento:</p>
                          <div
                              className="relative w-full aspect-video bg-green-500/30 border border-green-400 rounded-md flex"
                              style={{
                                  justifyContent: localSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end',
                                  alignItems: 'flex-end'
                              }}
                              title="Área da Imagem de Fundo"
                          >
                              <div className="absolute top-2 left-2 text-green-200 font-semibold text-sm">
                                  Imagem de Fundo
                              </div>
                              <div
                                  className="w-2/3 bg-brand-primary/30 border border-brand-primary rounded-md flex items-center justify-center text-center text-sm p-2 text-brand-primary-hover font-semibold"
                                  title="Área de Texto"
                              >
                                  Texto de Abertura
                              </div>
                          </div>

                          <div className="pt-2">
                              <label htmlFor="splashContentAlignment" className="text-sm text-brand-text-dim mb-1 block">Alinhamento Horizontal</label>
                              <select
                                  id="splashContentAlignment"
                                  value={localSplashContentAlignment}
                                  onChange={(e) => setLocalSplashContentAlignment(e.target.value as 'left' | 'right')}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              >
                                  <option value="right">Direita</option>
                                  <option value="left">Esquerda</option>
                              </select>
                          </div>
                      </div>
                      
                      <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brand-text mb-2">Imagem de Fundo</h4>
                          <div className="flex items-start gap-4">
                              {localSplashImage && <img src={localSplashImage} alt="Fundo da tela de abertura" className="h-24 w-auto aspect-video object-cover bg-brand-bg p-1 border border-brand-border rounded" />}
                              <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                  <UploadIcon className="w-5 h-5 mr-2" /> 
                                  {splashImage ? 'Alterar Imagem' : 'Carregar Imagem'}
                                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalSplashImage)} className="hidden" />
                              </label>
                          </div>
                      </div>
                  </div>

                  <div className="pt-6 border-t border-brand-border/50">
                      <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                          <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-brand-text mb-2">Descrição do Jogo</h4>
                              <textarea
                                id="splashDescription"
                                value={localSplashDescription}
                                onChange={(e) => setLocalSplashDescription(e.target.value)}
                                rows={8}
                                className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                placeholder="Uma breve descrição da sua aventura..."
                              />
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'fim_de_jogo' && (
              <div className="space-y-10">
                  {/* Positive Ending */}
                  <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-brand-text border-b border-brand-border pb-2">Final Positivo</h3>
                      <p className="text-sm text-brand-text-dim -mt-4">Esta tela aparece quando o jogador alcança uma cena marcada como "final".</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-brand-text mb-2">Posicionamento do Conteúdo</h4>
                              <div className="pt-2">
                                  <label htmlFor="positiveEndingContentAlignment" className="text-sm text-brand-text-dim mb-1 block">Alinhamento Horizontal</label>
                                  <select
                                      id="positiveEndingContentAlignment"
                                      value={localPositiveEndingContentAlignment}
                                      onChange={(e) => setLocalPositiveEndingContentAlignment(e.target.value as 'left' | 'right')}
                                      className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  >
                                      <option value="right">Direita</option>
                                      <option value="left">Esquerda</option>
                                  </select>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-brand-text mb-2">Imagem de Fundo</h4>
                              <div className="flex items-start gap-4">
                                  {localPositiveEndingImage && <img src={localPositiveEndingImage} alt="Fundo do final positivo" className="h-24 w-auto aspect-video object-cover bg-brand-bg p-1 border border-brand-border rounded" />}
                                  <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                      <UploadIcon className="w-5 h-5 mr-2" /> 
                                      {positiveEndingImage ? 'Alterar Imagem' : 'Carregar Imagem'}
                                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalPositiveEndingImage)} className="hidden" />
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brand-text mb-2">Mensagem de Vitória</h4>
                          <textarea
                              id="positiveEndingDescription"
                              value={localPositiveEndingDescription}
                              onChange={(e) => setLocalPositiveEndingDescription(e.target.value)}
                              rows={4}
                              className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              placeholder="Parabéns! Você venceu."
                          />
                      </div>
                  </div>

                  {/* Negative Ending */}
                  <div className="space-y-6 pt-6 border-t border-brand-border/50">
                      <h3 className="text-2xl font-bold text-brand-text border-b border-brand-border pb-2">Final Negativo</h3>
                      <p className="text-sm text-brand-text-dim -mt-4">Esta tela aparece quando o jogador fica sem chances (vidas).</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-brand-text mb-2">Posicionamento do Conteúdo</h4>
                              <div className="pt-2">
                                  <label htmlFor="negativeEndingContentAlignment" className="text-sm text-brand-text-dim mb-1 block">Alinhamento Horizontal</label>
                                  <select
                                      id="negativeEndingContentAlignment"
                                      value={localNegativeEndingContentAlignment}
                                      onChange={(e) => setLocalNegativeEndingContentAlignment(e.target.value as 'left' | 'right')}
                                      className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  >
                                      <option value="right">Direita</option>
                                      <option value="left">Esquerda</option>
                                  </select>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-brand-text mb-2">Imagem de Fundo</h4>
                              <div className="flex items-start gap-4">
                                  {localNegativeEndingImage && <img src={localNegativeEndingImage} alt="Fundo do final negativo" className="h-24 w-auto aspect-video object-cover bg-brand-bg p-1 border border-brand-border rounded" />}
                                  <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                      <UploadIcon className="w-5 h-5 mr-2" /> 
                                      {negativeEndingImage ? 'Alterar Imagem' : 'Carregar Imagem'}
                                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalNegativeEndingImage)} className="hidden" />
                                  </label>
                              </div>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brand-text mb-2">Mensagem de Derrota</h4>
                          <textarea
                              id="negativeEndingDescription"
                              value={localNegativeEndingDescription}
                              onChange={(e) => setLocalNegativeEndingDescription(e.target.value)}
                              rows={4}
                              className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              placeholder="Fim de jogo."
                          />
                      </div>
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
                title={isDirty ? "Salvar informações do jogo" : "Nenhuma alteração para salvar"}
            >
                Salvar
            </button>
        </div>
    </div>
  );
};

export default GameInfoEditor;