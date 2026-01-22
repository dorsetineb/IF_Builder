
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import PlatformLayout from './components/layouts/PlatformLayout';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Authors from './pages/Authors';
import AuthorProfile from './pages/AuthorProfile';
import MyPosts from './pages/MyPosts';
import Favorites from './pages/Favorites';
import Editor from './components/Editor';
import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './components/ToastContext';
import { UserProvider } from './components/UserContext';
import { FeedProvider } from './components/FeedContext';
import AboutProject from './pages/AboutProject';

const App: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);

    useEffect(() => {

        const initSession = async () => {
            // Safety timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout')), 5000);
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
            // Detect password recovery event
            if (event === 'PASSWORD_RECOVERY') {
                setIsRecoveryMode(true);
            }
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black text-white font-['Silkscreen'] text-sm p-4 sm:p-8 flex flex-col justify-start overflow-hidden selection:bg-white selection:text-black">
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
                    <div className="flex items-center gap-2">
                        <span>A:\&gt; RUN IF-BUILDER.EXE</span>
                        <span className="w-2.5 h-5 bg-white animate-pulse"></span>
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
                                {/* Dashboard route removed */}

                                {/* Community Routes - HIDDEN AS REQUESTED
                                <Route path="/community" element={<Community />} />
                                <Route path="/community/authors" element={<Authors />} />
                                <Route path="/community/author/:id" element={<AuthorProfile />} />
                                <Route path="/community/my-posts" element={<MyPosts />} />
                                <Route path="/community/favorites" element={<Favorites />} />
                                <Route path="/community/create" element={<CreatePost />} />
                                <Route path="/community/edit/:id" element={<CreatePost />} />
                                <Route path="/community/post/:id" element={<PostDetail />} />
                                */}
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
