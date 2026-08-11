import React, { useState } from 'react';
import { Course, ScheduleEntry, TimeSlot, TaskItem, DayOfWeek } from '../types';
import {
  X,
  User,
  MapPin,
  Clock,
  BookOpen,
  Edit3,
  Check,
  Plus,
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  entries: ScheduleEntry[];
  timeSlots: TimeSlot[];
  tasks: TaskItem[];
  onClose: () => void;
  onUpdateCourse: (updated: Course) => void;
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  entries,
  timeSlots,
  tasks,
  onClose,
  onUpdateCourse,
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  if (!course) return null;

  const [isEditingClassroom, setIsEditingClassroom] = useState(false);
  const [classroomInput, setClassroomInput] = useState(course.classroom);
  const [notesInput, setNotesInput] = useState(course.notes || '');

  // New task form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskItem['type']>('Parcial');

  // Find all schedule blocks for this course
  const courseEntries = entries.filter(e => e.courseId === course.id);
  const slotMap = new Map(timeSlots.map(s => [s.id, s]));

  // Group by day
  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  const dayBlocks = days.map(day => {
    const dayEntries = courseEntries.filter(e => e.day === day);
    const slots = dayEntries
      .map(e => slotMap.get(e.slotId))
      .filter((s): s is TimeSlot => s !== undefined)
      .sort((a, b) => a.start.localeCompare(b.start));

    if (slots.length === 0) return null;
    return {
      day,
      startTime: slots[0].start,
      endTime: slots[slots.length - 1].end,
      count: slots.length
    };
  }).filter((b): b is { day: DayOfWeek; startTime: string; endTime: string; count: number } => b !== null);

  const courseTasks = tasks.filter(t => t.courseId === course.id);

  const handleSaveClassroom = () => {
    onUpdateCourse({
      ...course,
      classroom: classroomInput.trim() || 'No disponible en el reporte fuente',
      notes: notesInput.trim()
    });
    setIsEditingClassroom(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      courseId: course.id,
      title: newTaskTitle.trim(),
      dueDate: newTaskDueDate || 'Por definir',
      completed: false,
      type: newTaskType
    });

    setNewTaskTitle('');
    setNewTaskDueDate('');
    setShowAddTask(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Course Color Banner */}
        <div
          className="p-5 border-b border-black/10 flex items-start justify-between relative"
          style={{ backgroundColor: course.color }}
        >
          <div>
            <div className="inline-block px-2 py-0.5 bg-black/10 text-gray-900 font-bold text-xs rounded mb-1">
              Grupo {course.group}
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {course.code}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm text-gray-700 flex-1">
          {/* Main Metadata */}
          <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase">Docente</div>
                <div className="font-bold text-gray-900">{course.professor}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-semibold uppercase flex items-center justify-between">
                  <span>Aula / Edificio</span>
                  {!isEditingClassroom && (
                    <button
                      onClick={() => setIsEditingClassroom(true)}
                      className="text-blue-600 hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Editar Aula
                    </button>
                  )}
                </div>

                {isEditingClassroom ? (
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={classroomInput}
                      onChange={e => setClassroomInput(e.target.value)}
                      placeholder="Ej. Bloque C - Aula 201"
                      className="flex-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSaveClassroom}
                      className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="font-medium text-gray-900 italic mt-0.5">
                    {course.classroom}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Sessions */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Horario Semanal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dayBlocks.map(block => (
                <div
                  key={block.day}
                  className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-gray-900">{block.day}</span>
                  <span className="font-mono text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {block.startTime} - {block.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Notes / Syllabus Summary */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Notas y Temario
            </h3>
            <textarea
              value={notesInput}
              onChange={e => setNotesInput(e.target.value)}
              onBlur={handleSaveClassroom}
              placeholder="Escribe notas sobre parciales, grupos de laboratorio, etc."
              rows={2}
              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Tasks & Exams for this Course */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Entregas y Parciales ({courseTasks.length})
              </h3>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>

            {showAddTask && (
              <form onSubmit={handleCreateTask} className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="Título de la tarea o parcial..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
                <div className="flex gap-2">
                  <select
                    value={newTaskType}
                    onChange={e => setNewTaskType(e.target.value as TaskItem['type'])}
                    className="text-xs px-2 py-1 bg-white border border-gray-300 rounded focus:outline-none"
                  >
                    <option value="Parcial">Parcial</option>
                    <option value="Tarea">Tarea</option>
                    <option value="Laboratorio">Laboratorio</option>
                    <option value="Exposición">Exposición</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={e => setNewTaskDueDate(e.target.value)}
                    className="text-xs px-2 py-1 bg-white border border-gray-300 rounded focus:outline-none flex-1"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}

            {courseTasks.length === 0 ? (
              <div className="text-xs text-gray-400 italic text-center py-2 bg-gray-50 rounded-lg">
                No hay tareas o parciales guardados para este curso.
              </div>
            ) : (
              <div className="space-y-1.5">
                {courseTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-xs gap-2"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                        className="rounded text-blue-600 cursor-pointer"
                      />
                      <span className={task.completed ? 'line-through text-gray-400' : 'font-medium text-gray-900'}>
                        [{task.type}] {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {task.dueDate}
                      </span>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
