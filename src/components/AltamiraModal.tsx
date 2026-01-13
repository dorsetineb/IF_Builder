import React from 'react';
import { X, KeyRound } from 'lucide-react';
import { InviteManager } from './InviteManager';

interface AltamiraModalProps {
    onClose: () => void;
}

export const AltamiraModal: React.FC<AltamiraModalProps> = ({ onClose }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (email.toLowerCase() === 'cotzbenites@gmail.com' && password.length > 0) {
            setIsAuthenticated(true);
        } else {
            setError('Acesso negado. Credenciais inválidas para este terminal.');
        }
    };

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
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="relative">
                    {!isAuthenticated ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">E-mail Autorizado</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="usuario@exemplo.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Senha de Acesso</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-input border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-bold">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all text-xs uppercase tracking-widest"
                            >
                                Autenticar
                            </button>
                        </form>
                    ) : (
                        <InviteManager />
                    )}
                </div>

                {/* Footer / Decoration */}
                <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                    <span>SECURE CONNECTION {isAuthenticated ? 'ACTIVE' : 'WAITING'}</span>
                    <span>IF-BUILDER::ADMIN</span>
                </div>
            </div>
        </div>
    );
};
