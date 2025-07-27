import { useState } from 'react'
import { CreditCard, DollarSign } from 'lucide-react'

export default function   Payment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash')
  const [isProcessing, setIsProcessing] = useState(false)

  const charges = [
    {
      description: "Consultation Fee",
      amount: 150.00
    },
    {
      description: "Medication",
      amount: 50.00
    },
    {
      description: "Service Charge",
      amount: 10.00
    }
  ]

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      id: 'visa',
      name: 'Visa',
      icon: <CreditCard className="w-5 h-5" />
    }
  ]

  const total = charges.reduce((sum, charge) => sum + charge.amount, 0)

  const handlePaymentMethodChange = (methodId) => {
    setSelectedPaymentMethod(methodId)
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert(`Payment of $${total.toFixed(2)} confirmed via ${selectedPaymentMethod === 'cash' ? 'Cash' : 'Visa'}!`)
    }, 2000)
  }

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment</h1>
          <p className="text-gray-600">
            Review your charges and select a payment method.
          </p>
        </div>

        {/* Charges Breakdown */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Charges Breakdown</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {charges.map((charge, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="text-blue-600 font-medium">{charge.description}</span>
                    <div className="text-gray-900 font-semibold mt-1">
                      {formatCurrency(charge.amount)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium text-lg">Total</span>
                  <span className="text-gray-900 font-bold text-xl">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <label className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => handlePaymentMethodChange(method.id)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedPaymentMethod === method.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`${
                      selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {method.icon}
                    </div>
                    <span className="text-gray-900 font-medium">{method.name}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Confirm Payment Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>

        {/* Payment Summary */}
        {selectedPaymentMethod && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="text-blue-600">
                {paymentMethods.find(method => method.id === selectedPaymentMethod)?.icon}
              </div>
              <span className="text-blue-800 font-medium">
                Selected: {paymentMethods.find(method => method.id === selectedPaymentMethod)?.name}
              </span>
            </div>
            <p className="text-blue-700 text-sm mt-2">
              Total amount: {formatCurrency(total)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}