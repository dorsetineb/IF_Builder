import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Hand, 
    Lightbulb, 
    Package, 
    Book, 
    Wrench 
} from 'lucide-react';
import { UIPreviewPanel } from './UIPreviewPanel';
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

    localEnableSuggestions,
    localEnableInventory,
    localEnableDiary,
    localEnableTrackers,
    localGameShowSystemButton,

    localFontFamily,
    localGameFontSize,
    localGameBackgroundColor,
    localGameFrameColor,
    localTextColor,
    localTitleColor,
    localFocusColor,
    localGameContinueIndicatorColor,
    localSplashButtonColor,
    localSplashButtonTextColor,
    localSplashButtonHoverColor,
    localActionButtonColor,
    localActionButtonTextColor,
    localActionButtonHoverColor,
    localSystemButtonColor,
    localSystemButtonTextColor,
    localSystemButtonBorderColor,
    localSystemButtonHoverColor,
    localSystemButtonHoverTextColor,
    localGameSceneNameOverlayBg,
    localGameSceneNameOverlayTextColor,
    localLayoutOrientation,
    localLayoutOrder,
    localImageFrame,
    ditherColors,
    localEnableImages,
    localEnableSystemMenu,
    
    previewType,
    setPreviewType,
    localSplashContentAlignment,
    localOmitSplashTitle,
    localOmitSplashDescription,
    localSplashButtonText,
    localStartScreenBgImage = '',
    localShowStartScreenTitle = true,
    localStartScreenTitle = '',
    localStartScreenButtonAlignment = 'center',
    localStartScreenVerticalAlignment = 'center',
    localTitle = '',
    
    localEnableChances = false,
    localChanceIcon = 'heart',
    localChanceIconColor = '#ff4d4d',
    localMaxChances = 3,
    localGameInteractionType = 'parser',

    onUpdate
}) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-32">
            {/* Left Column: Controls */}
            <div className="col-span-1 lg:col-span-5 space-y-8">
                {/* SECTION: AÇÕES & INTERAÇÃO */}
                <div className="bg-card border border-muted-foreground/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
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

            {/* Right Column: Preview */}
            <UIPreviewPanel
                localFontFamily={localFontFamily}
                localGameFontSize={localGameFontSize}
                localGameBackgroundColor={localGameBackgroundColor}
                localGameFrameColor={localGameFrameColor}
                localTextColor={localTextColor}
                localTitleColor={localTitleColor}
                localFocusColor={localFocusColor}
                localGameContinueIndicatorColor={localGameContinueIndicatorColor}
                localSplashButtonColor={localSplashButtonColor}
                localSplashButtonTextColor={localSplashButtonTextColor}
                localSplashButtonHoverColor={localSplashButtonHoverColor}
                localActionButtonColor={localActionButtonColor}
                localActionButtonTextColor={localActionButtonTextColor}
                localActionButtonHoverColor={localActionButtonHoverColor}
                localSystemButtonColor={localSystemButtonColor}
                localSystemButtonTextColor={localSystemButtonTextColor}
                localSystemButtonBorderColor={localSystemButtonBorderColor}
                localSystemButtonHoverColor={localSystemButtonHoverColor}
                localSystemButtonHoverTextColor={localSystemButtonHoverTextColor}
                localGameSceneNameOverlayBg={localGameSceneNameOverlayBg}
                localGameSceneNameOverlayTextColor={localGameSceneNameOverlayTextColor}
                localLayoutOrientation={localLayoutOrientation}
                localLayoutOrder={localLayoutOrder}
                localImageFrame={localImageFrame}
                ditherColors={ditherColors}
                localEnableInventory={localEnableInventory}
                localEnableDiary={localEnableDiary}
                localEnableTrackers={localEnableTrackers}
                localGameShowSystemButton={localGameShowSystemButton}
                localEnableImages={localEnableImages}
                localEnableSuggestions={localEnableSuggestions}
                localEnableSystemMenu={localEnableSystemMenu}
                previewType={previewType}
                setPreviewType={setPreviewType}
                localSplashContentAlignment={localSplashContentAlignment}
                localOmitSplashTitle={localOmitSplashTitle}
                localOmitSplashDescription={localOmitSplashDescription}
                localSplashButtonText={localSplashButtonText}
                localStartScreenBgImage={localStartScreenBgImage}
                localShowStartScreenTitle={localShowStartScreenTitle}
                localStartScreenTitle={localStartScreenTitle}
                localStartScreenButtonAlignment={localStartScreenButtonAlignment}
                localStartScreenVerticalAlignment={localStartScreenVerticalAlignment}
                localTitle={localTitle}
                localEnableChances={localEnableChances}
                localChanceIcon={localChanceIcon}
                localChanceIconColor={localChanceIconColor}
                localMaxChances={localMaxChances}
                localGameInteractionType={localGameInteractionType}

                // Add texts reflections to preview panel
                localSuggestionsButtonText={localSuggestionsButtonText}
                localInventoryButtonText={localInventoryButtonText}
                localDiaryButtonText={localDiaryButtonText}
                localTrackersButtonText={localTrackersButtonText}
                localActionButtonText={localActionButtonText}
                localVerbInputPlaceholder={localVerbInputPlaceholder}
            />
        </div>
    );
};
