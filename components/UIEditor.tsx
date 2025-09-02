import React, { useState, useEffect } from 'react';
import { GameData } from '../types';
import CollapsibleCard from './CollapsibleCard';

interface UIEditorProps {
  html: string;
  css: string;
  layoutOrientation: 'vertical' | 'horizontal';
  layoutOrder: 'image-first' | 'image-last';
  actionButtonColor: string;
  onUpdate: (field: keyof GameData, value: any) => void;
}

const UIEditor: React.FC<UIEditorProps> = (props) => {
  const { html, css, layoutOrientation, layoutOrder, actionButtonColor, onUpdate } = props;

  const [localHtml, setLocalHtml] = useState(html);
  const [localCss, setLocalCss] = useState(css);
  const [localLayoutOrientation, setLocalLayoutOrientation] = useState(layoutOrientation);
  const [localLayoutOrder, setLocalLayoutOrder] = useState(layoutOrder);
  const [localActionButtonColor, setLocalActionButtonColor] = useState(actionButtonColor);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalHtml(html);
    setLocalCss(css);
    setLocalLayoutOrientation(layoutOrientation);
    setLocalLayoutOrder(layoutOrder);
    setLocalActionButtonColor(actionButtonColor);
    setIsDirty(false);
  }, [html, css, layoutOrientation, layoutOrder, actionButtonColor]);

  useEffect(() => {
    const dirty = localHtml !== html ||
                  localCss !== css ||
                  localLayoutOrientation !== layoutOrientation ||
                  localLayoutOrder !== layoutOrder ||
                  localActionButtonColor !== actionButtonColor;
    setIsDirty(dirty);
  }, [localHtml, localCss, localLayoutOrientation, localLayoutOrder, localActionButtonColor, html, css, layoutOrientation, layoutOrder, actionButtonColor]);

  const handleSave = () => {
    if (localHtml !== html) onUpdate('gameHTML', localHtml);
    if (localCss !== css) onUpdate('gameCSS', localCss);
    if (localLayoutOrientation !== layoutOrientation) onUpdate('gameLayoutOrientation', localLayoutOrientation);
    if (localLayoutOrder !== layoutOrder) onUpdate('gameLayoutOrder', localLayoutOrder);
    if (localActionButtonColor !== actionButtonColor) onUpdate('gameActionButtonColor', localActionButtonColor);
  };
  
  const handleUndo = () => {
    setLocalHtml(html);
    setLocalCss(css);
    setLocalLayoutOrientation(layoutOrientation);
    setLocalLayoutOrder(layoutOrder);
    setLocalActionButtonColor(actionButtonColor);
  };

  return (
    <div className="h-full flex flex-col gap-6 pb-24">
      <h2 className="text-2xl font-bold text-brand-primary">Editor de Interface</h2>
      
      <CollapsibleCard title="Layout" startOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center">
            <div className="space-y-6">
                <div>
                    <label htmlFor="orientation-select" className="block text-lg font-semibold text-brand-text mb-2">Orientação</label>
                    <select
                        id="orientation-select"
                        value={localLayoutOrientation}
                        onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="vertical">Vertical</option>
                        <option value="horizontal">Horizontal</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="order-select" className="block text-lg font-semibold text-brand-text mb-2">Posição da Imagem</label>
                    <select
                        id="order-select"
                        value={localLayoutOrder}
                        onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="image-first">{localLayoutOrientation === 'vertical' ? 'Esquerda' : 'Acima'}</option>
                        <option value="image-last">{localLayoutOrientation === 'vertical' ? 'Direita' : 'Abaixo'}</option>
                    </select>
                </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
                <p className="text-sm text-brand-text-dim mb-2">Pré-visualização do Layout</p>
                <div 
                    className={`w-full max-w-sm aspect-video bg-brand-bg border-2 border-brand-border rounded-lg flex p-2 gap-2`}
                    style={{ flexDirection: localLayoutOrientation === 'horizontal' ? 'column' : 'row' }}
                >
                    <div className={`flex-1 bg-brand-border/50 rounded flex items-center justify-center text-center text-sm p-2 text-brand-text-dim ${localLayoutOrder === 'image-first' ? 'order-1' : 'order-2'}`}>
                        Painel de Imagem
                    </div>
                    <div className={`flex-1 bg-brand-surface rounded flex items-center justify-center text-center text-sm p-2 text-brand-text-dim ${localLayoutOrder === 'image-first' ? 'order-2' : 'order-1'}`}>
                        Painel de Descrição
                    </div>
                </div>
            </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Cores" startOpen={true}>
        <div>
            <label htmlFor="actionButtonColor" className="block text-sm font-medium text-brand-text-dim mb-1">Cor do Botão de Ação</label>
            <div className="flex items-center gap-2 p-1 bg-brand-bg border border-brand-border rounded-md max-w-xs">
                <input 
                    type="color" 
                    id="actionButtonColor" 
                    value={localActionButtonColor} 
                    onChange={(e) => setLocalActionButtonColor(e.target.value)} 
                    className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                />
                <input 
                    type="text" 
                    value={localActionButtonColor} 
                    onChange={(e) => setLocalActionButtonColor(e.target.value)} 
                    className="w-full bg-transparent font-mono text-sm focus:outline-none" 
                    placeholder="#ffffff"
                />
            </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="Código Fonte">
        <div className="h-[60vh] flex flex-col gap-6">
            <div className="flex-1 flex flex-col">
                <label htmlFor="html-editor" className="block text-sm font-medium text-brand-text-dim mb-1">
                    HTML do Jogo (index.html)
                </label>
                <textarea
                    id="html-editor"
                    value={localHtml}
                    onChange={(e) => setLocalHtml(e.target.value)}
                    className="w-full flex-1 bg-brand-bg border border-brand-border rounded-md p-3 font-mono text-sm focus:ring-brand-primary focus:border-brand-primary resize-none"
                    spellCheck="false"
                />
            </div>
            <div className="flex-1 flex flex-col">
                <label htmlFor="css-editor" className="block text-sm font-medium text-brand-text-dim mb-1">
                    CSS do Jogo (style.css)
                </label>
                <textarea
                    id="css-editor"
                    value={localCss}
                    onChange={(e) => setLocalCss(e.target.value)}
                    className="w-full flex-1 bg-brand-bg border border-brand-border rounded-md p-3 font-mono text-sm focus:ring-brand-primary focus:border-brand-primary resize-none"
                    spellCheck="false"
                />
            </div>
        </div>
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
                title={isDirty ? "Salvar alterações na interface" : "Nenhuma alteração para salvar"}
            >
                Salvar
            </button>
        </div>
    </div>
  );
};

export default UIEditor;