<<<<<<< HEAD

// import { useEffect, useState } from "react";
// import Sidebar from "../../components/Sidebar";
// import { fetchAllPatients } from "../../services/firebase/AssistantpatientsServices";
// import {
//   MdAssignmentInd,
//   MdEventNote,
//   MdScience,
//   MdDescription,
//   MdMedication,
// } from "react-icons/md";
// import { IoClose } from "react-icons/io5";

// const DEFAULT_IMAGES = [
//   "https://randomuser.me/api/portraits/women/44.jpg",
//   "https://randomuser.me/api/portraits/men/45.jpg",
//   "https://randomuser.me/api/portraits/women/48.jpg",
//   "https://randomuser.me/api/portraits/men/50.jpg",
// ];

// export default function Patients() {
//   const [activeTab, setActiveTab] = useState("history");
//   // const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [patients, setPatients] = useState([]);

//   const fetchPatients = async () => {
//     const data = await fetchAllPatients();
//     setPatients(data);
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   // const handleFileChange = (e) => {
//   //   const files = Array.from(e.target.files);
//   //   setUploadedFiles(files);
//   // };

//   const tabs = [
//     { name: "Overview", key: "overview" },
//     { name: "History", key: "history" },
//   ];

//   const filteredPatients = patients.filter((p) =>
//     p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     p.id?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <>
//       <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-6 border-b border-gray-200">
//         <h1 className="text-xl font-bold text-gray-800">Medicall</h1>
//       </nav>

//       <Sidebar />

//       <section className="pt-20 pl-60 pr-6 pb-10 bg-white min-h-screen font-sans flex gap-6 mt-5 ml-10">
//         {/* Left: Patient List */}
//         <div className="w-1/2">
//           <h1 className="text-2xl font-semibold text-gray-800">Patient Records</h1>
//           <p className="text-sky-700 my-3">
//             Search for a patient to view their history and manage their records.
//           </p>
//           <input
//             type="text"
//             placeholder=" Search by name or ID..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
//           />

//           <div className="space-y-4">
//             {filteredPatients.length > 0 ? (
//               filteredPatients.map((patient, index) => (
//                 <div
//                   key={patient.id}
//                   className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded"
//                   onClick={() => {
//                     setSelectedPatient(patient);
//                     setActiveTab("history");
//                     // setUploadedFiles([]);
//                   }}
//                 >
//                   <img
//                     src={DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}
//                     alt={patient.name}
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <div>
//                     <p className="font-semibold">{patient.name}</p>
//                     <p className="text-sm text-sky-700">ID: {patient.id}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-400 text-sm italic">No patient found with this name or ID.</p>
//             )}
//           </div>
//         </div>

//         {/* Right: Patient Details */}
//         <div className="w-1/2 border-l border-gray-200 pl-6">
//           {selectedPatient ? (
//             <>
//               <div className="flex justify-end mb-2 px-2">
//                 <button
//                   onClick={() => setSelectedPatient(null)}
//                   className="text-gray-500 hover:text-black text-xl"
//                 >
//                   <IoClose />
//                 </button>
//               </div>

//               <h2 className="text-lg font-semibold mb-4">Patient Details</h2>
//               <div className="flex items-center gap-4 mb-6">
//                 <img
//                   src="https://randomuser.me/api/portraits/men/44.jpg"
//                   alt="Profile"
//                   className="w-12 h-12 rounded-full"
//                 />
//                 <div>
//                   <h3 className="font-semibold">{selectedPatient.name}</h3>
//                   <p className="text-sky-700 text-sm">ID: {selectedPatient.id}</p>
//                 </div>
//               </div>

//               {/* Tabs */}
//               <div className="flex gap-8 border-b border-gray-200 mb-6">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.key}
//                     onClick={() => setActiveTab(tab.key)}
//                     className={`pb-2 font-medium border-b-2 transition-all duration-200 ${
//                       activeTab === tab.key
//                         ? "border-blue-500 text-sky-700"
//                         : "border-transparent text-gray-600 hover:border-blue-300"
//                     }`}
//                   >
//                     {tab.name}
//                   </button>
//                 ))}
//               </div>

//               {/* Overview */}
//               {activeTab === "overview" && (
//                 <div className="text-gray-700 mb-10 space-y-2">
//                   <p className="">
//                     <span className="font-medium">Name: </span>{selectedPatient.name}</p>
//                   <p>
//                     <span className="font-medium">Email:</span> {selectedPatient.email}
//                   </p>
//                   <p>
//                     <span className="font-medium">Phone:</span> {selectedPatient.phone}
//                   </p>
//                   <p>
//                     <span className="font-medium">Gender:</span> {selectedPatient.gender}
//                   </p>
//                   <p>
//                     <span className="font-medium">Date of Birth:</span> {selectedPatient.dob}
//                   </p>
//                 </div>
//               )}

//               {/* History */}
//               {activeTab === "history" && (
//                 <div className="space-y-6 mb-10">
//                   {[ // هذه بيانات وهمية الآن، لو عندك Collection تاني اسمه patientHistory نربطه لاحقًا
//                     {
//                       icon: <MdAssignmentInd className="text-2xl text-sky-700" />,
//                       label: "Initial Consultation",
//                       date: "2025-06-15",
//                     },
//                     {
//                       icon: <MdEventNote className="text-2xl text-sky-700" />,
//                       label: "Follow-up Appointment",
//                       date: "2025-07-01",
//                     },
//                   ].map((item, idx) => (
//                     <div key={idx} className="flex items-start gap-4">
//                       <div className="mt-1">{item.icon}</div>
//                       <div>
//                         <p className="font-medium">{item.label}</p>
//                         <p className="text-gray-500 text-sm">{item.date}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Files */}
//               {/* {activeTab === "files" && (
//                 <div>
//                   <h2 className="text-lg font-semibold mb-2">Files</h2>

//                   {uploadedFiles.length > 0 && (
//                     <ul className="text-sm text-gray-700 mb-4">
//                       {uploadedFiles.map((file, idx) => (
//                         <li key={idx} className="flex items-center gap-2">
//                           <span>{file.name}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                   <div className="border border-dashed border-gray-300 p-4 rounded-md text-center">
//                     <p className="text-gray-500 text-sm mb-3">
//                       Drag and drop files here, or browse to upload
//                     </p>
//                     <label className="bg-gray-100 px-4 py-2 rounded-md text-sm hover:bg-gray-200 cursor-pointer inline-block">
//                       Upload Files
//                       <input
//                         type="file"
//                         multiple
//                         onChange={handleFileChange}
//                         className="hidden"
//                       />
//                     </label>
//                   </div>
//                 </div>
//               )} */}
//             </>
//           ) : (
//             <div className="text-gray-400 text-xl mt-10">
//               Select a patient to view details
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// }


=======
//patients.jsx
>>>>>>> 898efbc (make responsive)
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { fetchAllPatients } from "../../services/firebase/AssistantpatientsServices";
import { getPatientAppointments } from "../../services/firebase/patientServices"; // استدعاء الفنكشن
import {
  MdAssignmentInd,
  MdEventNote,
  MdScience,
  MdDescription,
  MdMedication,
} from "react-icons/md";
import { IoClose } from "react-icons/io5";

const DEFAULT_IMAGES = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/48.jpg",
  "https://randomuser.me/api/portraits/men/50.jpg",
];

export default function Patients() {
  const [activeTab, setActiveTab] = useState("history");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
<<<<<<< HEAD
  const [patientAppointments, setPatientAppointments] = useState([]);
=======
  const [isMobile, setIsMobile] = useState(false);
  const [showPatientList, setShowPatientList] = useState(true);

>>>>>>> 898efbc (make responsive)

  const fetchPatients = async () => {
    const data = await fetchAllPatients();
    setPatients(data);
  };
useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  handleResize(); // استدعاء فوري
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  useEffect(() => {
    fetchPatients();
  }, []);

  // كل ما يتغير selectedPatient يجلب المواعيد
  useEffect(() => {
    if (selectedPatient) {
      getPatientAppointments(selectedPatient.id)
        .then((apps) => {
          setPatientAppointments(apps);
        })
        .catch((err) => {
          console.error("Error loading appointments:", err);
          setPatientAppointments([]);
        });
    } else {
      setPatientAppointments([]);
    }
  }, [selectedPatient]);

  const tabs = [
    { name: "Overview", key: "overview" },
    { name: "History", key: "history" },
  ];

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl ml-7 font-bold text-gray-800">Medicall</h1>
      </nav>

      <Sidebar />

<<<<<<< HEAD
      <section className="pt-20 pl-60 pr-6 pb-10 bg-white min-h-screen font-sans flex gap-6 mt-5 ml-10">
        {/* Left: Patient List */}
        <div className="w-1/2">
          <h1 className="text-2xl font-semibold text-gray-800">Patient Records</h1>
          <p className="text-sky-700 my-3">
            Search for a patient to view their history and manage their records.
          </p>
          <input
            type="text"
            placeholder=" Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
          />

          <div className="space-y-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => {
                    setSelectedPatient(patient);
                    setActiveTab("history");
                  }}
                >
                  <img
                    src={DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}
                    alt={patient.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-sky-700">ID: {patient.id}</p>
                  </div>
=======
 <section className="pt-20 px-4 md:pl-60 pb-10 bg-white min-h-screen font-sans mt-5">
  <div className="flex flex-col md:flex-row gap-6">
    
    {/* قائمة المرضى */}
    {(!isMobile || showPatientList) && (
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl font-semibold text-gray-800">Patient Records</h1>
        <p className="text-sky-700 my-3">
          Search for a patient to view their history and manage their records.
        </p>
        <input
          type="text"
          placeholder=" Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
        />
        <div className="space-y-4">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <div
                key={patient.id}
                className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => {
                  setSelectedPatient(patient);
                  setActiveTab("history");
                  if (isMobile) setShowPatientList(false);
                }}
              >
                <img
                  src={DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}
                  alt={patient.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{patient.name}</p>
                  <p className="text-sm text-sky-700">ID: {patient.id}</p>
>>>>>>> 898efbc (make responsive)
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No patient found with this name or ID.</p>
          )}
        </div>
      </div>
    )}

    {/* تفاصيل المريض */}
    {selectedPatient && (!isMobile || !showPatientList) && (
      <div className="w-full md:w-1/2 border-l border-gray-200 md:pl-6">
        {/* زر رجوع في الموبايل */}
        {isMobile && (
          <button
            onClick={() => setShowPatientList(true)}
            className="mb-4 text-sm text-sky-600 hover:underline"
          >
            ← Back to Patients
          </button>
        )}

        <div className="flex justify-end mb-2 px-2">
          <button
            onClick={() => {
              setSelectedPatient(null);
              if (isMobile) setShowPatientList(true);
            }}
            className="text-gray-500 hover:text-black text-xl"
          >
            <IoClose />
          </button>
        </div>

        <h2 className="text-lg font-semibold mb-4">Patient Details</h2>
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://randomuser.me/api/portraits/men/44.jpg"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{selectedPatient.name}</h3>
            <p className="text-sky-700 text-sm">ID: {selectedPatient.id}</p>
          </div>
        </div>

<<<<<<< HEAD
        {/* Right: Patient Details */}
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
                  src="https://randomuser.me/api/portraits/men/44.jpg"
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{selectedPatient.name}</h3>
                  <p className="text-sky-700 text-sm">ID: {selectedPatient.id}</p>
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
                  <p>
                    <span className="font-medium">Name: </span>{selectedPatient.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {selectedPatient.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {selectedPatient.phone}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span> {selectedPatient.gender}
                  </p>
                  <p>
                    <span className="font-medium">Date of Birth:</span> {selectedPatient.dob}
                  </p>
                </div>
              )}

              {/* History */}
              {activeTab === "history" && (
                <div className="space-y-6 mb-10">
                  {patientAppointments.length > 0 ? (
                    patientAppointments.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-start gap-4">
                        <div className="mt-1">
                          <MdAssignmentInd className="text-2xl text-sky-700" />
                        </div>
                        <div>
                          <p className="font-medium">{item.type || item.label || "Appointment"}</p>
                          <p className="text-gray-500 text-sm">
                            {item.start_time
                              ? (item.start_time.seconds
                                  ? new Date(item.start_time.seconds * 1000).toISOString().split("T")[0]
                                  : new Date(item.start_time).toISOString().split("T")[0])
                              : item.date}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No appointments found for this patient.</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-400 text-xl mt-10">
              Select a patient to view details
            </div>
          )}
=======
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
>>>>>>> 898efbc (make responsive)
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="text-gray-700 mb-10 space-y-2">
            <p><span className="font-medium">Name:</span> {selectedPatient.name}</p>
            <p><span className="font-medium">Email:</span> {selectedPatient.email}</p>
            <p><span className="font-medium">Phone:</span> {selectedPatient.phone}</p>
            <p><span className="font-medium">Gender:</span> {selectedPatient.gender}</p>
            <p><span className="font-medium">Date of Birth:</span> {selectedPatient.dob}</p>
          </div>
        )}

        {/* History */}
        {activeTab === "history" && (
          <div className="space-y-6 mb-10">
            {[
              {
                icon: <MdAssignmentInd className="text-2xl text-sky-700" />,
                label: "Initial Consultation",
                date: "2025-06-15",
              },
              {
                icon: <MdEventNote className="text-2xl text-sky-700" />,
                label: "Follow-up Appointment",
                date: "2025-07-01",
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
      </div>
    )}
  </div>
</section>

    </>
  );
}
