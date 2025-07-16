import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getScheduledAppointments } from '../../../services/firebase/patientServices';
import { AuthContext } from '../../../context/Authcontext';
import { useQuery} from '@tanstack/react-query';

const appointmentSchema = z.object({
  visitType: z.string().min(1, "Visit type is required"),
  reasonForVisit: z.string().min(1, "Reason for visit is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  doctorId: z.string(), 
  patientId: z.string()
});

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

export default function AppointmentPage() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const { user } = useContext(AuthContext);

    const { data: scheduledAppointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: getScheduledAppointments,
    refetchInterval: 1000, 
    staleTime: 0,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    mode: 'onChange'
  });

  const selectedDate = watch('appointmentDate');
  const selectedTime = watch('appointmentTime');

  useEffect(() => {
    const fetchScheduledAppointments = async () => {
      try {
        const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
        setValue('appointmentDate', formattedDate);
        
      if (!isLoading && scheduledAppointments) {
    console.log("Appointments data:", scheduledAppointments);
    generateTimeSlots(formattedDate, scheduledAppointments);
  }

      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };
    fetchScheduledAppointments();
  }, [setValue, scheduledAppointments, isLoading]);

  const generateTimeSlots = (date , appointments=[]) => {
    const today = new Date();
    const selected = new Date(date);
    const isToday = selected.toDateString() === today.toDateString();
    
    const slots = [];
    const startHour = 11; 
    const endHour = 22;  
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute > 0) break;
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
        
        const slotTime = new Date(selected);
        slotTime.setHours(hour, minute);
        
        const isBooked = appointments.some(app => {
        return (
          app.getDate() === slotTime.getDate() &&
          app.getMonth() === slotTime.getMonth() &&
          app.getFullYear() === slotTime.getFullYear() &&
          app.getHours() === slotTime.getHours() &&
          app.getMinutes() === slotTime.getMinutes()
        );
      });

        const available = !isBooked && (!isToday || slotTime > new Date(today.getTime() + 30*60*1000));
        
        slots.push({
          time: timeString,
          available
        });
      }
    }
    
    setTimeSlots(slots);
    setValue('appointmentTime', '');
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setValue('appointmentDate', date);
    
    generateTimeSlots(date, scheduledAppointments);
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    // Simulate API call/processing
    setTimeout(() => {
      setIsSubmitting(false);
      setAppointmentConfirmed(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setAppointmentConfirmed(false);
        reset();
      }, 3000);
    }, 1500);
  };

  const handleClearAll = () => {
    reset();
    setAppointmentConfirmed(false);
  };

  return (
    <div className="max-w-3xl mt-10 mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Make An Appointment</h1>
      
      <div className="mb-6 text-center">
        <p className="text-lg font-semibold">Doctor: Dr. Ashraf Mohamed</p>
        <p className="text-md text-gray-600">Clinic: Ashraf Medical Center</p>
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
            Your appointment with Dr. Ashraf Mohamed is scheduled for {selectedDate} at {selectedTime}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Visit Type
              </label>
              <select
                {...register('visitType')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.visitType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Choose visit type</option>
                {visitTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.visitType && (
                <p className="mt-1 text-sm text-red-600">{errors.visitType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Reason for Visit
              </label>
              <select
                {...register('reasonForVisit')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.reasonForVisit ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Choose reason</option>
                {visitReasons.map((reason, index) => (
                  <option key={index} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              {errors.reasonForVisit && (
                <p className="mt-1 text-sm text-red-600">{errors.reasonForVisit.message}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              {...register('appointmentDate')}
              min={new Date().toISOString().split('T')[0]}
              onChange={handleDateChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.appointmentDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
            )}
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
                  onClick={() => slot.available && setValue('appointmentTime', slot.time)}
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
            <input type="hidden" {...register('appointmentTime')} />
            {errors.appointmentTime && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
            )}
          </div>
            <div>
              <input type="hidden" {...register('doctorId')} value="IP5k3oM6YRUs0yCzmTIBQMAg0Um1" />
              <input type="hidden" {...register('patientId')} value={user?.uid} />
            </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="w-full sm:w-auto">
              {selectedTime && (
                <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md">
                  <p className="font-semibold">Selected Appointment:</p>
                  <p>{selectedDate} at {selectedTime}</p>
                  <p>Visit Type: {watch('visitType') || 'Not selected'}</p>
                  <p>Reason: {watch('reasonForVisit') || 'Not selected'}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
              
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`px-4 py-2 rounded-md transition-colors
                  ${isValid 
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
        </form>
      )}
    </div>
  );
}
