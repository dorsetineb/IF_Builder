import React from 'react';
import { X, KeyRound } from 'lucide-react';
import { InviteManager } from './InviteManager';

interface AltamiraModalProps {
    onClose: () => void;
}

export const AltamiraModal: React.FC<AltamiraModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-card border border-primary/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <KeyRound className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Protocolo Altamira</h2>
                            <p className="text-xs text-primary/80 uppercase tracking-widest font-mono">Gerador de Acesso Beta</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="relative">
                    <InviteManager />
                </div>

                {/* Footer / Decoration */}
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
                    <span>SECURE CONNECTION ESTABLISHED</span>
                    <span>IF-BUILDER::ADMIN</span>
                </div>
            </div>
        </div>
    );
};
