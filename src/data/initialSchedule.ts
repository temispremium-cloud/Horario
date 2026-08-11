import { Course, TimeSlot, ScheduleEntry, StudentInfo, DayOfWeek } from '../types';

export const INITIAL_STUDENT_INFO: StudentInfo = {
  university: 'UNIVERSIDAD DE LA GUAJIRA',
  nit: '892115029-4',
  phone: '(5) 728 2729',
  program: 'Programa de Ingeniería de Sistemas',
  page: 1,
  printedDate: '11/08/2026',
  printedTime: '10:35 AM',
  studentName: 'Estudiante Ingeniería de Sistemas',
  studentId: '2026-IS-001'
};

export const DAYS_OF_WEEK: DayOfWeek[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

export const TIME_SLOTS: TimeSlot[] = [
  { id: 't1', start: '06:30', end: '07:14', label: '06:30-07:14' },
  { id: 't2', start: '07:15', end: '07:59', label: '07:15-07:59' },
  { id: 't3', start: '08:00', end: '08:44', label: '08:00-08:44' },
  { id: 't4', start: '08:45', end: '09:29', label: '08:45-09:29' },
  { id: 't5', start: '09:30', end: '10:14', label: '09:30-10:14' },
  { id: 't6', start: '10:15', end: '10:59', label: '10:15-10:59' },
  { id: 't7', start: '11:00', end: '11:44', label: '11:00-11:44' },
  { id: 't8', start: '11:45', end: '12:29', label: '11:45-12:29' },
  { id: 't9', start: '12:30', end: '13:14', label: '12:30-13:14' },
  { id: 't10', start: '13:30', end: '14:14', label: '13:30-14:14' },
  { id: 't11', start: '14:15', end: '14:59', label: '14:15-14:59' },
  { id: 't12', start: '15:00', end: '15:44', label: '15:00-15:44' },
  { id: 't13', start: '15:45', end: '16:29', label: '15:45-16:29' },
  { id: 't14', start: '16:30', end: '17:14', label: '16:30-17:14' },
  { id: 't15', start: '17:15', end: '17:59', label: '17:15-17:59' },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-bd',
    code: 'BASES DE DATOS I',
    shortName: 'BASES DE DATOS I',
    group: 'C2',
    professor: 'GUSTAVO JAVIER REDONDO CUJIA',
    classroom: 'No disponible en el reporte fuente',
    color: '#ffe08a',
    credits: 3,
    notes: 'Modelado ER, Relacional, SQL Avanzado y Normalización.'
  },
  {
    id: 'c-iso',
    code: 'INGENIERIA DE SOFTWARE I',
    shortName: 'INGENIERIA DE SOFTWARE I',
    group: 'C1',
    professor: 'GONZALO BELTRAN ALVARADO',
    classroom: 'No disponible en el reporte fuente',
    color: '#a9c9e0',
    credits: 4,
    notes: 'Ciclo de vida del software, UML, Metodologías Ágiles (Scrum).'
  },
  {
    id: 'c-mi',
    code: 'METODOLOGIA DE LA INVESTIGACION',
    shortName: 'METODOLOGIA DE LA INVESTIGACION',
    group: 'C1',
    professor: 'SANDY ROMERO CUELLO',
    classroom: 'No disponible en el reporte fuente',
    color: '#d6c9ea',
    credits: 3,
    notes: 'Formulación de proyectos de investigación en sistemas.'
  },
  {
    id: 'c-so',
    code: 'SISTEMAS OPERATIVO',
    shortName: 'SISTEMAS OPERATIVO',
    group: 'C1',
    professor: 'ALEXANDER DAVID MERCADO MENDOZA',
    classroom: 'No disponible en el reporte fuente',
    color: '#a7c9c0',
    credits: 3,
    notes: 'Gestión de procesos, memoria, hilos y sistemas de archivos.'
  },
  {
    id: 'c-io',
    code: 'INVESTIGACION DE OPERACIONES',
    shortName: 'INVESTIGACION DE OPERACIONES',
    group: 'C1',
    professor: 'NICOLAS DE JESUS SANCHEZ VASQUEZ',
    classroom: 'No disponible en el reporte fuente',
    color: '#f3a6a6',
    credits: 3,
    notes: 'Programación lineal, método Simplex y teoría de colas.'
  },
  {
    id: 'c-mn',
    code: 'METODOS NUMERICO',
    shortName: 'METODOS NUMERICO',
    group: 'D2',
    professor: 'YISSET ANDREA PIMIENTA ZAPATA',
    classroom: 'No disponible en el reporte fuente',
    color: '#c3ecb0',
    credits: 3,
    notes: 'Solución de ecuaciones, interpolación e integración numérica.'
  },
  {
    id: 'c-re',
    code: 'REDES I',
    shortName: 'REDES I',
    group: 'D2',
    professor: 'FABIO ORLANDO MOYA CAMACHO',
    classroom: 'No disponible en el reporte fuente',
    color: '#dcb98a',
    credits: 4,
    notes: 'Modelo OSI, TCP/IP, Direccionamiento IPv4/IPv6 y Subnetting.'
  }
];

export const INITIAL_ENTRIES: ScheduleEntry[] = [
  // Bases de Datos I (Lunes y Miércoles 06:30 - 07:59)
  { slotId: 't1', day: 'Lunes', courseId: 'c-bd' },
  { slotId: 't2', day: 'Lunes', courseId: 'c-bd' },
  { slotId: 't1', day: 'Miercoles', courseId: 'c-bd' },
  { slotId: 't2', day: 'Miercoles', courseId: 'c-bd' },

  // Ingeniería de Software I (Martes 08:45 - 11:44)
  { slotId: 't4', day: 'Martes', courseId: 'c-iso' },
  { slotId: 't5', day: 'Martes', courseId: 'c-iso' },
  { slotId: 't6', day: 'Martes', courseId: 'c-iso' },
  { slotId: 't7', day: 'Martes', courseId: 'c-iso' },

  // Metodología de la Investigación (Miércoles 10:15 - 12:29)
  { slotId: 't6', day: 'Miercoles', courseId: 'c-mi' },
  { slotId: 't7', day: 'Miercoles', courseId: 'c-mi' },
  { slotId: 't8', day: 'Miercoles', courseId: 'c-mi' },

  // Sistemas Operativo (Martes 12:30 - 14:59)
  { slotId: 't9', day: 'Martes', courseId: 'c-so' },
  { slotId: 't10', day: 'Martes', courseId: 'c-so' },
  { slotId: 't11', day: 'Martes', courseId: 'c-so' },

  // Investigación de Operaciones (Jueves 12:30 - 14:59)
  { slotId: 't9', day: 'Jueves', courseId: 'c-io' },
  { slotId: 't10', day: 'Jueves', courseId: 'c-io' },
  { slotId: 't11', day: 'Jueves', courseId: 'c-io' },

  // Métodos Numérico (Lunes 15:00 - 17:14)
  { slotId: 't12', day: 'Lunes', courseId: 'c-mn' },
  { slotId: 't13', day: 'Lunes', courseId: 'c-mn' },
  { slotId: 't14', day: 'Lunes', courseId: 'c-mn' },

  // Redes I (Jueves 15:00 - 17:59)
  { slotId: 't12', day: 'Jueves', courseId: 'c-re' },
  { slotId: 't13', day: 'Jueves', courseId: 'c-re' },
  { slotId: 't14', day: 'Jueves', courseId: 'c-re' },
  { slotId: 't15', day: 'Jueves', courseId: 'c-re' },
];
