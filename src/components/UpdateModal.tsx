import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Download, X, ArrowUpRight } from 'lucide-react';
import { ReleaseInfo } from '../services/autoUpdater';
import { APP_VERSION } from '../version';

interface UpdateModalProps {
  isOpen: boolean;
  releaseInfo: ReleaseInfo | null;
  onConfirm: () => void;
  onCancel: () => void;
  isUpdating?: boolean;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  releaseInfo,
  onConfirm,
  onCancel,
  isUpdating = false,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !releaseInfo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border-2 border-muted-foreground/20 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            {t('updater.newVersionAvailable', 'Nova Atualização Disponível')}
          </h3>
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Version Badge & Info */}
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3 text-xs font-mono space-y-1.5 text-zinc-300">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">{t('updater.currentVersion', 'Versão atual:')}</span>
            <span className="font-semibold text-zinc-400">v{APP_VERSION}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">{t('updater.latestVersion', 'Nova versão:')}</span>
            <span className="font-bold text-emerald-400">v{releaseInfo.version}</span>
          </div>
        </div>

        {/* Description / Prompt */}
        <p className="text-sm text-zinc-300 leading-relaxed">
          {t(
            'updater.promptMessage',
            'Uma nova versão do IFBuilder está disponível no GitHub. Deseja baixar e atualizar agora?'
          )}
        </p>

        {/* Release Notes (if present) */}
        {releaseInfo.releaseNotes && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t('updater.changelog', 'Notas da Versão')}
            </span>
            <div className="text-xs text-zinc-400 max-h-28 overflow-y-auto bg-zinc-950 p-3 rounded-lg border border-zinc-800 whitespace-pre-wrap leading-relaxed">
              {releaseInfo.releaseNotes}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm font-semibold disabled:opacity-50"
          >
            {t('updater.cancelUpdate', 'Agora Não')}
          </button>

          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isUpdating ? (
              <span>{t('updater.downloading', 'Baixando...')}</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('updater.confirmUpdate', 'Baixar e Atualizar')}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
