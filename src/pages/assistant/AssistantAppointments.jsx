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
import { fetchAllPatients } from "../../services/firebase/AssistantpatientsServices";

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
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [assistantId, setAssistantId] = useState(null);
  const [patientName, setPatientName] = useState(""); // جديد
  const [patients, setPatients] = useState([]); // بدلًا من استخدام patientName لهذا الغرض
  const [visitType, setVisitType] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState("");
  const [viewedAppointment, setViewedAppointment] = useState(null);
  const [birthDate, setBirthDate] = useState("");


  useEffect(() => {
    if (user) {
      setAssistantId(user.uid);
    }
  }, [user]);

  

 useEffect(() => {
  const getPatients = async () => {
    const data = await fetchAllPatients();
    setPatients(data); 
  };
  getPatients();
}, []);

useEffect(() => {
  fetchAppointments();
}, []);

const fetchAppointments = async () => {
  const data = await getAllAppointmentsForTable();
  const sorted = data.sort((a, b) => {
    const dateA = new Date(a.start_time.seconds * 1000);
    const dateB = new Date(b.start_time.seconds * 1000);
    return dateA - dateB; 
  });
  setAppointments(sorted);
};
const handleView = (appt) => {
  setViewedAppointment(appt);
};
const isExistingPatientSelected = !!patientId;

  const resetForm = () => {
    setPatientName("");
    setPatients([]);
    setPatientId("");
    setSelectedDate("");
    setSelectedTime("");
    setEditId(null);
    setStatus("");
    setPaymentAmount("");
    setPaymentMethod("");
    setPaymentStatus("");
    setVisitType("");
    setGender("");
    setPhone("");
    setBirthDate("");
    
  };

//   const handleSubmit = async () => {
//   if (!selectedDate || !selectedTime || (!patientName && !patientId)) {
//     setFormError("Please fill all required fields: date, time, and either select or enter a patient name.");
//     return;
//   }

//   if (!paymentAmount || !paymentMethod) {
//     setFormError("Please enter payment details using the Payment section.");
//     return;
//   }


//   const appointment = {
//   assistant: assistantId,
//   doctor_id: "IP5k3oM6YRUs0yCzmTIBQMAg0Um1",
//   patient_id: patientId || "custom-" + Date.now(),
//   patient_name: patientName,
//   patient_phone: phone,
//   patient_age: birthDate ? new Date().getFullYear() - new Date(birthDate).getFullYear() : "",
//   patient_gender: gender,
//   payment_amount: Number(paymentAmount),
//   payment_method: paymentMethod,
//   payment_status: paymentStatus,
//   start_time: new Date(`${selectedDate} ${selectedTime}`),
//   status: status,
//   booked_by: "assistant",
//   visit_type: visitType, 
// };



//     if (editId) {
//       await updateAppointmentInFirestore(editId, appointment);
//       setSuccessMessage("Appointment updated successfully!");
//     } else {
//       await addAppointmentToFirestore(appointment);
//       setSuccessMessage("Appointment booked successfully!");
//     }

//     fetchAppointments();
//     resetForm();
//     setShowForm(false);
//     setTimeout(() => setSuccessMessage(""), 3000);
//   };
const handleSubmit = async () => {
  // Reset previous error
  setFormError("");

  // Validation checks
  if (!selectedDate || !selectedTime) {
    setFormError("Please select a date and time.");
    return;
  }

  if (!patientId && !patientName) {
    setFormError("Please select an existing patient or enter a new patient name.");
    return;
  }

  if (!visitType) {
    setFormError("Please choose a visit type.");
    return;
  }

  if (!status) {
    setFormError("Please choose an appointment status.");
    return;
  }

  if (!paymentMethod || !paymentAmount || !paymentStatus) {
    setFormError("Please complete all payment information.");
    return;
  }

  if (!patientId) {
    // Validation for new patient details
    if (!phone || !birthDate || !gender) {
      setFormError("Please enter phone, birth date, and gender for the new patient.");
      return;
    }

    // Validate phone format (digits only, 8-15 length)
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(phone)) {
      setFormError("Please enter a valid phone number (8–15 digits).");
      return;
    }
  }

  // All good – prepare appointment object
  const appointment = {
    assistant: assistantId,
    doctor_id: "IP5k3oM6YRUs0yCzmTIBQMAg0Um1",
    patient_id: patientId || "custom-" + Date.now(),
    patient_name: patientName,
    patient_phone: phone,
    patient_age: birthDate
      ? new Date().getFullYear() - new Date(birthDate).getFullYear()
      : "",
    patient_gender: gender,
    payment_amount: Number(paymentAmount),
    payment_method: paymentMethod,
    payment_status: paymentStatus,
    start_time: new Date(`${selectedDate} ${selectedTime}`),
    status: status,
    booked_by: "assistant",
    visit_type: visitType,
  };

  try {
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
  } catch (error) {
    console.error("Error saving appointment:", error);
    setFormError("Something went wrong. Please try again.");
  }
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
    setPatientName(appt.patient_name || "");
    setBirthDate(appt.patient_age ? new Date(Date.now() - appt.patient_age * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : "");
    setGender(appt.patient_gender || "");
    setPhone(appt.patient_phone || "");
    setVisitType(appt.visit_type || "");
    setPaymentAmount(appt.payment_amount || "");
    setPaymentMethod(appt.payment_method || "");
    setPaymentStatus(appt.payment_status || "");
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
        {formError && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center">
      <p className="text-lg font-semibold text-gray-700">{formError}</p>
      <button
        onClick={() => setFormError("")}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Close
      </button>
    </div>
  </div>
)}

        {showForm && (
          <div className="flex flex-col md:flex-row bg-white shadow rounded-xl overflow-hidden ml-5 mb-10">
            <div className="p-6">
              <label className="block mb-2 font-semibold ">Select Date</label>
              <CustomCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
             <label className="block mb-2 font-semibold mt-5">Select Time</label>
              <div className="grid grid-cols-4 gap-2 max-h-64 mb-20">
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
              



            </div>

            <div className="flex-1 p-6">
              <p className="text-sm text-gray-600 mb-6">
                <strong>Doctor:</strong> Mohamad Mahmoud &nbsp;|&nbsp;
                <strong>Hospital:</strong> Arak Dental Clinic
              </p>
              <label className="block mb-2 font-semibold">Select Patient</label>
<select
  onChange={(e) => {
    const selectedId = e.target.value;
    setPatientId(selectedId);
    const selectedPatient = patients.find((p) => p.id === selectedId);
    if (selectedPatient) {
      setPatientName(
        selectedPatient.fullName || selectedPatient.name 
      );
    }
    setPhone(selectedPatient.phone || "");
    setBirthDate(selectedPatient.dob || "");
    setGender(selectedPatient.gender || "");
  }}
  className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
>
  <option value="">-- Choose a patient --</option>
  {patients.map((patient) => (
    <option key={patient.id} value={patient.id}>
      {patient.fullName || patient.name || patient.email} - {patient.id}
    </option>
  ))}
</select>
<label className="block mb-2 font-semibold">Or Add New Patient</label>
<input
  type="text"
  placeholder="Enter Patient Full Name"
  value={patientName}
  onChange={(e) => setPatientName(e.target.value)}
  disabled={isExistingPatientSelected}
  className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700 disabled:bg-gray-100"
/>

<input
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Enter patient's phone"
  disabled={isExistingPatientSelected}
  className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700 disabled:bg-gray-100"
/>


<input
  type="date"
  value={birthDate}
  onChange={(e) => setBirthDate(e.target.value)}
  placeholder="Enter patient's birth date"
  disabled={isExistingPatientSelected}
  className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700 disabled:bg-gray-100"
/>



<select
  value={gender}
  onChange={(e) => setGender(e.target.value)}
  disabled={isExistingPatientSelected}
  className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
>
  <option value="">-- Select Gender --</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>


<label className="block mb-2 font-semibold">Visit Type</label>
<select
  value={visitType}
  onChange={(e) => setVisitType(e.target.value)}
  
  className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
>
  <option value="">-- Choose Visit Type --</option>
  <option value="Routine Dental Checkup">Routine Dental Checkup</option>
  <option value="Follow-up Visit">Follow-up Visit</option>
  <option value="Dental Consultation">Dental Consultation</option>
  <option value="Fluoride Treatment or Dental Sealants">Fluoride Treatment or Dental Sealants</option>
  <option value="Dental X-ray or Imaging">Dental X-ray or Imaging</option>
  <option value="Emergency Dental Care">Emergency Dental Care</option>
</select>
   <label className="block  mb-1 font-semibold">Status Type</label>
              <select
                className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">-- Choose Status Type --</option>
                <option value="scheduled">Scheduled</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="delayed">Delayed</option>
              </select>

<label className="block font-semibold mb-2"> Payment </label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
      >
        <option value="">-- Choose Payment Type --</option>
        <option value="cash">Cash</option>
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
      <label className="block font-semibold mb-2">Payment Status </label>
      <select
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
      >
        <option value="">-- Choose Payment Status --</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>

              

            
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
<div className="ml-5 mb-4 max-w-sm">
  <input
    type="text"
    placeholder="Search by patient name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
  />
</div>

        <div className="bg-white shadow rounded-xl overflow-x-auto ml-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th> */}
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked By</th>
    <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
  </tr>
</thead>
<tbody>
  {appointments
  .filter((appt) =>
    appt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((appt) => {

    const dateObj = new Date(appt.start_time.seconds * 1000);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <tr key={appt.id}>
        <td className="px-6 py-4 text-sm text-gray-800">{appt.patient_name }</td>
        {/* <td className="px-6 py-4 text-sm text-gray-800">{appt.patient_id}</td> */}
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
        <td className="px-6 py-4 text-sm space-x-5">
          <button onClick={() => handleEdit(appt)} className="text-sky-700 hover:underline">Edit</button>
          <button onClick={() => confirmDelete(appt.id)} className="text-red-600 hover:underline">Delete</button>
          <button onClick={() => handleView(appt)} className="text-green-600 hover:underline">View</button>

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
{viewedAppointment && (
  <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
      <h2 className="text-xl font-semibold text-sky-700 mb-4">Appointment Details</h2>
      
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong >Patient Name:</strong> {viewedAppointment.patient_name}</p>
        <p><strong>Patient ID:</strong> {viewedAppointment.patient_id}</p>
        <p><strong>Phone:</strong> {viewedAppointment.patient_phone || "N/A"}</p>
        <p><strong>Age:</strong> {viewedAppointment.patient_age || "N/A"}</p>
        <p><strong>Gender:</strong> {viewedAppointment.patient_gender || "N/A"}</p>
        <p><strong>Date:</strong> {new Date(viewedAppointment.start_time.seconds * 1000).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {new Date(viewedAppointment.start_time.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Visit Type:</strong> {viewedAppointment.visit_type || "N/A"}</p>
        <p><strong>Status:</strong> {viewedAppointment.status}</p>
        <p><strong>Payment Method:</strong> {viewedAppointment.payment_method}</p>
        <p><strong>Payment Amount:</strong> ${viewedAppointment.payment_amount}</p>
        <p><strong>Payment Status:</strong> {viewedAppointment.payment_status}</p>
        <p><strong>Booked By:</strong> {viewedAppointment.booked_by}</p>
      </div>

      <button
        onClick={() => setViewedAppointment(null)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
      >
        ×
      </button>
    </div>
  </div>
)}


      </div>
    </div>
  );
}









