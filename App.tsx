
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import PlatformLayout from './components/layouts/PlatformLayout';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Editor from './components/Editor';

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
        <Router>
            <Routes>
                {/* Platform Routes */}
                <Route element={<PlatformLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/projects" element={<div className="p-8 text-white">Página de Projetos (Em construção)</div>} />
                    <Route path="/settings" element={<div className="p-8 text-white">Configurações (Em construção)</div>} />
                </Route>

                {/* Editor Route (Standalone) */}
                <Route path="/editor" element={<Editor />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
