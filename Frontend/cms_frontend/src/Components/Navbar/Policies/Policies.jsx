import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../../../Contexts/AuthContext";

function Policies() {
  const { role, isLoggedIn, token } = useAuth();
  const [showCards, setShowCards] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    type: "Life",
    premium: "Monthly",
  });

  useEffect(() => {
    setShowCards(true);
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get(
        "https://claims-management-system-kkd6.onrender.com/policies/"
      );
      setPolicies(res.data.policies);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      "https://claims-management-system-kkd6.onrender.com/policies/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response from API:", res.data); // Debugging
    setShowForm(false);
    fetchPolicies();
  } catch (err) {
    console.error("Error submitting form:", err.response?.data || err);
  }
};


  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-4"
      style={{ backgroundImage: "url('home-background.jpg')" }}
    >
    <div className="relative p-4">
      {isLoggedIn && role === "agent" && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="absolute top-2 right-2 p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg transition"
        >
          <FaPlus size={24} />
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="absolute z-40 top-12 right-2 bg-white p-4 shadow-lg rounded-lg w-96"
        >
          <h2 className="text-lg font-semibold mb-2">Add Policy</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-2 mb-2 rounded"
            required
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full border p-2 mb-2 rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 mb-2 rounded"
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
            required
          >
            {["Life", "Auto", "Health", "Home", "Travel"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            name="premium"
            value={formData.premium}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
            required
          >
            {["Monthly", "Quarterly", "Halfyearly", "Annually"].map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            onSubmit={handleSubmit}
          >
            Submit
          </button>
        </form>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {policies.map((policy) => (
          <Card
            id={policy._id}
            key={policy._id}
            isVisible={showCards}
            name={policy.name}
            description={policy.description}
            amount={policy.amount}
            premium={policy.premium}
            type={policy.type}
            onEdit={fetchPolicies}
          />
        ))}
      </div>
    </div>
    </div>
  );
}

export default Policies;
