import React, { useEffect, useState, useContext } from "react";
import {
  addAppointmentToFirestore,
  getAllAppointmentsForTable,
  updateAppointmentInFirestore,
  deleteAppointmentFromFirestore,
} from "../../services/firebase/appointmentsServices";
import Sidebar from "../../components/Sidebar";
import CustomCalendar from "./CustomCalendar";
import { AuthContext } from "../../context/Authcontext";

const TIME_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM",
  "11:00 PM", "11:30 PM"
];

export default function AssistantAppointments() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientId, setPatientId] = useState("");
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("scheduled");
  const [reason, setReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [assistantId, setAssistantId] = useState(null);

  useEffect(() => {
    if (user) {
      setAssistantId(user.uid);
    }
  }, [user]);

  const fetchAppointments = async () => {
    const data = await getAllAppointmentsForTable();
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const resetForm = () => {
    setPatientId("");
    setSelectedDate("");
    setSelectedTime("");
    setEditId(null);
    setStatus("scheduled");
    setReason("");
    setPaymentAmount("");
    setPaymentMethod("cash");
    setShowPaymentModal(false);
  };

  const handleSubmit = async () => {
    if (!patientId || !selectedDate || !selectedTime || !assistantId) {
      return alert("Please fill all fields");
    }
    if (!paymentAmount || !paymentMethod) {
      return alert("Please enter payment details using the Payment button");
    }

    const appointment = {
      assistant: assistantId,
      doctor_id: "IP5k3oM6YRUs0yCzmTIBQMAg0Um1",
      patient_id: patientId,
      payment_amount: Number(paymentAmount),
      payment_method: paymentMethod,
      payment_status: "pending",
      reason_for_visit: reason,
      start_time: new Date(`${selectedDate} ${selectedTime}`),
      status,
      booked_by: "assistant",
    };

    if (editId) {
      await updateAppointmentInFirestore(editId, appointment);
      setSuccessMessage("Appointment updated successfully!");
    } else {
      await addAppointmentToFirestore(appointment);
      setSuccessMessage("Appointment booked successfully!");
    }

    fetchAppointments();
    resetForm();
    setShowForm(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const toTimeSlotFormat = (dateObj) => {
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const normalizedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${normalizedHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  const handleEdit = (appt) => {
    setEditId(appt.id);
    setPatientId(appt.patient_id);
    const dateObj = new Date(appt.start_time.seconds * 1000);
    setSelectedDate(dateObj.toISOString().split("T")[0]);
    setSelectedTime(toTimeSlotFormat(dateObj));
    setStatus(appt.status);
    setReason(appt.reason_for_visit || "");
    setPaymentAmount(appt.payment_amount || "");
    setPaymentMethod(appt.payment_method || "cash");
    setShowForm(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    await deleteAppointmentFromFirestore(deleteId);
    fetchAppointments();
    setShowDeleteModal(false);
  };

  const getFormattedTime = (slot) => {
    const [hourStr, modifier] = slot.split(" ");
    let [hours, minutes] = hourStr.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const bookedTimes = appointments
    .filter((a) => {
      const apptDate = new Date(a.start_time.seconds * 1000);
      return apptDate.toISOString().split("T")[0] === selectedDate;
    })
    .map((a) => {
      const date = new Date(a.start_time.seconds * 1000);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    });


  return (
    <div className="min-h-screen bg-white pt-16 pl-64 pr-4 mt-0">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Medicall</h1>
      </nav>
      <Sidebar />
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6 ml-5">
          <h3 className="text-2xl font-semibold text-gray-800">
            Appointments Table
            <br />
            <span className="text-sm text-sky-700">View and manage appointments</span>
          </h3>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
            }}
            className="bg-sky-700 text-white px-6 py-3 rounded-full hover:bg-sky-800"
          >
            {showForm ? "Close Form" : "+ Make Appointment"}
          </button>
        </div>

        {successMessage && (
          <div className="ml-5 mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 shadow-sm max-w-lg">
            {successMessage}
          </div>
        )}

        {showForm && (
          <div className="flex flex-col md:flex-row bg-white shadow rounded-xl overflow-hidden ml-5 mb-10">
            <div className="p-6">
              <CustomCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                <label className="block mt-4 mb-1 font-semibold">Status</label>
              <select
                className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="scheduled">Scheduled</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="delayed">Delayed</option>
              </select>
              <button
  onClick={() => setShowPaymentModal(true)}
  className="mt-4 ml-40 rounded-full px-8 py-4 text-xl bg-sky-700 text-white hover:bg-sky-800"
>
  Payment
</button>

{showPaymentModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
      {/* Close button */}
      <button
        onClick={() => setShowPaymentModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
      >
        ×
      </button>

      <h2 className="text-lg font-semibold mb-4 text-center text-sky-700">Payment Details</h2>

      <label className="block font-semibold mb-2">Select Payment Method</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
      >
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="insurance">Insurance</option>
      </select>

      <label className="block font-semibold mb-2">Amount</label>
      <input
        type="number"
        value={paymentAmount}
        onChange={(e) => setPaymentAmount(e.target.value)}
        placeholder="Enter amount"
        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
      />

      <button
        onClick={() => setShowPaymentModal(false)}
        className="w-fit  py-2 px-4 bg-sky-700 text-white rounded-full hover:bg-sky-800"
      >
        Done
      </button>
    </div>
  </div>
)}

            </div>

            <div className="flex-1 p-6">
              <p className="text-sm text-gray-600 mb-6">
                <strong>Doctor:</strong> Dr. Masia Glura &nbsp;|&nbsp;
                <strong>Hospital:</strong> Barala Hospital
              </p>
              <label className="block mb-2 font-semibold">Patient Name</label>
              <input
                type="text"
                placeholder="Enter Patient Full Name"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              />

              <label className="block mb-2 font-semibold">Appointment Time</label>
              <div className="grid grid-cols-4 gap-2 max-h-64 mb-30">
      {TIME_SLOTS.map((slot) => {
        const formatted = getFormattedTime(slot);
        const isBooked = bookedTimes.includes(formatted);
        return (
          <button
            key={slot}
            disabled={isBooked}
            onClick={() => setSelectedTime(slot)}
            className={`px-3 py-2 rounded-full text-sm border ${
              selectedTime === slot
                ? "bg-sky-700 text-white"
                : "bg-white text-gray-700"
            } ${isBooked ? "opacity-40 cursor-not-allowed " : ""}`}
          >
            {slot}
          </button>
        );
      })}
    </div>

            
              <div className="mt-6 flex justify-between">
                <button onClick={resetForm} className="px-6 py-3 border rounded-full text-sky-700 hover:bg-gray-100">
                  Clear
                </button>
                <button onClick={handleSubmit} className="px-6 py-3 bg-sky-700 text-white rounded-full hover:bg-sky-800">
                  {editId ? "Update" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-xl overflow-x-auto ml-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked By</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
  </tr>
</thead>
<tbody>
  {appointments.map((appt) => {
    const dateObj = new Date(appt.start_time.seconds * 1000);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <tr key={appt.id}>
        <td className="px-6 py-4 text-sm">{appt.patient_id}</td>
        <td className="px-6 py-4 text-sm  text-sky-600">{formattedDate}</td>
        <td className="px-6 py-4 text-sm text-sky-600">{formattedTime}</td>
        <td className="px-6 py-4 text-sm">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold
            ${appt.status === "completed" ? "bg-green-100 text-green-800"
              : appt.status === "scheduled" ? "bg-blue-100 text-blue-800"
              : appt.status === "cancelled" ? "bg-red-100 text-red-800"
              : appt.status === "delayed" ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"}`}>
            {appt.status}
          </span>
        </td>
        <td className="px-6 py-4 text-sm capitalize">
          {appt.booked_by === "assistant" ? "Assistant" : "Patient"}
        </td>
        <td className="px-6 py-4 text-sm space-x-2">
          <button onClick={() => handleEdit(appt)} className="text-blue-600 hover:underline">Edit</button>
          <button onClick={() => confirmDelete(appt.id)} className="text-red-600 hover:underline">Delete</button>

        </td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>
        {showDeleteModal && (
  <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4 text-red-600">Delete Appointment</h2>
      <p className="mb-6 text-gray-700">Are you sure you want to delete this appointment?</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}









