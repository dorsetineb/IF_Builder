import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from './Toast';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (messageOrTitle: string, descriptionOrType?: string | ToastType, type?: ToastType) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const toast = useCallback((messageOrTitle: string, descriptionOrType?: string | ToastType, typeParam?: ToastType) => {
        let finalMessage = messageOrTitle;
        let finalType: ToastType = 'info';

        if (descriptionOrType === 'success' || descriptionOrType === 'error' || descriptionOrType === 'info') {
            finalType = descriptionOrType;
            finalMessage = messageOrTitle;
        } else if (typeof descriptionOrType === 'string' && descriptionOrType.trim().length > 0) {
            // If both title and description are provided, use the descriptive contextual text
            finalMessage = descriptionOrType;
            finalType = typeParam || 'info';
        } else if (typeParam) {
            finalType = typeParam;
        }

        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message: finalMessage, type: finalType }]);

        // Auto dismiss after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                {toasts.map((t) => (
                    <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
