import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLock, FiPhone, FiUser } from "react-icons/fi";
import "../App.css";

function RegisterCard() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "agent",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email.endsWith("@gmail.com")) {
      newErrors.email = "Email must end with @gmail.com";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^\\-_])[A-Za-z\d@$!%*?&#^\\-_]{8,16}$/;

    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must have a lowercase, uppercase, number, and special character";
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "Password length must be between 8 and 16";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:9797/users/", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      alert("Registration successful!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "agent",
      });

      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-12">
      <motion.div initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }} className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-[color:var(--color-line)] bg-card shadow-[var(--shadow-card)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="brand-panel relative hidden p-8 text-card lg:flex lg:flex-col lg:justify-between">
          <div className="ambient-ring left-8 top-8 h-32 w-32" />
          <div className="ambient-ring bottom-8 right-8 h-40 w-40" />
          <div className="brand-shell">
            <div className="inline-flex rounded-full border border-[color:var(--color-ice)]/40 bg-[color:var(--color-card)]/10 px-4 py-2 text-sm font-bold text-[color:var(--color-ice)]">
              Create account
            </div>
            <h1 className="mt-6 text-3xl font-bold text-card">Join ClaimsMS</h1>
            <p className="mt-3 max-w-sm text-base leading-7 text-[color:var(--color-ice)]">Register once to start overseeing policies, submissions, and claim updates in one place.</p>
          </div>
          <div className="brand-shell rounded-[1rem] border border-[color:var(--color-ice)]/20 bg-[color:var(--color-card)]/10 p-4 text-sm text-[color:var(--color-ice)]">Your details stay secure and are used only for account access.</div>
        </div>

        <div className="p-7 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="icon-chip">
              <FiUser size={18} />
            </div>
            <div>
              <p className="section-label">Account setup</p>
              <h2 className="text-2xl font-bold text-ink">Register</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <InputField type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} />
            <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && <ErrorMessage message={errors.email} />}
            <InputField type="tel" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} />
            <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            {errors.password && <ErrorMessage message={errors.password} />}
            <InputField type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}

            <select name="role" value={formData.role} onChange={handleChange} className="brand-input">
              <option value="agent">Agent</option>
              <option value="policyholder">Policyholder</option>
              <option value="admin">Admin</option>
            </select>

            {errors.api && <ErrorMessage message={errors.api} />}

            <motion.button whileHover={reduceMotion ? undefined : { scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-card transition hover:bg-accent-deep disabled:opacity-60">
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent-deep hover:text-accent">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const InputField = ({ type, name, placeholder, value, onChange }) => {
  const icons = {
    name: <FiUser size={16} className="text-muted" />,
    email: <FiUser size={16} className="text-muted" />,
    phone: <FiPhone size={16} className="text-muted" />,
    password: <FiLock size={16} className="text-muted" />,
    confirmPassword: <FiLock size={16} className="text-muted" />,
  };

  return (
    <div className="flex items-center gap-2 rounded-[0.9rem] border border-[color:var(--color-line)] bg-[color:var(--color-row-alt)] px-3 py-2">
      {icons[name]}
      <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className="w-full border-0 bg-transparent text-ink outline-none placeholder:text-muted" />
    </div>
  );
};

const ErrorMessage = ({ message }) => <p className="mt-2 text-sm text-[color:var(--color-rejected)]">{message}</p>;

export default RegisterCard;
