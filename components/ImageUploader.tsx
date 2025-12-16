import React, { useState, useRef, DragEvent, MouseEvent, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface ImageUploaderProps {
  image?: string;
  onImageUpload: (dataUrl: string) => void;
  onRemove: () => void;
  className?: string;
  id?: string;
  height?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  image, 
  onImageUpload, 
  onRemove, 
  className = "", 
  id,
  height = "h-full min-h-[200px]"
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // View State
  const [isOriginalSize, setIsOriginalSize] = useState(false); // Toggle for "Actual Resolution"
  
  // Position State
  // For Cover Mode: Percentage (0-100)
  const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 });
  // For Original Size Mode: Pixels (translate)
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reset positions when image changes
  useEffect(() => {
      setBgPosition({ x: 50, y: 50 });
      setTranslate({ x: 0, y: 0 });
      setIsOriginalSize(false);
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
         if (ev.target?.result && typeof ev.target.result === 'string') {
             onImageUpload(ev.target.result);
         }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => {
             if (ev.target?.result && typeof ev.target.result === 'string') {
                 onImageUpload(ev.target.result);
             }
        };
        reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !containerRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      if (isOriginalSize) {
          // Pixel panning for full resolution
          setTranslate(prev => ({
              x: prev.x + deltaX,
              y: prev.y + deltaY
          }));
      } else {
          // Percentage panning for Cover mode
          // Sensitivity: Moving 1px moves 0.2% (adjust as needed for feel)
          // Direction: Dragging Right (Positive Delta) should show Left side (Decrease %)
          const sensitivity = 0.2;
          setBgPosition(prev => ({
              x: Math.max(0, Math.min(100, prev.x - (deltaX * sensitivity))),
              y: Math.max(0, Math.min(100, prev.y - (deltaY * sensitivity)))
          }));
      }
  };

  const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
  };
  
  const toggleViewMode = (e: MouseEvent) => {
      e.stopPropagation();
      setIsOriginalSize(!isOriginalSize);
      // Reset positions on toggle to prevent getting lost
      if (!isOriginalSize) {
          setTranslate({ x: 0, y: 0 }); 
      }
  }

  return (
    <div 
        ref={containerRef}
        className={`relative bg-brand-bg border-2 ${isDraggingOver ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-border border-dashed'} rounded-md overflow-hidden group ${className} ${height}`}
    >
        {image ? (
            <div 
                className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <img 
                    src={image} 
                    alt="Uploaded" 
                    className={`transition-transform duration-75 pointer-events-none select-none ${isOriginalSize ? 'absolute max-w-none w-auto h-auto' : 'absolute inset-0 w-full h-full object-cover'}`}
                    style={
                        isOriginalSize 
                        ? { transform: `translate(${translate.x}px, ${translate.y}px)` }
                        : { objectPosition: `${bgPosition.x}% ${bgPosition.y}%` }
                    }
                    draggable={false}
                />
                
                {/* Controls Overlay */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                     <button
                        onClick={toggleViewMode}
                        className={`p-1.5 rounded-md transition-colors border border-brand-border ${isOriginalSize ? 'bg-brand-primary text-brand-bg font-bold' : 'bg-brand-surface/80 text-brand-text hover:bg-brand-surface'}`}
                        title={isOriginalSize ? "Voltar ao ajuste (Cover)" : "Ver resolução real (Zoom)"}
                        type="button"
                    >
                        <MagnifyingGlassIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="p-1.5 bg-red-500/80 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="Remover Imagem"
                        type="button"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Hint Overlay (only visible initially or when hovering if not moved much) */}
                {!isOriginalSize && bgPosition.x === 50 && bgPosition.y === 50 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-brand-text-dim bg-brand-bg/80 px-2 py-1 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        Arraste para visualizar
                    </div>
                )}
            </div>
        ) : (
             <label 
                htmlFor={id}
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-brand-border/30 transition-colors p-4 text-center absolute inset-0"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(false); }}
                onDrop={handleDrop}
             >
                  <UploadIcon className="w-8 h-8 text-brand-text-dim mb-3" />
                  <span className="text-sm font-semibold text-brand-text">Clique para Enviar</span>
                  <span className="text-xs text-brand-text-dim mt-1">ou arraste e solte</span>
                  <input id={id} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
             </label>
        )}
    </div>
  );
};