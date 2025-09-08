

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
  splashButtonText: string;
  enableChances: boolean;
  positiveEndingImage: string;
  positiveEndingOmitTitle: boolean;
  positiveEndingDescription: string;
  positiveEndingButtonText: string;
  negativeEndingImage: string;
  negativeEndingOmitTitle: boolean;
  negativeEndingDescription: string;
  negativeEndingButtonText: string;
  onUpdate: (field: keyof GameData, value: string | boolean | number) => void;
}

const GameInfoEditor: React.FC<GameInfoEditorProps> = (props) => {
    const { 
        title, logo, hideTitle, omitSplashTitle, 
        splashImage, splashContentAlignment, splashDescription,
        splashButtonText, onUpdate, enableChances,
        positiveEndingImage, positiveEndingOmitTitle, positiveEndingDescription, positiveEndingButtonText,
        negativeEndingImage, negativeEndingOmitTitle, negativeEndingDescription, negativeEndingButtonText,
    } = props;

    const [localTitle, setLocalTitle] = useState(title);
    const [localLogo, setLocalLogo] = useState(logo);
    const [localHideTitle, setLocalHideTitle] = useState(hideTitle);
    const [localOmitSplashTitle, setLocalOmitSplashTitle] = useState(omitSplashTitle);
    const [localSplashImage, setLocalSplashImage] = useState(splashImage);
    const [localSplashContentAlignment, setLocalSplashContentAlignment] = useState(splashContentAlignment);
    const [localSplashDescription, setLocalSplashDescription] = useState(splashDescription);
    const [localSplashButtonText, setLocalSplashButtonText] = useState(splashButtonText);
    const [localEnableChances, setLocalEnableChances] = useState(enableChances);
    const [localPositiveEndingImage, setLocalPositiveEndingImage] = useState(positiveEndingImage);
    const [localPositiveEndingOmitTitle, setLocalPositiveEndingOmitTitle] = useState(positiveEndingOmitTitle);
    const [localPositiveEndingDescription, setLocalPositiveEndingDescription] = useState(positiveEndingDescription);
    const [localPositiveEndingButtonText, setLocalPositiveEndingButtonText] = useState(positiveEndingButtonText);
    const [localNegativeEndingImage, setLocalNegativeEndingImage] = useState(negativeEndingImage);
    const [localNegativeEndingOmitTitle, setLocalNegativeEndingOmitTitle] = useState(negativeEndingOmitTitle);
    const [localNegativeEndingDescription, setLocalNegativeEndingDescription] = useState(negativeEndingDescription);
    const [localNegativeEndingButtonText, setLocalNegativeEndingButtonText] = useState(negativeEndingButtonText);
    const [activeTab, setActiveTab] = useState('geral');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setLocalTitle(props.title);
        setLocalLogo(props.logo);
        setLocalHideTitle(props.hideTitle);
        setLocalOmitSplashTitle(props.omitSplashTitle);
        setLocalSplashImage(props.splashImage);
        setLocalSplashContentAlignment(props.splashContentAlignment);
        setLocalSplashDescription(props.splashDescription);
        setLocalSplashButtonText(props.splashButtonText);
        setLocalEnableChances(props.enableChances);
        setLocalPositiveEndingImage(props.positiveEndingImage);
        setLocalPositiveEndingOmitTitle(props.positiveEndingOmitTitle);
        setLocalPositiveEndingDescription(props.positiveEndingDescription);
        setLocalPositiveEndingButtonText(props.positiveEndingButtonText);
        setLocalNegativeEndingImage(props.negativeEndingImage);
        setLocalNegativeEndingOmitTitle(props.negativeEndingOmitTitle);
        setLocalNegativeEndingDescription(props.negativeEndingDescription);
        setLocalNegativeEndingButtonText(props.negativeEndingButtonText);
        setIsDirty(false);
    }, [props]);

    useEffect(() => {
        const hasChanged = localTitle !== title || 
                         localLogo !== logo || 
                         localHideTitle !== hideTitle ||
                         localOmitSplashTitle !== omitSplashTitle ||
                         localSplashImage !== splashImage ||
                         localSplashContentAlignment !== splashContentAlignment ||
                         localSplashDescription !== splashDescription ||
                         localSplashButtonText !== splashButtonText ||
                         localEnableChances !== enableChances ||
                         localPositiveEndingImage !== positiveEndingImage ||
                         localPositiveEndingOmitTitle !== positiveEndingOmitTitle ||
                         localPositiveEndingDescription !== positiveEndingDescription ||
                         localPositiveEndingButtonText !== positiveEndingButtonText ||
                         localNegativeEndingImage !== negativeEndingImage ||
                         localNegativeEndingOmitTitle !== negativeEndingOmitTitle ||
                         localNegativeEndingDescription !== negativeEndingDescription ||
                         localNegativeEndingButtonText !== negativeEndingButtonText;
        setIsDirty(hasChanged);
    }, [localTitle, localLogo, localHideTitle, localOmitSplashTitle, localSplashImage, localSplashContentAlignment, localSplashDescription, localSplashButtonText, localEnableChances, localPositiveEndingImage, localPositiveEndingOmitTitle, localPositiveEndingDescription, localPositiveEndingButtonText, localNegativeEndingImage, localNegativeEndingOmitTitle, localNegativeEndingDescription, localNegativeEndingButtonText, props]);

    const handleSave = () => {
        if (localTitle !== title) onUpdate('gameTitle', localTitle);
        if (localLogo !== logo) onUpdate('gameLogo', localLogo);
        if (localHideTitle !== hideTitle) onUpdate('gameHideTitle', localHideTitle);
        if (localOmitSplashTitle !== omitSplashTitle) onUpdate('gameOmitSplashTitle', localOmitSplashTitle);
        if (localSplashImage !== splashImage) onUpdate('gameSplashImage', localSplashImage);
        if (localSplashContentAlignment !== splashContentAlignment) onUpdate('gameSplashContentAlignment', localSplashContentAlignment);
        if (localSplashDescription !== splashDescription) onUpdate('gameSplashDescription', localSplashDescription);
        if (localSplashButtonText !== splashButtonText) onUpdate('gameSplashButtonText', localSplashButtonText);
        if (localEnableChances !== enableChances) onUpdate('gameEnableChances', localEnableChances);
        if (localPositiveEndingImage !== positiveEndingImage) onUpdate('gamePositiveEndingImage', localPositiveEndingImage);
        if (localPositiveEndingOmitTitle !== positiveEndingOmitTitle) onUpdate('gamePositiveEndingOmitTitle', localPositiveEndingOmitTitle);
        if (localPositiveEndingDescription !== positiveEndingDescription) onUpdate('gamePositiveEndingDescription', localPositiveEndingDescription);
        if (localPositiveEndingButtonText !== positiveEndingButtonText) onUpdate('gamePositiveEndingButtonText', localPositiveEndingButtonText);
        if (localNegativeEndingImage !== negativeEndingImage) onUpdate('gameNegativeEndingImage', localNegativeEndingImage);
        if (localNegativeEndingOmitTitle !== negativeEndingOmitTitle) onUpdate('gameNegativeEndingOmitTitle', localNegativeEndingOmitTitle);
        if (localNegativeEndingDescription !== negativeEndingDescription) onUpdate('gameNegativeEndingDescription', localNegativeEndingDescription);
        if (localNegativeEndingButtonText !== negativeEndingButtonText) onUpdate('gameNegativeEndingButtonText', localNegativeEndingButtonText);
    };
    
    const handleUndo = () => {
        setLocalTitle(title);
        setLocalLogo(logo);
        setLocalHideTitle(hideTitle);
        setLocalOmitSplashTitle(omitSplashTitle);
        setLocalSplashImage(splashImage);
        setLocalSplashContentAlignment(splashContentAlignment);
        setLocalSplashDescription(splashDescription);
        setLocalSplashButtonText(splashButtonText);
        setLocalEnableChances(enableChances);
        setLocalPositiveEndingImage(positiveEndingImage);
        setLocalPositiveEndingOmitTitle(positiveEndingOmitTitle);
        setLocalPositiveEndingDescription(positiveEndingDescription);
        setLocalPositiveEndingButtonText(positiveEndingButtonText);
        setLocalNegativeEndingImage(negativeEndingImage);
        setLocalNegativeEndingOmitTitle(negativeEndingOmitTitle);
        setLocalNegativeEndingDescription(negativeEndingDescription);
        setLocalNegativeEndingButtonText(negativeEndingButtonText);
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
        fim: 'Fim de Jogo',
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

                <div className="pt-6 border-t border-brand-border/50">
                    <h3 className="text-lg font-semibold text-brand-text mb-4">Sistema de Chances (Vidas)</h3>
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="enableChances" 
                            checked={localEnableChances} 
                            onChange={(e) => setLocalEnableChances(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <label htmlFor="enableChances" className="ml-2 text-sm text-brand-text-dim">
                          Habilitar sistema de chances (vidas). As opções de customização estão na aba "Tema".
                        </label>
                    </div>
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
                            <h4 className="text-lg font-semibold text-brand-text mb-2">Descrição e Botão de Início</h4>
                            <label htmlFor="splashDescription" className="text-sm text-brand-text-dim mb-1 block">Descrição do Jogo</label>
                            <textarea
                              id="splashDescription"
                              value={localSplashDescription}
                              onChange={(e) => setLocalSplashDescription(e.target.value)}
                              rows={6}
                              className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
                              placeholder="Uma breve descrição da sua aventura..."
                            />
                        </div>
                         <div>
                            <label htmlFor="splashButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Início</label>
                            <input
                                type="text"
                                id="splashButtonText"
                                value={localSplashButtonText}
                                onChange={(e) => setLocalSplashButtonText(e.target.value)}
                                className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
                                placeholder="INICIAR"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'fim' && (
            <div className="space-y-10">
                {/* Fim Positivo */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-brand-text">Fim Positivo (Vitória)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-brand-text mb-2">Imagem de Fundo</h4>
                            <div className="flex items-start gap-4">
                                {localPositiveEndingImage && <img src={localPositiveEndingImage} alt="Fundo da tela de vitória" className="h-24 w-auto aspect-video object-cover bg-brand-bg p-1 border border-brand-border rounded" />}
                                <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                    <UploadIcon className="w-5 h-5 mr-2" /> 
                                    {positiveEndingImage ? 'Alterar Imagem' : 'Carregar Imagem'}
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalPositiveEndingImage)} className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div className="space-y-2">
                             <h4 className="text-lg font-semibold text-brand-text mb-2">Título</h4>
                             <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="omitPositiveEndingTitle"
                                checked={localPositiveEndingOmitTitle}
                                onChange={(e) => setLocalPositiveEndingOmitTitle(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                              />
                              <label htmlFor="omitPositiveEndingTitle" className="ml-2 text-sm text-brand-text-dim">Omitir título da tela de vitória</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="positiveEndingDescription" className="text-sm text-brand-text-dim mb-1 block">Descrição da Vitória</label>
                        <textarea id="positiveEndingDescription" value={localPositiveEndingDescription} onChange={(e) => setLocalPositiveEndingDescription(e.target.value)} rows={4} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary" placeholder="Parabéns, você venceu!"/>
                    </div>
                    <div>
                        <label htmlFor="positiveEndingButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão</label>
                        <input type="text" id="positiveEndingButtonText" value={localPositiveEndingButtonText} onChange={(e) => setLocalPositiveEndingButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary" placeholder="Jogar Novamente"/>
                    </div>
                </div>
                
                {/* Fim Negativo */}
                <div className="space-y-6 pt-10 border-t border-brand-border/50">
                     <h3 className="text-2xl font-bold text-brand-text">Fim Negativo (Derrota)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-brand-text mb-2">Imagem de Fundo</h4>
                            <div className="flex items-start gap-4">
                                {localNegativeEndingImage && <img src={localNegativeEndingImage} alt="Fundo da tela de derrota" className="h-24 w-auto aspect-video object-cover bg-brand-bg p-1 border border-brand-border rounded" />}
                                <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                    <UploadIcon className="w-5 h-5 mr-2" /> 
                                    {negativeEndingImage ? 'Alterar Imagem' : 'Carregar Imagem'}
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalNegativeEndingImage)} className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div className="space-y-2">
                             <h4 className="text-lg font-semibold text-brand-text mb-2">Título</h4>
                             <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="omitNegativeEndingTitle"
                                checked={localNegativeEndingOmitTitle}
                                onChange={(e) => setLocalNegativeEndingOmitTitle(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                              />
                              <label htmlFor="omitNegativeEndingTitle" className="ml-2 text-sm text-brand-text-dim">Omitir título da tela de derrota</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="negativeEndingDescription" className="text-sm text-brand-text-dim mb-1 block">Descrição da Derrota</label>
                        <textarea id="negativeEndingDescription" value={localNegativeEndingDescription} onChange={(e) => setLocalNegativeEndingDescription(e.target.value)} rows={4} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary" placeholder="Fim de jogo..."/>
                    </div>
                    <div>
                        <label htmlFor="negativeEndingButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão</label>
                        <input type="text" id="negativeEndingButtonText" value={localNegativeEndingButtonText} onChange={(e) => setLocalNegativeEndingButtonText(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary" placeholder="Tentar Novamente"/>
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
