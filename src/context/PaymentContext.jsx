import React, { createContext, useState } from 'react';

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [appointmentIdCon, setAppointmentIdCon] = useState(null);

    return (
        <PaymentContext.Provider value={{ paymentStatus, setPaymentStatus, appointmentIdCon, setAppointmentIdCon }}>
            {children}
        </PaymentContext.Provider>
    );
}

export default PaymentContext
