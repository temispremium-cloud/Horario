import React from 'react';
import {
  FileText,
  LayoutGrid,
  Printer,
  Calendar,
  RotateCcw,
  GraduationCap,
  Smartphone
} from 'lucide-react';

interface HeaderNavProps {
  activeView: 'official' | 'interactive';
  onViewChange: (view: 'official' | 'interactive') => void;
  onPrint: () => void;
  onExportICS: () => void;
  onResetSchedule: () => void;
  onOpenInstallModal: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeView,
  onViewChange,
  onPrint,
  onExportICS,
  onResetSchedule,
  onOpenInstallModal,
}) => {
  return (
    <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1250px] mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Program */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="w-10 h-10 rounded-xl bg-[#b7191f] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-gray-900 text-base sm:text-lg leading-none">
                Horario Estudiante
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-[#b7191f] rounded-full uppercase">
                UniGuajira
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Programa de Ingeniería de Sistemas
            </p>
          </div>
        </div>

        {/* View Switches */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => onViewChange('official')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'official'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#b7191f]" />
            Formato Oficial Impreso
          </button>
          <button
            onClick={() => onViewChange('interactive')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'interactive'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
            Tablero Interactivo
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
          <button
            onClick={onOpenInstallModal}
            className="px-3 py-1.5 bg-gradient-to-r from-[#b7191f] to-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs hover:brightness-110 transition-all cursor-pointer animate-pulse sm:animate-none"
            title="Instalar esta aplicación en tu teléfono inteligente"
          >
            <Smartphone className="w-4 h-4" />
            Instalar en Móvil
          </button>

          <button
            onClick={onExportICS}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Exportar evento recurrente a Google Calendar / Apple Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Exportar .ICS
          </button>

          <button
            onClick={onPrint}
            className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir PDF
          </button>

          <button
            onClick={onResetSchedule}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Restablecer a valores iniciales"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
