import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiCheckCircle, FiEdit3, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../../Contexts/AuthContext";

function InsuranceBox({ name, description, amount, premium, id, onEdit, type }) {
  const { role, token } = useAuth();
  const reduceMotion = useReducedMotion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    dob: "",
    address: "",
    PAN_NUMBER: "",
    policyId: id,
  });

  const handleOpenModal = () => {
    setErrorMsg("");
    setFormData({
      dob: "",
      address: "",
      PAN_NUMBER: "",
      policyId: id,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setErrorMsg("");
    setIsModalOpen(false);
  };

  const handleEditClick = () => {
    setFormData({
      name: name || "",
      description: description || "",
      amount: amount || "",
      premium: premium || "Monthly",
      type: type || "Life",
      policyId: id,
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:9797/policies/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsEditing(false);
        onEdit();
      } else {
        console.error("Failed to update policy");
      }
    } catch (error) {
      console.error("Error updating policy:", error);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!token) {
      setErrorMsg("Please login to apply for a policy.");
      return;
    }
    try {
      const response = await fetch("http://localhost:9797/policyholder/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, policyId: id }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("Application submitted successfully!");
        setIsModalOpen(false);
        setFormData({
          dob: "",
          address: "",
          PAN_NUMBER: "",
          policyId: id,
        });
      } else {
        setErrorMsg(data.message || "Failed to submit policyholder data");
      }
    } catch (error) {
      setErrorMsg("Network error. Please check your connection and try again.");
      console.log("Error submitting policyholder data:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    try {
      const response = await fetch(`http://localhost:9797/policies/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        onEdit();
      } else {
        console.error("Failed to delete policy");
      }
    } catch (error) {
      console.error("Error deleting policy:", error);
    }
  };

  return (
    <>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
        transition={{ duration: 0.4 }}
        className="brand-card relative overflow-hidden p-6"
      >
        {role === "agent" && (
          <div className="absolute right-4 top-4 flex gap-2">
            <button onClick={handleEditClick} className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-line)] bg-[color:var(--color-card)] text-accent transition hover:bg-[color:var(--color-tint)]">
              <FiEdit3 size={16} />
            </button>
            <button onClick={handleDelete} className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-line)] bg-[color:var(--color-card)] text-[color:var(--color-rejected)] transition hover:bg-[color:var(--color-tint)]">
              <FiTrash2 size={16} />
            </button>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-ink">Edit policy</h2>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Policy Name</label>
              <input type="text" name="name" value={formData.name || ""} onChange={handleInputChange} placeholder="Enter policy name" className="brand-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Description</label>
              <textarea name="description" value={formData.description || ""} onChange={handleInputChange} placeholder="Enter policy description" className="brand-input min-h-24" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Coverage Amount (₹)</label>
              <input type="number" name="amount" value={formData.amount || ""} onChange={handleInputChange} placeholder="Enter coverage amount" className="brand-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Premium Cadence</label>
              <select name="premium" value={formData.premium || "Monthly"} onChange={handleInputChange} className="brand-input">
                {['Monthly', 'Quarterly', 'Halfyearly', 'Annually'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Policy Type</label>
              <select name="type" value={formData.type || "Life"} onChange={handleInputChange} className="brand-input">
                {['Life', 'Auto', 'Health', 'Home', 'Travel'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsEditing(false)} className="flex-1 rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm font-semibold text-ink transition hover:bg-[color:var(--color-row-alt)]">
                Cancel
              </button>
              <button onClick={handleUpdate} className="flex-1 rounded-full bg-approved px-4 py-2 text-sm font-semibold text-card transition hover:bg-[color:var(--color-approved)]">
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-label">Featured plan</p>
                <h2 className="mt-1 text-xl font-bold text-ink">{name}</h2>
              </div>
              <span className="type-chip">{type}</span>
            </div>
            <div className="mt-4 rounded-xl bg-[color:var(--color-row-alt)] p-4">
              <p className="font-mono text-2xl font-bold text-accent-deep">₹ {amount}</p>
              <p className="mt-2 text-sm text-muted">Premium cadence · {premium}</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{description}</p>
            <button onClick={handleOpenModal} className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-card transition hover:bg-accent-deep">
              <FiCheckCircle size={16} />
              Apply now
            </button>
          </>
        )}
      </motion.div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-navy)]/70 px-4">
          <div className="brand-card w-full max-w-md p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-label">Application</p>
                <h2 className="text-xl font-bold text-ink">Apply for policy</h2>
              </div>
              <button onClick={handleCloseModal} className="rounded-full border border-[color:var(--color-line)] px-3 py-1 text-sm font-semibold text-muted">
                Close
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {errorMsg && (
                <div className="rounded-[10px] bg-[color:var(--color-rejected)]/10 border border-[color:var(--color-rejected)]/30 p-3 text-sm text-[color:var(--color-rejected)] font-semibold">
                  {errorMsg}
                </div>
              )}
              <label className="block text-sm font-semibold text-ink">Date of birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="brand-input" pattern="\\d{4}-\\d{2}-\\d{2}" />
              <label className="block text-sm font-semibold text-ink">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="brand-input" />
              <label className="block text-sm font-semibold text-ink">PAN card</label>
              <input type="text" name="PAN_NUMBER" value={formData.PAN_NUMBER} onChange={handleInputChange} className="brand-input" />
              <label className="block text-sm font-semibold text-ink">Policy ID</label>
              <input type="text" value={formData.policyId} disabled className="brand-input bg-[color:var(--color-row-alt)]" />
              <button onClick={handleSubmit} className="w-full rounded-full bg-accent px-4 py-2 text-sm font-semibold text-card transition hover:bg-accent-deep">
                Submit application
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InsuranceBox;
