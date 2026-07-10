import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiCheckCircle, FiEdit3, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../../Contexts/AuthContext";

function InsuranceBox({ name, description, amount, premium, id, onEdit, type }) {
  const { role, token } = useAuth();
  const reduceMotion = useReducedMotion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    dob: "",
    address: "",
    PAN_NUMBER: "",
    policyId: id,
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://claims-management-system-kkd6.onrender.com/policies/edit/${id}`, {
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
    try {
      const response = await fetch("https://claims-management-system-kkd6.onrender.com/policyholder/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, policyId: id }),
      });
      if (response.ok) {
        setIsModalOpen(false);
      } else {
        console.error("Failed to submit policyholder data");
      }
    } catch (error) {
      console.log("Error submitting policyholder data:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    try {
      const response = await fetch(`https://claims-management-system-kkd6.onrender.com/policies/delete/${id}`, {
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
            <button onClick={() => setIsEditing((prev) => !prev)} className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-line)] bg-[color:var(--color-card)] text-accent transition hover:bg-[color:var(--color-tint)]">
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
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="brand-input" />
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="brand-input min-h-24" />
            <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} className="brand-input" />
            <select name="premium" value={formData.premium} onChange={handleInputChange} className="brand-input">
              {['Monthly', 'Quarterly', 'Halfyearly', 'Annually'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select name="type" value={formData.type} onChange={handleInputChange} className="brand-input">
              {['Life', 'Auto', 'Health', 'Home', 'Travel'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
            <button onClick={() => setIsModalOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-card transition hover:bg-accent-deep">
              <FiCheckCircle size={16} />
              Apply now
            </button>
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-navy)]/70 px-4">
            <div className="brand-card w-full max-w-md p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-label">Application</p>
                  <h2 className="text-xl font-bold text-ink">Apply for policy</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full border border-[color:var(--color-line)] px-3 py-1 text-sm font-semibold text-muted">
                  Close
                </button>
              </div>
              <div className="mt-5 space-y-3">
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
      </motion.div>
    </>
  );
}

export default InsuranceBox;
