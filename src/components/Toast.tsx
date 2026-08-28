import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastType } from './ToastContext';

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={18} className="text-primary-foreground shrink-0" />;
            case 'error': return <AlertCircle size={18} className="text-primary-foreground shrink-0" />;
            default: return <Info size={18} className="text-primary-foreground shrink-0" />;
        }
    };

    return (
        <div
            className={`
                pointer-events-auto bg-primary text-primary-foreground
                rounded-lg shadow-lg px-4 py-3 flex gap-3 items-center transition-all duration-300 transform border border-primary-foreground/20
                ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
            role="alert"
        >
            <div className="shrink-0 flex items-center justify-center">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-foreground leading-snug">{message}</p>
            </div>
            <button
                onClick={onDismiss}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1 rounded-md shrink-0 ml-1"
                aria-label="Fechar notificação"
            >
                <X size={14} />
            </button>
        </div>
    );
};
