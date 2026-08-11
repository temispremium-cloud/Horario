import React from 'react';
import { Course, ScheduleEntry, TimeSlot, StudentInfo, DayOfWeek } from '../types';

interface OfficialSheetViewProps {
  studentInfo: StudentInfo;
  courses: Course[];
  entries: ScheduleEntry[];
  timeSlots: TimeSlot[];
  days: DayOfWeek[];
  onCourseClick?: (course: Course) => void;
}

export const OfficialSheetView: React.FC<OfficialSheetViewProps> = ({
  studentInfo,
  courses,
  entries,
  timeSlots,
  days,
  onCourseClick
}) => {
  // Helper to find course for a specific time slot and day
  const getCourseForSlot = (slotId: string, day: DayOfWeek): Course | undefined => {
    const entry = entries.find(e => e.slotId === slotId && e.day === day);
    if (!entry) return undefined;
    return courses.find(c => c.id === entry.courseId);
  };

  return (
    <div className="sheet-container max-w-[1150px] mx-auto bg-white p-5 sm:p-8 shadow-xl border border-gray-200 rounded-lg my-4 text-black overflow-x-auto print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-[90px] text-center text-[8px] leading-tight select-none">
          <div className="w-[78px] h-[78px] rounded-full bg-[#b7191f] text-white flex items-center justify-center font-bold text-[22px] mx-auto mb-1 shadow-sm">
            50
          </div>
          <span className="font-semibold text-gray-800">UNIVERSIDAD<br />DE LA GUAJIRA</span>
        </div>

        <div className="text-center flex-1">
          <h1 className="text-[20px] sm:text-[22px] font-bold tracking-wide uppercase my-1 text-gray-900">
            {studentInfo.university}
          </h1>
          <div className="text-[12.5px] my-[1px] text-gray-800 font-medium">
            NIT: {studentInfo.nit}
          </div>
          <div className="text-[12.5px] my-[1px] text-gray-800 font-medium">
            Telefono:{studentInfo.phone}
          </div>
        </div>

        <div className="w-[150px] text-[11px] text-left shrink-0">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold whitespace-nowrap py-0.5 px-1">Pag:</td>
                <td className="py-0.5 px-1">{studentInfo.page}</td>
              </tr>
              <tr>
                <td className="font-bold whitespace-nowrap py-0.5 px-1">Impreso:</td>
                <td className="py-0.5 px-1">{studentInfo.printedDate}</td>
              </tr>
              <tr>
                <td></td>
                <td className="py-0.5 px-1">{studentInfo.printedTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr className="border-none border-t-2 border-[#1a1a1a] my-1.5" />
      <div className="text-center font-bold text-[15px] my-1 text-black">
        Horario Estudiante
      </div>
      <div className="text-center text-[12px] text-gray-700 -mt-2 mb-3.5 font-medium">
        {studentInfo.program}
      </div>
      <hr className="border-none border-t border-[#1a1a1a] mt-0.5 mb-2.5" />

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11.5px] min-w-[700px]">
          <thead>
            <tr>
              <th className="bg-[#e4e4e4] border border-[#999] py-1.5 px-1 text-[13px] font-bold text-black w-[90px]">
                Horario
              </th>
              {days.map(day => (
                <th key={day} className="bg-[#e4e4e4] border border-[#999] py-1.5 px-1 text-[13px] font-bold text-black">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot.id}>
                <td className="bg-[#dbeef2] font-bold whitespace-nowrap w-[90px] text-[11px] border border-[#999] text-center py-1 px-1 h-[40px]">
                  {slot.label}
                </td>
                {days.map(day => {
                  const course = getCourseForSlot(slot.id, day);
                  if (!course) {
                    return (
                      <td key={day} className="border border-[#999] text-center p-1 h-[40px]"></td>
                    );
                  }

                  return (
                    <td
                      key={day}
                      onClick={() => onCourseClick?.(course)}
                      style={{ backgroundColor: course.color }}
                      className="border border-[#999] text-center p-1 h-[40px] font-bold leading-snug text-[11.5px] cursor-pointer hover:brightness-95 transition-all select-none"
                      title={`Haz clic para ver detalles de ${course.code}`}
                    >
                      <div>
                        {course.shortName}
                        <br />
                        <span className="font-bold text-[10.5px] opacity-90">{course.group}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend / Materia Details */}
      <div className="mt-5.5 space-y-1">
        {courses.map(course => (
          <div
            key={course.id}
            onClick={() => onCourseClick?.(course)}
            className="grid grid-cols-[90px_1fr] gap-x-2 gap-y-0.5 py-2 border-b border-gray-300 text-[12.5px] last:border-b-0 hover:bg-gray-50/80 p-1.5 rounded cursor-pointer transition-colors"
          >
            <div className="font-bold text-gray-800">Materia</div>
            <div className="text-[#1a3a8f] font-bold flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 border border-[#999] shrink-0 rounded-xs"
                style={{ backgroundColor: course.color }}
              ></span>
              [{course.group}] {course.code}
            </div>

            <div className="font-bold text-gray-800">Docente</div>
            <div className="text-[#1a3a8f] font-bold">{course.professor}</div>

            <div className="font-bold text-gray-800">Aula</div>
            <div className="text-gray-600 italic">
              {course.classroom}
              {course.classroom.includes('No disponible') && (
                <span className="text-[11px] text-blue-600 ml-2 not-italic font-medium hover:underline">
                  (Editar aula)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 text-[11px] border-t border-[#999] pt-1.5 font-bold text-gray-800">
        <div>Formato replicado del horario oficial UniGuajira</div>
        <div>CL SMA LTD</div>
        <div>Pag: {studentInfo.page}</div>
      </div>
    </div>
  );
};
