import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Auth } from './components/Auth';
import PlatformLayout from './components/layouts/PlatformLayout';
import Settings from './pages/Settings';
import Editor from './components/Editor';
import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './components/ToastContext';
import AboutProject from './pages/AboutProject';

const App: React.FC = () => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.title = t('app.title', 'IF Builder / Ficções Interativas');
    }, [i18n.language, t]);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="if-builder-theme">
            <ToastProvider>
                <Router>
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
                </Router>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;
