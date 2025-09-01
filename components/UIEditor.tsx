import React, { useState, useEffect } from 'react';

interface UIEditorProps {
  html: string;
  css: string;
  onUpdate: (type: 'html' | 'css', content: string) => void;
}

const UIEditor: React.FC<UIEditorProps> = ({ html, css, onUpdate }) => {
  const [localHtml, setLocalHtml] = useState(html);
  const [localCss, setLocalCss] = useState(css);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalHtml(html);
    setLocalCss(css);
    setIsDirty(false);
  }, [html, css]);

  useEffect(() => {
    setIsDirty(localHtml !== html || localCss !== css);
  }, [localHtml, localCss, html, css]);

  const handleSave = () => {
    onUpdate('html', localHtml);
    onUpdate('css', localCss);
  };
  
  const handleUndo = () => {
    setLocalHtml(html);
    setLocalCss(css);
  };

  return (
    <div className="h-full flex flex-col gap-6 pb-24">
        <h2 className="text-2xl font-bold text-brand-primary">Editor de Interface</h2>
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