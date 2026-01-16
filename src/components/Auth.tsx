import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2, User, MapPin, Eye, EyeOff, Ticket, ArrowLeft, Send } from 'lucide-react';
import { DitherShader } from '@/components/ui/dither-shader';

export function Auth() {
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    // Step State for Sign Up: 1 = Invite Code, 2 = Details
    const [signUpStep, setSignUpStep] = useState(1);
    const [inviteCode, setInviteCode] = useState('');

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

    // Access Request State
    const [accessEmail, setAccessEmail] = useState('');
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    const handleRequestAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessEmail.trim()) return;

        setRequestLoading(true);

        try {
            // 1. Send actual email via FormSubmit (Zero-config)
            // This triggers an email to ola@ifbuildr.com
            // NOTE: The owner of ola@ifbuildr.com must activate the endpoint once by clicking the link in the first email received.
            await fetch("https://formsubmit.co/ajax/ola@ifbuildr.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    _subject: "Novo Pedido de Acesso - IF Builder",
                    email: accessEmail,
                    message: `O usuário ${accessEmail} solicitou acesso à plataforma.`,
                    _template: "table" // Makes it look nice
                })
            });

            // 2. Backup: Save to Supabase DB
            const { error: reqError } = await supabase
                .from('landing_page_requests')
                .insert([{ email: accessEmail }]);

            if (reqError) {
                console.error("DB Log Error:", reqError);
            }

            setRequestSent(true);
        } catch (err) {
            console.error("Unexpected error:", err);
            // Even if email service fails, we show success if we hopefully logged it or just to not block user
            // But usually fetch doesn't throw on 4xx/5xx, so we assume success for UX
            setRequestSent(true);
        } finally {
            setRequestLoading(false);
            setAccessEmail('');

            // Reset success message after a few seconds
            setTimeout(() => setRequestSent(false), 5000);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                if (signUpStep === 1) {
                    // Verify Invite Code
                    if (!inviteCode.trim()) throw new Error("Insira um código de convite.");

                    const { data: isValid, error: rpcError } = await supabase.rpc('check_invite', { code_input: inviteCode });

                    if (rpcError) throw rpcError;
                    if (!isValid) throw new Error("Código inválido ou expirado.");

                    // Determine username automatically or proceed
                    setSignUpStep(2);
                    setLoading(false);
                    return; // Stop here, UI updates to step 2
                }

                // Step 2: Final Registration
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

                // Sign Up via Supabase Auth
                // Metadata will trigger the handle_new_user function which consumes the invite
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            location: location,
                            username: email.split('@')[0], // Default username
                            invite_code: inviteCode // CRITICAL: This allows the trigger to validate & consume
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
            // Only stop loading if we are NOT moving to step 2 (handled above)
            // or if we finished/errored
            if (isSignUp && signUpStep === 1 && !error) {
                // logic handled inside try block for step transition
            } else {
                setLoading(false);
            }
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setSignUpStep(1); // Reset to step 1
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

            <div className={`w-full ${(isSignUp && signUpStep === 1) ? 'max-w-4xl' : 'max-w-md'} bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl relative z-10 overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-in-out`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

                <div className={isSignUp && signUpStep === 1 ? "grid grid-cols-1 md:grid-cols-2" : ""}>
                    {/* Left Column - Invite Info */}
                    {isSignUp && signUpStep === 1 && (
                        <div className="p-8 bg-zinc-950/30 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col space-y-6">
                            <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2 h-8 text-center w-full">
                                Sobre o IF Builder
                            </h3>
                            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed flex-1 flex flex-col justify-end pb-4 text-left">
                                <p>
                                    Este site é uma iniciativa independente dedicada ao desenvolvimento de ficções interativas, e sua manutenção é feita por um desenvolvedor solo muito dedicado.
                                </p>
                                <p>
                                    O acesso é controlado para que o projeto cresça de forma sustentável, respeitando os limites da infraestrutura e do desenvolvedor.
                                </p>
                                <p>
                                    Insira seu e-mail abaixo para solicitar acesso. O envio do código pode demorar um pouco, mas ele chegará ;)
                                </p>
                            </div>

                            {/* Access Request Form */}
                            <div className="pt-4 mt-auto border-t border-zinc-800/50">
                                <form onSubmit={handleRequestAccess} className="relative">
                                    {requestSent && (
                                        <div className="absolute inset-0 z-20 bg-black rounded-lg flex items-center justify-center gap-2 animate-in fade-in duration-300">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span className="text-white font-bold text-xs">Solicitação enviada.</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600" />
                                            <input
                                                type="email"
                                                placeholder="seu@email.com"
                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 pl-9 pr-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 placeholder:text-zinc-600 disabled:opacity-50"
                                                value={accessEmail}
                                                onChange={(e) => setAccessEmail(e.target.value)}
                                                disabled={requestLoading || requestSent}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={requestLoading || requestSent}
                                            className="bg-zinc-100 hover:bg-white text-zinc-900 px-4 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                                        >
                                            {requestLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Pedir acesso'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="p-8 space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                                {isSignUp ? <UserPlus className="w-6 h-6 text-purple-400" /> : <LogIn className="w-6 h-6 text-purple-400" />}
                                {isSignUp ? 'Criar Conta' : 'Acessar IF Builder'}
                            </h1>
                            <p className="text-zinc-400 text-sm">
                                {isSignUp
                                    ? (signUpStep === 1 ? 'Insira o código de 6 dígitos para avançar.' : 'Preencha seus dados para finalizar.')
                                    : <>Você acorda em uma caverna escura.<br />Um computador espera seu login e senha.</>}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">

                            {/* INVITE CODE STEP (Sign Up Step 1) */}
                            {isSignUp && signUpStep === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Ticket className="h-6 w-6 text-purple-500 group-focus-within:text-purple-400 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="XXXXXX"
                                                value={inviteCode}
                                                onChange={(e) => setInviteCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                                                onPaste={(e) => {
                                                    e.preventDefault();
                                                    const pastedData = e.clipboardData.getData('text');
                                                    const sanitized = pastedData.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
                                                    setInviteCode(sanitized);
                                                }}
                                                className="w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-purple-500/30 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-2xl font-mono tracking-[0.5em] text-center uppercase shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-xl transition-all flex items-center justify-center gap-2 group font-semibold text-base shadow-xl shadow-white/5"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Validar Código <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>}
                                    </button>
                                </div>
                            )}

                            {/* REGISTRATION FORM (Sign Up Step 2) or LOGIN */}
                            {((isSignUp && signUpStep === 2) || !isSignUp) && (
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
                                            <div className="flex items-center gap-2 px-1 h-6">
                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    checked={acceptedTerms}
                                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                    className="custom-checkbox"
                                                />
                                                <label htmlFor="terms" className="text-[11px] text-muted-foreground">
                                                    Li e concordo com os <a href="#" className="text-purple-400 hover:text-purple-300">Termos</a> e <a href="#" className="text-purple-400 hover:text-purple-300">Privacidade</a>.
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-white text-black hover:bg-zinc-200 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                                                disabled={loading}
                                            >
                                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Criar Conta <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setSignUpStep(1)}
                                                className="w-full text-zinc-500 hover:text-white py-2 transition-colors text-xs flex items-center justify-center gap-1"
                                            >
                                                <ArrowLeft size={12} /> Voltar para o Código
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
                        </form>

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

                        {/* Toggle Login/Sign Up (Hide on SignUp Step 2 to avoid confusion, forcing back first) */}
                        {!(isSignUp && signUpStep === 2) && (
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
