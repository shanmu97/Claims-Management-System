import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiList, FiUser } from "react-icons/fi";
import { useAuth } from "../../Contexts/AuthContext";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/about")) setActive("about");
    else if (path.startsWith("/policies")) setActive("policies");
    else if (path.startsWith("/profile")) setActive("profile");
    else setActive("home");
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const links = [
    { key: "home", label: "Home", to: "/" },
    { key: "about", label: "About", to: "/about" },
    { key: "policies", label: "Policies", to: "/policies" },
    { key: "profile", label: "Profile", to: "/profile" },
  ];

  return (
    <nav className="border-b border-[color:var(--color-line)] bg-navy text-ice">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-base font-bold text-card shadow-[0_8px_18px_rgba(46,107,224,0.24)]">
            C
          </div>
          <span className="text-xl font-bold tracking-wide text-card">
            Claims<span className="text-accent">MS</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <Link
                key={link.key}
                to={link.to}
                onClick={() => setActive(link.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active === link.key
                    ? "bg-accent text-card"
                    : "text-ice hover:bg-[color:var(--color-tint)] hover:text-card"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-ice-dim)] bg-[color:var(--color-card)]/10 text-card transition hover:bg-[color:var(--color-card)]/20"
              >
                <FiUser size={18} />
              </button>
            ) : (
              <Link to="/login" className="rounded-full border border-[color:var(--color-ice-dim)] px-4 py-2 text-sm font-semibold text-card transition hover:bg-[color:var(--color-card)]/10">
                Login
              </Link>
            )}

            {!isLoggedIn && (
              <Link to="/register" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-card transition hover:bg-accent-deep">
                Register
              </Link>
            )}

            {isLoggedIn && (
              <button onClick={handleLogout} className="rounded-full border border-[color:var(--color-ice-dim)] px-4 py-2 text-sm font-semibold text-card transition hover:bg-[color:var(--color-card)]/10">
                Logout
              </button>
            )}

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-ice-dim)] text-card md:hidden"
            >
              <FiList size={18} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="w-full border-t border-[color:var(--color-line)]/40 pt-3 md:hidden">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.key}
                  to={link.to}
                  onClick={() => {
                    setActive(link.key);
                    setMobileOpen(false);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active === link.key ? "bg-accent text-card" : "text-ice"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
