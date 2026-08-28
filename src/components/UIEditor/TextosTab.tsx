import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Hand, 
    Lightbulb, 
    Package, 
    Book, 
    Wrench,
    FileText
} from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UIPreviewPanel } from './UIPreviewPanel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FONTS } from '../../constants';

interface TextosTabProps {
    // Custom Text variables & Setters
    localActionButtonText: string;
    setLocalActionButtonText: (val: string) => void;
    localVerbInputPlaceholder: string;
    setLocalVerbInputPlaceholder: (val: string) => void;
    localContinueButtonText: string;
    setLocalContinueButtonText: (val: string) => void;
    localRestartButtonText: string;
    setLocalRestartButtonText: (val: string) => void;
    localRetrospectiveButtonText: string;
    setLocalRetrospectiveButtonText: (val: string) => void;
    
    localSuggestionsButtonText: string;
    setLocalSuggestionsButtonText: (val: string) => void;
    localSuggestionsEmptyFeedback: string;
    setLocalSuggestionsEmptyFeedback: (val: string) => void;
    
    localInventoryButtonText: string;
    setLocalInventoryButtonText: (val: string) => void;
    localInventoryEmptyFeedback: string;
    setLocalInventoryEmptyFeedback: (val: string) => void;
    
    localDiaryButtonText: string;
    setLocalDiaryButtonText: (val: string) => void;
    localDiaryPlayerName: string;
    setLocalDiaryPlayerName: (val: string) => void;
    localEnableNotes: boolean;
    localNotesButtonText: string;
    setLocalNotesButtonText: (val: string) => void;
    localNotesPlaceholderText: string;
    setLocalNotesPlaceholderText: (val: string) => void;
    
    localSystemButtonText: string;
    setLocalSystemButtonText: (val: string) => void;
    localTrackersButtonText: string;
    setLocalTrackersButtonText: (val: string) => void;
    localMainMenuButtonText: string;
    setLocalMainMenuButtonText: (val: string) => void;
    localViewEndingButtonText: string;
    setLocalViewEndingButtonText: (val: string) => void;
    localSaveMenuTitle: string;
    setLocalSaveMenuTitle: (val: string) => void;
    localLoadMenuTitle: string;
    setLocalLoadMenuTitle: (val: string) => void;

    localDiceRollTextPrefix?: string;
    setLocalDiceRollTextPrefix?: (val: string) => void;
    localDiceRollButtonText?: string;
    setLocalDiceRollButtonText?: (val: string) => void;

    // Enable flags
    localEnableSuggestions: boolean;
    localEnableInventory: boolean;
    localEnableDiary: boolean;
    localEnableTrackers: boolean;
    localGameShowSystemButton: boolean;

    // UIPreviewPanel specific properties
    localFontFamily: string;
    localGameFontSize: string;
    localGameBackgroundColor: string;
    localGameFrameColor: string;
    localTextColor: string;
    localTitleColor: string;
    localFocusColor: string;
    localGameContinueIndicatorColor: string;
    localSplashButtonColor: string;
    localSplashButtonTextColor: string;
    localSplashButtonHoverColor: string;
    localActionButtonColor: string;
    localActionButtonTextColor: string;
    localActionButtonHoverColor: string;
    localSystemButtonColor: string;
    localSystemButtonTextColor: string;
    localSystemButtonBorderColor: string;
    localSystemButtonHoverColor: string;
    localSystemButtonHoverTextColor: string;
    localGameSceneNameOverlayBg: string;
    localGameSceneNameOverlayTextColor: string;
    localLayoutOrientation: 'vertical' | 'horizontal';
    localLayoutOrder: 'image-first' | 'image-last';
    localImageFrame: string;
    ditherColors: { primary: string; secondary: string };
    localEnableImages: boolean;
    localEnableSystemMenu?: boolean;
    
    previewType: 'scene' | 'vignette' | 'menu';
    setPreviewType: (type: 'scene' | 'vignette' | 'menu') => void;
    localSplashContentAlignment: 'left' | 'right';
    localOmitSplashTitle: boolean;
    localOmitSplashDescription: boolean;
    localSplashButtonText: string;
    localStartScreenBgImage?: string;
    localShowStartScreenTitle?: boolean;
    localStartScreenTitle?: string;
    localStartScreenButtonAlignment?: 'left' | 'center' | 'right';
    localStartScreenVerticalAlignment?: 'center' | 'bottom';
    localTitle?: string;
    
    localEnableChances?: boolean;
    localChanceIcon?: 'circle' | 'cross' | 'heart' | 'square' | 'diamond' | 'star';
    localChanceIconColor?: string;
    localMaxChances?: number;
    localGameInteractionType?: 'parser' | 'choice';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (key: string, value: any, save?: boolean) => void;
}

export const TextosTab: React.FC<TextosTabProps> = ({
    localActionButtonText,
    setLocalActionButtonText,
    localVerbInputPlaceholder,
    setLocalVerbInputPlaceholder,
    localContinueButtonText,
    setLocalContinueButtonText,
    localRestartButtonText,
    setLocalRestartButtonText,
    localRetrospectiveButtonText,
    setLocalRetrospectiveButtonText,
    
    localSuggestionsButtonText,
    setLocalSuggestionsButtonText,
    localSuggestionsEmptyFeedback,
    setLocalSuggestionsEmptyFeedback,
    
    localInventoryButtonText,
    setLocalInventoryButtonText,
    localInventoryEmptyFeedback,
    setLocalInventoryEmptyFeedback,
    
    localDiaryButtonText,
    setLocalDiaryButtonText,
    localDiaryPlayerName,
    setLocalDiaryPlayerName,
    localEnableNotes,
    localNotesButtonText,
    setLocalNotesButtonText,
    localNotesPlaceholderText,
    setLocalNotesPlaceholderText,
    
    localSystemButtonText,
    setLocalSystemButtonText,
    localTrackersButtonText,
    setLocalTrackersButtonText,
    localMainMenuButtonText,
    setLocalMainMenuButtonText,
    localViewEndingButtonText,
    setLocalViewEndingButtonText,
    localSaveMenuTitle,
    setLocalSaveMenuTitle,
    localLoadMenuTitle,
    setLocalLoadMenuTitle,
    localDiceRollTextPrefix = 'Você tirou',
    setLocalDiceRollTextPrefix,
    localDiceRollButtonText = '',
    setLocalDiceRollButtonText,

    localEnableSuggestions,
    localEnableInventory,
    localEnableDiary,
    localEnableTrackers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameShowSystemButton,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localFontFamily,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameBackgroundColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameFrameColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localTextColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localTitleColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localFocusColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameContinueIndicatorColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSplashButtonColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSplashButtonTextColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSplashButtonHoverColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localActionButtonColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localActionButtonTextColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localActionButtonHoverColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSystemButtonColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSystemButtonTextColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSystemButtonBorderColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSystemButtonHoverColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSystemButtonHoverTextColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameSceneNameOverlayBg,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameSceneNameOverlayTextColor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localLayoutOrientation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localLayoutOrder,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localImageFrame,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ditherColors,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localEnableImages,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localEnableSystemMenu,
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previewType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPreviewType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSplashContentAlignment,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localOmitSplashTitle,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localOmitSplashDescription,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localSplashButtonText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localStartScreenBgImage = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localShowStartScreenTitle = true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localStartScreenTitle = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localStartScreenButtonAlignment = 'center',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localStartScreenVerticalAlignment = 'center',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localTitle = '',
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localEnableChances = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localChanceIcon = 'heart',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localChanceIconColor = '#ff4d4d',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localMaxChances = 3,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    localGameInteractionType = 'parser',

    onUpdate
}) => {
    const { t } = useTranslation();

    return (
        <div className="col-span-1 lg:col-span-5 space-y-4">
            {/* SECTION: AÇÕES & INTERAÇÃO */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '50ms' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <Hand className="w-5 h-5" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.actions')}</h4>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label htmlFor="actionButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.actionButtonText')}</label>
                            <input type="text" id="actionButtonText" value={localActionButtonText || ''} onChange={(e) => setLocalActionButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.actionButtonPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="verbInputPlaceholder" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.commandInputPlaceholder')}</label>
                            <input type="text" id="verbInputPlaceholder" value={localVerbInputPlaceholder || ''} onChange={(e) => setLocalVerbInputPlaceholder(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.commandInputValue')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="continueButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.continueButtonText')}</label>
                            <input type="text" id="continueButtonText" value={localContinueButtonText || ''} onChange={(e) => setLocalContinueButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.continueButtonPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="restartButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.restartButtonText')}</label>
                            <input type="text" id="restartButtonText" value={localRestartButtonText || ''} onChange={(e) => setLocalRestartButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.restartButtonPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="retrospectiveButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.retrospectiveButton')}</label>
                            <input type="text" id="retrospectiveButtonText" value={localRetrospectiveButtonText || ''} onChange={(e) => setLocalRetrospectiveButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.retrospectivePlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="diceRollTextPrefix" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.diceRollTextPrefix', 'Prefixo da Rolagem de Dados')}</label>
                            <input type="text" id="diceRollTextPrefix" value={localDiceRollTextPrefix || ''} onChange={(e) => setLocalDiceRollTextPrefix?.(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.diceRollTextPrefixPlaceholder', 'Você tirou')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="diceRollButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.diceRollButtonText', 'Texto do Botão de Rolagem de Dados')}</label>
                            <input type="text" id="diceRollButtonText" value={localDiceRollButtonText || ''} onChange={(e) => setLocalDiceRollButtonText?.(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.diceRollButtonTextPlaceholder', 'Rolar D6')} />
                        </div>
                    </div>
                </div>

                {/* SECTION: SUGESTÕES */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <Lightbulb className="w-5 h-5" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.suggestions')}</h4>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label htmlFor="suggestionsButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.suggestionsButton')}</label>
                            <input type="text" id="suggestionsButtonText" value={localSuggestionsButtonText || ''} onChange={e => setLocalSuggestionsButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.suggestionsPlaceholder')} disabled={!localEnableSuggestions} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="suggestionsEmptyFeedback" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.suggestionsEmptyFeedbackLabel')}</label>
                            <input
                                type="text"
                                id="suggestionsEmptyFeedback"
                                value={localSuggestionsEmptyFeedback || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setLocalSuggestionsEmptyFeedback(val);
                                    onUpdate('gameSuggestionsEmptyFeedback', val);
                                }}
                                className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                placeholder={t('UIEditor.textos.suggestionsEmptyFeedbackPlaceholder')}
                                disabled={!localEnableSuggestions}
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION: INVENTÁRIO */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <Package className="w-5 h-5" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.inventory')}</h4>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label htmlFor="inventoryButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.inventoryButton')}</label>
                            <input type="text" id="inventoryButtonText" value={localInventoryButtonText || ''} onChange={e => setLocalInventoryButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.inventoryPlaceholder')} disabled={!localEnableInventory} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="inventoryEmptyFeedback" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.inventoryEmptyFeedbackLabel')}</label>
                            <input
                                type="text"
                                id="inventoryEmptyFeedback"
                                value={localInventoryEmptyFeedback || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setLocalInventoryEmptyFeedback(val);
                                    onUpdate('gameInventoryEmptyFeedback', val);
                                }}
                                className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                placeholder={t('UIEditor.textos.inventoryEmptyFeedbackPlaceholder')}
                                disabled={!localEnableInventory}
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION: DIÁRIO & NARRATIVA */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <Book className="w-5 h-5" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.diary')}</h4>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label htmlFor="diaryButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.diaryButton')}</label>
                            <input type="text" id="diaryButtonText" value={localDiaryButtonText || ''} onChange={e => setLocalDiaryButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.diaryPlaceholder')} disabled={!localEnableDiary} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="diaryPlayerName" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.diaryPlayerName')}</label>
                            <input type="text" id="diaryPlayerName" value={localDiaryPlayerName || ''} onChange={(e) => setLocalDiaryPlayerName(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.diaryPlayerNamePlaceholder')} disabled={!localEnableDiary} />
                        </div>
                    </div>
                </div>

                {/* SECTION: ANOTAÇÕES */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '350ms' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-5 h-5" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.notes', 'Anotações')}</h4>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label htmlFor="notesButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.notesButton', 'Botão de Anotações')}</label>
                            <input 
                                type="text" 
                                id="notesButtonText" 
                                value={localNotesButtonText || ''} 
                                onChange={e => {
                                    const val = e.target.value;
                                    setLocalNotesButtonText(val);
                                    onUpdate('gameNotesButtonText', val);
                                }} 
                                className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" 
                                placeholder={t('UIEditor.textos.notesPlaceholder', 'Anotações')} 
                                disabled={!localEnableNotes} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="notesPlaceholderText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.notesTextAreaPlaceholderLabel')}</label>
                            <input 
                                type="text" 
                                id="notesPlaceholderText" 
                                value={localNotesPlaceholderText || ''} 
                                onChange={e => {
                                    const val = e.target.value;
                                    setLocalNotesPlaceholderText(val);
                                    onUpdate('gameNotesPlaceholderText', val);
                                }} 
                                className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" 
                                placeholder={t('UIEditor.textos.notesTextAreaPlaceholderPlaceholder')} 
                                disabled={!localEnableNotes} 
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION: INTERFACE & SISTEMA */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <Wrench className="w-5 h-5" />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">{t('UIEditor.textos.sections.system')}</h4>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label htmlFor="systemButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.systemButton')}</label>
                            <input type="text" id="systemButtonText" value={localSystemButtonText || ''} onChange={e => setLocalSystemButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.systemPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="trackersButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.trackersButton')}</label>
                            <input type="text" id="trackersButtonText" value={localTrackersButtonText || ''} onChange={e => setLocalTrackersButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed" placeholder={t('UIEditor.textos.trackersPlaceholder')} disabled={!localEnableTrackers} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="mainMenuButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.mainMenuButton')}</label>
                            <input type="text" id="mainMenuButtonText" value={localMainMenuButtonText || ''} onChange={e => setLocalMainMenuButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.mainMenuPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="viewEndingButtonText" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.viewEndingButton')}</label>
                            <input type="text" id="viewEndingButtonText" value={localViewEndingButtonText || ''} onChange={e => setLocalViewEndingButtonText(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.viewEndingPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="saveMenuTitle" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.saveMenuTitle')}</label>
                            <input type="text" id="saveMenuTitle" value={localSaveMenuTitle || ''} onChange={e => setLocalSaveMenuTitle(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.saveMenuPlaceholder')} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="loadMenuTitle" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('UIEditor.textos.loadMenuTitle')}</label>
                            <input type="text" id="loadMenuTitle" value={localLoadMenuTitle || ''} onChange={e => setLocalLoadMenuTitle(e.target.value)} className="w-full bg-background border border-muted-foreground/50 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder={t('UIEditor.textos.loadMenuPlaceholder')} />
                        </div>
                    </div>
                </div>
        </div>
    );
};
