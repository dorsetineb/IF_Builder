
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

const App: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
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
