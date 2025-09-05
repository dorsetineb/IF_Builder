
import React, { useState, useEffect } from 'react';
import { GameData } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface GameInfoEditorProps {
  title: string;
  logo: string;
  hideTitle: boolean;
  omitSplashTitle: boolean;
  splashImage: string;
  splashTextWidth: string;
  splashTextHeight: string;
  splashContentAlignment: 'left' | 'right';
  splashDescription: string;
  onUpdate: (field: keyof GameData, value: string | boolean | number) => void;
}

// Helper to extract number from a CSS value like "60%" or "auto"
const extractPercentage = (value: string): string => {
    if (value === 'auto') return '';
    const num = parseFloat(value);
    return isNaN(num) ? '' : String(num);
};

const GameInfoEditor: React.FC<GameInfoEditorProps> = (props) => {
    const { 
        title, logo, hideTitle, omitSplashTitle, 
        splashImage, splashTextWidth, splashTextHeight, splashContentAlignment, splashDescription,
        onUpdate 
    } = props;

    const [localTitle, setLocalTitle] = useState(title);
    const [localLogo, setLocalLogo] = useState(logo);
    const [localHideTitle, setLocalHideTitle] = useState(hideTitle);
    const [localOmitSplashTitle, setLocalOmitSplashTitle] = useState(omitSplashTitle);
    const [localSplashImage, setLocalSplashImage] = useState(splashImage);
    const [localSplashTextWidth, setLocalSplashTextWidth] = useState(splashTextWidth);
    const [localSplashTextHeight, setLocalSplashTextHeight] = useState(splashTextHeight);
    const [localSplashContentAlignment, setLocalSplashContentAlignment] = useState(splashContentAlignment);
    const [localSplashDescription, setLocalSplashDescription] = useState(splashDescription);
    const [activeTab, setActiveTab] = useState('geral');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setLocalTitle(props.title);
        setLocalLogo(props.logo);
        setLocalHideTitle(props.hideTitle);
        setLocalOmitSplashTitle(props.omitSplashTitle);
        setLocalSplashImage(props.splashImage);
        setLocalSplashTextWidth(props.splashTextWidth);
        setLocalSplashTextHeight(props.splashTextHeight);
        setLocalSplashContentAlignment(props.splashContentAlignment);
        setLocalSplashDescription(props.splashDescription);
        setIsDirty(false);
    }, [props]);

    useEffect(() => {
        const hasChanged = localTitle !== title || 
                         localLogo !== logo || 
                         localHideTitle !== hideTitle ||
                         localOmitSplashTitle !== omitSplashTitle ||
                         localSplashImage !== splashImage ||
                         localSplashTextWidth !== splashTextWidth ||
                         localSplashTextHeight !== splashTextHeight ||
                         localSplashContentAlignment !== splashContentAlignment ||
                         localSplashDescription !== splashDescription;
        setIsDirty(hasChanged);
    }, [localTitle, localLogo, localHideTitle, localOmitSplashTitle, localSplashImage, localSplashTextWidth, localSplashTextHeight, localSplashContentAlignment, localSplashDescription, props]);

    const handleSave = () => {
        if (localTitle !== title) onUpdate('gameTitle', localTitle);
        if (localLogo !== logo) onUpdate('gameLogo', localLogo);
        if (localHideTitle !== hideTitle) onUpdate('gameHideTitle', localHideTitle);
        if (localOmitSplashTitle !== omitSplashTitle) onUpdate('gameOmitSplashTitle', localOmitSplashTitle);
        if (localSplashImage !== splashImage) onUpdate('gameSplashImage', localSplashImage);
        if (localSplashTextWidth !== splashTextWidth) onUpdate('gameSplashTextWidth', localSplashTextWidth);
        if (localSplashTextHeight !== splashTextHeight) onUpdate('gameSplashTextHeight', localSplashTextHeight);
        if (localSplashContentAlignment !== splashContentAlignment) onUpdate('gameSplashContentAlignment', localSplashContentAlignment);
        if (localSplashDescription !== splashDescription) onUpdate('gameSplashDescription', localSplashDescription);
    };
    
    const handleUndo = () => {
        setLocalTitle(title);
        setLocalLogo(logo);
        setLocalHideTitle(hideTitle);
        setLocalOmitSplashTitle(omitSplashTitle);
        setLocalSplashImage(splashImage);
        setLocalSplashTextWidth(splashTextWidth);
        setLocalSplashTextHeight(splashTextHeight);
        setLocalSplashContentAlignment(splashContentAlignment);
        setLocalSplashDescription(splashDescription);
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
    
    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const value = e.target.value;
        if (value === '') {
            setter('auto');
        } else {
            const num = Number(value);
            if (!isNaN(num)) {
                const clampedNum = Math.max(0, Math.min(100, num));
                setter(`${clampedNum}%`);
            }
        }
    };

    const TABS = {
        geral: 'Geral',
        abertura: 'Abertura do Jogo',
    };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="text-3xl font-bold text-brand-text">Informações Gerais e Abertura</h2>
        <p className="text-brand-text-dim mt-1">
          Configure o título, a tela de abertura e outras configurações globais do seu jogo.
        </p>
      </div>

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

      <div className="bg-brand-surface rounded-b-lg rounded-r-lg border border-t-0 border-brand-border -mt-6 p-6">
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
                          className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
                          placeholder="Ex: A Masmorra Esquecida"
                        />
                        <div className="flex items-center pt-1 space-x-6">
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="hideTitle" 
                                    checked={localHideTitle} 
                                    onChange={(e) => setLocalHideTitle(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                />
                                <label htmlFor="hideTitle" className="ml-2 text-sm text-brand-text-dim">Omitir título do cabeçalho</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="omitSplashTitle"
                                checked={localOmitSplashTitle}
                                onChange={(e) => setLocalOmitSplashTitle(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
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
            </div>
        )}

        {activeTab === 'abertura' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-brand-text mb-2">Dimensões do Conteúdo</h4>
                        <p className="text-xs text-brand-text-dim">Visualizador de proporção:</p>
                        <div
                            className="relative w-full aspect-video bg-green-500/30 border border-green-400 rounded-md flex"
                            style={{
                                justifyContent: localSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end',
                                alignItems: 'flex-end'
                            }}
                            title="Área da Imagem de Fundo"
                        >
                            <div className="absolute top-2 left-2 text-green-200 font-semibold text-sm">
                                Imagem
                            </div>
                            <div
                                className="bg-brand-primary/30 border border-brand-primary rounded-md flex items-center justify-center text-center text-sm p-2 text-brand-primary-hover font-semibold"
                                style={{
                                    width: localSplashTextWidth !== 'auto' ? localSplashTextWidth : 'auto',
                                    minWidth: '40%',
                                    height: localSplashTextHeight !== 'auto' ? localSplashTextHeight : 'auto',
                                }}
                                title="Área de Texto"
                            >
                                Texto
                            </div>
                        </div>

                        <div className="flex items-end gap-4 pt-2">
                            <div className="flex-1">
                                <label htmlFor="splashTextWidth" className="text-sm text-brand-text-dim mb-1 block">Largura</label>
                                <div className="flex items-center">
                                    <input
                                        id="splashTextWidth"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={extractPercentage(localSplashTextWidth)}
                                        onChange={(e) => handleDimensionChange(e, setLocalSplashTextWidth)}
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
                                        placeholder="auto"
                                    />
                                    <span className="ml-2 text-brand-text-dim">%</span>
                                </div>
                            </div>
                             <div className="flex-1">
                                <label htmlFor="splashTextHeight" className="text-sm text-brand-text-dim mb-1 block">Altura</label>
                                 <div className="flex items-center">
                                    <input
                                        id="splashTextHeight"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={extractPercentage(localSplashTextHeight)}
                                        onChange={(e) => handleDimensionChange(e, setLocalSplashTextHeight)}
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
                                        placeholder="auto"
                                    />
                                    <span className="ml-2 text-brand-text-dim">%</span>
                                 </div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <label htmlFor="splashContentAlignment" className="text-sm text-brand-text-dim mb-1 block">Alinhamento do Conteúdo</label>
                            <select
                                id="splashContentAlignment"
                                value={localSplashContentAlignment}
                                onChange={(e) => setLocalSplashContentAlignment(e.target.value as 'left' | 'right')}
                                className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
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
                              className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
                              placeholder="Uma breve descrição da sua aventura..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}
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
