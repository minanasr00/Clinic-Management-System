import { Calendar, FileText, Pill, Stethoscope, Upload, X, FolderPlus, File } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { getPatientAppointments, getPatientDiagnoses, getTreatmentHistory } from '../../../services/firebase/patientServices';
import { AuthContext } from './../../../context/Authcontext';

export default function MedicalHistory() {
    const [uploadedFiles, setUploadedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const { user } = useContext(AuthContext)
  const [appointments, setAppointments] = useState([])
  const [diagnoses, setDiagnoses] = useState([])
  const [treatments, setTreatments] = useState([])
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const pappointments = await getPatientAppointments(user.uid);
        setAppointments(pappointments);
        console.log("Fetched appointments:", pappointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    }
    async function fetchDiagnoses() {
      try {
        const pdiagnoses = await getPatientDiagnoses(user.uid);
        setDiagnoses(pdiagnoses);
        console.log("Fetched diagnoses:", pdiagnoses);
        pdiagnoses.forEach(diagnosis => {
          getTreatmentHistory(diagnosis.id)
            .then(treatments => {
              setTreatments(prev => [...prev, ...treatments]);
            })
            .catch(error => {
              console.error("Error fetching treatments for diagnosis", diagnosis.id, ":", error);
            });
        });
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    }
    fetchAppointments();
    fetchDiagnoses();
  }, [])

  const uploadedDocuments = [
    {
      name: "Blood Test Results",
      date: "July 16, 2024",
      type: "Lab Report"
    },
    {
      name: "Allergy Test Results",
      date: "June 21, 2024",
      type: "Lab Report"
    }
  ]
  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadDate: new Date().toLocaleDateString()
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
  }

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
  }

  // Remove uploaded file
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get file type icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase()
    if (['pdf'].includes(extension)) return '📄'
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return '🖼️'
    if (['doc', 'docx'].includes(extension)) return '📝'
    if (['xls', 'xlsx'].includes(extension)) return '📊'
    return '📁'
  }
    
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical History</h1>
          <p className="text-[#4D7899] text-md">
            Review your complete medical history, including appointments, diagnoses, treatments, and uploaded documents.
          </p>
        </div>

        {/*  Appointments */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-scroll h-[400px]">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Visit Type
                    </th>
                   
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-md text-[#4D7899]">
                        {appointment.start_time.toDate().toLocaleDateString('en-US')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                        {appointment.visitType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-[#4D7899]">
                        {appointment.reason_for_visit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-[#4D7899]">
                        {appointment.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                        {appointment.payment_method} - {appointment.payment_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Diagnoses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Diagnoses</h2>
          <div className="space-y-4">
            {diagnoses.map((diagnosis, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Stethoscope className="w-5 h-5 text-[#4D7899] mt-1" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-[#4D7899] mb-2">
                      {diagnosis.prescription}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {diagnosis.instructions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Medications</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Diagnosis
                    </th>
                   
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Refills
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {treatments.map((treatment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-md text-[#4D7899]">
                        {treatment.medicationName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                        {treatment.diagnoseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-[#4D7899]">
                        {treatment.dosage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-[#4D7899]">
                        {treatment.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                        {treatment.refills}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                        {treatment.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        {/* Uploaded Documents */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploaded Documents</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadedDocuments.map((document, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900 flex items-center">
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                        {document.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-[#4D7899]">
                        {document.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-[#4D7899]">
                        {document.type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drop files here or click to upload
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Support for PDF, DOC, JPG, PNG files up to 10MB each
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <label className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileInputChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      />
                      Choose Files
                    </label>
                    <label className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center">
                      <input
                        type="file"
                        webkitdirectory=""
                        multiple
                        className="hidden"
                        onChange={handleFileInputChange}
                      />
                      <FolderPlus className="w-4 h-4 mr-2" />
                      Upload Folder
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Recently Uploaded</h4>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getFileIcon(file.name)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • Uploaded {file.uploadDate}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Save All Documents
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>    
      </div>
    </div>
  )
}