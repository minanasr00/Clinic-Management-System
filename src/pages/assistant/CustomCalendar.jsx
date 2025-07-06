import { useState } from "react";
import dayjs from "dayjs";

const daysShort = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function CustomCalendar({ selectedDate, setSelectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const startDay = currentMonth.startOf("month").day();
  const daysInMonth = currentMonth.daysInMonth();

  const generateCalendar = () => {
    const calendar = [];
    let dayCount = 1;

    for (let week = 0; week < 6; week++) {
      const row = [];
      for (let i = 1; i <= 7; i++) {
        const dayIndex = (i + 6) % 7; 
        const cellIndex = week * 7 + dayIndex;

        if (cellIndex < startDay - 1 || dayCount > daysInMonth) {
          row.push(null);
        } else {
          row.push(dayCount++);
        }
      }
      calendar.push(row);
    }

    return calendar;
  };

  const handleSelect = (day) => {
    const dateStr = currentMonth.date(day).format("YYYY-MM-DD");
    setSelectedDate(dateStr);
  };

  const calendar = generateCalendar();

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm ml-10 mt-15 pb-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-2xl font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
        >
          ❮
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button
          className="text-2xl font-bold text-gray-400 hover:text-gray-600"
          onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
        >
          ❯
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-y-2 text-center text-sm  text-blue-900 font-semibold mt-10">
        {daysShort.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm mt-2">
        {calendar.flat().map((day, index) => {
          const isSelected =
            day && selectedDate === currentMonth.date(day).format("YYYY-MM-DD");
          return (
            <button
              key={index}
              onClick={() => day && handleSelect(day)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition 
                ${
                  isSelected
                    ? "bg-blue-900 text-white font-bold"
                    : day
                    ? "text-gray-800 hover:bg-blue-100"
                    : "text-transparent"
                }`}
            >
              {day || ""}
            </button>
          );
        })}
      </div>

      {/* Bottom Buttons */}
      {/* <div className="flex justify-between mt-6">
        <button
          onClick={() => setSelectedDate("")}
          className="px-5 py-2 text-sm rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
        >
          Clear
        </button>
        <button
          onClick={() => alert("Selected: " + selectedDate)}
          className="px-5 py-2 text-sm rounded-lg bg-blue-900 text-white hover:bg-blue-800"
        >
          Select
        </button>
      </div> */}
    </div>
  );
}