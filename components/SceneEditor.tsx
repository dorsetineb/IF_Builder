import React, { useState, useEffect, DragEvent, useRef } from 'react';
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
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
  layoutOrientation: 'vertical' | 'horizontal';
}

const getCleanSceneState = (s: Scene): Scene => {
  return {
    ...s,
    isEndingScene: !!s.isEndingScene,
    removesChanceOnEntry: !!s.removesChanceOnEntry,
    restoresChanceOnEntry: !!s.restoresChanceOnEntry,
    objects: s.objects || [],
    interactions: s.interactions || [],
  };
};

const SceneEditor: React.FC<SceneEditorProps> = ({ 
    scene, 
    allScenes, 
    onUpdateScene, 
    allObjectIds, 
    onPreviewScene,
    sceneOrder,
    onSelectScene,
    isDirty,
    onSetDirty,
    layoutOrientation,
}) => {
  const [localScene, setLocalScene] = useState<Scene>(() => getCleanSceneState(scene));
  const [activeTab, setActiveTab] = useState<'properties' | 'objects' | 'interactions'>('properties');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const initialSceneJson = useRef(JSON.stringify(getCleanSceneState(scene)));
  
  // Reset state only when a different scene is selected
  useEffect(() => {
    const cleanScene = getCleanSceneState(scene);
    setLocalScene(cleanScene);
    initialSceneJson.current = JSON.stringify(cleanScene);
    setActiveTab('properties');
  }, [scene.id]);

  // Check for changes against the stored initial JSON and report to parent
  useEffect(() => {
    const currentJson = JSON.stringify(localScene);
    const currentlyDirty = currentJson !== initialSceneJson.current;
    onSetDirty(currentlyDirty);
  }, [localScene, onSetDirty]);

  const updateLocalScene = <K extends keyof Scene,>(key: K, value: Scene[K]) => {
    setLocalScene(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: 'isEndingScene' | 'removesChanceOnEntry' | 'restoresChanceOnEntry', value: boolean) => {
    setLocalScene(prev => {
        let newScene = { ...prev };

        // If we are checking a box, uncheck all others first.
        if (value) {
            newScene.isEndingScene = false;
            newScene.removesChanceOnEntry = false;
            newScene.restoresChanceOnEntry = false;
        }

        // Now, set the value for the box that was clicked.
        newScene[key] = value;

        // Special handling for winning scene
        if (key === 'isEndingScene' && value) {
            newScene.objects = [];
            newScene.interactions = [];
        }

        return newScene;
    });
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

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const event = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleImageUpload(event);
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
    setLocalScene(JSON.parse(initialSceneJson.current));
  };

  const handlePreview = () => {
    onPreviewScene(localScene);
  };

  const currentSceneIndex = sceneOrder.indexOf(scene.id);
  const prevSceneId = currentSceneIndex > 0 ? sceneOrder[currentSceneIndex - 1] : null;
  const nextSceneId = currentSceneIndex < sceneOrder.length - 1 ? sceneOrder[currentSceneIndex + 1] : null;

  const handleNavigate = (targetId: string | null) => {
      if (!targetId) return;
      // Confirmation logic is now handled by the parent component via onSelectScene prop
      onSelectScene(targetId);
  };

  const TABS = {
    properties: 'Propriedades',
    objects: 'Objetos',
    interactions: 'Interações',
  };

  const isAnyCheckboxChecked = !!localScene.isEndingScene || !!localScene.removesChanceOnEntry || !!localScene.restoresChanceOnEntry;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-start">
        <div>
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-brand-text">Editor de Cena</h2>
                {isDirty && (
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Alterações não salvas"></div>
                )}
            </div>
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

      <div>
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

        <div className="bg-brand-surface rounded-b-lg rounded-r-lg border border-t-0 border-brand-border -mt-px p-6">
          {activeTab === 'properties' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex flex-col space-y-3">
                      <div className="flex-grow relative">
                          {localScene.image ? (
                              <img src={localScene.image} alt={localScene.name} className="w-full h-full min-h-[300px] object-cover rounded-md border border-brand-border bg-brand-bg" />
                          ) : (
                              <label 
                                  htmlFor="image-upload-input" 
                                  className={`flex flex-col items-center justify-center w-full h-full min-h-[300px] border-2 border-dashed rounded-md bg-brand-bg cursor-pointer hover:bg-brand-border/30 transition-colors ${isDraggingOver ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-border'}`}
                                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                                  onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(false); }}
                                  onDrop={handleDrop}
                              >
                                  <UploadIcon className="w-10 h-10 text-brand-text-dim mb-4" />
                                  <span className="text-brand-text font-semibold">Clique para Enviar uma Imagem</span>
                                  <span className="text-xs text-brand-text-dim mt-1">ou arraste e solte aqui</span>
                              </label>
                          )}
                      </div>
                      <div className="flex-shrink-0">
                          <div className="flex items-center gap-2">
                              <label htmlFor="image-upload-input" className="inline-flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                <UploadIcon className="w-5 h-5 mr-2" /> {localScene.image ? 'Alterar Imagem' : 'Carregar Imagem'}
                              </label>
                              <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
                        <input type="text" id="sceneName" value={localScene.name} onChange={handleNameChange} className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"/>
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
                              <textarea id="sceneDescription" value={localScene.description} onChange={handleDescriptionChange} className="w-full h-full min-h-[200px] bg-brand-bg border border-brand-border rounded-md px-3 py-2 resize-y focus:ring-0"/>
                          </div>
                      </div>
                      <div className="space-y-4 pt-4">
                          <div className="flex items-center">
                              <input
                                  type="checkbox"
                                  id="isEndingScene"
                                  checked={!!localScene.isEndingScene}
                                  onChange={e => handleToggle('isEndingScene', e.target.checked)}
                                  className="custom-checkbox"
                                  disabled={isAnyCheckboxChecked && !localScene.isEndingScene}
                              />
                              <label htmlFor="isEndingScene" className={`ml-2 block text-sm text-brand-text-dim ${isAnyCheckboxChecked && !localScene.isEndingScene ? 'opacity-50' : ''}`}>
                                  Esta cena vence o jogo.
                              </label>
                          </div>
                          <div className="flex items-center">
                              <input
                                  type="checkbox"
                                  id="removesChance"
                                  checked={!!localScene.removesChanceOnEntry}
                                  onChange={e => handleToggle('removesChanceOnEntry', e.target.checked)}
                                  className="custom-checkbox"
                                  disabled={isAnyCheckboxChecked && !localScene.removesChanceOnEntry}
                              />
                              <label htmlFor="removesChance" className={`ml-2 block text-sm text-brand-text-dim ${isAnyCheckboxChecked && !localScene.removesChanceOnEntry ? 'opacity-50' : ''}`}>
                                  Esta cena remove uma chance/vida.
                              </label>
                          </div>
                          <div className="flex items-center">
                              <input
                                  type="checkbox"
                                  id="restoresChance"
                                  checked={!!localScene.restoresChanceOnEntry}
                                  onChange={e => handleToggle('restoresChanceOnEntry', e.target.checked)}
                                  className="custom-checkbox"
                                  disabled={isAnyCheckboxChecked && !localScene.restoresChanceOnEntry}
                              />
                              <label htmlFor="restoresChance" className={`ml-2 block text-sm text-brand-text-dim ${isAnyCheckboxChecked && !localScene.restoresChanceOnEntry ? 'opacity-50' : ''}`}>
                                  Esta cena restaura uma chance/vida.
                              </label>
                          </div>
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