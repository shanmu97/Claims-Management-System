import React, { useState, useEffect } from "react";
import { usePolicy } from "../../Contexts/PoliciesContext";
import { FaPlus, FaEdit } from "react-icons/fa";
import { useAuth } from "../../Contexts/AuthContext";

function MyClaims() {
  const { policies } = usePolicy();
  const { token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClaimId, setEditingClaimId] = useState(null);

  const [formData, setFormData] = useState({
    status: "Applied",
    claimAmount: "",
    appliedDate: "",
    reasonForClaim: "Medical",
    policyId: "",
  });

  useEffect(() => {
    if (policies.length > 0) {
      setFormData((prev) => ({ ...prev, policyId: policies[0]._id }));
    }
  }, [policies]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch(
          "https://claims-management-system-kkd6.onrender.com/claims/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch claims");
        }

        const data = await response.json();
        setClaims(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchClaims();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const url = isEditing
        ? `https://claims-management-system-kkd6.onrender.com/claims/${editingClaimId}`
        : "https://claims-management-system-kkd6.onrender.com/claims/";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update claim" : "Failed to submit claim");
      }

      const updatedClaim = await response.json();

      if (isEditing) {
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim._id === editingClaimId ? updatedClaim : claim
          )
        );
      } else {
        setClaims([...claims, updatedClaim]);
      }

      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (claim) => {
    setIsEditing(true);
    setEditingClaimId(claim._id);
    setFormData({
      status: claim.status,
      claimAmount: claim.claimAmount,
      appliedDate: claim.appliedDate,
      reasonForClaim: claim.reasonForClaim,
      policyId: claim.policyId,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingClaimId(null);
    setFormData({
      status: "Applied",
      claimAmount: "",
      appliedDate: "",
      reasonForClaim: "Medical",
      policyId: policies.length > 0 ? policies[0]._id : "",
    });
  };

  return (
    <div className="px-4 mt-4">
      <h1 className="font-bold text-3xl text-gray-800 text-center">
        My Claims
        <button
          style={{ backgroundColor: "#c52929" }}
          className="text-white rounded-full mx-1 p-2"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          <FaPlus size={12} />
        </button>
      </h1>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg shadow-md max-w-md mx-auto">
          <div className="grid grid-cols-1 gap-4">
            <label>
              Status:
              <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Applied">Applied</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>

            <label>
              Claim Amount:
              <input
                type="number"
                name="claimAmount"
                value={formData.claimAmount}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </label>

            <label>
              Applied Date:
              <input
                type="date"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </label>

            <label>
              Reason for Claim:
              <select name="reasonForClaim" value={formData.reasonForClaim} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Medical">Medical</option>
                <option value="Accident">Accident</option>
                <option value="Theft">Theft</option>
                <option value="Natural Disaster">Natural Disaster</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Policy:
              <select name="policyId" value={formData.policyId} onChange={handleChange} className="w-full p-2 border rounded">
                {policies.map((policy) => (
                  <option key={policy._id} value={policy._id}>
                    {policy.name}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="bg-green-600 text-white p-2 rounded-lg">
              {isEditing ? "Update Claim" : "Submit Claim"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {claims.length > 0 && (
        <table className="mt-6 w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
            <th className="border p-2">S.No</th>
               <th className="border p-2">Policy Name</th> 
              <th className="border p-2">Status</th>
              <th className="border p-2">Claim Amount</th>
              <th className="border p-2">Applied Date</th>
              <th className="border p-2">Reason</th>
              
              <th className="border p-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, index) => (
              <tr key={index} className="text-center">
                 <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{policies.find((p) => p._id === claim.policyId)?.name || "Unknown"}</td>
                <td className="border p-2">{claim.status}</td>
                <td className="border p-2">{claim.claimAmount}</td>
                <td className="border p-2">{claim.appliedDate}</td>
                <td className="border p-2">{claim.reasonForClaim}</td>
                
                <td className="border p-2">
                  <button style={{color:"#c52929"}}className="text-black" onClick={() => handleEdit(claim)}>
                    <FaEdit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyClaims;
