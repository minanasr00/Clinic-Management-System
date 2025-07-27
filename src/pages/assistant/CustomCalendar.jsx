import { useState } from "react";
import dayjs from "dayjs";

const daysShort = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function CustomCalendar({ selectedDate, setSelectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const today = dayjs();

  const generateCalendar = () => {
    const calendar = [];
    const startWeek = startOfMonth.startOf("week");
    const endWeek = endOfMonth.endOf("week");
    let current = startWeek;

    while (current.isBefore(endWeek, "day")) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(current);
        current = current.add(1, "day");
      }
      calendar.push(week);
    }

    return calendar;
  };

  const handleSelect = (day) => {
    if (day.isSame(currentMonth, "month")) {
      const dateStr = day.format("YYYY-MM-DD");
      setSelectedDate(dateStr);
    }
  };

  const calendar = generateCalendar();
  const minSelectableDate = today.date(28).startOf("day"); // ⛔ الأيام قبل 28 غير مسموح بها

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full h-fit flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-xl font-bold text-gray-500 hover:text-sky-700 transition"
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
        >
          ❮
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button
          className="text-xl font-bold text-gray-500 hover:text-sky-700 transition"
          onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
        >
          ❯
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-600 mb-2">
        {daysShort.map((day) => (
          <div key={day} className="flex items-center justify-center h-10 w-10">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm flex-grow">
        {calendar.flat().map((day, index) => {
          const isToday = day.isSame(today, "day");
          const isInMonth = day.isSame(currentMonth, "month");
          const isSelected = selectedDate === day.format("YYYY-MM-DD");

          const isDisabled =
            !isInMonth || day.isBefore(minSelectableDate, "day");

          return (
            <button
              key={index}
              onClick={() => handleSelect(day)}
              disabled={isDisabled}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition font-medium 
                ${
                  isSelected
                    ? "bg-sky-700 text-white"
                    : isToday
                    ? "bg-blue-100 text-sky-800"
                    : "text-gray-800"
                }
                ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-blue-100"}
              `}
            >
              {day.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
}


