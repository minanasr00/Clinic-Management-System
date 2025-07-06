import React, { useState } from "react";
import doctorImg from "../../assets/doctor-side.png";

const MeasurementsForm = () => {
  const [formData, setFormData] = useState({
    ID: "",
    Name: "",
    weight: "",
    height: "",
    bloodPressure: "",
    temperature: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Measurements saved!");
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex w-full max-w-6xl h-[650px]">
        {/* Left - Form */}
        <div className="w-1/2 flex items-center justify-center mt-5">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-4"
          >
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Patient Measurements
            </h2>

            <div>
              <label className="block text-gray-700 mb-1"> Patient ID</label>
              <input
                type="number"
                name="ID"
                value={formData.ID}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter ID"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter Name"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter weight"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter height"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Blood Pressure</label>
              <input
                type="text"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. 120/80"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter temperature"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-950 mb-5"
            >
              Save Measurements
            </button>
          </form>
        </div>

        {/* Right - Image */}
        <div className="w-1/2">
          <img
            src={doctorImg}
            alt="Medical Illustration"
            className="w-full  object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default MeasurementsForm;
