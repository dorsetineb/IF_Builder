
import React, { useState, useEffect } from 'react';
import { Scene, GameObject } from '../types';
import ObjectEditor from './ObjectEditor';
import InteractionEditor from './InteractionEditor';
import { UploadIcon } from './icons/UploadIcon';
import CollapsibleCard from './CollapsibleCard';
import { SparklesIcon } from './icons/SparklesIcon';
import { generateSceneImage } from '../services/geminiService';
import { TrashIcon } from './icons/TrashIcon';

interface SceneEditorProps {
  scene: Scene;
  allScenes: Scene[];
  onUpdateScene: (scene: Scene) => void;
}

const SceneEditor: React.FC<SceneEditorProps> = ({ scene, allScenes, onUpdateScene }) => {
  const [localScene, setLocalScene] = useState<Scene>(scene);
  const [isDirty, setIsDirty] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  useEffect(() => {
    setLocalScene(scene);
    setIsDirty(false);
  }, [scene]);

  useEffect(() => {
    if (JSON.stringify(localScene) !== JSON.stringify(scene)) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [localScene, scene]);

  const updateLocalScene = <K extends keyof Scene,>(key: K, value: Scene[K]) => {
    setLocalScene(prev => ({ ...prev, [key]: value }));
  };
  
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLocalScene('id', e.target.value);
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLocalScene('name', e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateLocalScene('description', e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  updateLocalScene('image', event.target.result);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };
  
  const handleGenerateImage = async () => {
      if (!localScene.description) {
          alert("Por favor, escreva uma descrição para a cena antes de gerar uma imagem.");
          return;
      }
      setIsGeneratingImage(true);
      try {
          const prompt = `Pixel art no estilo de um jogo de computador dos anos 80 como Dungeon Master. Estética de fantasia sombria, 16-bit. A ilustração NÃO deve conter nenhum texto, margens ou molduras, preenchendo toda a área da imagem. A cena é: "${localScene.description}"`;
          const imageUrl = await generateSceneImage(prompt);
          updateLocalScene('image', imageUrl);
      } catch (error) {
          console.error(error);
          alert(error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao gerar la imagem.");
      } finally {
          setIsGeneratingImage(false);
      }
  };
  
  const handleSave = () => {
    const finalScene = {
        ...localScene,
        id: localScene.id.trim().replace(/\s+/g, '_').toLowerCase() || `cena_${Date.now()}`
    };
    onUpdateScene(finalScene);
  }
  
  const handleUndo = () => {
    setLocalScene(scene);
  };


  return (
    <div className="space-y-4 pb-24">
      <CollapsibleCard title="Propriedades" startOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Left Column: Image */}
            <div className="flex flex-col space-y-3">
                <div className="flex-grow relative">
                    <img src={localScene.image} alt={localScene.name} className="w-full h-full min-h-[300px] object-cover rounded-md border border-brand-border bg-brand-bg" />
                    {isGeneratingImage && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-md">
                            <div className="text-white text-center">
                                <p className="text-lg font-semibold animate-pulse">Gerando imagem...</p>
                                <p className="text-sm">Isso pode levar um momento.</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <label className="inline-flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                           <UploadIcon className="w-5 h-5 mr-2" /> Carregar Imagem
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        <button 
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImage}
                            className="inline-flex items-center px-4 py-2 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition-colors cursor-pointer disabled:bg-purple-400 disabled:cursor-wait"
                        >
                           <SparklesIcon className="w-5 h-5 mr-2" />
                           {isGeneratingImage ? 'Gerando...' : 'Gerar Imagem (IA)'}
                        </button>
                    </div>
                    <p className="text-xs text-brand-text-dim mt-2">imagens na proporção 9:16 (vertical), recomendado 1080x1920 pixels (.jpg, .png ou .gif)</p>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-4 flex flex-col">
                <div>
                  <label htmlFor="sceneName" className="block text-sm font-medium text-brand-text-dim mb-1">Nome da Cena</label>
                  <input type="text" id="sceneName" value={localScene.name} onChange={handleNameChange} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"/>
                </div>
                <div>
                  <label htmlFor="sceneId" className="block text-sm font-medium text-brand-text-dim mb-1">ID da Cena (único, sem espaços)</label>
                  <input type="text" id="sceneId" value={localScene.id} onChange={handleIdChange} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"/>
                </div>
                <div className="flex flex-col flex-1 min-h-0">
                    <label htmlFor="sceneDescription" className="block text-sm font-medium text-brand-text-dim mb-1">Descrição</label>
                     <div className="relative flex-1">
                        <textarea id="sceneDescription" value={localScene.description} onChange={handleDescriptionChange} className="w-full h-full min-h-[200px] bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary resize-y"/>
                     </div>
                </div>
            </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Objetos">
        <ObjectEditor
            objects={localScene.objects || []}
            onUpdateObjects={newObjects => updateLocalScene('objects', newObjects)}
        />
      </CollapsibleCard>

      <CollapsibleCard title="Interações">
        <InteractionEditor
            interactions={localScene.interactions || []}
            onUpdateInteractions={newInteractions => updateLocalScene('interactions', newInteractions)}
            allScenes={allScenes}
            currentSceneId={localScene.id}
            sceneObjects={localScene.objects || []}
        />
      </CollapsibleCard>

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
              title={isDirty ? "Salvar alterações na cena" : "Nenhuma alteração para salvar"}
          >
              Salvar
          </button>
      </div>
    </div>
  );
};

export default SceneEditor;