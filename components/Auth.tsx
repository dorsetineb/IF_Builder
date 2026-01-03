import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Dither from './Dither';

export function Auth() {
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Verifique seu e-mail para confirmar o cadastro!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            if (err.message === 'Failed to fetch') {
                setError('Erro de conexão. Verifique se as Variáveis de Ambiente do Supabase (URL e ANON_KEY) foram configuradas no Vercel.');
            } else {
                setError(err.message || 'Ocorreu um erro na autenticação.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans relative">
            <Dither
                waveSpeed={0.05}
                waveFrequency={3}
                waveAmplitude={0.3}
                waveColor={[0.5, 0.3, 0.9]}
                colorNum={4}
                pixelSize={3}
                disableAnimation={false}
                enableMouseInteraction={true}
                mouseRadius={0.5}
            />

            <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl relative z-10 overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            {isSignUp ? <UserPlus className="w-6 h-6 text-purple-400" /> : <LogIn className="w-6 h-6 text-blue-400" />}
                            {isSignUp ? 'Criar Conta' : 'Acessar IF Builder'}
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            {isSignUp
                                ? 'Comece a construir sua ficção interativa hoje.'
                                : 'Entre com seu e-mail e senha para continuar.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <input
                                    type="email"
                                    placeholder="Seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                <input
                                    type="password"
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {message && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs animate-in fade-in slide-in-from-top-1">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                <p>{message}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? 'Cadastrar' : 'Entrar'}
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-4 border-t border-zinc-800/50">
                        <p className="text-xs text-zinc-500 text-center">
                            {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-1 text-white hover:text-purple-400 underline underline-offset-4 transition-colors font-medium"
                            >
                                {isSignUp ? 'Fazer login' : 'Criar agora'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="fixed bottom-10 right-10 opacity-20 hidden lg:block select-none">
                <div className="text-9xl font-black text-white italic">IF</div>
            </div>
        </div>
    );
}
