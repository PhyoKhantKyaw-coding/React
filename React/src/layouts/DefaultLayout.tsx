import { useState, useEffect, useRef } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";
import AddtoCart from "@/modules/home/chunks/AddtoCart";
import OrdersHistory from "@/modules/home/chunks/OrdersHistory";
import { RootState } from "@/store";

const DefaultLayout: React.FC = () => {
  const [viewProfileBox, setViewProfileBox] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOrderHistoryDialogOpen, setIsOrderHistoryDialogOpen] = useState<boolean>(false);
  const [addToCartOpen, setAddToCartOpen] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string | undefined; email: string | undefined } | null>(null);
  const profile = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, decodedUserData, userLogout } = useAuth();
  const location = useLocation();
  const userId = decodedUserData?.nameIdentifier || "";
  const cartItemCount = useSelector((state: RootState) => state.cart.cartItems.length);

  const { data: sales = [] } = api.sale.GetSalesByUserId.useQuery(userId);

  const toggleProfileBox = () => setViewProfileBox(!viewProfileBox);
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
    const token = Cookies.get("token");
    if (token && isAuthenticated && !user) {
      try {
        setUser({ name: decodedUserData?.name, email: decodedUserData?.email });
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUser(null);
        userLogout();
        navigate("/auth/login");
      }
    } else if (!token && isAuthenticated) {
      setUser(null);
      userLogout();
      navigate("/auth/login");
    }
  }, [isAuthenticated, decodedUserData, userLogout, navigate, user]);

  const toggleCartDialog = () => {
    setAddToCartOpen(true);
  };

  const handleOrderClick = () => {
    setIsOrderHistoryDialogOpen(true);
  };

  const handleLogout = () => {
    userLogout();
    setUser(null);
    setViewProfileBox(false);
    navigate("/auth/login");
  };

  const profileInitial = user?.name?.charAt(0).toUpperCase() || "U";

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (decodedUserData?.role === "Admin") {
    return <Navigate to="/admin/home" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(rgba(0,0,0,0.712)_10%,transparent_1%)] bg-[length:15px_11px] bg-[rgba(151,217,231,0.9)]">
      <header className="fixed top-3 left-0 w-full z-50 bg-gradient-to-r from-blue-400 to-green-400 shadow-xl text-white px-4 sm:px-6 py-3 rounded-b-2xl">
        <div className="container min-w-full flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">
            Retail Management System
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="sm:hidden text-white text-2xl focus:outline-none"
            >
              ☰
            </button>
            <nav
              className={`absolute sm:static top-16 right-4 sm:right-auto bg-blue-400 sm:bg-transparent rounded-lg p-4 sm:p-0 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center shadow-lg sm:shadow-none z-40 transition-all ${menuOpen ? "flex" : "hidden sm:flex"}`}
            >
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <Link to="/products" className="hover:underline">
                Products
              </Link>
              <Link to="/reports" className="hover:underline">
                Reports
              </Link>
              <div className="relative mb-2">
                <button
                  className="text-white text-1xl focus:outline-none mr-3"
                  onClick={handleOrderClick}
                >
                  Orders
                </button>
                <button
                  className="text-white text-2xl focus:outline-none"
                  onClick={toggleCartDialog}
                >
                  🛒
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </nav>
            <div className="relative" ref={profile}>
              <button
                onClick={toggleProfileBox}
                className="w-10 h-10 rounded-full bg-white text-blue-600 font-semibold flex items-center justify-center hover:ring-4 ring-blue-300 transition"
              >
                {profileInitial}
              </button>
              {viewProfileBox && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-xl shadow-lg p-4 z-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {profileInitial}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.name || "Unknown User"}</p>
                      <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
                    </div>
                  </div>
                  <hr className="my-3" />
                  <ul className="space-y-2 text-sm">
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
          </div>
        </div>
      </header>
      <main className="pt-28 px-4 sm:px-6 lg:px-8 flex-1">
        <Outlet />
        <div
          className={`${addToCartOpen ? "flex" : "hidden"} fixed inset-0 bg-black/50 items-center justify-center z-50`}
        >
          <div className="bg-white rounded-2xl min-w-full p-6 max-w-lg sm:max-w-md md:max-w-lg">
            <AddtoCart setIsOpen={setAddToCartOpen} />
          </div>
        </div>
        <OrdersHistory
          isOpen={isOrderHistoryDialogOpen}
          setIsOpen={setIsOrderHistoryDialogOpen}
          data={sales}
        />
      </main>
      <footer className="bg-gray-800 text-white text-center text-sm sm:text-base p-4">
        <p>
          © {new Date().getFullYear()} Dragon Retail Management. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default DefaultLayout;