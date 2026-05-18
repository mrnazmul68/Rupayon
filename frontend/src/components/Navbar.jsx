import { useState, useRef, useEffect } from "react";
import { FiShoppingCart, FiUser, FiPackage, FiLogOut, FiSettings } from "react-icons/fi";
import { FaTachometerAlt } from "react-icons/fa";
import navItems from "../assets/data/navItems";
import logo from "../assets/images/logo.png";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/useCart.js";
import { useAuth } from "../context/useAuth.js";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, dbUser, logoutUser } = useAuth();
  const dropdownRef = useRef(null);

  const profileInitial =
    user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U";
  const isAdmin = dbUser?.role === "admin";
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full md:px-16 bg-navbg text-navtext border border-border shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 h-14 flex items-center justify-between">
        <Link to={"/"}>
          <div className="h-12 w-12 border-2 border-navtext rounded-2xl overflow-hidden">
            <img src={logo} alt="Rupayon" />
          </div>
        </Link>

        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-navtext"
                    : "hover:text-[#8B7355] transition"
                }
                to={item.path}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "text-red-700 relative" : "text-gray-600 relative"
            }
          >
            <FiShoppingCart className="text-xl cursor-pointer hover:text-[#8B7355]" />

            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </NavLink>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="h-9 w-9 rounded-full overflow-hidden border border-navtext flex items-center justify-center bg-white text-sm font-semibold uppercase hover:opacity-80 transition"
                title={user.displayName || user.email || "Profile"}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Profile"}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  profileInitial
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <FiUser className="text-gray-500" />
                    My Profile
                  </Link>

                  <Link
                    to="/profile/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <FiPackage className="text-gray-500" />
                    My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FaTachometerAlt className="text-gray-500" />
                      Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={() => {
                      logoutUser();
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
                  >
                    <FiLogOut className="text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="px-3 py-1 border border-navtext rounded-md text-sm hover:bg-navtext hover:text-white transition">
                <Link to={"/login"}>Login</Link>
              </button>
              <button className="px-3 py-1 border border-navtext rounded-md text-sm bg-navtext text-white hover:bg-white hover:text-navtext transition">
                <Link to={"/sign-up"}>Sign Up</Link>
              </button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "text-red-700 relative" : "text-gray-600 relative"
            }
          >
            <FiShoppingCart className="text-xl cursor-pointer hover:text-[#8B7355]" />

            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </NavLink>
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col gap-1"
          >
            <span className="w-6 h-0.5 bg-gray-800"></span>
            <span className="w-6 h-0.5 bg-gray-800"></span>
            <span className="w-6 h-0.5 bg-gray-800"></span>
          </button>
        </div>
      </div>

      {open && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/40 z-40"
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-white z-50 shadow-xl transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 flex flex-col gap-6">
          <button onClick={closeMenu} className="self-end text-2xl">
            x
          </button>

          <ul className="flex flex-col gap-4 text-gray-700">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "border-b-2 border-navtext"
                      : "hover:text-[#8B7355] transition"
                  }
                  to={item.path}
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 mt-6">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <FiUser className="text-gray-500" />
                  My Profile
                </Link>
                
                <Link
                  to="/profile/orders"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <FiPackage className="text-gray-500" />
                  My Orders
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <FaTachometerAlt className="text-gray-500" />
                    Admin Panel
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    logoutUser();
                    closeMenu();
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <FiLogOut className="text-red-500" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="border border-gray-400 py-2 rounded-md">
                  <Link to={"/login"} onClick={closeMenu}>
                    Login
                  </Link>
                </button>
                <button className="bg-[#8B7355] text-white py-2 rounded-md">
                  <Link to={"/sign-up"} onClick={closeMenu}>
                    Sign Up
                  </Link>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
