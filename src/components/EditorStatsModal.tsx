
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  FileText, 
  Package, 
  Layers, 
  Clock, 
  AlertCircle, 
  X,
  PlusCircle,
  Hash,
  Activity,
  HardDrive,
  Target,
  Search,
  Zap,
  Type
} from 'lucide-react';
import { calculateEditorStats } from '../utils/statsCalculator';
import { GameData } from '../types';

interface EditorStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameData: GameData;
  onSceneClick?: (sceneId: string) => void;
}

const StatCard: React.FC<{
  label: string;
  value: string | number;
  subValue?: string;
  rightLabel?: string;
  rightValue?: string | number;
  rightSubValue?: string;
  className?: string;
}> = ({ label, value, subValue, rightLabel, rightValue, rightSubValue, className = "" }) => (
  <div className={`bg-zinc-900/40 border border-white/10 p-3 rounded-lg flex items-center hover:bg-zinc-900/60 transition-colors h-full min-h-[80px] ${className}`}>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">{label}</p>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-lg font-bold text-zinc-100 tabular-nums leading-none">{value}</span>
        {subValue && <span className="text-[9px] text-zinc-400 font-medium leading-none">{subValue}</span>}
      </div>
    </div>
    {rightLabel && (
      <div className="ml-auto text-right">
         <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">{rightLabel}</p>
         <div className="flex items-baseline justify-end gap-1 mt-0.5">
           <span className="text-lg font-bold text-zinc-300 tabular-nums leading-none">{rightValue}</span>
           {rightSubValue && <span className="text-[9px] text-zinc-400 font-medium leading-none">{rightSubValue}</span>}
         </div>
      </div>
    )}
  </div>
);

const EditorStatsModal: React.FC<EditorStatsModalProps> = ({ isOpen, onClose, gameData, onSceneClick }) => {
  const { t } = useTranslation();
  const stats = calculateEditorStats(gameData);

  if (!isOpen) return null;

  // Get Top verbs
  const topVerbs = Object.entries(stats.verbDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="fixed inset-0 z-[4000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-background border border-muted-foreground/50 rounded-lg w-full max-w-5xl max-h-[90vh] min-h-[550px] overflow-hidden shadow-xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          {/* Volumetria e Escala */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-foreground uppercase flex items-center gap-2">
                <Layers className="w-4 h-4" /> {t('editorStats.totalScenes')}
              </h3>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground -mt-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
              <StatCard 
                label={t('editorStats.scenesStart')} 
                value={stats.scenesByType.scenes} 
              />
              <StatCard 
                label={t('editorStats.scenesIntermediate')} 
                value={stats.scenesByType.transitionVignettes} 
              />
              <StatCard 
                label={t('editorStats.scenesVictory')} 
                value={stats.scenesByType.victoryVignettes} 
              />
              <StatCard 
                label={t('editorStats.scenesDefeat')} 
                value={stats.scenesByType.defeatVignettes} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
               <StatCard 
                  label={t('editorStats.totalObjects')} 
                  value={stats.totalGlobalObjects} 
                  subValue={`(${stats.totalTakableObjects} ${t('editorStats.takable')})`}
                  rightLabel={t('editorStats.avgObjects')}
                  rightValue={stats.avgObjectsPerScene}
                />
                <StatCard 
                  label={t('editorStats.totalInteractions')} 
                  value={stats.totalInteractions} 
                  rightLabel={t('editorStats.avgInteractions')}
                  rightValue={stats.avgInteractionsPerScene}
                />
            </div>
          </div>

          {/* Densidade Literária */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> {t('editorStats.content')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                <StatCard 
                  label={t('editorStats.avgWords')} 
                  value={stats.avgWordsPerScene} 
                  subValue={t('editorStats.avgWordsPerScene')}
                  rightLabel={t('editorStats.totalWords')}
                  rightValue={stats.totalWords.toLocaleString()}
                />
                <StatCard 
                  label={t('editorStats.avgReadingTime')} 
                  value={stats.avgReadingTimePerSceneMinutes} 
                  subValue={t('editorStats.minutes')}
                  rightLabel={t('editorStats.totalReadingTime')}
                  rightValue={stats.totalReadingTimeMinutes}
                  rightSubValue={t('editorStats.minutes')}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
              <div className="bg-zinc-900/20 border border-white/10 p-3 rounded-lg space-y-3 h-full flex flex-col justify-center">
                {stats.sceneWithMostWords ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">{t('editorStats.mostWords')}</p>
                    <p 
                      className={`text-sm font-medium text-zinc-200 line-clamp-1 ${onSceneClick ? 'cursor-pointer hover:text-emerald-400 transition-colors' : ''}`}
                      onClick={() => {
                        if (onSceneClick) {
                          onSceneClick(stats.sceneWithMostWords!.id);
                          onClose();
                        }
                      }}
                    >
                      {stats.sceneWithMostWords.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 tabular-nums">{stats.sceneWithMostWords.count} {t('editorStats.totalWords').toLowerCase()}</p>
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('editorStats.mostWords')}</p>
                )}
              </div>
              <div className="bg-zinc-900/20 border border-white/10 p-3 rounded-lg space-y-3 h-full flex flex-col justify-center">
                {stats.sceneWithLeastWords ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">{t('editorStats.leastWords')}</p>
                    <p 
                      className={`text-sm font-medium text-zinc-200 line-clamp-1 ${onSceneClick ? 'cursor-pointer hover:text-emerald-400 transition-colors' : ''}`}
                      onClick={() => {
                        if (onSceneClick) {
                          onSceneClick(stats.sceneWithLeastWords!.id);
                          onClose();
                        }
                      }}
                    >
                      {stats.sceneWithLeastWords.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 tabular-nums">{stats.sceneWithLeastWords.count} {t('editorStats.totalWords').toLowerCase()}</p>
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('editorStats.leastWords')}</p>
                )}
              </div>
              <div className="bg-zinc-900/20 border border-white/10 p-3 rounded-lg space-y-3 h-full flex flex-col justify-center">
                {stats.sceneWithMostInteractions ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">{t('editorStats.mostInteractions')}</p>
                    <p 
                      className={`text-sm font-medium text-zinc-200 line-clamp-1 ${onSceneClick ? 'cursor-pointer hover:text-emerald-400 transition-colors' : ''}`}
                      onClick={() => {
                        if (onSceneClick) {
                          onSceneClick(stats.sceneWithMostInteractions!.id);
                          onClose();
                        }
                      }}
                    >
                      {stats.sceneWithMostInteractions.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 tabular-nums">{stats.sceneWithMostInteractions.count} {t('editorStats.interactions')}</p>
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('editorStats.mostInteractions')}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 pt-2">
            {/* QA Audit & Weight */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-foreground uppercase mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" /> {t('editorStats.qaAudit')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                <div className="flex flex-col gap-2 p-3 bg-zinc-900/20 rounded-lg border border-white/10 justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('editorStats.assetWeight')}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="py-1 md:py-0 md:px-2 flex flex-col items-center justify-center">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase text-center">{t('editorStats.estimatedSize')}</span>
                      <span className="text-base font-bold text-zinc-100 tabular-nums text-center">{stats.estimatedAssetSizeMB} MB</span>
                    </div>
                    <div className="py-1 md:py-0 md:px-2 flex flex-col items-center justify-center">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase text-center">{t('editorStats.heaviestAsset')}</span>
                      <span className="text-sm font-bold text-zinc-300 tabular-nums text-center">{stats.maxAssetSizeMB} MB</span>
                    </div>
                    <div className="py-1 md:py-0 md:px-2 flex flex-col items-center justify-center">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase text-center">{t('editorStats.avgAssetWeight')}</span>
                      <span className="text-sm font-bold text-zinc-300 tabular-nums text-center">{stats.avgAssetSizeMBPerScene} MB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/20 border border-white/10 p-3 rounded-lg space-y-2 h-full flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('editorStats.verbs')}</p>
                  <div className="flex flex-wrap gap-1.5">
                     {topVerbs.length > 0 ? topVerbs.map(([verb, count]) => (
                       <div key={verb} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-zinc-300 font-medium">
                          <span className="text-zinc-500 mr-1">{count}x</span> {verb}
                       </div>
                     )) : (
                       <p className="text-[10px] text-zinc-600 italic">Nenhum verbo registrado</p>
                     )}
                  </div>
                </div>
              </div>
            </div>

            {/* Integridade do Projeto */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground uppercase mb-4 flex items-center gap-2">
                   <Activity className="w-4 h-4" /> {t('editorStats.integrity')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3 items-stretch">
                   <div className="p-2.5 bg-zinc-900/30 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 h-full">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">{t('editorStats.deadEnds')}</span>
                      <span className={`text-lg font-bold ${stats.integrity.deadEndScenes > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{stats.integrity.deadEndScenes}</span>
                   </div>
                   <div className="p-2.5 bg-zinc-900/30 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 h-full">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">{t('editorStats.orphanScenes')}</span>
                      <span className={`text-lg font-bold ${stats.integrity.orphanScenes > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{stats.integrity.orphanScenes}</span>
                   </div>
                   <div className="p-2.5 bg-zinc-900/30 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 h-full">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">{t('editorStats.scenesMissingImage')}</span>
                      <span className={`text-lg font-bold ${stats.accessibility.scenesMissingImages > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{stats.accessibility.scenesMissingImages}</span>
                   </div>
                   <div className="p-2.5 bg-zinc-900/30 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 h-full">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">{t('editorStats.scenesMissingDesc')}</span>
                      <span className={`text-lg font-bold ${stats.accessibility.scenesMissingDescriptions > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{stats.accessibility.scenesMissingDescriptions}</span>
                   </div>
                   <div className="p-2.5 bg-zinc-900/30 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 h-full">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">{t('editorStats.objectsMissingImage')}</span>
                      <span className={`text-lg font-bold text-zinc-400`}>{stats.accessibility.objectsMissingImages}</span>
                   </div>
                   <div className="p-2.5 bg-zinc-900/30 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 h-full">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">{t('editorStats.uselessObjects')}</span>
                      <span className={`text-lg font-bold ${stats.uselessObjectsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{stats.uselessObjectsCount}</span>
                   </div>
                   <div className="p-2.5 bg-zinc-900/30 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 h-full">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">{t('editorStats.hollowInteractions')}</span>
                      <span className={`text-lg font-bold ${stats.interactionsWithoutEffectCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{stats.interactionsWithoutEffectCount}</span>
                   </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditorStatsModal;
