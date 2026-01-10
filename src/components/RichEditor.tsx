import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Pencil, Send } from 'lucide-react';

interface RichEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    minHeight?: string;
    autoFocus?: boolean;
    onSubmit?: () => void;
    submitting?: boolean;
    submitLabel?: string;
    onCancel?: () => void;
}

const RichEditor = ({
    value,
    onChange,
    placeholder,
    minHeight = "100px",
    autoFocus = false,
    onSubmit,
    submitting = false,
    submitLabel,
    onCancel
}: RichEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            const quill = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder,
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'code-block'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link']
                    ]
                }
            });

            quill.on('text-change', () => {
                const html = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML;
                onChange(html);
            });

            quillRef.current = quill;
            if (autoFocus) quill.focus();
        }
    }, []);

    // Sync external value changes (reset)
    useEffect(() => {
        if (quillRef.current && value === '' && quillRef.current.root.innerHTML !== '<p><br></p>') {
            quillRef.current.root.innerHTML = '';
        } else if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            quillRef.current.root.innerHTML = value;
        }
    }, [value]);

    return (
        <div className="flex flex-col border border-border rounded-lg bg-card overflow-hidden focus-within:ring-1 focus-within:ring-purple-500/50 transition-all text-sm">
            <div ref={editorRef} style={{ minHeight }} className="text-foreground text-sm" />
            {(onSubmit || onCancel) && (
                <div className="bg-muted/30 border-t border-border p-2 flex justify-end">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="text-xs font-bold text-muted-foreground hover:bg-muted px-4 py-1.5 rounded-lg transition-colors mr-2"
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                    )}
                    {onSubmit && (
                        <button
                            onClick={onSubmit}
                            disabled={submitting || !value.trim()}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {submitLabel === 'Salvar Edição' ? <Pencil size={12} /> : <Send size={12} className={submitting ? "animate-pulse" : ""} />}
                            {submitLabel || 'Enviar'}
                        </button>
                    )}
                </div>
            )}
            <style>{`
                .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid var(--border); background: var(--muted); padding: 4px; }
                .ql-container.ql-snow { border: none; }
                .ql-editor { padding: 0.75rem; font-family: inherit; font-size: 0.8rem; color: white !important; }
                .ql-editor * { color: white !important; }
                .ql-editor.ql-blank::before { color: rgba(255, 255, 255, 0.4) !important; font-style: italic; }
                .ql-snow .ql-stroke { stroke: var(--muted-foreground); }
                .ql-snow .ql-fill { fill: var(--muted-foreground); }
                .ql-snow .ql-picker { color: var(--muted-foreground); }
                .ql-toolbar button:hover .ql-stroke { stroke: var(--foreground); }
                .ql-editor img { max-width: 100%; max-height: 300px; object-fit: contain; display: block; margin: 4px 0; border-radius: 6px; }
            `}</style>
        </div>
    );
};

export default RichEditor;
