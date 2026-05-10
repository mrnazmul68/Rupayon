import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaTags,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "../../context/useAuth.js";

const AdminLayout = () => {
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { path: "/admin", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/admin/products", icon: FaBox, label: "Products" },
    { path: "/admin/categories", icon: FaTags, label: "Categories" },
    { path: "/admin/orders", icon: FaShoppingCart, label: "Orders" },
    { path: "/admin/users", icon: FaUsers, label: "Users" },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <>
      <style>{`
        .sidebar-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .sidebar-scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="flex min-h-screen bg-gray-100">
      <aside className={`hidden md:flex ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-900 text-white flex-col fixed h-screen left-0 top-0 z-40 transition-all duration-300`}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {!sidebarCollapsed && <h1 className="text-xl font-bold">Rupayon Admin</h1>}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-gray-300 hover:text-white">
            {sidebarCollapsed ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
          </button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto sidebar-scrollbar-hide">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <Icon size={sidebarCollapsed ? 24 : 16} />
                    {!sidebarCollapsed && item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? 'Return to Home' : ''}
          >
            <FaHome size={sidebarCollapsed ? 24 : 16} />
            {!sidebarCollapsed && 'Return to Home'}
          </Link>
          <button
            onClick={logoutUser}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <FaSignOutAlt size={sidebarCollapsed ? 24 : 16} />
            {!sidebarCollapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex-col z-50 transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">Rupayon Admin</h1>
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto sidebar-scrollbar-hide">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <FaHome />
            Return to Home
          </Link>
          <button
            onClick={() => {
              logoutUser();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <main className={`flex-1 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300`}>
        <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-700 hover:text-gray-900">
              <FaBars size={20} />
            </button>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{user?.email}</span>
          </div>
        </header>
        <div className="p-4 md:p-8 overflow-x-auto">
          <Outlet />
        </div>
      </main>
    </div>
    </>
  );
};


export default AdminLayout;
