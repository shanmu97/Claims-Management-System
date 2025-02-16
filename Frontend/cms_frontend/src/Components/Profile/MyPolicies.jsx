import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { FaEdit } from "react-icons/fa";

function MyPolicies() {
  const [policies, setPolicies] = useState([]);
  const { token, role, phId } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    dob: "",
    address: "",
    PAN_NUMBER: "",
  });

  useEffect(() => {
    fetchPolicies();
  }, [token]);

  const fetchPolicies = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://claims-management-system-kkd6.onrender.com/policyholder/policies",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unauthorized or failed to fetch policies");
      }

      const data = await response.json();
      setPolicies(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditClick = (policy) => {
    setEditData({
      dob: policy.dob || "",
      address: policy.address || "",
      PAN_NUMBER: policy.PAN_NUMBER || "",
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://claims-management-system-kkd6.onrender.com/policyholder/${phId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      if (!response.ok) {
        console.log("Failed to update policy");
        return;
      }

      setShowEditModal(false);
      fetchPolicies();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-center font-bold text-3xl mt-4 text-gray-800">
        My Policies
      </h1>
      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 w-20">S. No</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Premium</th>
              {role !== "policyholder" && <th className="border border-gray-300 p-2 w-16">Edit</th>}
            </tr>
          </thead>
          <tbody>
            {policies.length > 0 ? (
              policies.map((policy, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2 w-20">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{policy.name}</td>
                  <td className="border border-gray-300 p-2">{policy.type}</td>
                  <td className="border border-gray-300 p-2">{policy.amount}</td>
                  <td className="border border-gray-300 p-2">{policy.premium}</td>
                  {role !== "policyholder" && (
                    <td className="border border-gray-300 p-2">
                      <button className="m-2 p-2 rounded-full" onClick={() => handleEditClick(policy)}>
                        <FaEdit />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role !== "policyholder" ? "6" : "5"} className="border border-gray-300 p-4 text-center">
                  No policies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Policy Details</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">Date of Birth (YYYY-MM-DD)</label>
              <input
                type="date"
                name="dob"
                value={editData.dob}
                onChange={handleChange}
                className="w-full border p-2 mb-2 rounded"
                required
              />

              <label className="block mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={editData.address}
                onChange={handleChange}
                className="w-full border p-2 mb-2 rounded"
                required
              />

              <label className="block mb-2">PAN Card</label>
              <input
                type="text"
                name="PAN_NUMBER"
                value={editData.PAN_NUMBER}
                onChange={handleChange}
                className="w-full border p-2 mb-4 rounded"
                required
              />

              <div className="flex justify-end gap-2">
                <button type="button" className="bg-gray-400 text-white p-2 rounded" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPolicies;
