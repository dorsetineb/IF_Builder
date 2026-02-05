import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import PlatformLayout from './components/layouts/PlatformLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Editor from './components/Editor';
import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './components/ToastContext';
import { UserProvider } from './components/UserContext';
import AboutProject from './pages/AboutProject';

const App: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);

    // BIOS Animation State
    // BIOS Animation State
    const [biosStep, setBiosStep] = useState(0); // 0: Info, 1: Prompt Wait, 2: Typing
    const [typedCommand, setTypedCommand] = useState('');
    const [isBiosFinished, setIsBiosFinished] = useState(false);

    useEffect(() => {
        const initSession = async () => {
            // Safety timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout')), 8000);
            });

            const sessionLoadPromise = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
            };

            try {
                await Promise.race([sessionLoadPromise(), timeoutPromise]);
            } catch (err) {
                console.warn('Session load timed out or failed, forcing UI render', err);
            } finally {
                setLoading(false);
            }
        };

        initSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsRecoveryMode(true);
            }
            setSession(session);
            setLoading(false);
        });

        // BIOS Animation Sequence
        const fullCommand = "RUN IF-BUILDER.EXE";

        // Step 1: Show prompt A:\> fast (0.5s)
        const timer1 = setTimeout(() => {
            setBiosStep(1);
        }, 500);

        // Step 2: Start typing command after 1.5s
        let typingInterval: any;
        const timer2 = setTimeout(() => {
            setBiosStep(2);
            let charIndex = 0;
            typingInterval = setInterval(() => {
                if (charIndex < fullCommand.length) {
                    setTypedCommand(fullCommand.slice(0, charIndex + 1));
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 50); // Speed of typing: 50ms per char
        }, 1500);

        // Finish: End animation after typing completes
        // 1.5s (start) + ~1s (typing) + 0.5s (pause) = 3s
        const timer3 = setTimeout(() => {
            setIsBiosFinished(true);
        }, 3000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            if (typingInterval) clearInterval(typingInterval);
        };
    }, []);

    // Show BIOS until both data is loaded AND animation is finished
    if (loading || !isBiosFinished) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black text-white font-['Silkscreen'] text-sm p-4 sm:p-8 flex flex-col justify-start overflow-hidden selection:bg-white selection:text-black cursor-none">
                <style>{`
                    @keyframes hard-blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }
                    .animate-hard-blink {
                        animation: hard-blink 0.5s step-end infinite;
                    }
                `}</style>
                <div className="space-y-1 max-w-3xl">
                    <p>IF-BUILDER BIOS v1.0.24</p>
                    <p className="mb-4">Copyright (C) 2026 Deepmind Systems Inc.</p>

                    <p>System Memory: 640KB OK</p>
                    <p>Extended Memory: 32MB OK</p>
                    <p>Shadow RAM: Cached</p>
                    <br />
                    <p>Detecting Primary Master ... IF_BUILDER_CORE</p>
                    <p>Detecting Primary Slave ... USER_DATA</p>
                    <br />
                    <p>Booting from Hard Disk...</p>
                    <p>Loading interactive_fiction_engine.sys ... OK</p>
                    <p>Mounting file system ... OK</p>
                    <br />

                    {/* Prompt appears in Step 1 */}
                    {/* Prompt appears in Step 1 */}
                    <div className={`flex items-center ${biosStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="mr-2">A:\&gt;</span>
                        {/* Command Typed Character by Character */}
                        {biosStep >= 2 && <span>{typedCommand}</span>}
                        {/* Blinking Cursor - Always visible after prompt, moves with text */}
                        <span className="w-2.5 h-5 bg-white animate-hard-blink"></span>
                    </div>
                </div>
            </div>
        );
    }

    // Show Auth for password recovery OR when not logged in
    if (!session || isRecoveryMode) {
        return <Auth isRecoveryMode={isRecoveryMode} onRecoveryComplete={() => setIsRecoveryMode(false)} />;
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="if-builder-theme">
            <ToastProvider>
                <UserProvider>
                    <Router>
                        <Routes>
                            {/* Platform Routes */}
                            <Route element={<PlatformLayout />}>
                                <Route path="/" element={<Navigate to="/editor" replace />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/about" element={<AboutProject />} />
                                <Route path="/projects" element={<div className="p-8 text-white">Página de Projetos (Em construção)</div>} />
                            </Route>
                            <Route path="/editor" element={<Editor />} />
                            {/* Reset Password Route */}
                            <Route path="/reset-password" element={<Auth isRecoveryMode={true} onRecoveryComplete={() => {
                                setIsRecoveryMode(false);
                                window.location.href = '/';
                            }} />} />
                            {/* Catch all */}
                            <Route path="*" element={<Navigate to="/editor" replace />} />
                        </Routes>
                    </Router>
                </UserProvider>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;
