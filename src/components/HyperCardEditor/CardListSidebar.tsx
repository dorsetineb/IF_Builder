import React from 'react';
import { HyperCard } from '../../types';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  Plus,
  Copy,
  Trash2,
  Flag,
  Image as ImageIcon,
  Sliders,
  Sparkles
} from 'lucide-react';

interface CardListSidebarProps {
  cards: HyperCard[];
  selectedCardId: string;
  startCardId?: string;
  onSelectCard: (cardId: string) => void;
  onAddCard: () => void;
  onDuplicateCard: (card: HyperCard) => void;
  onDeleteCard: (cardId: string) => void;
  onSetStartCard: (cardId: string) => void;
  onUpdateCardTransition: (cardId: string, transition: HyperCard['transition']) => void;
}

export const CardListSidebar: React.FC<CardListSidebarProps> = ({
  cards,
  selectedCardId,
  startCardId,
  onSelectCard,
  onAddCard,
  onDuplicateCard,
  onDeleteCard,
  onSetStartCard,
  onUpdateCardTransition,
}) => {
  const { t } = useTranslation();
  const selectedCard = cards.find(c => c.id === selectedCardId);

  return (
    <div className="w-64 md:w-72 bg-card/80 backdrop-blur-md border-r border-muted-foreground/30 flex flex-col h-full overflow-hidden select-none">
      {/* Header */}
      <div className="p-4 border-b border-muted-foreground/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            {t('hypercard.cardsListTitle', 'Cartões da Pilha')}
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
          {cards.length}
        </span>
      </div>

      {/* Cards Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cards.map((card, index) => {
          const isSelected = card.id === selectedCardId;
          const isStart = card.id === startCardId || (index === 0 && !startCardId);

          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-md shadow-primary/10'
                  : 'bg-background/60 hover:bg-muted border-muted-foreground/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Card Thumbnail */}
                <div className="w-14 h-11 rounded-lg bg-zinc-900 border border-muted-foreground/30 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  )}
                  {isStart && (
                    <div className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-primary shadow-sm" />
                  )}
                </div>

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground truncate">
                      {card.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      🎯 {card.hotspots.length} {t('hypercard.zonesCount', 'zonas')}
                    </span>
                    {isStart && (
                      <span className="text-[9px] uppercase font-bold text-primary bg-primary/10 px-1 py-0.2 rounded border border-primary/20">
                        {t('hypercard.startCard', 'INÍCIO')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Card Action Buttons */}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateCard(card);
                    }}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20"
                    title={t('common.duplicate', 'Duplicar')}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {cards.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCard(card.id);
                      }}
                      className="p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                      title={t('common.delete', 'Excluir')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Card Button */}
      <div className="p-3 border-t border-muted-foreground/30 space-y-2 bg-background/50">
        <button
          onClick={onAddCard}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('hypercard.addCardBtn', 'Novo Cartão')}</span>
        </button>

        {/* Selected Card Transition Control */}
        {selectedCard && (
          <div className="pt-2 border-t border-muted-foreground/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                {t('hypercard.cardTransition', 'Transição')}
              </span>
              {selectedCard.id !== startCardId && (
                <button
                  onClick={() => onSetStartCard(selectedCard.id)}
                  className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  <Flag className="w-3 h-3" />
                  <span>{t('hypercard.setAsStart', 'Tornar Inicial')}</span>
                </button>
              )}
            </div>
            <select
              value={selectedCard.transition || 'dissolve'}
              onChange={(e) => onUpdateCardTransition(selectedCard.id, e.target.value as HyperCard['transition'])}
              className="w-full bg-background border border-muted-foreground/40 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="dissolve">Dissolve (Suave)</option>
              <option value="cut">Cut (Instantâneo)</option>
              <option value="wipe-left">Wipe Esquerda</option>
              <option value="wipe-right">Wipe Direita</option>
              <option value="zoom">Zoom</option>
              <option value="iris">Iris (Círculo)</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
