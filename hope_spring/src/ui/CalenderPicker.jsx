import React, { useMemo, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";

/**
 * CalendarPicker
 * Props:
 * - availability: { 'YYYY-MM-DD': ['09:00', '11:30', ...], ... }
 * - value: { date: Date|null, time: string|null }
 * - onChange: (next) => void   // next = { date, time }
 */
const CalendarPicker = ({ availability = {}, value = {}, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const selectedDate = value?.date || null;
  const selectedTime = value?.time || null;

  const monthMatrix = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let day = startDate;
    while (day <= endDate) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push(day);
        day = addDays(day, 1);
      }
      rows.push(days);
    }
    return rows;
  }, [currentMonth]);

  const dayKey = (d) => format(d, "yyyy-MM-dd");
  const slotsForSelected = selectedDate ? availability[dayKey(selectedDate)] || [] : [];

  const handlePickDate = (d) => {
    // Only allow pick if date has at least one slot
    const usable = availability[dayKey(d)] && availability[dayKey(d)].length > 0;
    if (!usable) return;
    onChange({ date: d, time: null });
  };

  const handlePickTime = (t) => onChange({ date: selectedDate, time: t });

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg p-6">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          className="px-3 py-1 rounded-full bg-[#f1effc] text-[#7c6cf2] hover:bg-[#e9e5fb] transition"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          ←
        </button>
        <div className="text-lg font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          type="button"
          className="px-3 py-1 rounded-full bg-[#f1effc] text-[#7c6cf2] hover:bg-[#e9e5fb] transition"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          →
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthMatrix.map((week, i) => (
          <React.Fragment key={i}>
            {week.map((day) => {
              const key = dayKey(day);
              const hasSlots = availability[key] && availability[key].length > 0;
              const isCurMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePickDate(day)}
                  className={[
                    "h-12 rounded-xl border text-sm transition flex items-center justify-center",
                    isCurMonth ? "bg-white" : "bg-gray-50 text-gray-400",
                    hasSlots
                      ? "border-[#cfe4e1] hover:shadow"
                      : "border-gray-200 opacity-50 cursor-not-allowed",
                    isSelected ? "ring-2 ring-[#67c6c6]" : "",
                  ].join(" ")}
                >
                  <span className={hasSlots ? "text-gray-700" : "text-gray-400"}>
                    {format(day, "d")}
                  </span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Time slots */}
      <div className="mt-6">
        <div className="text-sm text-gray-600 mb-2">
          {selectedDate
            ? `Available slots for ${format(selectedDate, "MMM d, yyyy")}`
            : "Select a date to see available time slots"}
        </div>

        <div className="flex flex-wrap gap-3">
          {selectedDate && slotsForSelected.length === 0 && (
            <div className="text-gray-400 text-sm">No slots available.</div>
          )}

          {slotsForSelected.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => handlePickTime(t)}
              className={[
                "px-4 py-2 rounded-full border transition",
                t === selectedTime
                  ? "bg-[#67c6c6] text-white border-[#67c6c6]"
                  : "bg-white border-[#cfe4e1] text-gray-700 hover:bg-[#f4fbfa]",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;
