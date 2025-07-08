import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  MdAssignmentInd,
  MdEventNote,
  MdScience,
  MdDescription,
  MdMedication,
} from "react-icons/md";
import { IoClose } from "react-icons/io5";

const dummyPatients = [
  {
    id: "123456789",
    name: "Sophia Clark",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "sophia@example.com",
    status: "Stable",
    lastVisit: "10 June 2025",
    diagnosis: "Mild fever, dehydration",
    medication: "Paracetamol 500mg, ORS",
  },
  {
    id: "987654321",
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    email: "john@example.com",
    status: "Recovering",
    lastVisit: "02 July 2025",
    diagnosis: "Back pain",
    medication: "Ibuprofen",
  },
  {
    id: "987654321",
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    email: "john@example.com",
    status: "Recovering",
    lastVisit: "02 July 2025",
    diagnosis: "Back pain",
    medication: "Ibuprofen",
  },
  {
    id: "987654321",
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    email: "john@example.com",
    status: "Recovering",
    lastVisit: "02 July 2025",
    diagnosis: "Back pain",
    medication: "Ibuprofen",
  },
];

export default function Patients() {
  const [activeTab, setActiveTab] = useState("history");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const tabs = [
    { name: "Overview", key: "overview" },
    { name: "History", key: "history" },
    { name: "Files", key: "files" },
  ];

  const filteredPatients = dummyPatients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
  {/* Navbar */}
  <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-6 border-b border-gray-200">
    <h1 className="text-xl font-bold text-gray-800">Medicall</h1>
  </nav>

  {/* Sidebar */}
  <Sidebar />

  {/* Main Section (Flex between left and right) */}
  <section className="pt-20 pl-60 pr-6 pb-10 bg-white min-h-screen font-sans flex gap-6 mt-5 ml-10">
    
    {/* Left Side: Header + Search + List */}
    <div className="w-1/2">
      <h1 className="text-2xl font-semibold text-gray-800">Patient Records</h1>
      <p className="text-gray-500 mb-6">
        Search for a patient to view their history and manage their records.
      </p>
      <input
        type="text"
        placeholder=" Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
      />

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => {
              setSelectedPatient(patient);
              setActiveTab("history");
              setUploadedFiles([]);
            }}
          >
            <img
              src={patient.image}
              alt={patient.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{patient.name}</p>
              <p className="text-sm text-sky-700">ID: {patient.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Right Side: Patient Details */}
    <div className="w-1/2 border-l border-gray-200 pl-6">
      {selectedPatient ? (
        <>
          <div className="flex justify-end mb-2 px-2">
            <button
              onClick={() => setSelectedPatient(null)}
              className="text-gray-500 hover:text-black text-xl"
            >
              <IoClose />
            </button>
          </div>

          <h2 className="text-lg font-semibold mb-4">Patient Details</h2>
          <div className="flex items-center gap-4 mb-6">
            <img
              src={selectedPatient.image}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{selectedPatient.name}</h3>
              <p className="text-gray-500 text-sm">ID: {selectedPatient.id}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-sky-700"
                    : "border-transparent text-gray-600 hover:border-blue-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="text-gray-700 mb-10 space-y-2">
              <p className="text-lg font-semibold">{selectedPatient.name}</p>
              <p>
                <span className="font-medium">Email:</span> {selectedPatient.email}
              </p>
              <p>
                <span className="font-medium">Status:</span> {selectedPatient.status}
              </p>
              <p>
                <span className="font-medium">Last Visit:</span> {selectedPatient.lastVisit}
              </p>
              <p>
                <span className="font-medium">Diagnosis:</span> {selectedPatient.diagnosis}
              </p>
              <p>
                <span className="font-medium">Medication:</span> {selectedPatient.medication}
              </p>
            </div>
          )}

          {/* History */}
          {activeTab === "history" && (
            <div className="space-y-6 mb-10">
              {[
                {
                  icon: <MdAssignmentInd className="text-2xl text-sky-700" />,
                  label: "Initial Consultation",
                  date: "2023-01-15",
                },
                {
                  icon: <MdEventNote className="text-2xl text-sky-700" />,
                  label: "Follow-up Appointment",
                  date: "2023-02-20",
                },
                {
                  icon: <MdScience className="text-2xl text-sky-700" />,
                  label: "Lab Results Review",
                  date: "2023-03-10",
                },
                {
                  icon: <MdDescription className="text-2xl text-sky-700" />,
                  label: "Treatment Plan Adjustment",
                  date: "2023-04-05",
                },
                {
                  icon: <MdMedication className="text-2xl text-sky-700" />,
                  label: "Current Medication Review",
                  date: "2023-05-12",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-gray-500 text-sm">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Files */}
          {activeTab === "files" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Files</h2>

              {uploadedFiles.length > 0 && (
                <ul className="text-sm text-gray-700 mb-4">
                  {uploadedFiles.map((file, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span>{file.name}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="border border-dashed border-gray-300 p-4 rounded-md text-center">
                <p className="text-gray-500 text-sm mb-3">
                  Drag and drop files here, or browse to upload
                </p>
                <label className="bg-gray-100 px-4 py-2 rounded-md text-sm hover:bg-gray-200 cursor-pointer inline-block">
                  Upload Files
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-400  text-xl mt-10">Select a patient to view details</div>
      )}
    </div>
  </section>
</>

  );
}


