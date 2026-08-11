import { useState, useEffect } from 'react';
import { Course, ScheduleEntry, TaskItem } from './types';
import {
  INITIAL_STUDENT_INFO,
  INITIAL_COURSES,
  INITIAL_ENTRIES,
  TIME_SLOTS,
  DAYS_OF_WEEK
} from './data/initialSchedule';
import { OfficialSheetView } from './components/OfficialSheetView';
import { InteractiveScheduleView } from './components/InteractiveScheduleView';
import { CourseDetailModal } from './components/CourseDetailModal';
import { TaskModal } from './components/TaskModal';
import { InstallPwaModal } from './components/InstallPwaModal';
import { HeaderNav } from './components/HeaderNav';
import { generateICS, downloadICSFile } from './utils/icsExporter';
import { Smartphone } from 'lucide-react';

const STORAGE_KEY_COURSES = 'uniguajira_courses_v1';
const STORAGE_KEY_TASKS = 'uniguajira_tasks_v1';

export default function App() {
  const [activeView, setActiveView] = useState<'official' | 'interactive'>('official');

  // Courses state
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  // Entries & Slots (fixed schedule from UniGuajira report)
  const [entries] = useState<ScheduleEntry[]>(INITIAL_ENTRIES);

  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'tsk-1',
          courseId: 'c-bd',
          title: 'Parcial 1: Modelado Relacional y Álgebra Relacional',
          dueDate: '2026-08-20',
          completed: false,
          type: 'Parcial'
        },
        {
          id: 'tsk-2',
          courseId: 'c-iso',
          title: 'Entrega de Diagramas de Casos de Uso y Clases UML',
          dueDate: '2026-08-25',
          completed: false,
          type: 'Tarea'
        }
      ];
    } catch {
      return [];
    }
  });

  // Modal states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskCourseId, setTaskCourseId] = useState<string | undefined>(undefined);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Error saving courses to localStorage', e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage', e);
    }
  }, [tasks]);

  // Handler to update a single course (e.g. classroom or notes)
  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    if (selectedCourse?.id === updatedCourse.id) {
      setSelectedCourse(updatedCourse);
    }
  };

  // Handlers for tasks
  const handleAddTask = (newTaskData: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...newTaskData,
      id: `tsk-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // ICS Export function
  const handleExportICS = () => {
    const icsContent = generateICS(courses, entries, TIME_SLOTS);
    downloadICSFile('Horario_UniGuajira_IngSistemas.ics', icsContent);
  };

  // Reset function
  const handleResetSchedule = () => {
    if (window.confirm('¿Deseas restablecer el horario y aulas a la versión oficial original?')) {
      setCourses(INITIAL_COURSES);
      localStorage.removeItem(STORAGE_KEY_COURSES);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex flex-col pb-16 md:pb-0">
      {/* Top Bar Header */}
      <HeaderNav
        activeView={activeView}
        onViewChange={setActiveView}
        onPrint={handlePrint}
        onExportICS={handleExportICS}
        onResetSchedule={handleResetSchedule}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-[1250px] w-full mx-auto p-3 sm:p-6">
        {activeView === 'official' ? (
          <div className="animate-in fade-in duration-300">
            {/* Context Notice banner */}
            <div className="no-print bg-white p-4 rounded-xl shadow-xs border border-gray-200 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>
                  <strong>Formato Oficial Replicado:</strong> Replicado fielmente del sistema de la Universidad de La Guajira. Puedes hacer clic en cualquier asignatura o docente para editar el aula o agregar tareas.
                </span>
              </div>
              <button
                onClick={() => setActiveView('interactive')}
                className="text-blue-600 font-semibold hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Cambiar a Tablero Interactivo &rarr;
              </button>
            </div>

            <OfficialSheetView
              studentInfo={INITIAL_STUDENT_INFO}
              courses={courses}
              entries={entries}
              timeSlots={TIME_SLOTS}
              days={DAYS_OF_WEEK}
              onCourseClick={setSelectedCourse}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <InteractiveScheduleView
              courses={courses}
              entries={entries}
              timeSlots={TIME_SLOTS}
              days={DAYS_OF_WEEK}
              tasks={tasks}
              onCourseClick={setSelectedCourse}
              onAddTaskClick={courseId => {
                setTaskCourseId(courseId);
                setIsTaskModalOpen(true);
              }}
              onToggleTask={handleToggleTask}
            />
          </div>
        )}
      </main>

      {/* Floating PWA Install Bar for Mobile Devices */}
      <div className="no-print fixed bottom-3 left-3 right-3 sm:hidden z-30">
        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="w-full py-2.5 px-4 bg-[#b7191f] text-white rounded-xl shadow-lg border border-red-900/30 font-bold text-xs flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 animate-bounce" />
            <span>Instalar Horario en tu Celular</span>
          </div>
          <span className="bg-white text-[#b7191f] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
            Instalar
          </span>
        </button>
      </div>

      {/* Course Details Modal */}
      <CourseDetailModal
        course={selectedCourse}
        entries={entries}
        timeSlots={TIME_SLOTS}
        tasks={tasks}
        onClose={() => setSelectedCourse(null)}
        onUpdateCourse={handleUpdateCourse}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Task Add Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        courses={courses}
        initialCourseId={taskCourseId}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleAddTask}
      />

      {/* PWA Install Modal */}
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
