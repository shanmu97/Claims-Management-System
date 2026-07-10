import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "../Contexts/AuthContext";
import "../App.css";

function LoginCard() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.email.endsWith("@gmail.com")) {
      newErrors.email = "Email must end with @gmail.com";
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "Password must be 8-16 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (validate()) {
      try {
        const response = await fetch("https://claims-management-system-kkd6.onrender.com/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        const data = await response.json();
        login(data.token, data.role);
        navigate("/profile");
      } catch (error) {
        setApiError(error.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-[color:var(--color-line)] bg-card shadow-[var(--shadow-card)] lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="brand-panel relative hidden p-8 text-card lg:flex lg:flex-col lg:justify-between">
          <div className="ambient-ring left-10 top-10 h-32 w-32" />
          <div className="ambient-ring bottom-8 right-8 h-40 w-40" />
          <div className="brand-shell">
            <div className="inline-flex rounded-full border border-[color:var(--color-ice)]/40 bg-[color:var(--color-card)]/10 px-4 py-2 text-sm font-bold text-[color:var(--color-ice)]">
              Secure access
            </div>
            <h1 className="mt-6 text-3xl font-bold text-card">Claims Management System</h1>
            <p className="mt-3 max-w-sm text-base leading-7 text-[color:var(--color-ice)]">
              Sign in to manage your policies, review claims, and stay on top of every update.
            </p>
          </div>
          <div className="brand-shell rounded-[1rem] border border-[color:var(--color-ice)]/20 bg-[color:var(--color-card)]/10 p-4 text-sm text-[color:var(--color-ice)]">
            Use your registered email and password to continue.
          </div>
        </div>

        <div className="p-7 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="icon-chip">
              <FiUser size={18} />
            </div>
            <div>
              <p className="section-label">Welcome back</p>
              <h2 className="text-2xl font-bold text-ink">Login</h2>
            </div>
          </div>

          {apiError && <div className="mt-5 error-strip">{apiError}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">Email</label>
              <InputField type="email" name="email" placeholder="you@gmail.com" value={formData.email} onChange={handleChange} />
              {errors.email && <ErrorMessage message={errors.email} />}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">Password</label>
              <InputField type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
              {errors.password && <ErrorMessage message={errors.password} />}
            </div>

            <motion.button whileHover={reduceMotion ? undefined : { scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-card transition hover:bg-accent-deep">
              Login
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-accent-deep hover:text-accent">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const InputField = ({ type, name, placeholder, value, onChange }) => (
  <div className="flex items-center gap-2 rounded-[0.9rem] border border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] px-3 py-2">
    {name === "email" ? <FiUser size={16} className="text-muted" /> : <FiLock size={16} className="text-muted" />}
    <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className="w-full border-0 bg-transparent text-ink outline-none placeholder:text-muted" />
  </div>
);

const ErrorMessage = ({ message }) => <p className="mt-2 text-sm text-[color:var(--color-rejected)]">{message}</p>;

export default LoginCard;
