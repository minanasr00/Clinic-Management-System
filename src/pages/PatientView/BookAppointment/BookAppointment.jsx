// import { useState, useEffect, useContext, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { addAppointment, getScheduledAppointments } from '../../../services/firebase/patientServices';
// import { AuthContext } from '../../../context/Authcontext';
// import { useQuery } from '@tanstack/react-query';


// const appointmentSchema = z.object({
//   visitType: z.string().min(1, "Visit type is required"),
//   reasonForVisit: z.string().min(1, "Reason for visit is required"),
//   appointmentDate: z.string().min(1, "Date is required"),
//   appointmentTime: z.string().min(1, "Time is required"),
//   doctorId: z.string(), 
//   patientId: z.string(),
//   status: z.string().default("pending"), 
//   paymentMethod: z.string(),
//   bookedBy: z.string().default("patient"),
//   paymentAmount: z.number().default(500)
// });

// const visitTypes = [
//   "General Checkup",
//   "Follow-up",
//   "Consultation",
//   "Emergency",
//   "Vaccination",
//   "Lab Test"
// ];

// const visitReasons = [
//   "Routine Examination",
//   "Cold/Flu Symptoms",
//   "Injury/Pain",
//   "Chronic Condition",
//   "Medication Refill",
//   "Test Results",
//   "Other"
// ];




// export default function AppointmentPage() {
//   const [PaymentStatus, setPaymentStatus] = useState('');
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
//   const { user } = useContext(AuthContext);

//   const { data: scheduledAppointments, isLoading } = useQuery({
//     queryKey: ['appointments'],
//     queryFn: getScheduledAppointments,
//     refetchInterval: 1000, 
//     staleTime: 0,
//   });

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors, isValid }
//   } = useForm({
//     resolver: zodResolver(appointmentSchema),
//     mode: 'onChange'
//   });

//   const selectedDate = watch('appointmentDate');
//   const selectedTime = watch('appointmentTime');

//   useEffect(() => {
//     const today = new Date();
//     const formattedDate = today.toISOString().split('T')[0];
//     setValue('appointmentDate', formattedDate);
//   }, [setValue]);

//   // Memoized time slot generation function
//   const generateTimeSlots = useCallback((date, appointments = []) => {
//     const today = new Date();
//     const selected = new Date(date);
//     const isToday = selected.toDateString() === today.toDateString();
    
//     const slots = [];
//     const startHour = 11; 
//     const endHour = 22;  
    
//     for (let hour = startHour; hour <= endHour; hour++) {
//       for (let minute = 0; minute < 60; minute += 30) {
//         if (hour === endHour && minute > 0) break;
        
//         const period = hour >= 12 ? 'PM' : 'AM';
//         const displayHour = hour % 12 || 12;
//         const timeString = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
        
//         const slotTime = new Date(selected);
//         slotTime.setHours(hour, minute);
        
//         const isBooked = appointments.some(app => {
          
//           return (
//             app.getDate() === slotTime.getDate() &&
//             app.getMonth() === slotTime.getMonth() &&
//             app.getFullYear() === slotTime.getFullYear() &&
//             app.getHours() === slotTime.getHours() &&
//             app.getMinutes() === slotTime.getMinutes()
//           );
//         });

//         const available = !isBooked && (!isToday || slotTime > new Date(today.getTime() + 30*60*1000));
        
//         slots.push({
//           time: timeString,
//           available
//         });
//       }
//     }
    
//     return slots;
//   }, []);

//   // Update time slots when date or appointments change
//   useEffect(() => {
//     if (!isLoading && scheduledAppointments && selectedDate) {
//       const slots = generateTimeSlots(selectedDate, scheduledAppointments);
//       setTimeSlots(slots);
//     }
//   }, [generateTimeSlots, scheduledAppointments, isLoading, selectedDate]);

//   // Memoized time selection handler
//   const handleTimeSelect = useCallback((time) => {
//     setValue('appointmentTime', time, { shouldDirty: true, shouldValidate: true });
//   }, [setValue]);

//   const handleDateChange = useCallback((e) => {
//     const date = e.target.value;
//     setValue('appointmentDate', date, { shouldValidate: true });
//   }, [setValue]);

//   const onSubmit = (data) => {
//     setIsSubmitting(true);
//     console.log(data);
//     console.log(PaymentStatus);
//     addAppointment(data , PaymentStatus , user?.displayName || "Unknown User")

//     // Simulate API call/processing
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setAppointmentConfirmed(true);
      
//       // Reset form after 3 seconds
//       setTimeout(() => {
//         setAppointmentConfirmed(false);
//         reset();
//       }, 3000);
//     }, 1500);
//   };

//   const handleClearAll = useCallback(() => {
//     reset();
//     setAppointmentConfirmed(false);
//   }, [reset]);

//   return (
//     <div className="max-w-3xl mt-10 mx-auto p-4 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold text-center mb-6">Make An Appointment</h1>
      
//       <div className="mb-6 text-center">
//         <p className="text-lg font-semibold">Doctor: Dr. Ashraf Mohamed</p>
//         <p className="text-md text-gray-600">Clinic: Ashraf Medical Center</p>
//       </div>

//       {appointmentConfirmed ? (
//         <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md border border-green-300">
//           <div className="flex items-center justify-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//             <p className="text-lg font-semibold">Appointment Confirmed!</p>
//           </div>
//           <p className="text-center mt-2">
//             Your appointment with Dr. Ashraf Mohamed is scheduled for {selectedDate} at {selectedTime}.
//           </p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Visit Type
//               </label>
//               <select
//                 {...register('visitType')}
//                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                   errors.visitType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//                 }`}
//               >
//                 <option value="">Choose visit type</option>
//                 {visitTypes.map((type, index) => (
//                   <option key={index} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//               {errors.visitType && (
//                 <p className="mt-1 text-sm text-red-600">{errors.visitType.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Reason for Visit
//               </label>
//               <select
//                 {...register('reasonForVisit')}
//                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                   errors.reasonForVisit ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//                 }`}
//               >
//                 <option value="">Choose reason</option>
//                 {visitReasons.map((reason, index) => (
//                   <option key={index} value={reason}>
//                     {reason}
//                   </option>
//                 ))}
//               </select>
//               {errors.reasonForVisit && (
//                 <p className="mt-1 text-sm text-red-600">{errors.reasonForVisit.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Select Date
//             </label>
//             <input
//               type="date"
//               {...register('appointmentDate')}
//               min={new Date().toISOString().split('T')[0]}
//               onChange={handleDateChange}
//               className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//                 errors.appointmentDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//               }`}
//             />
//             {errors.appointmentDate && (
//               <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
//             )}
//           </div>

//           <div className="mb-6">
//             <h3 className="block text-sm font-medium text-gray-700 mb-3">
//               Select Appointment Time
//             </h3>
//             {isLoading ? (
//               <div className="text-center py-4">Loading available time slots...</div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {timeSlots.map((slot, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => slot.available && handleTimeSelect(slot.time)}
//                     disabled={!slot.available}
//                     className={`py-2 px-3 rounded-md text-center text-sm font-medium transition-colors
//                       ${selectedTime === slot.time
//                         ? 'bg-blue-600 text-white'
//                         : slot.available
//                           ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
//                           : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
//                       }`}
//                   >
//                     {slot.time}
//                   </button>
//                 ))}
//               </div>
//               )}
//             <input type="hidden" {...register('appointmentTime')} />
//             {errors.appointmentTime && (
//               <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
//               )}

// <div className="mb-6">
//   <label className="block text-sm font-medium text-gray-700 mt-3 mb-3">
//     Payment Method
//   </label>
//   <div className="flex gap-4">
//     {/* Cash Option */}
//     <label className={`flex-1 text-center py-2 rounded-md cursor-pointer transition-colors ${
//       watch('paymentMethod') === 'cash' 
//         ? 'bg-yellow-500 text-white shadow-md' 
//         : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
//     }`}>
//       <input
//         type="radio"
//         {...register('paymentMethod')}
//         value="cash"
//         className="hidden"
//         onClick={() => setPaymentStatus('unpaid')}  
//       />
//       <div className="flex items-center justify-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
//           />
//         </svg>
//         <span>Cash</span>
//       </div>
//     </label>

//     {/* Visa Option */}
//     <label className={`flex-1 text-center py-2 rounded-md cursor-pointer transition-colors ${
//       watch('paymentMethod') === 'visa' 
//         ? 'bg-blue-600 text-white shadow-md' 
//         : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
//     }`}>
//       <input
//         type="radio"
//         {...register('paymentMethod')}
//         value="visa"
//         className="hidden"
//       />
//       <div className="flex items-center justify-center gap-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
//           />
//         </svg>
//         <span>Visa</span>
//       </div>
//     </label>
//   </div>
//   {errors.paymentMethod && (
//     <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
//   )}
// </div>
//           </div>
//           <div>
//             <input type="hidden" {...register('doctorId')} value="IP5k3oM6YRUs0yCzmTIBQMAg0Um1" />
//             <input type="hidden" {...register('patientId')} value={user?.uid} />
//           </div>
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
//             <div className="w-full sm:w-auto">
//               {selectedTime && (
//                 <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md">
//                   <p className="font-semibold">Selected Appointment:</p>
//                   <p>{selectedDate} at {selectedTime}</p>
//                   <p>Visit Type: {watch('visitType') || 'Not selected'}</p>
//                   <p>Reason: {watch('reasonForVisit') || 'Not selected'}</p>
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleClearAll}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//               >
//                 Clear All
//               </button>
              
//               <button
//                 type="submit"
//                 disabled={!isValid || isSubmitting}
//                 className={`px-4 py-2 rounded-md transition-colors
//                   ${isValid 
//                     ? 'bg-green-600 text-white hover:bg-green-700' 
//                     : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                   } flex items-center justify-center`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : 'Confirm Appointment'}
//               </button>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }
import { useState, useEffect, useContext, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addAppointment, getScheduledAppointments } from '../../../services/firebase/patientServices';
import { AuthContext } from '../../../context/Authcontext';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PaymentContext from '../../../context/PaymentContext';

const appointmentSchema = z.object({
  visitType: z.string().min(1, "Visit type is required"),
  reasonForVisit: z.string().min(1, "Reason for visit is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  doctorId: z.string(), 
  patientId: z.string(),
  status: z.string().default("pending"), 
  paymentMethod: z.string(),
  bookedBy: z.string().default("patient"),
  paymentAmount: z.number().default(500)
});

const visitTypes = [
  "Routine Dental Checkup",
  "Follow-up Visit",
  "Dental Consultation",
  "Fluoride Treatment or Dental Sealants",
  "Dental X-ray or Lab Test",
  "Emergency"
];

const visitReasons = [
  "Routine Cleaning or Examination",
  "Toothache or Pain",
  "Broken or Chipped Tooth",
  "Bleeding Gums",
  "Cavity or Filling Issue",
  "Results Review (X-ray/Lab)",
  "Other"
];

export default function AppointmentPage() {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const selectedPaymentMethod = watch('paymentMethod');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setValue('appointmentDate', formattedDate);
  }, [setValue]);

  // Memoized time slot generation function
  const generateTimeSlots = useCallback((date, appointments = []) => {
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
    
    return slots;
  }, []);

  // Update time slots when date or appointments change
  useEffect(() => {
    if (!isLoading && scheduledAppointments && selectedDate) {
      const slots = generateTimeSlots(selectedDate, scheduledAppointments);
      setTimeSlots(slots);
    }
  }, [generateTimeSlots, scheduledAppointments, isLoading, selectedDate]);

  // Memoized time selection handler
  const handleTimeSelect = useCallback((time) => {
    setValue('appointmentTime', time, { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  const handleDateChange = useCallback((e) => {
    const date = e.target.value;
    setValue('appointmentDate', date, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Determine payment status based on method
      const finalPaymentStatus = data.paymentMethod === 'cash' ? 'unpaid' : 'pending';
      setPaymentStatus(finalPaymentStatus);
      
      // Add appointment to Firestore
      const newAppointmentId = await addAppointment(
        data, 
        finalPaymentStatus, 
        user?.displayName || "Unknown User"
      );
      
      setAppointmentId(newAppointmentId);
      console.log("New appointment ID:", newAppointmentId);

      localStorage.setItem('appointmentId', newAppointmentId);

      if (data.paymentMethod === 'visa') {
        // Redirect to Stripe payment with appointment ID
        const paymentLink = `https://buy.stripe.com/test_eVq3co18AfCi4jT0yue3e01?appointment_id=${newAppointmentId}`;
        window.location.href = paymentLink;
        
      } else {
        // For cash payments, show confirmation immediately
        setIsSubmitting(false);
        setAppointmentConfirmed(true);
        setTimeout(() => {
          setAppointmentConfirmed(false);
          reset();
          navigate('/patient/Book Appointment'); // Redirect to appointments page
        }, 3000);
      }
    } catch (error) {
      console.error("Error processing appointment:", error);
      setIsSubmitting(false);
    }
  };

  const handleClearAll = useCallback(() => {
    reset();
    setAppointmentConfirmed(false);
  }, [reset]);

  return (
    <div className="max-w-3xl mt-10 mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Make An Appointment</h1>
      
      <div className="mb-6 text-center">
        <p className="text-lg font-semibold">Doctor: Mohamad Mahmoud</p>
        <p className="text-md text-gray-600">Clinic: Arak Dental Clinic</p>
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
          {selectedPaymentMethod === 'cash' && (
            <p className="text-center mt-2 font-semibold">
              Please bring cash payment of ${watch('paymentAmount')} to your appointment.
            </p>
          )}
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
            {isLoading ? (
              <div className="text-center py-4">Loading available time slots...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
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
            )}
            <input type="hidden" {...register('appointmentTime')} />
            {errors.appointmentTime && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mt-3 mb-3">
              Payment Method
            </label>
            <div className="flex gap-4">
              {/* Cash Option */}
              <label className={`flex-1 text-center py-2 rounded-md cursor-pointer transition-colors ${
                watch('paymentMethod') === 'cash' 
                  ? 'bg-yellow-500 text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
              }`}>
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="cash"
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Cash</span>
                </div>
              </label>

              {/* Visa Option */}
              <label className={`flex-1 text-center py-2 rounded-md cursor-pointer transition-colors ${
                watch('paymentMethod') === 'visa' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
              }`}>
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="visa"
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span>Visa</span>
                </div>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
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
                  <p className="mt-2 font-semibold">
                    Payment: {watch('paymentMethod') === 'cash' ? 'Cash at clinic' : 'Online payment'}
                  </p>
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
                    {watch('paymentMethod') === 'visa' ? 'Processing Payment...' : 'Confirming...'}
                  </>
                ) : watch('paymentMethod') === 'visa' ? 'Pay & Confirm' : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}