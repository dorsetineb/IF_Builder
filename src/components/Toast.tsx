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
            case 'success': return <CheckCircle size={18} className="text-white" />;
            case 'error': return <AlertCircle size={18} className="text-white" />;
            default: return <Info size={18} className="text-white" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'border-green-500/20';
            case 'error': return 'border-red-500/20';
            default: return 'border-blue-500/20';
        }
    };

    return (
        <div
            className={`
                pointer-events-auto bg-purple-600 text-white 
                rounded-lg shadow-lg p-4 flex gap-3 items-start transition-all duration-300 transform
                ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">{title}</h4>
                {description && <p className="text-xs text-purple-100 mt-1 leading-relaxed">{description}</p>}
            </div>
            <button
                onClick={onDismiss}
                className="text-purple-200 hover:text-white transition-colors -mr-1 -mt-1 p-1 rounded-md"
            >
                <X size={14} />
            </button>
        </div>
    );
};
