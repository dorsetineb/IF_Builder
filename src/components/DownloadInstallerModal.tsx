import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Monitor, Terminal, X } from 'lucide-react';
import { APP_VERSION } from '../version';

interface DownloadInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadInstallerModal: React.FC<DownloadInstallerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<'windows' | 'linux'>('windows');

  if (!isOpen) return null;

  const handleDownload = () => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const downloadApiUrl = isLocalhost
      ? `https://www.ifbuildr.com/api/download?platform=${platform}`
      : `/api/download?platform=${platform}`;

    window.location.href = downloadApiUrl;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border-2 border-muted-foreground/20 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            {t('downloadModal.title', 'Baixar IFBuilder Desktop')}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          {t('downloadModal.subtitle', 'Escolha o sistema operacional para baixar o instalador oficial (v{{version}}):', { version: APP_VERSION })}
        </p>

        {/* Platform Selection Grid */}
        <div className="grid grid-cols-2 gap-3 py-2">
          {/* Windows Option */}
          <button
            type="button"
            onClick={() => setPlatform('windows')}
            className={`flex flex-col items-center gap-2.5 p-4 rounded-lg border-2 transition-all text-center cursor-pointer ${
              platform === 'windows'
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/30 hover:border-muted-foreground/50'
            }`}
          >
            <Monitor className={`w-7 h-7 ${platform === 'windows' ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <span className={`text-xs font-bold block ${platform === 'windows' ? 'text-primary' : 'text-foreground'}`}>
                {t('downloadModal.windowsTitle', 'Windows')}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                {t('downloadModal.windowsDesc', 'Instalador .exe / .msi')}
              </span>
            </div>
          </button>

          {/* Linux Option */}
          <button
            type="button"
            onClick={() => setPlatform('linux')}
            className={`flex flex-col items-center gap-2.5 p-4 rounded-lg border-2 transition-all text-center cursor-pointer ${
              platform === 'linux'
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/30 hover:border-muted-foreground/50'
            }`}
          >
            <Terminal className={`w-7 h-7 ${platform === 'linux' ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <span className={`text-xs font-bold block ${platform === 'linux' ? 'text-primary' : 'text-foreground'}`}>
                {t('downloadModal.linuxTitle', 'Linux')}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                {t('downloadModal.linuxDesc', 'Pacote .AppImage / .deb')}
              </span>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm font-semibold"
          >
            {t('common.cancel', 'Cancelar')}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors text-sm font-bold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t('downloadModal.confirmBtn', 'Baixar Instalador')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
