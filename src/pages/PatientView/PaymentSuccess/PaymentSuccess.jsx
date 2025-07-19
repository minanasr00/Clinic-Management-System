// src/pages/PaymentSuccess.jsx
import {  useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase/config';
import PaymentContext from '../../../context/PaymentContext';



export default function PaymentSuccess() {
    const navigate = useNavigate();
    const appointmentIdCon = localStorage.getItem('appointmentId');
    console.log("PaymentSuccess component rendered with appointmentId:", appointmentIdCon);

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!appointmentIdCon) return;

      try {
        const appointmentRef = doc(db, 'appointments', appointmentIdCon);
        await updateDoc(appointmentRef, {
          payment_status: 'paid',
          paid_at: new Date()
        });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          localStorage.removeItem('appointmentId');
          navigate('/patient/Book Appointment');
        }, 3000);
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    };

    updatePaymentStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your appointment has been confirmed. You'll be redirected shortly.
        </p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}