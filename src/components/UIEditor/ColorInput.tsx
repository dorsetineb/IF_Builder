import React, { memo } from 'react';

interface ColorInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    headerRight?: React.ReactNode;
}

export const ColorInput: React.FC<ColorInputProps> = memo(({ label, id, value, onChange, placeholder = '#000000', headerRight }) => {
    const pickerValue = value && value.startsWith('#') 
        ? (value.length === 4 
            ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}` 
            : value.substring(0, 7)) 
        : '#000000';

    return (
        <div className="w-full min-w-0">
            <div className="flex items-center justify-between mb-1.5 gap-2">
                <label htmlFor={id} className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{label}</label>
                {headerRight && <div className="shrink-0">{headerRight}</div>}
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 bg-background border border-muted-foreground/30 rounded-lg focus-within:border-primary transition-all">
                {/* Quadrado de cor (swatch) perfeito e indeformável */}
                <div
                    className="w-6 h-6 shrink-0 rounded border border-white/25 relative overflow-hidden flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: pickerValue }}
                >
                    <input
                        type="color"
                        id={`${id}-picker`}
                        value={pickerValue}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer p-0 border-0 m-0"
                        aria-label={`Seletor de cor para ${label}`}
                    />
                </div>
                <input
                    type="text"
                    id={id}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent border-none text-xs font-mono text-foreground focus:outline-none focus:ring-0 p-0"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
});

ColorInput.displayName = 'ColorInput';
