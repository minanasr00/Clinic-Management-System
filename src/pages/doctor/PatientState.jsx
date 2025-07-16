import React, { useState } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import AdminSideNav from "./AdminSideNav";
import doctorimg from "../../assets/istockphoto-92347250-612x612.jpg";
import logo from "../../assets/logo.jpg";

const PatientState = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [newDiagnosis, setNewDiagnosis] = useState({ name: "", date: "" });

  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    refills: "",
    status: "Active",
  });

  const selectedPatient = {
    name: "Alice Johnson",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    nextAppointment: "2025-07-12",
  };

  const [diagnoses, setDiagnoses] = useState([
    { id: 1, name: "Hypertension", date: "2025-06-01" },
    { id: 2, name: "Diabetes", date: "2025-06-15" },
  ]);

  const handleAddPrescription = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setFormData({
      medication: "",
      dosage: "",
      frequency: "",
      refills: "",
      status: "Active",
    });
    setEditIndex(null);
    setShowModal(true);
  };

  const handleEditPrescription = (index) => {
    const presc = prescriptions[index];
    setFormData({
      medication: presc.medication,
      dosage: presc.dosage,
      frequency: presc.frequency,
      refills: presc.refills,
      status: presc.status,
    });
    setSelectedDiagnosis({ name: presc.diagnosis });
    setEditIndex(index);
    setShowModal(true);
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    const updatedPrescription = {
      ...formData,
      diagnosis: selectedDiagnosis.name,
    };

    if (editIndex !== null) {
      const updated = [...prescriptions];
      updated[editIndex] = updatedPrescription;
      setPrescriptions(updated);
    } else {
      setPrescriptions([...prescriptions, updatedPrescription]);
    }

    setShowModal(false);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewDiagnosis = () => {
    if (!newDiagnosis.name || !newDiagnosis.date) return;
    const newEntry = {
      id: diagnoses.length + 1,
      name: newDiagnosis.name,
      date: newDiagnosis.date,
    };
    setDiagnoses([...diagnoses, newEntry]);
    setNewDiagnosis({ name: "", date: "" });
    setShowDiagnosisModal(false);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-opacity-40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg overflow-y-auto">
            <AdminSideNav />
          </div>
        </>
      )}

      <div className="flex h-full">
        <div className="hidden md:block">
          <AdminSideNav />
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto bg-[#f7fafc]">
          <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-2 font-semibold text-xl text-[#299eed]">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-gray-700 text-2xl mr-2"
              >
                <FaBars />
              </button>
              <img src={logo} alt="Logo" className="w-8 h-8" />
              <span>Clinic System</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaBell className="text-xl text-gray-600 cursor-pointer" />
              <img
                src={doctorimg}
                className="w-10 h-10 rounded-full object-cover"
                alt="Doctor"
              />
            </div>
          </nav>

          <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 bg-[#f8fafc]">
            <h1 className="text-2xl sm:text-3xl font-bold">{selectedPatient.name}</h1>

            <section className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm sm:text-base text-gray-700">
                <div className="font-bold">Full Name:</div>
                <div>{selectedPatient.name}</div>
                <div className="font-bold">Gender:</div>
                <div>Female</div>
                <div className="font-bold">Email:</div>
                <div>alice@example.com</div>
                <div className="font-bold">Date of Birth:</div>
                <div>1991-05-20</div>
                <div className="font-bold">Contact:</div>
                <div>+201123456789</div>
                <div className="font-bold">Address:</div>
                <div>Cairo, Egypt</div>
              </div>
            </section>

            <section className="bg-white p-6 rounded shadow">
              <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Appointment History</h2>
                <button className="text-[#299eed] text-sm hover:underline">View All</button>
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
                  <tr className="border-t">
                    <td className="py-2">2025-05-12</td>
                    <td className="py-2">9:00 AM</td>
                    <td className="py-2">Checkup</td>
                    <td className="py-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="bg-white p-6 rounded shadow">
              <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Diagnosis</h2>
                <button onClick={() => setShowDiagnosisModal(true)} className="bg-[#299eed] text-white px-4 py-2 rounded text-sm hover:bg-blue-600 cursor-pointer">
                  + Add New Diagnosis
                </button>
              </div>
              <table className="w-full text-sm sm:text-base font-semibold text-left">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="py-2">Diagnosis</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="py-2">{d.name}</td>
                      <td className="py-2">{d.date}</td>
                      <td className="py-2">
                        <button
                          className="text-sm text-blue-600 hover:underline cursor-pointer"
                          onClick={() => handleAddPrescription(d)}
                        >
                          Add Prescription
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

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
                    <th className="py-2">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2">{p.medication}</td>
                      <td className="py-2">{p.diagnosis}</td>
                      <td className="py-2">{p.dosage}</td>
                      <td className="py-2">{p.frequency}</td>
                      <td className="py-2">{p.refills}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${p.status === "Active" ? "bg-blue-100 text-blue-700" : p.status === "Completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2">
                        <button
                          className="text-sm text-red-600 hover:underline cursor-pointer"
                          onClick={() => handleEditPrescription(idx)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 z-50 flex items-center justify-center px-4">
          <form
            onSubmit={handleSavePrescription}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
          >
            <h2 className="text-lg font-bold mb-4 text-center text-[#299eed]">
              {editIndex !== null
                ? `Edit Prescription for: ${selectedDiagnosis?.name}`
                : `Add Prescription for: ${selectedDiagnosis?.name}`}
            </h2>
            <div className="space-y-3">
              <input
                name="medication"
                placeholder="Medication"
                required
                value={formData.medication}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="dosage"
                placeholder="Dosage"
                required
                value={formData.dosage}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="frequency"
                placeholder="Frequency"
                required
                value={formData.frequency}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="refills"
                placeholder="Refills"
                required
                value={formData.refills}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <select
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#299eed] text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {showDiagnosisModal && (
        <div className="fixed inset-0  bg-opacity-40 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 text-center text-[#299eed]">
              Add New Diagnosis
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Diagnosis Name"
                value={newDiagnosis.name}
                onChange={(e) => setNewDiagnosis({ ...newDiagnosis, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="date"
                value={newDiagnosis.date}
                onChange={(e) => setNewDiagnosis({ ...newDiagnosis, date: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowDiagnosisModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewDiagnosis}
                className="px-4 py-2 bg-[#299eed] text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientState;
