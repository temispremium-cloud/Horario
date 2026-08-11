export type DayOfWeek = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado';

export interface TimeSlot {
  id: string;
  start: string; // "06:30"
  end: string;   // "07:14"
  label: string; // "06:30-07:14"
}

export interface Course {
  id: string;
  code: string;        // Full name, e.g. "BASES DE DATOS I"
  shortName: string;   // Short name for grid, e.g. "BASES DE DATOS I"
  group: string;       // e.g. "C2"
  professor: string;   // e.g. "GUSTAVO JAVIER REDONDO CUJIA"
  classroom: string;   // e.g. "No disponible en el reporte fuente" or "Aula 102"
  color: string;       // Background color hex
  textColor?: string;
  credits?: number;
  notes?: string;
}

export interface ScheduleEntry {
  slotId: string;
  day: DayOfWeek;
  courseId: string;
}

export interface TaskItem {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  type: 'Parcial' | 'Tarea' | 'Exposición' | 'Laboratorio' | 'Otro';
}

export interface StudentInfo {
  university: string;
  nit: string;
  phone: string;
  program: string;
  page: number;
  printedDate: string;
  printedTime: string;
  studentName?: string;
  studentId?: string;
}
