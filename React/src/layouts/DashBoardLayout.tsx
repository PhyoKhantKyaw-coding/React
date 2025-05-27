import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "@/store/features/adminSidebarSlice";
import { RootState } from "@/store";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const sidebarData = [
  { to: "products", label: "Dashboard" },
  { to: "users", label: "Users" },
  { to: "categories", label: "Categories" },
  { to: "sales", label: "Sales" },
  { to: "settings", label: "Settings" },
];

const AdminDashboardLayout = () => {
  const [viewProfileBox, setViewProfileBox] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string | undefined; email: string | undefined } | null>(null);
  const profile = useRef<HTMLDivElement>(null);
  const activeSidebar = useSelector((state: RootState) => state.adminSidebar.sidebar);
  const dispatch = useDispatch();
  const { isAuthenticated, decodedUserData, userLogout } = useAuth();
  const location = useLocation();

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

  useEffect(() => {
    if (isAuthenticated && decodedUserData) {
      try {
        setUser({ name: decodedUserData.name, email: decodedUserData.email });
      } catch (error) {
        console.error("Failed to set user data:", error);
        setUser(null);
        userLogout();
      }
    } else {
      setUser(null);
      userLogout();
    }
  }, [isAuthenticated, decodedUserData, userLogout]);

  const handleSidebarClick = (to: string) => () => {
    dispatch(setSidebar(to));
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    userLogout();
    setUser(null);
    setViewProfileBox(false);
  };

  const profileInitial = user?.name?.charAt(0).toUpperCase() || "A";

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (decodedUserData?.role === "user") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

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
            {sidebarData.map((item) => (
              <li key={item.to}>
                <div
                  className={cn(
                    `block px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-gray-700 transition`,
                    item.to === activeSidebar ? "bg-gray-700" : ""
                  )}
                  onClick={handleSidebarClick(item.to)}
                >
                  {item.label}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header
          className={`fixed top-2 left-0 ${
            sidebarOpen ? "lg:left-64" : "lg:left-0"
          } right-0 pt-2 pb-2 z-40 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 shadow-xl text-white px-2 sm:px-4 transition-all duration-300`}
        >
          <div className="container min-w-full flex justify-between">
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
            <div className="flex mr-2.5 items-center gap-2 sm:gap-3">
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
                <div ref={profile}>
                <button
                  onClick={toggleProfileBox}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-blue-600 font-semibold flex items-center justify-center hover:ring-4 ring-blue-300 transition"
                  aria-label="Toggle profile menu"
                >
                  {profileInitial}
                </button>
                {viewProfileBox && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white text-black rounded-xl shadow-lg p-3 sm:p-4 z-50">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                        {profileInitial}
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">
                          {user?.name || "Admin User"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {user?.email || "admin@example.com"}
                        </p>
                      </div>
                    </div>
                    <hr className="my-2 sm:my-3" />
                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="text-left w-full hover:text-red-500"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              </nav>
              
            </div>
          </div>
        </header>

        <main
          className={`flex-1 pt-16 sm:pt-20 ${
            sidebarOpen ? "lg:pl-64" : "lg:pl-0"
          } px-2 sm:px-4 md:px-6 lg:px-8 pb-8 min-h-[calc(100vh-8rem)] transition-all duration-300`}
        >
          <Outlet />
        </main>

        <footer className="bg-gray-800 text-white text-center p-3 sm:p-4 text-sm sm:text-base">
          <p>
            © {new Date().getFullYear()} Dragon Retail Management. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;