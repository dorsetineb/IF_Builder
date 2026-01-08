import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PendingApproval() {
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const handleSubmitCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error: rpcError } = await supabase.rpc('use_invite', {
                invite_code: inviteCode
            });

            if (rpcError) throw rpcError;

            if (data === true) {
                setSuccess(true);
                setTimeout(() => {
                    // Force reload to refresh session/profile data
                    window.location.href = '/';
                }, 2000);
            } else {
                setError('Código inválido ou expirado.');
            }
        } catch (err) {
            console.error('Error using invite:', err);
            setError('Erro ao validar código. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),transparent_70%)]" />

            <div className="max-w-md w-full bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 text-center">

                {/* Decorative Icon */}
                <div className="mx-auto w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <span className="text-4xl">🚧</span>
                </div>

                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                    Acesso em Beta
                </h1>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                    O Nargnar está em fase de testes fechados. Sua conta foi criada, mas precisa de aprovação ou de um convite para acessar a plataforma.
                </p>

                {success ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-green-400 mb-6 animate-in zoom-in duration-300">
                        <CheckCircle2 size={24} />
                        <span className="font-semibold">Acesso liberado! Entrando...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitCode} className="mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                placeholder="Tenho um código de convite"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pr-12 text-center font-mono tracking-widest text-lg uppercase focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none md:text-xl placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:text-muted-foreground/50"
                                maxLength={6}
                            />
                            <button
                                type="submit"
                                disabled={loading || !inviteCode}
                                className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-primary"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-3 flex items-center justify-center gap-2 text-red-400 text-sm animate-in slide-in-from-top-1">
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </div>
                        )}
                    </form>
                )}

                <div className="pt-6 border-t border-white/5">
                    <p className="text-xs text-muted-foreground mb-4">
                        Não tem um código? Entre em contato com a administração ou aguarde a aprovação manual.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <LogOut size={14} />
                        Sair da conta
                    </button>
                </div>
            </div>
        </div>
    );
}
