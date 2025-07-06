import { useState, useEffect } from "react";
import CustomCalendar from "./CustomCalendar.jsx";

const TIMES = {
  Morning: ["09:00 am", "10:00 am", "11:00 am", "12:00 am"],
  Afternoon: ["01:00 pm", "02:00 pm", "03:00 pm", "04:00 pm"],
  Evening: ["05:00 pm", "06:00 pm", "07:00 pm", "08:00 pm"],
};

export default function AssistantAppointments() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const patientAppointments = [
    {
      name: "Merna Nabil",
      date: "2025-07-04",
      time: "10:00 am",
      source: "Patient",
      status: "Pending",
    },
    {
      name: "Walaa Ahmed",
      date: "2025-07-05",
      time: "02:00 pm",
      source: "Patient",
      status: "Confirmed",
    },
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments") || "[]");
    setAppointments(stored.filter(Boolean));
  }, []);

  const handleDelete = (indexToRemove) => {
    const updated = allAppointments.filter((_, i) => i !== indexToRemove);
    localStorage.setItem(
      "appointments",
      JSON.stringify(updated.filter((a) => a.source === "Assistant"))
    );
    setAppointments(updated.filter((a) => a.source === "Assistant"));
  };

  const handleEdit = (index) => {
    const appt = appointments[index];
    if (!appt) return;
    setSelectedDate(appt.date);
    setSelectedTime(appt.time);
    setPatientName(appt.name);
    setEditIndex(index);
    setShowForm(true);
  };

  const addAppointment = () => {
    if (!selectedDate || !selectedTime || !patientName) {
      return alert("Please fill all fields (date, time, and patient name)");
    }

    const cleanedAppointments = appointments.filter(Boolean);

    const exists = cleanedAppointments.find(
      (appt, idx) =>
        appt?.date === selectedDate &&
        appt?.time === selectedTime &&
        (editIndex === null || idx !== editIndex)
    );

    if (exists) {
      return alert("This time slot is already booked!");
    }

    const newAppt = {
      date: selectedDate,
      time: selectedTime,
      name: patientName,
      source: "Assistant",
      status: "Confirmed",
    };

    let updated;
    if (editIndex !== null) {
      updated = [...cleanedAppointments];
      updated[editIndex] = newAppt;
    } else {
      updated = [...cleanedAppointments, newAppt];
    }

    localStorage.setItem("appointments", JSON.stringify(updated));
    setAppointments(updated);
    setSelectedDate("");
    setSelectedTime("");
    setPatientName("");
    setEditIndex(null);
    setShowForm(false);
  };

  const filteredAppointments = filterDate
    ? appointments.filter((a) => a.date === filterDate)
    : appointments;

  const allAppointments = [...filteredAppointments, ...patientAppointments].sort((a, b) => {
    if (!a?.date || !a?.time || !b?.date || !b?.time) return 0;
    return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
  });

  const getBadgeColor = (type) => {
    switch (type) {
      case "Past":
        return "bg-gray-200 text-gray-600";
      case "Soon":
        return "bg-red-100 text-red-600";
      case "Upcoming":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getTimeBadge = (date, time) => {
    const now = new Date();
    const appointmentDate = new Date(`${date} ${time}`);
    const diff = appointmentDate - now;

    if (diff < 0) return "Past";
    if (diff < 3600000) return "Soon";
    return "Upcoming";
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] py-12 px-4">
      <div className="max-w-6xl mx-auto">
       

        {/* Calendar + Form (conditionally rendered) */}
        {showForm && (
          <div className="flex flex-col md:flex-row gap-8 bg-white shadow p-6 rounded-xl mb-10 transition-all">
            <div className="md:w-1/2">
              <CustomCalendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-2 text-blue-900">Make An Appointment</h2>
              <p className="text-sm text-gray-600 mb-6">
                <strong>Doctor:</strong> Dr. Masia Glura &nbsp; | &nbsp;
                <strong>Hospital:</strong> Barala Hospital
              </p>

              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full mb-4 p-3 border rounded-lg"
              />

              <h3 className="text-lg font-semibold mb-2 text-blue-800">Choose Time</h3>
              {Object.entries(TIMES).map(([period, times]) => (
                <div key={period} className="mb-4">
                  <p className="text-gray-700 font-medium">{period}</p>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {times.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`px-4 py-2 rounded-full text-sm  ${
                          selectedTime === t
                            ? "bg-blue-900 text-white"
                            : "bg-white border border-gray-300 hover:bg-blue-100"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={addAppointment}
                className="w-fit py-4 px-6 bg-blue-900 text-white ml-80 rounded font-semibold mt-4 hover:bg-blue-950"
              >
                {editIndex !== null ? "Update Appointment" : "Confirm Appointment"}
              </button>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-3xl font-bold text-blue-800">Booked Appointments</h3>
          
           {/* Header */}
        <div className="flex mb-6">
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-900 text-white px-6 py-4 rounded hover:bg-blue-950 cursor-pointer"
          >
            {showForm ? "Close Form" : "Add Appointment"}
          </button>
        </div>
        
        </div>
          <div className=" w-fit mb-5 flex items-center gap-3 bg-white p-3 rounded-lg shadow border border-gray-200">
            <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="text-sm text-red-600 hover:text-red-800 transition"
              >
                Clear
              </button>
            )}
            
          </div>
        {/* Appointments Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAppointments.map((appt, index) => (
            <div key={index} className="bg-white shadow rounded-xl p-5 relative">
              <div className="absolute top-2 right-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Booked By: {appt.source}
                </span>
              </div>

              <div className="mt-10 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Date: {appt.date}</span>
                  <span>Time: {appt.time}</span>
                  <span
                    className={`${getBadgeColor(getTimeBadge(appt.date, appt.time))} px-2 py-0.5 text-xs rounded-full`}
                  >
                    {getTimeBadge(appt.date, appt.time)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Name: {appt.name}</span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




