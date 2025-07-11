import { useState, useEffect } from 'react';

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [visitType, setVisitType] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  const visitTypes = [
    "General Checkup",
    "Follow-up",
    "Consultation",
    "Emergency",
    "Vaccination",
    "Lab Test"
  ];

  const visitReasons = [
    "Routine Examination",
    "Cold/Flu Symptoms",
    "Injury/Pain",
    "Chronic Condition",
    "Medication Refill",
    "Test Results",
    "Other"
  ];


  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    generateTimeSlots(formattedDate);
  }, []);

  const generateTimeSlots = (date) => {
    const today = new Date();
    const selected = new Date(date);
    const isToday = selected.toDateString() === today.toDateString();
    
    const slots = [];
    const startHour = 8; 
    const endHour = 19;  
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute > 0) break; 
        

        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
        

        const slotTime = new Date(selected);
        slotTime.setHours(hour, minute);
        

        const available = !isToday || slotTime > new Date(today.getTime() + 60*60*1000);
        
        slots.push({
          time: timeString,
          available
        });
      }
    }
    
    setTimeSlots(slots);
    setSelectedTime('');
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    generateTimeSlots(date);
  };

  const handleConfirmAppointment = () => {
    if (!isFormComplete()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call/processing
    setTimeout(() => {
      setIsSubmitting(false);
      setAppointmentConfirmed(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setAppointmentConfirmed(false);
      }, 3000);
    }, 1500);
  };

  const isFormComplete = () => {
    return visitType && reasonForVisit && selectedDate && selectedTime;
  };

  const handleClearAll = () => {
    setSelectedTime('');
    setVisitType('');
    setReasonForVisit('');
    setAppointmentConfirmed(false);
  };

  return (
    <div className="max-w-3xl mt-10 mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Make An Appointment</h1>
      
      <div className="mb-6 text-center">
        <p className="text-lg font-semibold">Doctor: Dr. Masia Giura</p>
        <p className="text-md text-gray-600">Hospital: Barala Hospital</p>
      </div>

      {appointmentConfirmed ? (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md border border-green-300">
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-lg font-semibold">Appointment Confirmed!</p>
          </div>
          <p className="text-center mt-2">
            Your appointment with Dr. Masia Giura is scheduled for {selectedDate} at {selectedTime}.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Visit Type
              </label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose visit type</option>
                {visitTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Reason for Visit
              </label>
              <select
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose reason</option>
                {visitReasons.map((reason, index) => (
                  <option key={index} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <h3 className="block text-sm font-medium text-gray-700 mb-3">
              Select Appointment Time
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`py-2 px-3 rounded-md text-center text-sm font-medium transition-colors
                    ${selectedTime === slot.time
                      ? 'bg-blue-600 text-white'
                      : slot.available
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="w-full sm:w-auto">
              {selectedTime && (
                <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md">
                  <p className="font-semibold">Selected Appointment:</p>
                  <p>{selectedDate} at {selectedTime}</p>
                  <p>Visit Type: {visitType || 'Not selected'}</p>
                  <p>Reason: {reasonForVisit || 'Not selected'}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
              
              <button
                onClick={handleConfirmAppointment}
                disabled={!isFormComplete() || isSubmitting}
                className={`px-4 py-2 rounded-md transition-colors
                  ${isFormComplete() 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}