import React from 'react';
import { GameObject } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ObjectEditorProps {
  objects: GameObject[];
  onUpdateObjects: (objects: GameObject[]) => void;
}

const ObjectEditor: React.FC<ObjectEditorProps> = ({ objects = [], onUpdateObjects }) => {
  const handleAddObject = () => {
    const newObject: GameObject = {
      id: `objeto_${Date.now()}`,
      name: 'Novo Objeto',
      examineDescription: 'Descrição do novo objeto.',
      isTakable: false,
    };
    onUpdateObjects([...objects, newObject]);
  };

  const handleRemoveObject = (index: number) => {
    onUpdateObjects(objects.filter((_, i) => i !== index));
  };

  const handleObjectChange = (index: number, field: keyof GameObject, value: string | boolean) => {
    const newObjects = objects.map((obj, i) => {
        if (i === index) {
            let finalValue = value;
            if (field === 'id' && typeof value === 'string') {
                finalValue = value.trim().replace(/\s+/g, '_').toLowerCase();
            }
            return { ...obj, [field]: finalValue };
        }
        return obj;
    });
    onUpdateObjects(newObjects);
  };

  return (
    <>
      <div className="space-y-4">
        {objects.map((obj, index) => (
          <div key={index} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
            <button
                onClick={() => handleRemoveObject(index)}
                className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors"
                title="Remover objeto"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                 {/* Left Column */}
                 <div className="space-y-4">
                    <div>
                        <label htmlFor={`obj-name-${index}`} className="block text-sm font-medium text-brand-text-dim mb-1">Nome do Objeto</label>
                        <input
                            id={`obj-name-${index}`}
                            type="text"
                            value={obj.name}
                            onChange={e => handleObjectChange(index, 'name', e.target.value)}
                            placeholder="Nome do Objeto"
                            className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor={`obj-id-${index}`} className="block text-sm font-medium text-brand-text-dim mb-1">ID do Objeto (único, sem espaços)</label>
                        <input
                            id={`obj-id-${index}`}
                            type="text"
                            value={obj.id}
                            onChange={e => handleObjectChange(index, 'id', e.target.value)}
                            placeholder="ID do Objeto"
                            className="w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div className="flex items-center pt-2">
                      <input
                        type="checkbox"
                        id={`isTakable-${index}`}
                        checked={obj.isTakable}
                        onChange={e => handleObjectChange(index, 'isTakable', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                      <label htmlFor={`isTakable-${index}`} className="ml-2 block text-sm text-brand-text-dim">
                        Pode ser pego pelo jogador
                      </label>
                    </div>
                 </div>
                 {/* Right Column */}
                 <div className="flex flex-col h-full">
                    <label htmlFor={`obj-desc-${index}`} className="block text-sm font-medium text-brand-text-dim mb-1">Descrição ao olhar</label>
                    <textarea
                      id={`obj-desc-${index}`}
                      value={obj.examineDescription}
                      onChange={e => handleObjectChange(index, 'examineDescription', e.target.value)}
                      placeholder="Descrição ao olhar"
                      rows={4}
                      className="w-full flex-grow bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
            </div>
          </div>
        ))}
         {objects.length === 0 && <p className="text-center text-brand-text-dim">Nenhum objeto nesta cena.</p>}
      </div>
      <div className="flex justify-end mt-4">
        <button 
            onClick={handleAddObject} 
            className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors duration-200"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Adicionar Objeto
        </button>
      </div>
    </>
  );
};

export default ObjectEditor;