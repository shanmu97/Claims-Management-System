import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import "../App.css";

function LoginCard() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
        const response = await fetch(
          "https://claims-management-system-kkd6.onrender.com/users/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        const data = await response.json();
        login(data.token,data.role);
        navigate("/profile");
      } catch (error) {
        setApiError(error.message);
      }
    }
  };

  return (
    <div className="mg flex justify-center items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex bg-white rounded-2xl border border-gray-300 shadow-lg shadow-gray-400/50 w-[750px] max-w-full"
      >
        <div className="w-1/2">
          <img
            src="/userlogo123.jpg"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-1/2 p-8 space-y-5">
          <h2 className="text-xl font-bold text-gray-800 text-center">Login</h2>

          {apiError && <ErrorMessage message={apiError} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <ErrorMessage message={errors.email} />}

            <InputField
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <ErrorMessage message={errors.password} />}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Login
            </motion.button>
          </form>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
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

export default LoginCard;
