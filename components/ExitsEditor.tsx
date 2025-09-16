import React from 'react';
import { Exits, Scene } from '../types';

interface ExitsEditorProps {
  exits: Exits;
  allScenes: Scene[];
  currentSceneId: string;
  onUpdateExits: (exits: Exits) => void;
}

const DIRECTIONS: (keyof Exits)[] = ['norte', 'sul', 'leste', 'oeste', 'acima', 'abaixo'];

const ExitsEditor: React.FC<ExitsEditorProps> = ({ exits, allScenes, currentSceneId, onUpdateExits }) => {
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
          <label htmlFor={`exit-${direction}`} className="capitalize block text-sm font-medium text-brand-text-dim mb-1">{direction}</label>
          <select
            id={`exit-${direction}`}
            value={exits[direction] || ''}
            onChange={e => handleExitChange(direction, e.target.value)}
            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
          >
            <option value="">Nenhuma</option>
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