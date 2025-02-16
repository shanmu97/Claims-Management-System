import { FaCheckCircle, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../../Contexts/AuthContext";
import { useState } from "react";

function Card({ name, description, amount, premium, id, onEdit, type }) {
  const { role, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    dob: "",
    address: "",
    PAN_NUMBER: "",
    policyId: id,
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://claims-management-system-kkd6.onrender.com/policyholder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error submitting policyholder data:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="relative w-72 bg-gray-50 rounded-2xl shadow-xl p-6 space-y-4 border border-gray-200 -mt-16"
    >
      {role === "agent" && (
        <div className="absolute top-2 right-2 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 bg-white border border-blue-500 p-2 rounded-lg shadow hover:bg-blue-600 hover:text-white transition"
          >
            <FaEdit />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => onEdit(id)}
            className="text-red-600 bg-white border border-red-500 p-2 rounded-lg shadow hover:bg-red-600 hover:text-white transition"
          >
            <FaTrash />
          </motion.button>
        </div>
      )}
      <motion.img
        src="https://via.placeholder.com/250x140"
        alt="Insurance"
        className="w-full h-36 object-cover rounded-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      />
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-gray-800">{name}</h2>
        <p className="text-gray-500 font-semibold text-sm">Amount: Rs. {amount}</p>
        <p className="text-gray-500 font-semibold text-sm">Installment: {premium}</p>
        <p className="text-gray-500 font-semibold text-sm">Type: {type}</p>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center w-full bg-red-700 text-white font-medium py-2 rounded-lg transition"
      >
        <FaCheckCircle className="mr-2" />
        Apply Now
      </motion.button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Apply for Policy</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <label className="block">Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
              pattern="\d{4}-\d{2}-\d{2}"
            />
            <label className="block">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block">PAN Card:</label>
            <input
              type="text"
              name="PAN_NUMBER"
              value={formData.PAN_NUMBER}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
            <label className="block">Policy ID:</label>
            <input
              type="text"
              value={formData.policyId}
              disabled
              className="w-full p-2 border rounded mb-2 bg-gray-100"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white p-2 rounded mt-2"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Card;
