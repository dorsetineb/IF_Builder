import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastType } from './ToastContext';

interface ToastProps {
    id: string;
    title: string;
    description?: string;
    type: ToastType;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ title, description, type, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={18} className="text-primary-foreground" />;
            case 'error': return <AlertCircle size={18} className="text-primary-foreground" />;
            default: return <Info size={18} className="text-primary-foreground" />;
        }
    };

    return (
        <div
            className={`
                pointer-events-auto bg-primary text-primary-foreground
                rounded-lg shadow-lg p-4 flex gap-3 items-start transition-all duration-300 transform border border-primary-foreground/20
                ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-primary-foreground">{title}</h4>
                {description && <p className="text-xs text-primary-foreground/90 mt-1 leading-relaxed">{description}</p>}
            </div>
            <button
                onClick={onDismiss}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors -mr-1 -mt-1 p-1 rounded-md"
            >
                <X size={14} />
            </button>
        </div>
    );
};
