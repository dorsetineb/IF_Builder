import React from 'react';
import { useTranslation } from 'react-i18next';
import { Exits, Scene } from '../types';

interface ExitsEditorProps {
  exits: Exits;
  allScenes: Scene[];
  currentSceneId: string;
  onUpdateExits: (exits: Exits) => void;
}

const DIRECTIONS: (keyof Exits)[] = ['norte', 'sul', 'leste', 'oeste', 'acima', 'abaixo'];

const ExitsEditor: React.FC<ExitsEditorProps> = ({ exits, allScenes, currentSceneId, onUpdateExits }) => {
  const { t } = useTranslation();

  const handleExitChange = (direction: keyof Exits, value: string) => {
    const newExits = { ...exits };
    if (value) {
      newExits[direction] = value;
    } else {
      delete newExits[direction];
    }
    onUpdateExits(newExits);
  };

  const otherScenes = allScenes.filter(s => s.id !== currentSceneId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {DIRECTIONS.map(direction => (
        <div key={direction} className="flex flex-col">
          <label htmlFor={`exit-${direction}`} className="capitalize block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{t(`exitsEditor.${direction}Label`, direction)}</label>
          <select
            id={`exit-${direction}`}
            value={exits[direction] || ''}
            onChange={e => handleExitChange(direction, e.target.value)}
            className="w-full bg-zinc-950 border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:ring-0 [&>option]:bg-zinc-950"
          >
            <option value="">{t('exitsEditor.none', 'Nenhuma')}</option>
            {otherScenes.map(scene => (
              <option key={scene.id} value={scene.id}>
                {scene.name} ({scene.id})
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default ExitsEditor;