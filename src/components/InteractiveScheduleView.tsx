import React, { useState, useMemo } from 'react';
import { Course, ScheduleEntry, TimeSlot, DayOfWeek, TaskItem } from '../types';
import {
  Clock,
  User,
  MapPin,
  BookOpen,
  Calendar,
  AlertCircle,
  Plus,
  Search,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface InteractiveScheduleViewProps {
  courses: Course[];
  entries: ScheduleEntry[];
  timeSlots: TimeSlot[];
  days: DayOfWeek[];
  tasks: TaskItem[];
  onCourseClick: (course: Course) => void;
  onAddTaskClick: (courseId?: string) => void;
  onToggleTask: (taskId: string) => void;
}

export const InteractiveScheduleView: React.FC<InteractiveScheduleViewProps> = ({
  courses,
  entries,
  timeSlots,
  days,
  tasks,
  onCourseClick,
  onAddTaskClick,
  onToggleTask,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<DayOfWeek | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Current Day & Time calculation
  const now = new Date();
  const currentDayIndex = now.getDay(); // 0 = Sun, 1 = Mon ...
  const dayNameMap: Record<number, DayOfWeek | undefined> = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miercoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sabado'
  };
  const todayName = dayNameMap[currentDayIndex];

  const currentTimeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Helper to find course for a specific slot and day
  const getCourseForSlot = (slotId: string, day: DayOfWeek): Course | undefined => {
    const entry = entries.find(e => e.slotId === slotId && e.day === day);
    if (!entry) return undefined;
    return courses.find(c => c.id === entry.courseId);
  };

  // Check if course matches current search
  const isCourseFiltered = (course: Course) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      course.code.toLowerCase().includes(q) ||
      course.professor.toLowerCase().includes(q) ||
      course.group.toLowerCase().includes(q) ||
      course.classroom.toLowerCase().includes(q)
    );
  };

  // Find active or upcoming class today
  const todayStatus = useMemo(() => {
    if (!todayName) {
      return { type: 'weekend', message: '¡Hoy no hay clases programadas! Buen fin de semana.' };
    }

    // Get all slots for today that have a course
    const todayEntries = entries.filter(e => e.day === todayName);
    if (todayEntries.length === 0) {
      return { type: 'free', message: `Hoy ${todayName} no tienes clases registradas.` };
    }

    // Sort by slot start time
    const slotMap = new Map(timeSlots.map(s => [s.id, s]));
    const todaySlotsWithCourse = todayEntries
      .map(e => ({
        entry: e,
        slot: slotMap.get(e.slotId),
        course: courses.find(c => c.id === e.courseId)
      }))
      .filter((item): item is { entry: ScheduleEntry; slot: TimeSlot; course: Course } => item.slot !== undefined && item.course !== undefined)
      .sort((a, b) => a.slot.start.localeCompare(b.slot.start));

    // Check currently active class
    const activeItem = todaySlotsWithCourse.find(
      item => currentTimeString >= item.slot.start && currentTimeString <= item.slot.end
    );

    if (activeItem) {
      return {
        type: 'active',
        course: activeItem.course,
        slot: activeItem.slot,
        message: `Clase en curso ahora (${activeItem.slot.label}): ${activeItem.course.code}`
      };
    }

    // Check upcoming class
    const upcomingItem = todaySlotsWithCourse.find(item => item.slot.start > currentTimeString);
    if (upcomingItem) {
      return {
        type: 'upcoming',
        course: upcomingItem.course,
        slot: upcomingItem.slot,
        message: `Próxima clase hoy a las ${upcomingItem.slot.start}: ${upcomingItem.course.code}`
      };
    }

    return { type: 'done', message: `Has terminado todas tus clases de hoy ${todayName}.` };
  }, [entries, courses, timeSlots, todayName, currentTimeString]);

  // Count total hours per course
  const courseHours = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(e => {
      counts[e.courseId] = (counts[e.courseId] || 0) + 0.75; // each block ~45 mins (0.75h)
    });
    return counts;
  }, [entries]);

  return (
    <div className="space-[#1f2937] space-y-6">
      {/* Active / Next Class Alert Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
        todayStatus.type === 'active'
          ? 'bg-amber-50 border-amber-300 text-amber-900'
          : todayStatus.type === 'upcoming'
          ? 'bg-blue-50 border-blue-300 text-blue-900'
          : 'bg-emerald-50 border-emerald-300 text-emerald-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            todayStatus.type === 'active'
              ? 'bg-amber-500 text-white animate-pulse'
              : todayStatus.type === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide uppercase">
                {todayStatus.type === 'active' ? 'EN CURSO AHORA' : todayStatus.type === 'upcoming' ? 'PRÓXIMA CLASE' : 'ESTADO DE HOY'}
              </span>
              {todayName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 border border-current font-semibold">
                  {todayName}
                </span>
              )}
            </div>
            <p className="text-sm font-medium mt-0.5">{todayStatus.message}</p>
          </div>
        </div>

        {todayStatus.course && (
          <button
            onClick={() => onCourseClick(todayStatus.course!)}
            className="self-end sm:self-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-current hover:shadow-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            Ver Detalle <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Control Bar: Search & Day Filters */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por materia, docente o grupo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Quick Task Add Button */}
          <button
            onClick={() => onAddTaskClick()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Nueva Tarea / Parcial
          </button>
        </div>

        {/* Day Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDayTab('Todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDayTab === 'Todos'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ver Semana Completa
          </button>
          {days.map(day => {
            const isToday = day === todayName;
            return (
              <button
                key={day}
                onClick={() => setSelectedDayTab(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedDayTab === day
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
                {isToday && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Hoy" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid or Single Day View */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[750px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3 w-28 text-center border-r border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Horario
                  </div>
                </th>
                {(selectedDayTab === 'Todos' ? days : [selectedDayTab]).map(day => (
                  <th
                    key={day}
                    className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${
                      day === todayName ? 'bg-blue-50/70 text-blue-900 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>{day}</span>
                      {day === todayName && (
                        <span className="px-1.5 py-0.5 text-[9px] bg-blue-600 text-white rounded-full uppercase font-bold">
                          Hoy
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeSlots.map(slot => (
                <tr key={slot.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-2 border-r border-gray-200 text-center font-mono font-medium text-gray-500 bg-gray-50/60 text-[11px] whitespace-nowrap">
                    {slot.label}
                  </td>
                  {(selectedDayTab === 'Todos' ? days : [selectedDayTab]).map(day => {
                    const course = getCourseForSlot(slot.id, day);
                    if (!course) {
                      return (
                        <td
                          key={day}
                          className="p-1 border-r border-gray-100 last:border-r-0 bg-white"
                        />
                      );
                    }

                    const passesFilter = isCourseFiltered(course);

                    return (
                      <td
                        key={day}
                        onClick={() => onCourseClick(course)}
                        className={`p-1.5 border-r border-gray-200 last:border-r-0 transition-all cursor-pointer ${
                          passesFilter ? 'opacity-100 scale-100' : 'opacity-25 grayscale'
                        }`}
                      >
                        <div
                          style={{
                            backgroundColor: course.color,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                          }}
                          className="p-2 rounded-lg border border-black/10 hover:shadow-md transition-all group flex flex-col justify-between h-full min-h-[46px]"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-gray-900 text-[11.5px] line-clamp-2 leading-tight">
                              {course.shortName}
                            </span>
                            <span className="text-[9.5px] px-1.5 py-0.5 bg-black/10 rounded font-bold text-gray-900 shrink-0">
                              {course.group}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center justify-between text-[10px] text-gray-800/80 font-medium">
                            <span className="truncate max-w-[120px]">{course.professor.split(' ')[0]} {course.professor.split(' ')[1] || ''}</span>
                            <span className="italic shrink-0">{course.classroom.includes('No disponible') ? 'Sin aula' : course.classroom}</span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courses Overview Cards & Tasks Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Course Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Asignaturas Inscritas ({courses.length})
            </h3>
            <span className="text-xs text-gray-500">
              Total créditos estimados: {courses.reduce((acc, c) => acc + (c.credits || 0), 0)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courses.map(course => {
              const courseTasks = tasks.filter(t => t.courseId === course.id);
              const pendingTasks = courseTasks.filter(t => !t.completed);

              return (
                <div
                  key={course.id}
                  onClick={() => onCourseClick(course)}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: course.color }}
                        />
                        <h4 className="font-bold text-gray-900 text-sm leading-snug">
                          {course.code}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-700 rounded">
                        Grupo {course.group}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate font-medium">{course.professor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="italic">{course.classroom}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      ~{(courseHours[course.id] || 0).toFixed(1)} hrs/semana
                    </span>
                    {pendingTasks.length > 0 ? (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold text-[11px] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {pendingTasks.length} pendiente(s)
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[11px]">Al día</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Tasks & Reminders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Pendientes & Parciales ({tasks.filter(t => !t.completed).length})
            </h3>
            <button
              onClick={() => onAddTaskClick()}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              + Agregar
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs space-y-1">
                <Sparkles className="w-6 h-6 mx-auto text-gray-300" />
                <p>No tienes entregas o exámenes pendientes.</p>
                <p className="text-[11px] text-gray-400">Agrega recordatorios vinculados a tus materias.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {tasks.map(task => {
                  const course = courses.find(c => c.id === task.courseId);
                  return (
                    <div
                      key={task.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${
                        task.completed
                          ? 'bg-gray-50 border-gray-200 opacity-60 line-through'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1 space-y-0.5">
                        <div className="font-semibold text-gray-900 leading-snug">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          {course && (
                            <span
                              className="font-medium px-1.5 py-0.2 rounded text-[10px]"
                              style={{ backgroundColor: course.color }}
                            >
                              {course.shortName}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
