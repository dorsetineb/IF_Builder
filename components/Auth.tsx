import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2, User, MapPin, Eye, EyeOff, Gamepad2 } from 'lucide-react';
import { DitherShader } from '@/components/ui/dither-shader';

export function Auth() {
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [location, setLocation] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                // Validation
                if (password !== confirmPassword) {
                    throw new Error("As senhas não coincidem.");
                }
                if (!acceptedTerms) {
                    throw new Error("Você precisa aceitar os Termos de Serviço.");
                }
                if (fullName.length < 3) {
                    throw new Error("Por favor, insira seu nome e sobrenome.");
                }

                // Sign Up
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
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
            setError(msg || 'Ocorreu um erro na autenticação.');
        } finally {
            setLoading(false);
        }
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

            <div className={`w-full ${isSignUp ? 'max-w-4xl' : 'max-w-md'} bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl relative z-10 overflow-hidden rounded-2xl shadow-2xl transition-all duration-500`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

                <div className="p-8 space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                            {isSignUp ? <UserPlus className="w-6 h-6 text-purple-400" /> : <LogIn className="w-6 h-6 text-blue-400" />}
                            {isSignUp ? 'Criar Conta' : 'Acessar IF Builder'}
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            {isSignUp
                                ? 'Junte-se à aventura e comece a criar suas histórias hoje mesmo.'
                                : 'Entre com seu e-mail e senha para continuar.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className={isSignUp ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                        {/* Left Column / Main Fields */}
                        <div className="space-y-4">
                            {isSignUp && (
                                <>
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
                                </>
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

                            {!isSignUp && (
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
                            )}
                        </div>

                        {/* Right Column / Security Fields & Actions */}
                        <div className="space-y-4">
                            {isSignUp && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Senha</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Mínimo de 6 caracteres"
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
                                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Confirmar Senha</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Repita sua senha"
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

                                    <div className="space-y-2">
                                        {/* Terms as Label slot */}
                                        <div className="flex items-center gap-2 px-1 h-6">
                                            <input
                                                id="terms"
                                                type="checkbox"
                                                checked={acceptedTerms}
                                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                className="w-3.5 h-3.5 rounded border-purple-500/30 bg-purple-500/10 text-purple-500 focus:ring-purple-500/20 focus:ring-offset-0 cursor-pointer checked:bg-purple-500 checked:border-purple-500"
                                            />
                                            <label htmlFor="terms" className="text-[10px] text-zinc-400 leading-tight">
                                                Li e concordo com os <a href="#" className="text-purple-400 hover:text-purple-300">Termos</a> e <a href="#" className="text-purple-400 hover:text-purple-300">Privacidade</a>.
                                            </label>
                                        </div>

                                        {/* Button as Input slot */}
                                        <button
                                            type="submit"
                                            className="w-full bg-white text-black hover:bg-zinc-200 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    Criar Conta
                                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}

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

                            {!isSignUp && (
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-white/5"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            Entrar
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="pt-4 border-t border-zinc-800/50">
                        <p className="text-xs text-zinc-500 text-center">
                            {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-1 text-white hover:text-purple-400 underline underline-offset-4 transition-colors font-medium"
                            >
                                {isSignUp ? 'Fazer login' : 'Cadastre-se'}
                            </button>
                        </p>
                    </div>
                </div>
            </div >

            {/* Decorative elements */}
            <div className="fixed bottom-10 right-24 hidden lg:block select-none pointer-events-none z-0 opacity-20">
                <h1 className="text-9xl font-black text-white tracking-tighter italic" style={{ fontFamily: 'Inter, sans-serif' }}>IF</h1>
            </div>
        </div >
    );
}
