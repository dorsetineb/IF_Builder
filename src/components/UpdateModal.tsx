import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Download, X, AlertTriangle, Loader2 } from 'lucide-react';
import { ReleaseInfo } from '../services/autoUpdater';
import { APP_VERSION } from '../version';

interface UpdateModalProps {
  isOpen: boolean;
  releaseInfo: ReleaseInfo | null;
  onConfirm: () => void;
  onCancel: () => void;
  isUpdating?: boolean;
  downloadProgress?: number;
  downloadStatusText?: string;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  releaseInfo,
  onConfirm,
  onCancel,
  isUpdating = false,
  downloadProgress = 0,
  downloadStatusText = 'Baixando atualização...',
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
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800 disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Save Project Warning Callout */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-amber-300">Lembre-se de Salvar seu Projeto!</span>
            <span className="opacity-90 leading-relaxed block text-[11px]">
              Por favor, certifique-se de salvar suas alterações no editor antes de atualizar. O aplicativo atualizará e reiniciará automaticamente.
            </span>
          </div>
        </div>

        {/* Version Badge & Info */}
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3 text-xs font-mono space-y-1.5 text-zinc-300">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">{t('updater.currentVersion', 'Versão atual:')}</span>
            <span className="font-semibold text-zinc-400">v{APP_VERSION}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">{t('updater.latestVersion', 'Nova versão:')}</span>
            <span className="font-bold text-primary">v{releaseInfo.version}</span>
          </div>
        </div>

        {/* Progress Bar (Visible during update) */}
        {isUpdating ? (
          <div className="space-y-2 py-2">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                {downloadStatusText}
              </span>
              <span className="font-mono text-primary font-bold">{downloadProgress}%</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-3 overflow-hidden border border-zinc-800 p-0.5">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out shadow-sm"
                style={{ width: `${Math.max(3, downloadProgress)}%` }}
              />
            </div>
          </div>
        ) : (
          /* Description / Prompt */
          <p className="text-xs text-zinc-300 leading-relaxed">
            {t(
              'updater.promptMessage',
              'Uma nova versão do IFBuilder está disponível. Deseja atualizar o aplicativo internamente agora?'
            )}
          </p>
        )}

        {/* Release Notes (if present and not updating) */}
        {!isUpdating && releaseInfo.releaseNotes && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              {t('updater.changelog', 'Notas da Versão')}
            </span>
            <div className="text-xs text-zinc-400 max-h-24 overflow-y-auto bg-zinc-950 p-3 rounded-lg border border-zinc-800 whitespace-pre-wrap leading-relaxed">
              {releaseInfo.releaseNotes}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            {t('updater.cancelUpdate', 'Agora Não')}
          </button>

          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isUpdating ? (
              <span>Atualizando...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('updater.confirmUpdate', 'Baixar e Atualizar')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
