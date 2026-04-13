import React from 'react';
import { GameData } from '../types';

export const getFramePreviewStyles = (
    frame: GameData['gameImageFrame'],
    localGameTheme: 'dark' | 'light',
    localGameFrameColor?: string
) => {
    const panelStyles: React.CSSProperties = { boxSizing: 'border-box', overflow: 'hidden' };
    const containerStyles: React.CSSProperties = {
        backgroundColor: localGameTheme === 'dark' ? '#111827' : '#f8fafc',
        color: localGameTheme === 'dark' ? '#94a3b8' : '#475569',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
    };
    let panelClass = '';
    let containerClass = '';

    switch (frame) {
        case 'rounded-top':
            panelStyles.padding = '5px';
            panelStyles.backgroundColor = localGameFrameColor || '#FFFFFF';
            panelStyles.border = 'none';
            panelStyles.borderRadius = '40px 40px 4px 4px';
            containerStyles.borderRadius = '35px 35px 0 0';
            panelClass = 'frame-preview-portal';
            containerClass = 'frame-preview-portal-container';
            break;
        case 'book-cover':
            panelStyles.padding = '5px';
            panelStyles.backgroundColor = localGameFrameColor || '#FFFFFF';
            panelStyles.border = 'none';
            panelClass = 'frame-preview-book';
            break;
        case 'trading-card':
            panelStyles.backgroundColor = localGameFrameColor || '#FFFFFF';
            panelStyles.borderRadius = '12px';
            panelStyles.padding = '4px';
            containerStyles.border = 'none';
            containerStyles.borderRadius = '8px';
            panelClass = 'frame-preview-trading';
            containerClass = 'frame-preview-trading-container';
            break;
        default:
            panelStyles.border = 'none';
            panelStyles.padding = '0';
    }
    return { panelStyles, containerStyles, panelClass, containerClass };
};
