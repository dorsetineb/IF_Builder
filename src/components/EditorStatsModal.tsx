
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  FileText, 
  Package, 
  Layers, 
  X,
  Activity,
  Search,
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
  <div className={`bg-background/40 border border-muted-foreground/20 p-3 rounded-lg flex flex-col justify-between hover:bg-background/60 transition-all shadow-sm h-full min-h-[80px] ${className}`}>
    <div className="flex justify-between items-start gap-2">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">{label}</p>
      {rightLabel && (
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight text-right">{rightLabel}</p>
      )}
    </div>
    <div className="flex justify-between items-baseline mt-2">
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-foreground tabular-nums leading-none">{value}</span>
        {subValue && <span className="text-[9px] text-muted-foreground font-medium leading-none">{subValue}</span>}
      </div>
      {rightLabel && (
        <div className="flex items-baseline justify-end gap-1">
          <span className="text-lg font-bold text-muted-foreground tabular-nums leading-none">{rightValue}</span>
          {rightSubValue && <span className="text-[9px] text-muted-foreground font-medium leading-none">{rightSubValue}</span>}
        </div>
      )}
    </div>
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
    <div className="fixed inset-0 z-[4000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto lg:overflow-hidden" onClick={onClose}>
      <div 
        className="bg-background border border-muted-foreground/50 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-muted-foreground/20 bg-card/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest leading-none">{t('editorStats.modalTitle')}</h2>
              <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tight">{stats.totalScenes} {t('editorStats.scenesCount')}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 gap-4 grid grid-cols-1 lg:grid-cols-12 custom-scrollbar lg:max-h-none">
          
          {/* Volumetria e Escala */}
          <div className="lg:col-span-8 bg-card border border-muted-foreground/50 rounded-xl p-5 shadow-sm flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-primary" /> {t('editorStats.narrativeMetrics')}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
              <StatCard 
                label={t('editorStats.opening')} 
                value={stats.scenesByType.opening} 
              />
              <StatCard 
                label={t('editorStats.regularScenes')} 
                value={stats.scenesByType.scenes} 
              />
              <StatCard 
                label={t('editorStats.transitionVignettes')} 
                value={stats.scenesByType.transition} 
              />
              <StatCard 
                label={t('editorStats.conclusions')} 
                value={stats.scenesByType.victory} 
              />
              <StatCard 
                label={t('editorStats.negativeConclusions')} 
                value={stats.scenesByType.defeat} 
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-auto">
              <div className="bg-background/40 border border-muted-foreground/20 p-3 rounded-lg flex flex-col justify-between hover:bg-background/60 transition-all shadow-sm h-full min-h-[80px]">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">{t('editorStats.totalObjects')}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight text-right">{t('editorStats.avgObjects')}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div className="flex gap-20">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">{t('editorStats.created')}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-foreground tabular-nums leading-none">{stats.totalGlobalObjects}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">{t('editorStats.used')}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-foreground tabular-nums leading-none">{stats.usedObjectsCount}</span>
                        <span className="text-[8px] text-muted-foreground font-medium leading-none">
                          ({stats.usedTakableObjectsCount} {t('editorStats.takable')})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-lg font-bold text-muted-foreground tabular-nums leading-none">{stats.avgObjectsPerScene}</span>
                  </div>
                </div>
              </div>
                <StatCard 
                  label={t('editorStats.totalInteractions')} 
                  value={stats.totalInteractions} 
                  rightLabel={t('editorStats.avgInteractions')}
                  rightValue={stats.avgInteractionsPerScene}
                />
            </div>
          </div>

          {/* QA Audit & Weight */}
          <div className="lg:col-span-4 bg-card border border-muted-foreground/50 rounded-xl p-5 shadow-sm flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-primary" /> {t('editorStats.qaAudit')}
            </h3>
            <div className="flex flex-col gap-3 h-full justify-between">
              <div className="flex flex-col gap-2 p-3 bg-background/30 rounded-lg border border-muted-foreground/20">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t('editorStats.assetWeight')}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-muted-foreground font-bold uppercase">.ZIP</span>
                    <span className="text-sm font-bold text-foreground tabular-nums">{stats.estimatedZipSizeMB}MB</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-muted-foreground font-bold uppercase">.HTML</span>
                    <span className="text-sm font-bold text-foreground tabular-nums">{stats.estimatedHtmlSizeMB}MB</span>
                  </div>
                </div>
              </div>

              <div className="bg-background/30 border border-muted-foreground/20 p-3 rounded-lg flex flex-col flex-1 mt-3 overflow-hidden">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{t('editorStats.verbs')}</p>
                <div className="flex flex-wrap gap-1 content-start">
                   {topVerbs.length > 0 ? topVerbs.map(([verb, count]) => (
                     <div key={verb} className="px-1.5 py-0.5 bg-background/50 border border-muted-foreground/20 rounded text-[9px] text-foreground font-medium flex items-center gap-1">
                        <span className="text-primary font-bold">{count}</span> {verb}
                     </div>
                   )) : (
                     <p className="text-[9px] text-muted-foreground italic">{t('editorStats.noVerbs')}</p>
                   )}
                </div>
              </div>
            </div>
          </div>

          {/* Densidade Literária */}
          <div className="lg:col-span-12 bg-card border border-muted-foreground/50 rounded-xl p-5 shadow-sm flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-primary" /> {t('editorStats.content')}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5 grid grid-cols-1 gap-2">
                <StatCard 
                  label={t('editorStats.avgWords')} 
                  value={stats.avgWordsPerScene} 
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
              <div className="lg:col-span-7 grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="bg-background/30 border border-muted-foreground/20 p-3 rounded-lg flex flex-col justify-center gap-1 min-h-[70px]">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t('editorStats.mostWords')}</p>
                  {stats.sceneWithMostWords ? (
                    <>
                      <p 
                        className={`text-xs font-bold text-foreground line-clamp-1 ${onSceneClick ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
                        onClick={() => {
                          if (onSceneClick) {
                            onSceneClick(stats.sceneWithMostWords!.id);
                            onClose();
                          }
                        }}
                      >
                        {stats.sceneWithMostWords.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground tabular-nums">{stats.sceneWithMostWords.count} {t('editorStats.words')}</p>
                    </>
                  ) : <span className="text-xs italic text-muted-foreground">-</span>}
                </div>
                <div className="bg-background/30 border border-muted-foreground/20 p-3 rounded-lg flex flex-col justify-center gap-1 min-h-[70px]">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t('editorStats.leastWords')}</p>
                  {stats.sceneWithLeastWords ? (
                    <>
                      <p 
                        className={`text-xs font-bold text-foreground line-clamp-1 ${onSceneClick ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
                        onClick={() => {
                          if (onSceneClick) {
                            onSceneClick(stats.sceneWithLeastWords!.id);
                            onClose();
                          }
                        }}
                      >
                        {stats.sceneWithLeastWords.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground tabular-nums">{stats.sceneWithLeastWords.count} {t('editorStats.words')}</p>
                    </>
                  ) : <span className="text-xs italic text-muted-foreground">-</span>}
                </div>
                <div className="bg-background/30 border border-muted-foreground/20 p-3 rounded-lg flex flex-col justify-center gap-1 min-h-[70px]">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t('editorStats.mostInteractions')}</p>
                  {stats.sceneWithMostInteractions ? (
                    <>
                      <p 
                        className={`text-xs font-bold text-foreground line-clamp-1 ${onSceneClick ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
                        onClick={() => {
                          if (onSceneClick) {
                            onSceneClick(stats.sceneWithMostInteractions!.id);
                            onClose();
                          }
                        }}
                      >
                        {stats.sceneWithMostInteractions.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground tabular-nums">{stats.sceneWithMostInteractions.count} {t('editorStats.interactions')}</p>
                    </>
                  ) : <span className="text-xs italic text-muted-foreground">-</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Integridade do Projeto */}
          <div className="lg:col-span-12 bg-card border border-muted-foreground/50 rounded-xl p-5 shadow-sm flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '300ms' }}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-4">
               <Activity className="w-4 h-4 text-primary" /> {t('editorStats.integrity')}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-2">
               {[
                 { label: t('editorStats.deadEnds'), value: stats.integrity.deadEndScenes, color: stats.integrity.deadEndScenes > 0 ? 'text-red-400' : 'text-emerald-400' },
                 { label: t('editorStats.orphanScenes'), value: stats.integrity.orphanScenes, color: stats.integrity.orphanScenes > 0 ? 'text-red-400' : 'text-emerald-400' },
                 { label: t('editorStats.scenesMissingImage'), value: stats.accessibility.scenesMissingImages, color: stats.accessibility.scenesMissingImages > 0 ? 'text-amber-400' : 'text-emerald-400' },
                 { label: t('editorStats.scenesMissingDesc'), value: stats.accessibility.scenesMissingDescriptions, color: stats.accessibility.scenesMissingDescriptions > 0 ? 'text-red-400' : 'text-emerald-400' },
                 { label: t('editorStats.objectsMissingImage'), value: stats.accessibility.objectsMissingImages, color: 'text-muted-foreground' },
                 { label: t('editorStats.uselessObjects'), value: stats.uselessObjectsCount, color: stats.uselessObjectsCount > 0 ? 'text-amber-400' : 'text-emerald-400' },
                 { label: t('editorStats.hollowInteractions'), value: stats.interactionsWithoutEffectCount, color: stats.interactionsWithoutEffectCount > 0 ? 'text-amber-400' : 'text-emerald-400' }
               ].map((item, idx) => (
                 <div key={idx} className="p-2 bg-background/30 rounded-lg border border-muted-foreground/20 flex flex-col items-center justify-center gap-1 shadow-sm min-h-[65px] h-full">
                    <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider text-center leading-tight min-h-[20px] flex items-center">{item.label}</span>
                    <span className={`text-base font-extrabold ${item.color}`}>{item.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorStatsModal;
