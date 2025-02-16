import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="flex items-center space-x-3 transform transition duration-200 group-hover:scale-110">
            <img src="../lumiqai_logo.jpg" className="h-8" alt="LumiqSure Logo" />
            <span className="self-center text-2xl font-semibold text-gray-50 cinzel-decorative-bold">
              LumiqSure
            </span>
          </div>
        </Link>

        <div className="flex items-center md:order-2 space-x-3">
          <div className="relative">
            <button
              onClick={() => {setDropdownOpen(!dropdownOpen);setActive("user")}}
              className="focus:outline-none"
            >
              <img
                className="w-8 h-8 rounded-full transform transition duration-200 hover:scale-110"
                src="../userlogo123.jpg"
                alt="User"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                {isLoggedIn && (
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                )}
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="items-center justify-between hidden md:flex md:w-auto">
          <ul className="flex flex-col font-medium md:space-x-8 md:flex-row">
            <li>
              <Link
                to="/"
                onClick={() => setActive("home")}
                className={`block py-2 px-3 rounded-sm md:p-0 transition ${
                  active === "home"
                    ? "text-white bg-gray-900 md:bg-transparent md:text-white"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setActive("about")}
                className={`block py-2 px-3 rounded-sm md:p-0 transition ${
                  active === "about"
                    ? "text-white bg-gray-900 md:bg-transparent md:text-white"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white"
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/policies"
                onClick={() => setActive("policies")}
                className={`block py-2 px-3 rounded-sm md:p-0 transition ${
                  active === "policies"
                    ? "text-white bg-gray-900 md:bg-transparent md:text-white"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white"
                }`}
              >
                Policies
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
