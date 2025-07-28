import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchPatientById } from "../../services/firebase/patientServiceSingle";
import { fetchAppointmentsByPatientId } from "../../services/firebase/appointmentsServiceSinglePatient";
import { fetchDiagnosesByPatientId, addDiagnosis } from "../../services/firebase/diagnosesService";
import {
  fetchMedicationsByPrescriptionIds,
  addPrescriptionMedication,
  updatePrescriptionMedication
} from "../../services/firebase/medicationsService";
import { FaBell, FaBars } from "react-icons/fa";
import logo from "/arak-dental-logo.jpeg";
import toast from "react-hot-toast";
import AdminSideNav from "./AdminSideNav";

const PatientState = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [newDiagnosis, setNewDiagnosis] = useState({
    name: "",
    date: "",
    instructions: "",
    notes: ""
  });
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [isAddingDiagnosis, setIsAddingDiagnosis] = useState(false);
  const [isAddingPrescription, setIsAddingPrescription] = useState(false);
  const [editingPrescriptionId, setEditingPrescriptionId] = useState(null);
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    medicationName: "",
    dosage: "",
    frequency: "",
    refills: "",
    notes: "",
    diagnoseName: "",
  });

  const { patientId } = useParams();
  console.log("Route patient ID:", patientId);

  const [patientInfo, setPatientInfo] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);

  // Mock current doctor ID - you should replace this with actual authentication
  const currentDoctorId = "IP5k3oM6YRUs0yCzmTIBQMAg0Um1"; // Replace with actual doctor ID from your auth system

  useEffect(() => {
    const getPatientData = async () => {
      try {
        // Clear all state when patient changes
        setPatientInfo(null);
        setDiagnoses([]);
        setPrescriptions([]);
        setPatientAppointments([]);

        const data = await fetchPatientById(patientId);
        if (data) {
          setPatientInfo(data);
          console.log("Patient data loaded:", data);
        } else {
          console.warn("Patient not found");
        }
      } catch (err) {
        console.error("Failed to load patient:", err);
      }
    };

    if (patientId) {
      getPatientData();

      fetchAppointmentsByPatientId(patientId)
        .then((appointments) => {
          const sortedAppointments = appointments.sort((a, b) =>
            a.start_time.toDate() > b.start_time.toDate() ? -1 : 1
          );
          setPatientAppointments(sortedAppointments);
        })
        .catch((error) => console.error("Failed to fetch appointments:", error));

      fetchDiagnosesByPatientId(patientId)
        .then(async (fetchedDiagnoses) => {
          console.log("Fetched diagnoses:", fetchedDiagnoses);

          // Sort diagnoses by date (newest to oldest)
          const sortedDiagnoses = fetchedDiagnoses.sort((a, b) => {
            const dateA = a.date_issued?.toDate ? a.date_issued.toDate() : new Date(0);
            const dateB = b.date_issued?.toDate ? b.date_issued.toDate() : new Date(0);
            return dateB - dateA; // Descending order (newest first)
          });

          setDiagnoses(sortedDiagnoses);

          // Fetch prescriptions for all diagnoses
          const diagnosisIds = fetchedDiagnoses.map(d => d.id);
          if (diagnosisIds.length > 0) {
            const medications = await fetchMedicationsByPrescriptionIds(diagnosisIds);
            console.log("Fetched medications:", medications);
            setPrescriptions(medications);
          } else {
            // If no diagnoses, make sure prescriptions are empty
            setPrescriptions([]);
          }
        })
        .catch((err) => {
          console.error("Failed to load diagnoses:", err);
          // Clear prescriptions on error as well
          setPrescriptions([]);
        });
    }
  }, [patientId]); // This effect runs when patientId changes

  const selectedPatient = {
    name: patientInfo?.name || "Loading...",
    image: patientInfo?.imgurl || "https://via.placeholder.com/150",
    email: patientInfo?.email || "N/A",
    dob: patientInfo?.dob || "N/A",
    gender: patientInfo?.gender || "N/A",
    phone: patientInfo?.phone || "N/A",
  };

  const handleAddPrescription = (diagnosis) => {
    console.log("Adding prescription for diagnosis:", diagnosis);
    setSelectedDiagnosis(diagnosis);
    setFormData({
      medicationName: "",
      dosage: "",
      frequency: "",
      refills: "",
      notes: "",
      diagnoseName: diagnosis.prescription,
    });
    setEditIndex(null);
    setEditingPrescriptionId(null);
    setShowModal(true);
  };

  const handleEditPrescription = (prescription) => {
    console.log("Editing prescription:", prescription);
    setFormData({
      medicationName: prescription.medicationName || "",
      dosage: prescription.dosage || "",
      frequency: prescription.frequency || "",
      refills: prescription.refills || "",
      notes: prescription.notes || "",
      diagnoseName: prescription.diagnoseName || "",
    });
    setEditingPrescriptionId(prescription.id);
    setSelectedDiagnosis({ prescription: prescription.diagnoseName });
    setShowModal(true);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();

    if (!formData.medicationName || !formData.dosage || !formData.frequency) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsAddingPrescription(true);
    console.log("Saving prescription:", formData);

    try {
      if (editingPrescriptionId) {
        // Update existing prescription
        await updatePrescriptionMedication(editingPrescriptionId, {
          medicationName: formData.medicationName,
          dosage: formData.dosage,
          frequency: formData.frequency,
          refills: parseInt(formData.refills) || 0,
          notes: formData.notes || null,
          diagnoseName: formData.diagnoseName,
        });

        // Update local state
        setPrescriptions(prev => prev.map(p =>
          p.id === editingPrescriptionId
            ? { ...p, ...formData, refills: parseInt(formData.refills) || 0 }
            : p
        ));

        toast.success("Prescription updated successfully!");
      } else {
        // Add new prescription
        const prescriptionData = {
          medicationName: formData.medicationName,
          dosage: formData.dosage,
          frequency: formData.frequency,
          refills: parseInt(formData.refills) || 0,
          notes: formData.notes || null,
          prescriptionId: selectedDiagnosis.id,
          diagnoseName: selectedDiagnosis.prescription,
        };

        const docRef = await addPrescriptionMedication(prescriptionData);

        // Add to local state
        setPrescriptions(prev => [...prev, { id: docRef.id, ...prescriptionData }]);

        toast.success("Prescription added successfully!");
      }

      setShowModal(false);
      setEditingPrescriptionId(null);
    } catch (error) {
      console.error("Failed to save prescription:", error);
      toast.error("Failed to save prescription. Please try again.");
    } finally {
      setIsAddingPrescription(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewDiagnosis = async (e) => {
    e.preventDefault();

    if (!newDiagnosis.name || !newDiagnosis.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsAddingDiagnosis(true);
    console.log("Adding diagnosis:", newDiagnosis);

    const payload = {
      prescription: newDiagnosis.name,
      date_issued: new Date(newDiagnosis.date),
      patient_id: patientId,
      doctor_id: currentDoctorId,
      instructions: newDiagnosis.instructions || "N/A",
      notes: newDiagnosis.notes || null,
    };

    try {
      console.log("Payload to be sent:", payload);
      const docRef = await addDiagnosis(payload);
      console.log("Diagnosis added successfully:", docRef.id);

      // Refresh the diagnoses list
      const updatedDiagnoses = await fetchDiagnosesByPatientId(patientId);

      // Sort diagnoses by date (newest to oldest)
      const sortedDiagnoses = updatedDiagnoses.sort((a, b) => {
        const dateA = a.date_issued?.toDate ? a.date_issued.toDate() : new Date(0);
        const dateB = b.date_issued?.toDate ? b.date_issued.toDate() : new Date(0);
        return dateB - dateA; // Descending order (newest first)
      });

      console.log("Updated diagnoses:", sortedDiagnoses);
      setDiagnoses(sortedDiagnoses);

      // Reset form and close modal
      setNewDiagnosis({ name: "", date: "", instructions: "", notes: "" });
      setShowDiagnosisModal(false);

      toast.success("Diagnosis added successfully!");
    } catch (error) {
      console.error("Failed to add diagnosis:", error);
      toast.error("Failed to add diagnosis. Please try again.");
    } finally {
      setIsAddingDiagnosis(false);
    }
  };

  return (
    <div className="relative h-screen overflow-y-auto w-full">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
            <div
            className="fixed inset-0 bg-black opacity-40 z-40"
            onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg overflow-y-auto">
            <AdminSideNav />
            </div>
        </>
      )}
      {/* Top bar for mobile */}
              <div className="md:hidden flex justify-between items-center p-4 bg-white shadow fixed top-0 left-0 right-0 z-40">
                <button onClick={() => setSidebarOpen(true)} className="text-xl text-gray-700">
                  <FaBars />
                </button>
                <div className="flex items-center space-x-2 font-semibold text-xl text-[#299eed]">
              <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
              <span>Arak Dental Clinic</span>
            </div>
                <div className="w-6" /> {/* Spacer */}
              </div>
      <div className="flex">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 bg-[#f8fafc]">
            <div className="flex items-center space-x-2 md:font-semibold md:text-xl text-sm text-[#299eed]">
              {/* <img src={logo} alt="Logo" className="w-8 h-8 rounded-full sm:hidden md:block" /> */}
              <span>Arak Dental Clinic</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold capitalize mt-10">{selectedPatient.name}</h1>
            {/* Personal Info */}
            <section className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm sm:text-base text-gray-700 capitalize">
                <div className="font-bold">Full Name:</div>
                <div>{selectedPatient.name}</div>
                <div className="font-bold">Gender:</div>
                <div>{selectedPatient.gender}</div>
                <div className="font-bold">Email:</div>
                <div>{selectedPatient.email}</div>
                <div className="font-bold">Date of Birth:</div>
                <div>{selectedPatient.dob}</div>
                <div className="font-bold">Contact:</div>
                <div>{selectedPatient.phone}</div>
              </div>
            </section>

            {/* Appointment History */}
            <section className="bg-white p-6 rounded shadow">
              <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Appointment History</h2>
                <button
                  onClick={() => navigate("/Doctor/AppointmentsPage")}
                  className="bg-[#299eed] text-white px-4 py-2 rounded text-sm hover:bg-blue-600 cursor-pointer"
                >
                  View All
                </button>

              </div>
              <table className="w-full text-sm sm:text-base font-semibold text-left">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="py-2">Date</th>
                    <th className="py-2">Time</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patientAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    patientAppointments.map((appt) => (
                      <tr key={appt.id} className="border-t">
                        <td className="py-2">
                          {appt.start_time?.toDate
                            ? appt.start_time.toDate().toLocaleDateString("en-GB")
                            : "N/A"}
                        </td>
                        <td className="py-2">
                          {appt.start_time?.toDate
                            ? appt.start_time.toDate().toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "N/A"}
                        </td>
                        <td className="py-2">{appt.type || "N/A"}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${appt.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {appt.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            {/* Diagnosis */}
            <section className="bg-white p-6 rounded shadow">
              <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Diagnoses</h2>
                <button
                  onClick={() => setShowDiagnosisModal(true)}
                  className="bg-[#299eed] text-white px-4 py-2 rounded text-sm hover:bg-blue-600 cursor-pointer"
                >
                  + Add New Diagnosis
                </button>
              </div>
              <table className="w-full text-sm sm:text-base font-semibold text-left">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="py-2">Diagnosis</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Instructions</th>
                    <th className="py-2">Notes</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">
                        No diagnoses found.
                      </td>
                    </tr>
                  ) : (
                    diagnoses.map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="py-2">{d.prescription}</td>
                        <td className="py-2">
                          {d.date_issued?.toDate ? d.date_issued.toDate().toLocaleDateString("en-GB") : "N/A"}
                        </td>
                        <td className="py-2">{d.instructions || "N/A"}</td>
                        <td className="py-2">{d.notes || "N/A"}</td>
                        <td className="py-2">
                          <button
                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                            onClick={() => handleAddPrescription(d)}
                          >
                            Add Prescription
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            {/* Prescriptions */}
            <section className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Prescriptions</h2>
              <table className="w-full text-sm sm:text-base font-semibold text-left">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="py-2">Medication</th>
                    <th className="py-2">Diagnosis</th>
                    <th className="py-2">Dosage</th>
                    <th className="py-2">Frequency</th>
                    <th className="py-2">Refills</th>
                    <th className="py-2">Notes</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-4 text-center text-gray-500">
                        No prescriptions found.
                      </td>
                    </tr>
                  ) : (
                    prescriptions.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="py-2">{p.medicationName}</td>
                        <td className="py-2">{p.diagnoseName}</td>
                        <td className="py-2">{p.dosage}</td>
                        <td className="py-2">{p.frequency}</td>
                        <td className="py-2">{p.refills}</td>
                        <td className="py-2">{p.notes || "N/A"}</td>
                        <td className="py-2">
                          <button
                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                            onClick={() => handleEditPrescription(p)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </div>

      {/* Prescription Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-40 z-50 flex items-center justify-center px-4">
          <form
            onSubmit={handleSavePrescription}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
          >
            <h2 className="text-lg font-bold mb-4 text-center text-[#299eed]">
              {editingPrescriptionId
                ? `Edit Prescription for: ${selectedDiagnosis?.prescription}`
                : `Add Prescription for: ${selectedDiagnosis?.prescription}`}
            </h2>
            <div className="space-y-3">
              <input
                name="medicationName"
                placeholder="Medication Name"
                required
                value={formData.medicationName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="dosage"
                placeholder="Dosage (e.g., 500mg)"
                required
                value={formData.dosage}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="frequency"
                placeholder="Frequency (e.g., Once Daily)"
                required
                value={formData.frequency}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="refills"
                placeholder="Refills (number)"
                type="number"
                value={formData.refills}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                name="notes"
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows="3"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingPrescriptionId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isAddingPrescription}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#299eed] text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                disabled={isAddingPrescription}
              >
                {isAddingPrescription ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Diagnosis Modal */}
      {showDiagnosisModal && (
        <div className="fixed inset-0  bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 text-center text-[#299eed]">
              Add New Diagnosis
            </h2>
            <form onSubmit={handleAddNewDiagnosis} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis Name *
                </label>
                <input
                  type="text"
                  placeholder="Diagnosis Name"
                  required
                  value={newDiagnosis.name}
                  onChange={(e) => setNewDiagnosis({ ...newDiagnosis, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={newDiagnosis.date}
                  onChange={(e) => setNewDiagnosis({ ...newDiagnosis, date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  placeholder="Treatment instructions"
                  value={newDiagnosis.instructions}
                  onChange={(e) => setNewDiagnosis({ ...newDiagnosis, instructions: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  placeholder="Additional notes"
                  value={newDiagnosis.notes}
                  onChange={(e) => setNewDiagnosis({ ...newDiagnosis, notes: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDiagnosisModal(false);
                    setNewDiagnosis({ name: "", date: "", instructions: "", notes: "" });
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={isAddingDiagnosis}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#299eed] text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                  disabled={isAddingDiagnosis}
                >
                  {isAddingDiagnosis ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientState;