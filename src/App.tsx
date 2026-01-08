
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
import PendingApproval from './pages/PendingApproval';

const App: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isApproved, setIsApproved] = useState<boolean | null>(null);

    useEffect(() => {
        const checkApproval = async (userId: string) => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_approved')
                    .eq('id', userId)
                    .single();

                if (error) {
                    console.error('Error checking approval:', error);
                    // If error (e.g. profile doesn't exist yet), default to false to be safe, 
                    // or true if you want to be lenient. Given beta, default false.
                    setIsApproved(false);
                    return;
                }

                setIsApproved(!!data?.is_approved);
            } catch (err) {
                console.error('Unexpected error checking approval:', err);
                setIsApproved(false);
            }
        };

        const initSession = async () => {
            // Safety timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout')), 5000);
            });

            const sessionLoadPromise = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);

                if (session?.user) {
                    await checkApproval(session.user.id);
                }
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
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user) {
                // If we don't have approval status yet, or if switching users
                await checkApproval(session.user.id);
            } else {
                setIsApproved(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center text-white">Carregando...</div>;
    }

    if (!session) {
        return <Auth />;
    }

    // Gate for Beta Access
    if (isApproved === false) {
        return (
            <ThemeProvider defaultTheme="dark" storageKey="if-builder-theme">
                <ToastProvider>
                    <Router>
                        <Routes>
                            <Route path="*" element={<PendingApproval />} />
                        </Routes>
                    </Router>
                </ToastProvider>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="if-builder-theme">
            <ToastProvider>
                <Router>
                    <Routes>
                        {/* Platform Routes */}
                        <Route element={<PlatformLayout />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />

                            <Route path="/community" element={<Community />} />
                            <Route path="/community/authors" element={<Authors />} />
                            <Route path="/community/author/:id" element={<AuthorProfile />} />
                            <Route path="/community/my-posts" element={<MyPosts />} />
                            <Route path="/community/favorites" element={<Favorites />} />
                            <Route path="/community/create" element={<CreatePost />} />
                            <Route path="/community/edit/:id" element={<CreatePost />} />
                            <Route path="/community/post/:id" element={<PostDetail />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/projects" element={<div className="p-8 text-white">Página de Projetos (Em construção)</div>} />
                        </Route>
                        {/* Editor Route (Standalone) */}
                        <Route path="/editor" element={<Editor />} />
                        {/* Catch all */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Router>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;
