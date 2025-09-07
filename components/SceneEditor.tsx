
import React, { useState, useEffect } from 'react';
import { Scene } from '../types';
import ObjectEditor from './ObjectEditor';
import InteractionEditor from './InteractionEditor';
import { UploadIcon } from './icons/UploadIcon';
import { EyeIcon } from './icons/EyeIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface SceneEditorProps {
  scene: Scene;
  allScenes: Scene[];
  onUpdateScene: (scene: Scene) => void;
  allObjectIds: string[];
  onPreviewScene: (scene: Scene) => void;
  sceneOrder: string[];
  onSelectScene: (id: string) => void;
  onDirtyStateChange: (sceneId: string, isDirty: boolean) => void;
  layoutOrientation: 'vertical' | 'horizontal';
}

const SceneEditor: React.FC<SceneEditorProps> = ({ 
    scene, 
    allScenes, 
    onUpdateScene, 
    allObjectIds, 
    onPreviewScene,
    sceneOrder,
    onSelectScene,
    onDirtyStateChange,
    layoutOrientation,
}) => {
  const [localScene, setLocalScene] = useState<Scene>(scene);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'objects' | 'interactions'>('properties');
  
  useEffect(() => {
    setLocalScene(scene);
    setIsDirty(false);
    setActiveTab('properties');
  }, [scene]);

  useEffect(() => {
    if (JSON.stringify(localScene) !== JSON.stringify(scene)) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [localScene, scene]);

  useEffect(() => {
    onDirtyStateChange(localScene.id, isDirty);
  }, [isDirty, localScene.id, onDirtyStateChange]);

  const updateLocalScene = <K extends keyof Scene,>(key: K, value: Scene[K]) => {
    setLocalScene(prev => ({ ...prev, [key]: value }));
  };

  const handleEndingSceneToggle = (isChecked: boolean) => {
    setLocalScene(prev => ({
        ...prev,
        isEndingScene: isChecked,
        objects: isChecked ? [] : prev.objects, 
        interactions: isChecked ? [] : prev.interactions,
    }));
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
  
  const handleSave = () => {
    const finalScene: Scene = { ...localScene };
    if (finalScene.isEndingScene) {
        finalScene.objects = [];
        finalScene.interactions = [];
    }
    onUpdateScene(finalScene);
  }
  
  const handleUndo = () => {
    setLocalScene(scene);
  };

  const handlePreview = () => {
    onPreviewScene(localScene);
  };

  const currentSceneIndex = sceneOrder.indexOf(scene.id);
  const prevSceneId = currentSceneIndex > 0 ? sceneOrder[currentSceneIndex - 1] : null;
  const nextSceneId = currentSceneIndex < sceneOrder.length - 1 ? sceneOrder[currentSceneIndex + 1] : null;

  const handleNavigate = (targetId: string | null) => {
      if (!targetId) return;
      if (isDirty) {
          if (window.confirm('Você tem alterações não salvas. Deseja descartá-las e mudar de cena?')) {
              onSelectScene(targetId);
          }
      } else {
          onSelectScene(targetId);
      }
  };

  const TABS = {
    properties: 'Propriedades',
    objects: 'Objetos',
    interactions: 'Interações',
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-brand-text">Editor de Cena</h2>
            <p className="text-brand-text-dim mt-1">
            Defina a imagem, descrição, objetos e interações para a cena <code className="bg-brand-bg px-1 py-0.5 rounded text-brand-primary-hover">{localScene.name}</code>.
            </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-1">
            <button
                onClick={() => handleNavigate(prevSceneId)}
                disabled={!prevSceneId}
                className="p-2 rounded-md hover:bg-brand-surface disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cena Anterior"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
                onClick={() => handleNavigate(nextSceneId)}
                disabled={!nextSceneId}
                className="p-2 rounded-md hover:bg-brand-surface disabled:opacity-50 disabled:cursor-not-allowed"
                title="Próxima Cena"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
      </div>

      <div className="border-b border-brand-border flex space-x-1">
        {Object.entries(TABS).map(([key, name]) => {
            const isTabDisabled = localScene.isEndingScene && (key === 'objects' || key === 'interactions');
            return (
                <button
                    key={key}
                    onClick={() => !isTabDisabled && setActiveTab(key as any)}
                    disabled={isTabDisabled}
                    className={`px-4 py-2 font-semibold text-sm rounded-t-md transition-colors ${
                        activeTab === key
                            ? 'bg-brand-surface border-brand-border border-t border-x text-brand-primary'
                            : 'text-brand-text-dim hover:text-brand-text'
                    } ${isTabDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {name}
                </button>
            );
        })}
      </div>

      <div className="bg-brand-surface rounded-b-lg rounded-r-lg border border-t-0 border-brand-border -mt-6 p-6">
        {activeTab === 'properties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex flex-col space-y-3">
                    <div className="flex-grow relative">
                        <img src={localScene.image} alt={localScene.name} className="w-full h-full min-h-[300px] object-cover rounded-md border border-brand-border bg-brand-bg" />
                    </div>
                    <div className="flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <label className="inline-flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                               <UploadIcon className="w-5 h-5 mr-2" /> Carregar Imagem
                               <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                        <p className="text-xs text-brand-text-dim mt-2">
                            {layoutOrientation === 'horizontal'
                                ? 'imagens na proporção 16:9 (horizontal), recomendado 1920x1080 pixels (.jpg, .png ou .gif)'
                                : 'imagens na proporção 9:16 (vertical), recomendado 1080x1920 pixels (.jpg, .png ou .gif)'}
                        </p>
                    </div>
                </div>

                <div className="space-y-4 flex flex-col">
                    <div>
                      <label htmlFor="sceneName" className="block text-sm font-medium text-brand-text-dim mb-1">Nome da Cena</label>
                      <input type="text" id="sceneName" value={localScene.name} onChange={handleNameChange} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"/>
                    </div>
                    <div>
                      <label htmlFor="sceneId" className="block text-sm font-medium text-brand-text-dim mb-1">ID da Cena</label>
                      <p 
                        id="sceneId" 
                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-brand-text-dim font-mono select-all"
                        title="O ID da cena é único e não pode ser alterado."
                      >
                        {localScene.id}
                      </p>
                    </div>
                    <div className="flex flex-col flex-1 min-h-0">
                        <label htmlFor="sceneDescription" className="block text-sm font-medium text-brand-text-dim mb-1">
                          {localScene.isEndingScene ? 'Mensagem de Fim de Jogo' : 'Descrição'}
                        </label>
                         <div className="relative flex-1">
                            <textarea id="sceneDescription" value={localScene.description} onChange={handleDescriptionChange} className="w-full h-full min-h-[200px] bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary resize-y"/>
                         </div>
                    </div>
                    <div className="flex items-center pt-2 border-t border-brand-border/50">
                        <input
                            type="checkbox"
                            id="isEndingScene"
                            checked={!!localScene.isEndingScene}
                            onChange={e => handleEndingSceneToggle(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <label htmlFor="isEndingScene" className="ml-2 block text-sm text-brand-text-dim">
                            Esta é uma cena final (Fim de Jogo).
                        </label>
                    </div>
                </div>
            </div>
        )}
        
        {activeTab === 'objects' && !localScene.isEndingScene && (
            <ObjectEditor
                objects={localScene.objects || []}
                onUpdateObjects={newObjects => updateLocalScene('objects', newObjects)}
                allObjectIds={allObjectIds}
            />
        )}
        
        {activeTab === 'interactions' && !localScene.isEndingScene && (
             <InteractionEditor
                interactions={localScene.interactions || []}
                onUpdateInteractions={newInteractions => updateLocalScene('interactions', newInteractions)}
                allScenes={allScenes}
                currentSceneId={localScene.id}
                sceneObjects={localScene.objects || []}
            />
        )}

        {localScene.isEndingScene && (activeTab === 'objects' || activeTab === 'interactions') && (
            <div className="text-center p-4 bg-brand-bg border-2 border-dashed border-brand-border rounded-md text-brand-text-dim">
                Cenas finais não possuem objetos ou interações.
            </div>
        )}
      </div>


      <div className="fixed bottom-6 right-10 z-10 flex gap-2">
           <button
              onClick={handlePreview}
              className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors"
              title="Pré-visualizar esta cena (com alterações não salvas)"
            >
              <EyeIcon className="w-5 h-5 mr-2" />
              Pré-visualizar Cena
            </button>
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