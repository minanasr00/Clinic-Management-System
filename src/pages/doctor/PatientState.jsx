import React, { useState } from "react";
import {
    FaBell,
    FaTachometerAlt,
    FaCalendarAlt,
    FaUserInjured,
    FaUserNurse,
    FaFilePrescription,
    FaSearch
} from "react-icons/fa";

const patients = [
    {
        name: "Alice Johnson",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        nextAppointment: "2025-07-12",
    },
    {
        name: "James Franco",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        nextAppointment: "2025-07-14",
    },
    {
        name: "Sarah Smith",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        nextAppointment: "2025-07-16",
    },
    {
        name: "Mark Wilson",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        nextAppointment: "2025-07-20",
    },
];

const PatientState = () => {
    const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
    const [activeNav, setActiveNav] = useState("Patients");
    const selectedPatient = patients[selectedPatientIndex];

    return (
        <div className="min-h-screen bg-[#f7fafc] flex flex-col">
            {/* Top Navbar */}
            <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 font-semibold text-xl text-[#299eed]">
                    <img src="https://media.istockphoto.com/id/1321617070/vector/health-medical-logo.jpg?s=612x612&w=0&k=20&c=sus8vhG3c__vCdvOBLDhuf2vPUgIAudIAeUBApU_7Ew=" alt="Logo" className="w-8 h-8" />
                    <span>Clinic System</span>
                </div>

                <div className="flex space-x-6 font-medium text-gray-700">
                    {["Dashboard", "Appointments", "Patients", "Assistants", "Prescriptions"].map((item) => (
                        <div
                            key={item}
                            onClick={() => setActiveNav(item)}
                            className={`cursor-pointer pb-1 transition-all duration-150 ${activeNav === item
                                ? "text-[#299eed] font-semibold border-b-2 border-[#299eed]"
                                : "hover:text-[#299eed]"
                                }`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    <FaBell className="text-xl text-gray-600 cursor-pointer" />
                    <img
                        src="https://media.istockphoto.com/id/92347250/photo/portrait-of-a-doctor.jpg?s=612x612&w=0&k=20&c=yKBhDy7ch065QV8mE4ocec8n9uec9VmBDmT137ZjHFo="
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Doctor"
                    />
                </div>
            </nav>

            <div className="h-[1px] bg-gray-300 w-full" />

            <div className="flex flex-1">
                <aside className="w-80 bg-white border-r-[1.5px] border-[#eff1f5] p-6">
                    <h2 className="text-xl font-bold mb-4">Patients</h2>

                    <div className="relative mb-6">
                        <FaSearch className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients"
                            className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#299eed]"
                        />
                    </div>

                    <div className="space-y-4">
                        {patients.map((p, idx) => {
                            const isSelected = selectedPatientIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedPatientIndex(idx)}
                                    className={`flex items-center space-x-3 cursor-pointer p-2 rounded relative transition-all duration-150
                                    ${isSelected ? "bg-[#f8faff]" : "hover:bg-gray-100"}`}>
                                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <div className="font-semibold">{p.name}</div>
                                        <div className="text-xs text-gray-500">Next Appointment: {p.nextAppointment}</div>
                                    </div>

                                    {isSelected && (
                                        <div className="absolute right-0 top-0 h-full w-1 bg-[#bdd4e5] rounded-r" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

                <main className="flex-1 p-8 space-y-8 bg-[#f8fafc">
                    <h1 className="text-3xl font-bold">{selectedPatient.name}</h1>

                    <section className="bg-white p-6 rounded shadow">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Personal Information</h2>
                        <div className="grid grid-cols-4 gap-x-4 gap-y-4 text-base text-gray-700">
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
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Appointment History</h2>
                            <button className="text-[#299eed] text-base hover:underline">View All</button>
                        </div>
                        <table className="w-full text-base font-semibold text-left">
                            <thead className="text-gray-500 font-semibold border-b">
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
                                    <td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span></td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2">2025-04-20</td>
                                    <td className="py-2">11:00 AM</td>
                                    <td className="py-2">Consultation</td>
                                    <td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span></td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2">2025-03-18</td>
                                    <td className="py-2">2:30 PM</td>
                                    <td className="py-2">Follow-up</td>
                                    <td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="bg-white p-6 rounded shadow">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Prescriptions</h2>
                            <button className="bg-[#299eed] text-white px-4 py-2 rounded-full hover:bg-[#bdd4e5] text-sm">+ Add New</button>
                        </div>
                        <table className="w-full text-base font-semibold text-left">
                            <thead className="text-gray-500 border-b">
                                <tr>
                                    <th className="py-2">Medication</th>
                                    <th className="py-2">Dosage</th>
                                    <th className="py-2">Frequency</th>
                                    <th className="py-2">Refills</th>
                                    <th className="py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="py-2">Atorvastatin</td>
                                    <td className="py-2">10mg</td>
                                    <td className="py-2">Once Daily</td>
                                    <td className="py-2">2</td>
                                    <td className="py-2"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Active</span></td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2">Lisinopril</td>
                                    <td className="py-2">20mg</td>
                                    <td className="py-2">Once Daily</td>
                                    <td className="py-2">0</td>
                                    <td className="py-2"><span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">Inactive</span></td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2">Metformin</td>
                                    <td className="py-2">500mg</td>
                                    <td className="py-2">Twice Daily</td>
                                    <td className="py-2">1</td>
                                    <td className="py-2"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Active</span></td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2">Aspirin</td>
                                    <td className="py-2">81mg</td>
                                    <td className="py-2">Once Daily</td>
                                    <td className="py-2">3</td>
                                    <td className="py-2"><span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">Inactive</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default PatientState;
