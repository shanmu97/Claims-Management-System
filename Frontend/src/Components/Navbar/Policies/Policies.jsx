import { useEffect, useState } from "react";
import axios from "axios";
import { FiFilePlus } from "react-icons/fi";
import { useAuth } from "../../../Contexts/AuthContext";
import Card from "./Card";

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
      const res = await axios.get("http://localhost:9797/policies/");
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
      await axios.post("http://localhost:9797/policies/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setShowForm(false);
      fetchPolicies();
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err);
    }
  };

  return (
    <div className="brand-page px-4 py-8 sm:px-6 lg:px-8">
      <div className="brand-section">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Insurance plans</p>
            <h1 className="text-3xl font-bold text-ink">Choose a plan that fits your needs</h1>
            <p className="mt-2 text-sm font-semibold text-accent-deep">Transparent coverage, flexible premiums, and guided claims support.</p>
          </div>
          {isLoggedIn && role === "agent" && (
            <button onClick={() => setShowForm((prev) => !prev)} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-card transition hover:bg-accent-deep">
              <FiFilePlus size={16} />
              Add Policy
            </button>
          )}
        </div>

        {showForm && (
          <div className="mt-6 flex justify-end">
            <form onSubmit={handleSubmit} className="brand-card w-full max-w-xl p-6">
              <h2 className="text-xl font-bold text-ink">Add Policy</h2>
              <div className="mt-4 grid gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Policy name" className="brand-input" required />
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Coverage amount" className="brand-input" required />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="brand-input min-h-24" required />
                <select name="type" value={formData.type} onChange={handleChange} className="brand-input" required>
                  {['Life', 'Auto', 'Health', 'Home', 'Travel'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <select name="premium" value={formData.premium} onChange={handleChange} className="brand-input" required>
                  {['Monthly', 'Quarterly', 'Halfyearly', 'Annually'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm font-semibold text-ink transition hover:bg-[color:var(--color-row-alt)]">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-card transition hover:bg-accent-deep">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {policies.map((policy) => (
            <Card id={policy._id} key={policy._id} isVisible={showCards} name={policy.name} description={policy.description} amount={policy.amount} premium={policy.premium} type={policy.type} onEdit={fetchPolicies} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Policies;
