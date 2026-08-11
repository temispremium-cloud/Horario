import { Course, ScheduleEntry, TimeSlot, DayOfWeek } from '../types';

const DAY_MAP: Record<DayOfWeek, { index: number; rruleDay: string }> = {
  Lunes: { index: 1, rruleDay: 'MO' },
  Martes: { index: 2, rruleDay: 'TU' },
  Miercoles: { index: 3, rruleDay: 'WE' },
  Jueves: { index: 4, rruleDay: 'TH' },
  Viernes: { index: 5, rruleDay: 'FR' },
  Sabado: { index: 6, rruleDay: 'SA' },
};

export function generateICS(
  courses: Course[],
  entries: ScheduleEntry[],
  slots: TimeSlot[]
): string {
  let icsLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UniGuajira//Horario Estudiante//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Horario UniGuajira - Ingeniería de Sistemas',
    'X-WR-TIMEZONE:America/Bogota',
  ];

  // Group entries by course and day to form continuous blocks
  const slotMap = new Map<string, TimeSlot>(slots.map(s => [s.id, s]));
  const courseMap = new Map<string, Course>(courses.map(c => [c.id, c]));

  // Get next occurrence of each day from today
  const today = new Date();

  // For each course and day, find min start time and max end time
  const groupedBlocks: Array<{
    course: Course;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
  }> = [];

  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

  courses.forEach(course => {
    days.forEach(day => {
      const courseEntries = entries.filter(e => e.courseId === course.id && e.day === day);
      if (courseEntries.length === 0) return;

      // Find time slots for these entries
      const matchedSlots = courseEntries
        .map(e => slotMap.get(e.slotId))
        .filter((s): s is TimeSlot => s !== undefined)
        .sort((a, b) => a.start.localeCompare(b.start));

      if (matchedSlots.length > 0) {
        const firstSlot = matchedSlots[0];
        const lastSlot = matchedSlots[matchedSlots.length - 1];
        groupedBlocks.push({
          course,
          day,
          startTime: firstSlot.start,
          endTime: lastSlot.end,
        });
      }
    });
  });

  groupedBlocks.forEach(block => {
    const dayInfo = DAY_MAP[block.day];
    if (!dayInfo) return;

    // Calculate initial start date
    const targetDayIndex = dayInfo.index; // 1 = Mon, ..., 6 = Sat
    const currentDayIndex = today.getDay(); // 0 = Sun, 1 = Mon, ...
    
    let daysUntil = targetDayIndex - currentDayIndex;
    if (daysUntil < 0) daysUntil += 7;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() + daysUntil);

    const [startH, startM] = block.startTime.split(':').map(Number);
    const [endH, endM] = block.endTime.split(':').map(Number);

    startDate.setHours(startH, startM, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(endH, endM, 0, 0);

    const formatICSDatetime = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const mins = String(date.getMinutes()).padStart(2, '0');
      const secs = String(date.getSeconds()).padStart(2, '0');
      return `${year}${month}${day}T${hours}${mins}${secs}`;
    };

    const dtStart = formatICSDatetime(startDate);
    const dtEnd = formatICSDatetime(endDate);

    icsLines.push(
      'BEGIN:VEVENT',
      `SUMMARY:${block.course.code} [Grupo ${block.course.group}]`,
      `DESCRIPTION:Docente: ${block.course.professor}\\nAula: ${block.course.classroom}\\nPrograma: Ingeniería de Sistemas - UniGuajira`,
      `LOCATION:UniGuajira - ${block.course.classroom}`,
      `DTSTART;TZID=America/Bogota:${dtStart}`,
      `DTEND;TZID=America/Bogota:${dtEnd}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${dayInfo.rruleDay};UNTIL=${startDate.getFullYear()}1215T235959Z`,
      `STATUS:CONFIRMED`,
      'END:VEVENT'
    );
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}

export function downloadICSFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
