import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, currentIndex]);

    const showPrev = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
    };

    const showNext = () => {
        setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : prev));
    };

    if (!images || images.length === 0) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-50"
            >
                <X size={32} />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); showPrev(); }}
                        disabled={currentIndex === 0}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all ${currentIndex === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); showNext(); }}
                        disabled={currentIndex === images.length - 1}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all ${currentIndex === images.length - 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                    >
                        <ChevronRight size={40} />
                    </button>
                </>
            )}

            <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                {images.length > 1 && (
                    <div className="mt-4 text-white/50 text-sm font-medium">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageModal;
