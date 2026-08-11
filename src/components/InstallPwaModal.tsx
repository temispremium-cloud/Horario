import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  X,
  Share,
  PlusSquare,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if already in standalone display mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt event (Android / Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstallSuccess(true);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Error initiating PWA install:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#b7191f] to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-white shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Instalar en tu Móvil
              </h3>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                UniGuajira - Horario Estudiante
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-sm text-gray-700 max-h-[80vh] overflow-y-auto">
          {installSuccess || isInstalled ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">
                ¡Aplicación Instalada!
              </h4>
              <p className="text-xs text-gray-600 max-w-xs mx-auto">
                Ya tienes el Horario Estudiante en la pantalla de inicio de tu celular. Puedes abrirlo sin necesidad de navegador.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          ) : (
            <>
              {/* Features list */}
              <div className="bg-red-50/60 p-3.5 rounded-xl border border-red-100 space-y-2">
                <div className="font-bold text-[#b7191f] text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Ventajas de la App en tu Celular
                </div>
                <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside font-medium">
                  <li>Acceso instantáneo desde la pantalla de inicio sin escribir la URL.</li>
                  <li>Funciona <strong>sin conexión a internet</strong> en todo momento.</li>
                  <li>Soporte para pantalla completa sin barras del navegador.</li>
                  <li>Notificaciones y horario actualizado en vivo.</li>
                </ul>
              </div>

              {/* Native Prompt button (Android Chrome) */}
              {deferredPrompt && (
                <div className="space-y-2">
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 px-4 bg-[#b7191f] hover:bg-red-800 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" /> Instalar Ahora con 1 Clic
                  </button>
                  <p className="text-[11px] text-gray-500 text-center">
                    Se añadirá el icono oficial de UniGuajira a tus aplicaciones.
                  </p>
                </div>
              )}

              {/* Manual instructions for iOS iPhone / iPad */}
              {isIOS && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="font-bold text-gray-900 text-xs flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    Instrucciones para iPhone / iPad (Safari)
                  </div>
                  <ol className="text-xs text-gray-700 space-y-2.5 font-medium">
                    <li className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        1
                      </span>
                      <span>
                        Toca el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> en la barra inferior de Safari.
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        2
                      </span>
                      <span>
                        Desplázate hacia abajo y elige <PlusSquare className="w-3.5 h-3.5 inline text-gray-700 mx-0.5" /> <strong>"Añadir a pantalla de inicio"</strong>.
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        3
                      </span>
                      <span>
                        Confirma tocando <strong>Añadir</strong> arriba a la derecha. ¡Listo!
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Instructions for Android Chrome / other browsers if native prompt didn't show */}
              {!deferredPrompt && !isIOS && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="font-bold text-gray-900 text-xs flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    Cómo instalar manualmente en Android / Navegador
                  </div>
                  <ol className="text-xs text-gray-700 space-y-2 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-200 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        1
                      </span>
                      <span>Abre el menú del navegador (tres puntos <ExternalLink className="w-3 h-3 inline text-gray-500" /> arriba a la derecha).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-200 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        2
                      </span>
                      <span>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla principal"</strong>.</span>
                    </li>
                  </ol>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>PWA Oficial UniGuajira</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
