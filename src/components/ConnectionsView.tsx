
import React from 'react';
import { Scene, Interaction, GameObject } from '../types';
import { ConnectionDetail } from './SceneEditor';

interface ConnectionsViewProps {
  currentScene: Scene;
  inputConnections: ConnectionDetail[];
  outputConnections: ConnectionDetail[];
  allObjectsMap: Map<string, GameObject>;
  onSelectScene: (sceneId: string) => void;
}

const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  currentScene,
  inputConnections,
  outputConnections,
  allObjectsMap,
  onSelectScene,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Input Scenes Column */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-3">
          Entradas
          <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded-md px-1.5 py-0.5 border border-purple-500/20">
            {inputConnections.length}
          </span>
        </h4>
        <p className="text-[10px] text-muted-foreground -mt-2 italic">Cenas que <b>trazem</b> o jogador para esta cena.</p>
        <div className="space-y-3">
          {inputConnections.length > 0 ? (
            inputConnections.map(({ scene, interactions }) => (
              <div
                key={scene.id}
                className="w-full text-left p-4 bg-card/50 border border-border rounded-lg group hover:border-primary/50 transition-all shadow-sm"
              >
                <button onClick={() => onSelectScene(scene.id)} className="w-full text-left rounded-md -m-1 p-1 hover:bg-muted/50 transition-all">
                  <p className="font-bold text-foreground text-xs">{scene.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">{scene.id}</p>
                </button>
                <div className="mt-3 pt-3 border-t border-border/50 text-xs space-y-2">
                  {interactions.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1">
                      <span>Verbos</span>
                      <span>Alvo</span>
                      <span>Requer</span>
                    </div>
                  )}
                  {interactions.map(inter => {
                    const targetObject = allObjectsMap.get(inter.target);
                    const targetName = targetObject ? targetObject.name : (inter.target || '-');
                    return (
                      <div key={inter.id} className="grid grid-cols-3 gap-2 text-muted-foreground bg-background/80 p-2 rounded-md border border-border/50 items-center text-[11px]">
                        <span className="truncate font-medium" title={inter.verbs.join(', ')}>{inter.verbs.join(', ')}</span>
                        <span className="truncate" title={targetName}>{targetName}</span>
                        <span className="truncate italic text-muted-foreground/70" title={inter.requiresInInventory && allObjectsMap.has(inter.requiresInInventory) ? allObjectsMap.get(inter.requiresInInventory)!.name : '-'}>
                          {inter.requiresInInventory && allObjectsMap.has(inter.requiresInInventory)
                            ? allObjectsMap.get(inter.requiresInInventory)!.name
                            : '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-xs text-center py-8 bg-muted/20 border-2 border-dashed border-border/50 rounded-xl italic">Nenhuma cena leva diretamente para aqui.</p>
          )}
        </div>
      </div>

      {/* Output Scenes Column */}
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-3">
          Saídas
          <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded-md px-1.5 py-0.5 border border-purple-500/20">
            {outputConnections.length}
          </span>
        </h4>
        <p className="text-[10px] text-muted-foreground -mt-2 italic">Cenas que o usuário pode chegar <b>partindo</b> desta cena.</p>
        <div className="space-y-3">
          {outputConnections.length > 0 ? (
            outputConnections.map(({ scene, interactions }) => (
              <div
                key={scene.id}
                className="w-full text-left p-4 bg-card/50 border border-border rounded-lg group hover:border-primary/50 transition-all shadow-sm"
              >
                <button onClick={() => onSelectScene(scene.id)} className="w-full text-left rounded-md -m-1 p-1 hover:bg-muted/50 transition-all">
                  <p className="font-bold text-foreground text-xs">{scene.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">{scene.id}</p>
                </button>
                <div className="mt-3 pt-3 border-t border-border/50 text-xs space-y-2">
                  {interactions.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1">
                      <span>Verbos</span>
                      <span>Alvo</span>
                      <span>Requer</span>
                    </div>
                  )}
                  {interactions.map(inter => {
                    const targetObject = allObjectsMap.get(inter.target);
                    const targetName = targetObject ? targetObject.name : (inter.target || '-');
                    return (
                      <div key={inter.id} className="grid grid-cols-3 gap-2 text-muted-foreground bg-background/80 p-2 rounded-md border border-border/50 items-center text-[11px]">
                        <span className="truncate font-medium" title={inter.verbs.join(', ')}>{inter.verbs.join(', ')}</span>
                        <span className="truncate" title={targetName}>{targetName}</span>
                        <span className="truncate italic text-muted-foreground/70" title={inter.requiresInInventory && allObjectsMap.has(inter.requiresInInventory) ? allObjectsMap.get(inter.requiresInInventory)!.name : '-'}>
                          {inter.requiresInInventory && allObjectsMap.has(inter.requiresInInventory)
                            ? allObjectsMap.get(inter.requiresInInventory)!.name
                            : '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-xs text-center py-8 bg-muted/20 border-2 border-dashed border-border/50 rounded-xl italic">Esta cena não leva diretamente a nenhuma outra.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsView;
