import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import { useToast } from '../ToastContext';
import { compressImageToWebP } from '../../utils/imageOptimizer';
import { MAX_IMAGE_SIZE } from '../../constants';

export interface ImageUploadFieldProps {
  value?: string;
  onChange: (image: string) => void;
  className?: string;
  label?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  maxSize?: number;
  id?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  className = 'relative w-full aspect-video bg-muted/30 rounded-lg overflow-hidden border border-muted-foreground/50 group',
  label,
  children,
  disabled = false,
  maxSize = MAX_IMAGE_SIZE,
  id,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const generatedId = useId();
  const inputId = id || `image-upload-${generatedId}`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (maxSize && file.size > maxSize) {
      toast(
        t('UIEditor.errors.uploadError', 'Erro ao carregar imagem'),
        t('sceneEditor.imageLimitExceeded', {
          size: Math.round(maxSize / 1024 / 1024),
          defaultValue: `A imagem excede o limite de ${Math.round(maxSize / 1024 / 1024)}MB.`,
        }),
        'error'
      );
      if (e.target) e.target.value = '';
      return;
    }

    try {
      const compressed = await compressImageToWebP(file);
      onChange(compressed);
    } catch (err) {
      console.error('Image compression failed, falling back to FileReader', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onChange(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  return (
    <div className={className}>
      {value ? (
        <>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {children}

          <div
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 gap-4 backdrop-blur-sm"
            style={{ zIndex: 20 }}
          >
            <label
              htmlFor={inputId}
              className="group/btn flex flex-col items-center gap-2 cursor-pointer text-white hover:text-primary transition-colors"
            >
              <div className="p-2 bg-white/10 rounded-full group-hover/btn:bg-white/20 transition-all">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {t('sceneEditor.changeBtn', 'Trocar')}
              </span>
              <input
                id={inputId}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange('');
              }}
              disabled={disabled}
              className="group/del flex flex-col items-center gap-2 text-white hover:text-red-400 transition-colors"
              title={t('common.delete', 'Excluir')}
            >
              <div className="p-2 bg-white/10 rounded-full group-hover/del:bg-red-600 group-hover/del:text-white transition-all">
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {t('sceneEditor.removeBtn', 'Remover')}
              </span>
            </button>
          </div>
        </>
      ) : (
        <label
          htmlFor={inputId}
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/5 transition-colors group/empty"
        >
          <div className="w-12 h-12 rounded-full bg-background border border-muted-foreground/50 flex items-center justify-center mb-3 group-hover/empty:scale-110 group-hover/empty:border-primary/50 transition-all">
            <ImageIcon className="w-5 h-5 text-muted-foreground group-hover/empty:text-primary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground group-hover/empty:text-foreground text-center px-2">
            {label || t('sceneEditor.loadImage', 'Carregar imagem')}
          </span>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploadField;
