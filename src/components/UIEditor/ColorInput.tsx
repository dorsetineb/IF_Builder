import React, { memo } from 'react';

interface ColorInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

export const ColorInput: React.FC<ColorInputProps> = memo(({ label, id, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</label>
        <div className="flex items-center gap-2 p-1 bg-background border border-muted-foreground/50 rounded-lg focus-within:border-primary/50 transition-all">
            <input
                type="color"
                id={`${id}-picker`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                aria-label={`Seletor de cor para ${label}`}
            />
            <input
                type="text"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent border-none text-[10px] font-mono p-1 focus:outline-none focus:ring-0"
                placeholder={placeholder}
            />
        </div>
    </div>
));

ColorInput.displayName = 'ColorInput';
