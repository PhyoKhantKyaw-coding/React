import AddtoCart from "@/modules/home/chunks/AddtoCard";
import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout: React.FC = () => {
  const [viewProfileBox, setViewProfileBox] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const profile = useRef<HTMLDivElement>(null);

  const toggleProfileBox = () => setViewProfileBox((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemCount(cartItems.length);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profile.current && !profile.current.contains(event.target as Node)) {
        setViewProfileBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCartDialog = () => {
    const cartDialog = document.getElementById("cart-dialog");
    if (cartDialog) {
      cartDialog.classList.toggle("hidden");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(rgba(0,0,0,0.712)_10%,transparent_1%)] bg-[length:15px_11px] bg-[rgba(151,217,231,0.9)]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-400 to-green-400 shadow-xl text-white px-4 sm:px-6 py-3 rounded-b-2xl">
        <div className="container min-w-full flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">
            Retail Management System
          </h1>
          <div className="flex items-center gap-4">
            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="sm:hidden text-white text-2xl focus:outline-none"
            >
              ☰
            </button>

            {/* Nav Menu */}
            <nav
              className={`absolute sm:static top-16 right-4 sm:right-auto bg-blue-400 sm:bg-transparent rounded-lg p-4 sm:p-0 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center shadow-lg sm:shadow-none z-40 transition-all ${
                menuOpen ? "flex" : "hidden sm:flex"
              }`}
            >
              <a href="/" className="hover:underline">
                Home
              </a>
              <a href="/products" className="hover:underline">
                Products
              </a>
              <a href="/orders" className="hover:underline">
                Orders
              </a>
              <a href="/reports" className="hover:underline">
                Reports
              </a>
            </nav>

            {/* Cart */}
            <div className="relative">
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

            {/* Profile */}
            <div className="relative" ref={profile}>
              <button
                onClick={toggleProfileBox}
                className="w-10 h-10 rounded-full bg-white text-blue-600 font-semibold flex items-center justify-center hover:ring-4 ring-blue-300 transition"
              >
                P
              </button>
              {viewProfileBox && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-xl shadow-lg p-4 z-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      P
                    </div>
                    <div>
                      <p className="font-semibold">Phyo Khant</p>
                      <p className="text-sm text-gray-500">phyo@example.com</p>
                    </div>
                  </div>
                  <hr className="my-3" />
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="/profile" className="block hover:text-blue-600">
                        Profile
                      </a>
                    </li>
                    <li>
                      <a href="/settings" className="block hover:text-blue-600">
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

      {/* Main Content */}
      <main className="pt-28 px-4 sm:px-6 lg:px-8 flex-1">
        <Outlet />
        {/* Cart Dialog */}
        <div
          id="cart-dialog"
          className="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm sm:max-w-md md:max-w-lg">
            <AddtoCart onClose={toggleCartDialog} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center text-sm sm:text-base p-4">
        <p>
          © {new Date().getFullYear()} Dragon Retail Management. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default DefaultLayout;
