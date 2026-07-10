import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { FiEdit3, FiSave, FiUser } from "react-icons/fi";

function Dashboard() {
  const { token, setRole, setId, setPHID } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", role: "" });
  const [policyData, setData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const response1 = await fetch("http://localhost:9797/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response1.ok) throw new Error("Failed to fetch user data");
        const data1 = await response1.json();
        setId(data1.id);
        setUser(data1);
        setFormData({ name: data1.name, phone: data1.phone, email: data1.email, role: data1.role });
        setRole(data1.role);

        const response2 = await fetch("http://localhost:9797/policyholder/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response2.ok) throw new Error("Failed to fetch user data");
        const data2 = await response2.json();
        const filteredData = data2.find((item) => item.policyHolderId === data1.id) || {};
        setPHID(filteredData._id);
        setData(filteredData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:9797/users/edit", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update user data");

      const updatedData = await response.json();
      setUser(updatedData);
      if (updatedData.role) setRole(updatedData.role);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!user) return <div className="brand-card p-6 text-center text-muted">Loading profile...</div>;

  return (
    <section className="brand-section">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="section-label">Profile</p>
          <h2 className="text-2xl font-bold text-ink">Your account overview</h2>
        </div>
        <button onClick={isEditing ? handleEdit : () => setIsEditing(true)} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-card transition hover:bg-accent-deep">
          {isEditing ? <FiSave size={16} /> : <FiEdit3 size={16} />}
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="brand-card overflow-hidden p-0">
        <div className="border-b border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] p-6 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-card shadow-[0_8px_18px_rgba(46,107,224,0.24)]">
              <FiUser size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink">{user.name}</h3>
              <p className="text-sm text-muted">{user.role} · {user.phone}</p>
            </div>
          </div>
          <div className="mt-4 rounded-full bg-[color:var(--color-info)] px-4 py-2 text-sm font-semibold text-accent-deep sm:mt-0">
            {user.email}
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] p-4">
            <p className="text-sm font-semibold text-muted">Name</p>
            {isEditing ? <input type="text" name="name" value={formData.name} onChange={handleChange} className="brand-input mt-2" /> : <p className="mt-2 text-base font-semibold text-ink">{user.name}</p>}
          </div>
          <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] p-4">
            <p className="text-sm font-semibold text-muted">Phone</p>
            {isEditing ? <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="brand-input mt-2" /> : <p className="mt-2 text-base font-semibold text-ink">{user.phone}</p>}
          </div>
          <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] p-4">
            <p className="text-sm font-semibold text-muted">Email</p>
            {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} className="brand-input mt-2" /> : <p className="mt-2 text-base font-semibold text-ink">{user.email}</p>}
          </div>
          <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] p-4">
            <p className="text-sm font-semibold text-muted">Role</p>
            {isEditing ? <input type="text" name="role" value={formData.role} onChange={handleChange} className="brand-input mt-2" /> : <p className="mt-2 text-base font-semibold text-ink">{user.role}</p>}
          </div>
          <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] p-4 md:col-span-2">
            <p className="text-sm font-semibold text-muted">Profile details</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted">Date of birth</p>
                <p className="mt-1 font-semibold text-ink">{policyData.dob || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted">PAN number</p>
                <p className="mt-1 font-semibold text-ink">{policyData.PAN_NUMBER || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Address</p>
                <p className="mt-1 font-semibold text-ink">{policyData.address || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;