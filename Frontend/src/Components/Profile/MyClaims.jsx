import React, { useState, useEffect } from "react";
import { usePolicy } from "../../Contexts/PoliciesContext";
import { FiEdit3, FiFilePlus } from "react-icons/fi";
import { useAuth } from "../../Contexts/AuthContext";

function StatusBadge({ status }) {
  const map = {
    Applied: "bg-applied",
    Pending: "bg-pending",
    Approved: "bg-approved",
    Rejected: "bg-rejected",
  };

  return <span className={`status-badge ${map[status] || "bg-accent"}`}>{status}</span>;
}

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
        const response = await fetch("https://claims-management-system-kkd6.onrender.com/claims/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
      const url = isEditing ? `https://claims-management-system-kkd6.onrender.com/claims/${editingClaimId}` : "https://claims-management-system-kkd6.onrender.com/claims/";
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
        setClaims((prevClaims) => prevClaims.map((claim) => (claim._id === editingClaimId ? updatedClaim : claim)));
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
    <section className="brand-section">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="section-label">My claims</p>
          <h2 className="text-2xl font-bold text-ink">Claim history and updates</h2>
        </div>
        <button onClick={() => { resetForm(); setShowForm((prev) => !prev); }} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-card transition hover:bg-accent-deep">
          <FiFilePlus size={16} />
          File a claim
        </button>
      </div>

      {showForm && (
        <div className="brand-card mb-6 p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-ink">
              Status
              <select name="status" value={formData.status} onChange={handleChange} className="brand-input mt-2">
                <option value="Applied">Applied</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-ink">
              Claim amount
              <input type="number" name="claimAmount" value={formData.claimAmount} onChange={handleChange} className="brand-input mt-2" required />
            </label>

            <label className="text-sm font-semibold text-ink">
              Applied date
              <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleChange} className="brand-input mt-2" required />
            </label>

            <label className="text-sm font-semibold text-ink">
              Reason
              <select name="reasonForClaim" value={formData.reasonForClaim} onChange={handleChange} className="brand-input mt-2">
                <option value="Medical">Medical</option>
                <option value="Accident">Accident</option>
                <option value="Theft">Theft</option>
                <option value="Natural Disaster">Natural Disaster</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-ink md:col-span-2">
              Policy
              <select name="policyId" value={formData.policyId} onChange={handleChange} className="brand-input mt-2">
                {policies.map((policy) => (
                  <option key={policy._id} value={policy._id}>
                    {policy.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm font-semibold text-ink">
                Cancel
              </button>
              <button type="submit" className="rounded-full bg-approved px-4 py-2 text-sm font-semibold text-card transition hover:bg-[color:var(--color-approved)]">
                {isEditing ? "Update claim" : "Submit claim"}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div className="mb-4 error-strip">{error}</div>}

      <div className="brand-card overflow-hidden">
        {claims.length > 0 ? (
          <div className="divide-y divide-[color:var(--color-line)]">
            {claims.map((claim, index) => (
              <div key={index} className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${index % 2 === 1 ? "bg-[color:var(--color-row-alt)]" : "bg-card"}`}>
                <div>
                  <p className="text-sm font-semibold text-muted">Claim #{index + 1}</p>
                  <p className="text-base font-bold text-ink">{policies.find((p) => p._id === claim.policyId)?.name || "Unknown"}</p>
                  <p className="mt-1 text-sm text-muted">{claim.reasonForClaim} · {claim.appliedDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm font-bold text-accent-deep">₹ {claim.claimAmount}</p>
                  <StatusBadge status={claim.status} />
                  <button onClick={() => handleEdit(claim)} className="rounded-full border border-[color:var(--color-line)] p-2 text-accent transition hover:bg-[color:var(--color-tint)]">
                    <FiEdit3 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted">No claims found</div>
        )}
      </div>
    </section>
  );
}

export default MyClaims;
