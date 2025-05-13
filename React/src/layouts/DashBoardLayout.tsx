import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink } from "react-router-dom";

const AdminDashboardLayout = () => {
  const [viewProfileBox, setViewProfileBox] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar visible by default
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = useRef<HTMLDivElement>(null);

  const toggleProfileBox = () => setViewProfileBox((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profile.current && !profile.current.contains(event.target as Node)) {
        setViewProfileBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Backdrop (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-xl`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold truncate">Admin Dashboard</h2>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none text-2xl"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {[
              { to: "/admin/dashboard", label: "Dashboard" },
              { to: "/admin/users", label: "Users" },
              { to: "/admin/categories", label: "Categories" },
              { to: "/admin/settings", label: "Settings" },
            ].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-gray-700 transition ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={`fixed top-2 left-0 ${
            sidebarOpen ? "lg:left-64" : "lg:left-0"
          } right-0 pt-2 pb-2 z-40 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 shadow-xl text-white px-2 sm:px-4 mx-2 transition-all duration-300`}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="text-white focus:outline-none text-xl mr-2"
                aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "◄" : "☰"}
              </button>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                Admin Retail Management
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleMenu}
                className="sm:hidden text-white focus:outline-none text-xl"
                aria-label="Toggle navigation menu"
              >
                ☰
              </button>
              <nav
                className={`absolute sm:static top-14 sm:top-auto right-2 sm:right-auto bg-blue-400 sm:bg-transparent rounded-lg p-2 sm:p-0 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-start sm:items-center shadow-lg sm:shadow-none z-40 ${
                  menuOpen ? "flex" : "hidden sm:flex"
                }`}
              >
                <NavLink
                  to="/admin/products"
                  className="text-sm sm:text-base hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  Products
                </NavLink>
                <NavLink
                  to="/admin/orders"
                  className="text-sm sm:text-base hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  Orders
                </NavLink>
                <NavLink
                  to="/admin/reports"
                  className="text-sm sm:text-base hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  Reports
                </NavLink>
              </nav>
              <div className="relative" ref={profile}>
                <button
                  onClick={toggleProfileBox}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-blue-600 font-semibold flex items-center justify-center hover:ring-4 ring-blue-300 transition"
                  aria-label="Toggle profile menu"
                >
                  A
                </button>
                {viewProfileBox && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white text-black rounded-xl shadow-lg p-3 sm:p-4 z-50">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                        A
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">
                          Admin User
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          admin@example.com
                        </p>
                      </div>
                    </div>
                    <hr className="my-2 sm:my-3" />
                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <li>
                        <a
                          href="/admin/profile"
                          className="block hover:text-blue-600"
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href="/admin/settings"
                          className="block hover:text-blue-600"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <button className="text-left w-full hover:text-red-500">
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          className={`flex-1 pt-16 sm:pt-20 ${
            sidebarOpen ? "lg:pl-64" : "lg:pl-0"
          } px-2 sm:px-4 md:px-6 lg:px-8 pb-8 min-h-[calc(100vh-8rem)] transition-all duration-300`}
        >
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center p-3 sm:p-4 text-sm sm:text-base">
          <p>
            © {new Date().getFullYear()} Dragon Retail Management. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;