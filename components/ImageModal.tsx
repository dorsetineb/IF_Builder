import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
                <X size={32} />
            </button>
            <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <img
                    src={imageUrl}
                    alt="Full screen"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
            </div>
        </div>
    );
};

export default ImageModal;
