import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { FiEdit3 } from "react-icons/fi";

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
      const response = await fetch("https://claims-management-system-kkd6.onrender.com/policyholder/policies", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
      const response = await fetch(`https://claims-management-system-kkd6.onrender.com/policyholder/${phId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

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
    <section className="brand-section">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="section-label">My policies</p>
          <h2 className="text-2xl font-bold text-ink">Your active coverage</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {policies.length > 0 ? (
          policies.map((policy, index) => (
            <div key={index} className="brand-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label">Policy {index + 1}</p>
                  <h3 className="mt-1 text-lg font-bold text-ink">{policy.name}</h3>
                </div>
                <span className="type-chip">{policy.type}</span>
              </div>
              <div className="mt-4 rounded-xl bg-[color:var(--color-row-alt)] p-4">
                <p className="font-mono text-lg font-bold text-accent-deep">₹ {policy.amount}</p>
                <p className="mt-1 text-sm text-muted">{policy.premium}</p>
              </div>
              {role !== "policyholder" && (
                <button onClick={() => handleEditClick(policy)} className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm font-semibold text-ink transition hover:bg-[color:var(--color-row-alt)]">
                  <FiEdit3 size={15} />
                  Edit KYC
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="brand-card p-6 text-muted md:col-span-2">No policies found</div>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-navy)]/70 px-4">
          <div className="brand-card w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-ink">Edit policy details</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input type="date" name="dob" value={editData.dob} onChange={handleChange} className="brand-input" required />
              <input type="text" name="address" value={editData.address} onChange={handleChange} className="brand-input" required />
              <input type="text" name="PAN_NUMBER" value={editData.PAN_NUMBER} onChange={handleChange} className="brand-input" required />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm font-semibold text-ink" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-card transition hover:bg-accent-deep">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyPolicies;
