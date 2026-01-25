import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2, User, MapPin, Eye, EyeOff, ArrowLeft, KeyRound, Gamepad2, Info, X, Activity } from 'lucide-react';
import { DitherShader } from '@/components/ui/dither-shader';

interface AuthProps {
    isRecoveryMode?: boolean;
    onRecoveryComplete?: () => void;
}

type LandingView = 'landing' | 'login' | 'register' | 'about' | 'play';

export function Auth({ isRecoveryMode = false, onRecoveryComplete }: AuthProps) {
    const [loading, setLoading] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(isRecoveryMode);
    const [sessionReady, setSessionReady] = useState(false);

    // Landing page view state
    const [currentView, setCurrentView] = useState<LandingView>('landing');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [location, setLocation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Check if user is coming from a password reset link and wait for session
    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        if (hashParams.get('type') === 'recovery' || isRecoveryMode) {
            setIsResetPassword(true);
        }

        // Listen for auth state changes to know when session is ready
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY' || (session && isRecoveryMode)) {
                setSessionReady(true);
            }
        });

        // Also check if session already exists
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSessionReady(true);
            }
        });

        return () => subscription.unsubscribe();
    }, [isRecoveryMode]);

    // Handle password reset request (send email)
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        } catch (err: any) {
            let msg = err.message;
            if (msg?.includes('security purposes')) {
                msg = 'Por segurança, aguarde alguns segundos antes de tentar novamente.';
            }
            setError(msg || 'Erro ao enviar e-mail de recuperação.');
        } finally {
            setLoading(false);
        }
    };

    // Handle setting new password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (password !== confirmPassword) {
                throw new Error('As senhas não coincidem.');
            }
            if (password.length < 6) {
                throw new Error('A senha deve ter pelo menos 6 caracteres.');
            }

            // Ensure we have a valid session before updating password
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Sessão expirada. Por favor, solicite um novo link de recuperação.');
            }

            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            setMessage('Senha redefinida com sucesso! Redirecionando...');
            setTimeout(() => {
                if (onRecoveryComplete) onRecoveryComplete();
                window.location.href = window.location.origin;
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Erro ao redefinir senha.');
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const isSignUp = currentView === 'register';

        try {
            if (isSignUp) {
                // Validation
                if (password !== confirmPassword) {
                    throw new Error("As senhas não coincidem.");
                }
                if (fullName.length < 3) {
                    throw new Error("Por favor, insira seu nome e sobrenome.");
                }

                // Sign Up via Supabase Auth
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                        data: {
                            full_name: fullName,
                            location: location,
                            username: (() => {
                                const base = email.split('@')[0];
                                return base.length < 3 ? `${base}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` : base;
                            })()
                        }
                    }
                });

                if (error) throw error;
                setMessage('Conta criada com sucesso! Verifique seu e-mail para confirmar.');
            } else {
                // Login
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            let msg = err.message;
            if (msg === 'User already registered') msg = 'Este usuário já está cadastrado.';
            if (msg === 'Invalid login credentials') msg = 'Dados incorretos. Tente novamente.';
            setError(msg || 'Ocorreu um erro na autenticação.');
        } finally {
            setLoading(false);
        }
    };

    const resetToLanding = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (currentView === 'landing' || isClosing) return;

        setIsClosing(true);
        setTimeout(() => {
            setCurrentView('landing');
            setIsClosing(false);
            setError(null);
            setMessage(null);
            setIsForgotPassword(false);
        }, 300);
    };

    // Determine if we should show the new landing layout
    const showLandingLayout = !isRecoveryMode && !isResetPassword;

    // Sidebar Component (Left)
    const renderSidebar = () => (
        <div className="w-72 bg-zinc-950/2 backdrop-blur-[2px] border-r border-muted-foreground/50 flex flex-col h-full relative z-20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-900/10">
            <div className="flex-1 flex flex-col justify-center w-full px-6 space-y-12">
                {/* Tagline */}
                <div className="text-sm text-zinc-400 leading-relaxed text-left space-y-1">
                    <p>Em uma caverna escura.</p>
                    <p>Monitores CRT iluminam o mofo.</p>
                    <p className="text-purple-400 font-bold mt-2">&gt; O QUE VOCÊ FAZ?</p>
                </div>

                {/* Navigation Buttons */}
                <div className="space-y-4 w-full">
                    {/* Acessar - Primary */}
                    <button
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                        }}
                        onClick={() => { setCurrentView('login'); setError(null); setMessage(null); }}
                        className={`w-full flex items-center justify-start gap-3 px-6 py-4 rounded-xl font-bold text-sm transition-all group border relative overflow-hidden ${currentView === 'login'
                            ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30 scale-[1.02]'
                            : 'bg-zinc-900/40 border-muted-foreground/50 text-zinc-400 hover:bg-purple-600 hover:border-purple-400 hover:text-white hover:shadow-lg hover:shadow-purple-600/40'
                            }`}
                    >
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            style={{
                                background: `radial-gradient(circle 60px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.2) 0%, transparent 100%)`
                            }}
                        />
                        <LogIn size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
                        <span className="uppercase tracking-wider relative z-10">Acessar</span>
                    </button>

                    {/* Criar Conta - Secondary */}
                    <button
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                        }}
                        onClick={() => { setCurrentView('register'); setError(null); setMessage(null); }}
                        className={`w-full flex items-center justify-start gap-3 px-6 py-4 rounded-xl font-bold text-sm transition-all group border relative overflow-hidden ${currentView === 'register'
                            ? 'bg-zinc-100 border-white text-black shadow-lg scale-[1.02]'
                            : 'bg-zinc-900/40 border-muted-foreground/50 text-zinc-400 hover:bg-purple-600 hover:border-purple-400 hover:text-white hover:shadow-lg hover:shadow-purple-600/40'
                            }`}
                    >
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            style={{
                                background: `radial-gradient(circle 60px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.2) 0%, transparent 100%)`
                            }}
                        />
                        <UserPlus size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
                        <span className="uppercase tracking-wider relative z-10">Criar Conta</span>
                    </button>

                    {/* Secret Hint Text */}
                    <div className="text-sm text-zinc-400 leading-relaxed text-left space-y-1 pt-8 opacity-50">
                        <p>Se clicar nos computadores.</p>
                        <p className="text-purple-400 font-bold mt-2">Algo pode acontecer...</p>
                    </div>

                    {/* Jogar Button removed (Secret Trigger now) */}
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-zinc-900/50 bg-zinc-950/2">
                <div className="font-mono text-[10px] text-zinc-600 leading-relaxed text-left">
                    <p>© 2026 IF Builder.</p>
                </div>
            </div>
        </div>
    );

    // Auth Form Component (Login or Register)
    const renderAuthForm = () => {
        const isSignUp = currentView === 'register';

        return (
            <div
                className={`w-full max-w-sm bg-zinc-900/50 border border-muted-foreground/50 backdrop-blur-xl overflow-hidden rounded-2xl shadow-2xl ${isClosing
                    ? 'animate-out fade-out zoom-out-95 duration-300'
                    : 'animate-in fade-in zoom-in-95 duration-300'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-center">
                        <div className="space-y-1 text-center">
                            <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                                {isSignUp ? (
                                    <><UserPlus className="w-5 h-5 text-purple-400" /> Criar Conta</>
                                ) : (
                                    <><LogIn className="w-5 h-5 text-purple-400" /> Acessar IF Builder</>
                                )}
                            </h1>
                        </div>
                    </div>

                    {/* FORGOT PASSWORD FORM */}
                    {isForgotPassword && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            {message ? (
                                <div className="flex flex-col items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm text-center">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <p>E-mail de recuperação enviado!<br />Verifique sua caixa de entrada.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">E-mail</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <input
                                                type="email"
                                                placeholder="seu@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-muted-foreground/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Enviar Link <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                                    </button>
                                </form>
                            )}

                            <button
                                type="button"
                                onClick={() => { setIsForgotPassword(false); setError(null); setMessage(null); }}
                                className="w-full text-zinc-500 hover:text-white py-2 transition-colors text-xs flex items-center justify-center gap-1"
                            >
                                <ArrowLeft size={12} /> Voltar para o login
                            </button>
                        </div>
                    )}

                    {/* NORMAL AUTH FORM (Login/SignUp) */}
                    {!isForgotPassword && (
                        <form onSubmit={handleAuth} className="space-y-4">
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                                {isSignUp && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Nome e Sobrenome</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                placeholder="Ex: João Silva"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-muted-foreground/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">E-mail</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                        <input
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-muted-foreground/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {isSignUp && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Local (Opcional)</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                placeholder="Ex: São Paulo, SP"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-muted-foreground/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {!isSignUp ? (
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Senha</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Sua senha"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-muted-foreground/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Senha</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Mínimo de 6"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-muted-foreground/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Confirmar</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Repita senha"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-muted-foreground/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-xl shadow-white/5"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{isSignUp ? 'Criar Conta' : 'Entrar'} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                                </button>
                            </div>

                            {/* Forgot Password Link - only on login */}
                            {!isSignUp && (
                                <button
                                    type="button"
                                    onClick={() => { setIsForgotPassword(true); setError(null); setMessage(null); }}
                                    className="w-full text-zinc-500 hover:text-purple-400 py-1 transition-colors text-xs text-center"
                                >
                                    Esqueceu sua senha?
                                </button>
                            )}
                        </form>
                    )}

                    {error && (
                        <div className="flex items-center justify-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs animate-in fade-in slide-in-from-top-1">
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

                    {/* Toggle Login/Sign Up */}
                    <div className="pt-4 border-t border-zinc-800/50">
                        <p className="text-xs text-zinc-500 text-center">
                            {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                            <button
                                onClick={() => { setCurrentView(isSignUp ? 'login' : 'register'); setError(null); setMessage(null); }}
                                className="ml-1 text-white hover:text-purple-400 underline underline-offset-4 transition-colors font-medium"
                            >
                                {isSignUp ? 'Fazer login' : 'Cadastre-se'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderAboutPanel = () => (
        <div
            className={`w-full max-w-2xl bg-zinc-900/80 border border-muted-foreground/50 backdrop-blur-xl overflow-hidden rounded-2xl shadow-2xl ${isClosing
                ? 'animate-out fade-out zoom-out-95 duration-300'
                : 'animate-in fade-in zoom-in-95 duration-300'
                }`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
            <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                    <div className="space-y-1 text-center">
                        <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                            <Activity className="w-5 h-5 text-purple-400" /> Sobre o IF Builder
                        </h2>
                    </div>
                </div>

                <div className="space-y-4 text-zinc-400 leading-relaxed text-sm">
                    <p>
                        Crie cenas, objetos e defina as interações que avançam a sua ficção interativa.
                    </p>
                    <p>
                        Todas as ficções interativas criadas aqui são exportadas em um arquivo .zip. Ele não precisa de internet nem do editor para funcionar - apenas um navegador. Pense nesse arquivo como um pendrive: você pode guardá-lo em uma gaveta, ou entregá-lo a alguém.
                    </p>

                </div>
            </div>
        </div>
    );

    // Game Popup Component (Fake Browser)
    const renderGamePopup = () => (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ${isClosing
                ? 'animate-out fade-out duration-300'
                : 'animate-in fade-in duration-300'
                }`}
            onClick={resetToLanding}
        >
            <div
                className={`w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden ${isClosing
                    ? 'animate-out zoom-out-95 duration-300'
                    : 'animate-in zoom-in-95 duration-300'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fake Browser Header */}
                <div className="bg-zinc-800 border-b border-zinc-700 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                            TERM.V2.EXE - REMOTE CONNECTION
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400 transition-colors" onClick={resetToLanding} />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>

                {/* Game iframe */}
                <div className="relative" style={{ height: '80vh' }}>
                    <iframe
                        src="/fuja_da_masmorra/index.html"
                        className="w-full h-full border-0"
                        title="Fuja da Masmorra Demo"
                    />
                </div>
            </div>
        </div>
    );

    // Password Reset Form (for recovery mode)
    const renderResetPasswordForm = () => (
        <div className="w-full max-w-md bg-zinc-900/50 border border-muted-foreground/50 backdrop-blur-xl overflow-hidden rounded-2xl shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

            <div className="p-8 space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                        <KeyRound className="w-6 h-6 text-purple-400" /> Redefinir Senha
                    </h1>
                    <p className="text-zinc-400 text-sm">Digite sua nova senha abaixo.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Nova Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-muted-foreground/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Confirmar Nova Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Repita a senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-muted-foreground/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Redefinir Senha <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                {error && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs animate-in fade-in slide-in-from-top-1">
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
            </div>
        </div>
    );

    // If in recovery mode, show simplified layout
    if (!showLandingLayout) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans relative">
                <div className="absolute inset-0 z-0 bg-neutral-950">
                    <DitherShader
                        src="/background.png"
                        gridSize={2}
                        ditherMode="bayer"
                        colorMode="duotone"
                        primaryColor="#000000"
                        secondaryColor="#581c87"
                        invert={false}
                        animated={true}
                        animationSpeed={0.005}
                        className="w-full h-full"
                        objectFit="cover"
                        enableHover={true}
                        hoverRadius={433}
                    />
                </div>

                <div className="relative z-10">
                    {renderResetPasswordForm()}
                </div>

                {/* IF Logo */}
                <div className="fixed bottom-10 right-24 hidden lg:block select-none pointer-events-none z-0 opacity-20">
                    <h1 className="text-9xl font-black text-white tracking-tighter italic" style={{ fontFamily: 'Inter, sans-serif' }}>IF</h1>
                </div>
            </div>
        );
    }

    // Main landing layout with sidebar
    return (
        <div className="h-screen w-screen flex bg-black font-sans relative overflow-hidden">
            {/* Global Dither Background */}
            <div className="absolute inset-0 z-0 bg-neutral-950 overflow-hidden pointer-events-none">
                <DitherShader
                    src="/background.png"
                    gridSize={2}
                    ditherMode="bayer"
                    colorMode="duotone"
                    primaryColor="#000000"
                    secondaryColor="#581c87"
                    invert={false}
                    animated={true}
                    animationSpeed={0.005}
                    className="w-full h-full"
                    objectFit="cover"
                    enableHover={true}
                    hoverRadius={433}
                />
            </div>

            {/* Secret "Jogar" Trigger - Invisible area over computers */}
            <div
                className="absolute top-1/2 right-[20%] w-64 h-64 -translate-y-[40%] z-30 cursor-pointer hidden md:block"
                onClick={(e) => {
                    e.stopPropagation();
                    setCurrentView('play');
                }}
            />

            {/* Left Sidebar */}
            {renderSidebar()}

            {/* Main Content Area - Click to reset/close forms */}
            <div className={`flex-1 flex items-center justify-center p-8 pr-32 relative z-10 ${currentView !== 'landing' ? 'cursor-pointer' : ''}`} onClick={resetToLanding}>

                <div className="relative z-10 w-full max-w-sm cursor-default">
                    {currentView === 'login' && renderAuthForm()}
                    {currentView === 'register' && renderAuthForm()}
                    {currentView === 'about' && renderAboutPanel()}
                    {currentView === 'landing' && (
                        <div className="text-center animate-in fade-in duration-500">
                            {/* Content empty - nice clean look */}
                        </div>
                    )}
                </div>
            </div>

            {/* Game Popup (overlay) */}
            {currentView === 'play' && renderGamePopup()}

            {/* IF Logo & Status - Bottom Right Group */}
            <div className="fixed bottom-12 right-12 z-10 flex flex-col gap-0 select-none pointer-events-none opacity-20 items-end">
                <h1 className="text-[120px] font-black text-white tracking-tighter italic leading-[0.8]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    IF
                </h1>
                <div className="font-mono text-[10px] text-zinc-500 tracking-wider pr-2 mt-2 border-r-2 border-zinc-800 text-right">
                    <p>SYS.STATUS: ONLINE</p>
                    <p>NODE: ALPHA-7</p>
                </div>
            </div>
        </div>
    );
}
