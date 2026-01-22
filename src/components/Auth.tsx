import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2, User, MapPin, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';
import { DitherShader } from '@/components/ui/dither-shader';

interface AuthProps {
    isRecoveryMode?: boolean;
    onRecoveryComplete?: () => void;
}

export function Auth({ isRecoveryMode = false, onRecoveryComplete }: AuthProps) {
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(isRecoveryMode);
    const [sessionReady, setSessionReady] = useState(false);

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

        try {
            if (isSignUp) {
                // Direct registration (invite code step removed)

                // Step 2: Final Registration
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
                            username: email.split('@')[0] // Default username
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

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError(null);
        setMessage(null);
    };

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

            <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl relative z-10 overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-in-out">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

                <div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                                {isResetPassword ? (
                                    <><KeyRound className="w-6 h-6 text-purple-400" /> Redefinir Senha</>
                                ) : isForgotPassword ? (
                                    <><Mail className="w-6 h-6 text-purple-400" /> Recuperar Senha</>
                                ) : isSignUp ? (
                                    <><UserPlus className="w-6 h-6 text-purple-400" /> Criar Conta</>
                                ) : (
                                    <><LogIn className="w-6 h-6 text-purple-400" /> Acessar IF Builder</>
                                )}
                            </h1>
                            <p className="text-zinc-400 text-sm">
                                {isResetPassword
                                    ? 'Digite sua nova senha abaixo.'
                                    : isForgotPassword
                                        ? 'Digite seu e-mail para receber o link de recuperação.'
                                        : isSignUp
                                            ? 'Preencha seus dados para criar sua conta.'
                                            : <>Você acorda em uma caverna escura.<br />Um computador espera seu login e senha.</>}
                            </p>
                        </div>

                        {/* RESET PASSWORD FORM (when coming from email link) */}
                        {isResetPassword && (
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
                                            className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
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
                                            className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
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
                        )}

                        {/* FORGOT PASSWORD FORM */}
                        {isForgotPassword && !isResetPassword && (
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
                                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
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
                        {!isForgotPassword && !isResetPassword && (
                            <form onSubmit={handleAuth} className="space-y-4">


                                {/* REGISTRATION FORM or LOGIN */}
                                {(isSignUp || !isSignUp) && (
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
                                                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
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
                                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
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
                                                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
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
                                                        className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
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
                                                            className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
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
                                                            className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all text-sm"
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

                                        {isSignUp ? (
                                            <div className="pt-2 space-y-4">
                                                <button
                                                    type="submit"
                                                    className="w-full bg-white text-black hover:bg-zinc-200 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                                                    disabled={loading}
                                                >
                                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Criar Conta <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-white/5"
                                                disabled={loading}
                                            >
                                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Entrar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                                            </button>
                                        )}
                                    </div>
                                )}

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

                        {message && !isForgotPassword && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs animate-in fade-in slide-in-from-top-1">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                <p>{message}</p>
                            </div>
                        )}

                        {/* Toggle Login/Sign Up - hide on forgot/reset password */}
                        {!isForgotPassword && !isResetPassword && (
                            <div className="pt-4 border-t border-zinc-800/50">
                                <p className="text-xs text-zinc-500 text-center">
                                    {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                                    <button
                                        onClick={toggleMode}
                                        className="ml-1 text-white hover:text-purple-400 underline underline-offset-4 transition-colors font-medium"
                                    >
                                        {isSignUp ? 'Fazer login' : 'Cadastre-se'}
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="fixed bottom-10 right-24 hidden lg:block select-none pointer-events-none z-0 opacity-20">
                <h1 className="text-9xl font-black text-white tracking-tighter italic" style={{ fontFamily: 'Inter, sans-serif' }}>IF</h1>
            </div>
        </div >
    );
}
