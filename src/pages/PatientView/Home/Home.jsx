
import { Stethoscope, Heart, Pill, Cross } from 'lucide-react'
import { AuthContext } from './../../../context/Authcontext';
import img from "../../../assets/heroSec.jpg"
import docImg from "../../../assets/doctorImg.jpg"
import { useContext } from 'react';

export default function Home() {
    const services = [
  {
    icon: 'Stethoscope',
    title: "General Consultation",
  },
  {
    icon: 'Heart',
    title: "Cardiology",  
  },
  {
    icon: 'Pill',
    title: "Pharmacy",
  },
  {
    icon: 'Cross',
    title: "First Aid",
  }
]
  const getIcon = (iconName) => {
    const icons = {
      Stethoscope: <Stethoscope className="w-6 h-6" />,
      Heart: <Heart className="w-6 h-6" />,
      Pill: <Pill className="w-6 h-6" />,
      Cross: <Cross className="w-6 h-6" />
    }
    return icons[iconName]
  }
  const { user, role } = useContext(AuthContext);
  console.log(user, role);
  
  
  
  return (
    <div className="min-h-screen bg-gray-50 px-15 pt-5">   
      <section className="relative max-w-6xl h-96 md:h-[500px] overflow-hidden rounded-3xl mx-auto mt-6">
        <div 
          className="absolute z-10 inset-0 bg-cover bg-start"
          style={{
            backgroundImage:`url(${img})`
          }}
        >
          <div className="absolute inset-0 bg-opacity-40"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-lg md:text-xl text-white opacity-90 max-w-2xl mx-auto">
              Welcome to Dr. Bennett's Clinic, where we provide personalized healthcare. Book your appointment 
              and take the first step towards a healthier you.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-teal-600">
                  {getIcon(service.icon)}
                </div>
                <h3 className="font-semibold text-gray-900">{service.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 ">Meet Dr. Bennett</h2>
        <div className=" rounded-2xl p-8">
          <div className="flex flex-col items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex-1">
              <p className="text-black font-[lexend] text-lg leading-relaxed mb-6">
                Dr. Bennett is a board-certified orthopedic surgeon specializing in sports medicine and joint replacement. 
                With over 15 years of experience, Dr. Bennett is dedicated to providing compassionate care and helping 
                patients regain their mobility and live pain-free. Welcome to our practice, where your health and 
                well-being are our top priority.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-45 h-45  rounded-full overflow-hidden mb-4">
                <img 
                  src={docImg} 
                  alt="Dr. Bennett"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Dr. Bennett</h3>
              <p className="text-teal-600 font-medium">General Practitioner</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}