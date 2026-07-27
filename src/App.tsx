import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Auth } from './components/Auth';
import { ThemeProvider } from './components/ThemeProvider';
import { TypographyProvider } from './components/TypographyProvider';
import { ToastProvider } from './components/ToastContext';
import Analytics from './components/Analytics';

// Lazy load heavy components
const PlatformLayout = lazy(() => import('./components/layouts/PlatformLayout'));
const Settings = lazy(() => import('./pages/Settings'));
const Editor = lazy(() => import('./components/Editor'));
const AboutProject = lazy(() => import('./pages/AboutProject'));

const AppContent: React.FC = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        if (path === '/about') {
            document.title = t('app.aboutTitle', 'IF Builder / Sobre o Projeto');
        } else if (path === '/editor' || path === '/settings') {
            document.title = t('app.editorTitle', 'IF Builder / Editor de Narrativa');
        } else {
            document.title = t('app.title', 'IF Builder / Ficções Interativas');
        }
    }, [location.pathname, i18n.language, t]);

    return (
        <Suspense fallback={<div className="h-screen w-screen bg-black" />}>
            <Routes>
                {/* Landing Page Route */}
                <Route path="/" element={<Auth />} />

                {/* Platform Routes */}
                <Route element={<PlatformLayout />}>
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/about" element={<AboutProject />} />
                    <Route path="/projects" element={<div className="p-8 text-white">Página de Projetos (Em construção)</div>} />
                </Route>

                {/* Editor Route */}
                <Route path="/editor" element={<Editor />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="if-builder-theme">
            <TypographyProvider>
                <ToastProvider>
                    <Router>
                        <Analytics />
                        <AppContent />
                    </Router>
                </ToastProvider>
            </TypographyProvider>
        </ThemeProvider>
    );
};

export default App;
