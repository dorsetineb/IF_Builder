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
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);

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

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Simple loading screen while checking session
    if (loading) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
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
