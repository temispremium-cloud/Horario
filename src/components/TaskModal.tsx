import React, { useState } from 'react';
import { Course, TaskItem } from '../types';
import { X, Calendar, Plus } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  courses: Course[];
  initialCourseId?: string;
  onClose: () => void;
  onSaveTask: (task: Omit<TaskItem, 'id'>) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  courses,
  initialCourseId,
  onClose,
  onSaveTask
}) => {
  if (!isOpen) return null;

  const [courseId, setCourseId] = useState(initialCourseId || courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskItem['type']>('Parcial');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) return;

    onSaveTask({
      courseId,
      title: title.trim(),
      type,
      dueDate: dueDate || 'Por definir',
      completed: false
    });

    setTitle('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" /> Nuevo Recordatorio / Parcial
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm text-gray-700">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Materia Asociada
            </label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-medium"
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  [{course.group}] {course.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tipo de Evento
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as TaskItem['type'])}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-medium"
            >
              <option value="Parcial">Examen Parcial</option>
              <option value="Tarea">Entrega de Tarea / Proyecto</option>
              <option value="Laboratorio">Informe de Laboratorio</option>
              <option value="Exposición">Exposición / Presentación</option>
              <option value="Otro">Otro Recordatorio</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Título / Descripción corta
            </label>
            <input
              type="text"
              placeholder="Ej. Parcial 1 de Consultas SQL y Normalización"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Fecha de Entrega
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Guardar Recordatorio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
