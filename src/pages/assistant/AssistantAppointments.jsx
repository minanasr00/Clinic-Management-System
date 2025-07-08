import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import CustomCalendar from "./CustomCalendar";

const TIME_SLOTS = [
  "08:00 AM","08:30 AM","09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM",
  "08:00 PM","08:30 PM","09:00 PM","09:30 PM","10:00 PM","10:30 PM","11:00 PM","11:30 PM",
  "12:00 AM","12:30 AM","01:00 AM","01:30 AM","02:00 AM","02:30 AM","03:00 AM","03:30 AM",
  "04:00 AM","04:30 AM","05:00 AM","05:30 AM","06:00 AM","06:30 AM","07:00 AM","07:30 AM"
];

export default function AssistantAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);

  const patientAppointments = [
    { name: "Ali Kamal", date: "2025-07-04", time: "10:00 AM", source: "Patient", status: "Pending" },
    { name: "Sara Hamed", date: "2025-07-05", time: "02:00 PM", source: "Patient", status: "Confirmed" }
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments") || "[]");
    const assistantAppointments = stored.filter(a => a.source === "Assistant");
    const merged = [...assistantAppointments, ...patientAppointments].sort(
      (a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
    );
    setAppointments(assistantAppointments);
    setAllAppointments(merged);
  }, []);

  const refreshAllAppointments = (updatedAssistantAppointments) => {
    const merged = [...updatedAssistantAppointments, ...patientAppointments].sort(
      (a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
    );
    setAppointments(updatedAssistantAppointments);
    setAllAppointments(merged);
    localStorage.setItem("appointments", JSON.stringify(updatedAssistantAppointments));
  };

  const openFormForEdit = (globalIndex) => {
    const appt = allAppointments[globalIndex];
    if (appt.source === "Patient") return alert("Cannot delay a patient-booked appointment.");

    const localIndex = appointments.findIndex(
      a => a.date === appt.date && a.time === appt.time && a.name === appt.name
    );
    setPatientName(appt.name);
    setSelectedDate(appt.date);
    setSelectedTime(appt.time);
    setEditIndex(localIndex);
    setShowForm(true);
  };

  const addOrUpdateAppointment = () => {
    if (!patientName.trim() || !selectedDate || !selectedTime) {
      return alert("Please enter patient name, select a date and time.");
    }
    const newAppt = { name: patientName, date: selectedDate, time: selectedTime, source: "Assistant", status: "Confirmed" };
    let updated;
    if (editIndex !== null) {
      updated = [...appointments];
      updated[editIndex] = newAppt;
    } else {
      updated = [...appointments, newAppt];
    }
    setEditIndex(null);
    setShowForm(false);
    setPatientName("");
    setSelectedDate("");
    setSelectedTime("");
    refreshAllAppointments(updated);
  };

  const handleDelete = (globalIndex) => {
    const apptToDelete = allAppointments[globalIndex];

    if (apptToDelete.source === "Assistant") {
      const updated = appointments.filter(
        a => !(a.name === apptToDelete.name && a.date === apptToDelete.date && a.time === apptToDelete.time)
      );
      refreshAllAppointments(updated);
    } else {
      // delete from static list (for demo only - in real app use backend or localStorage)
      alert("This is a demo record booked by the patient and cannot be deleted in current setup.");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 pl-64 pr-4 mt-0 ">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Medicall</h1>
      </nav>
      <Sidebar />
      <div className="max-w-6xl mx-auto py-8 ">
        <div className="flex justify-between items-center  mb-6 ml-5">
          <h3 className="text-2xl font-semibold text-gray-800">Appointments
            <br></br>
            <span className="text-xs text-sky-700">Veiw and manage appointmemts details</span>
          </h3>
          
          
          <button onClick={() => { setShowForm(!showForm); setEditIndex(null); }} className="bg-sky-700
        text-white px-6 py-3 rounded-full hover:bg-sky-800">
            {showForm ? "Close Form" : "+ Make Appointment"}
          </button>
        </div>
        {showForm && (
          <div className="flex flex-col md:flex-row bg-white shadow rounded-xl overflow-hidden ml-5 mb-10">
            <div className="p-6 mt-25">
              <CustomCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
             
            </div>
            <div className="flex-1 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editIndex !== null ? "Edit Appointment" : "Make An Appointment"}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                <strong>Doctor:</strong> Dr. Masia Glura &nbsp;|&nbsp;
                <strong>Hospital:</strong> Barala Hospital
              </p>
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full mb-4 p-3 border rounded"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Appointment Time</h3>
              <div className="grid grid-cols-4 gap-4 max-h-80 overflow-y-auto">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`px-4 py-2 border rounded-full text-sm flex items-center justify-center space-x-2 hover:bg-gray-100 focus:outline-none ${
                      selectedTime === slot ? "bg-sky-700 text-white" : "bg-white text-gray-800"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l2 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                
                <button onClick={() => {
                  setSelectedDate("");
                  setSelectedTime("");
                  setPatientName("");
                  setEditIndex(null);
                }} className="px-6 py-3 border rounded-full text-sky-700 hover:bg-gray-100">
                  Clear
                </button>
                <button onClick={addOrUpdateAppointment} className="px-6 py-3 bg-sky-700 text-white rounded-full hover:bg-sky-800">
                  {editIndex !== null ? "Update" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white shadow rounded-xl overflow-x-auto ml-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allAppointments.map((appt, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">{appt.source === "Assistant" ? "Routine Check-up" : "Initial Consultation"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.date}, {appt.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${appt.status === "Confirmed" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appt.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button onClick={() => openFormForEdit(idx)} className="text-sky-700 hover:underline">Delay</button>
                  <span>|</span>
                  <button onClick={() => handleDelete(idx)} className="text-red-600 hover:underline">Cancel</button>
                </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}







