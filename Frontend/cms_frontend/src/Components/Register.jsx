import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function RegisterCard() {
  const navigate = useNavigate(); // Add useNavigate hook

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
      newErrors.email = "* Email must end with @gmail.com";
    }

    const passwordRegex =/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^\\-_])[A-Za-z\d@$!%*?&#^\\-_]{8,16}$/;

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "* Password must have a lowercase, uppercase, number, and special character";
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "* Password length must be between 8 and 16";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "* Passwords do not match";
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
      await axios.post(
        "https://claims-management-system-kkd6.onrender.com/users/",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }
      );

      alert("Registration successful!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "agent",
      });

      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="mg flex justify-center items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-300 shadow-lg shadow-gray-400/50 w-[750px] max-w-full"
      >
        <div className="hidden md:block w-1/2">
          <img
            src="../userlogo123.jpg"
            alt="Register"
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 space-y-5">
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <InputField
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <ErrorMessage message={errors.email} />}

            <InputField
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <ErrorMessage message={errors.password} />}

            <InputField
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <ErrorMessage message={errors.confirmPassword} />
            )}

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 transition"
            >
              <option value="agent">Agent</option>
              <option value="policyholder">Policyholder</option>
              <option value="admin">Admin</option>
            </select>

            {errors.api && <ErrorMessage message={errors.api} />}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const InputField = ({ type, name, placeholder, value, onChange }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-2 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 transition"
  />
);

const ErrorMessage = ({ message }) => (
  <p className="text-red-500 text-sm">{message}</p>
);

export default RegisterCard;
