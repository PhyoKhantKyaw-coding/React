import React, { useState, useEffect } from "react";

interface AddtoCartProps {
  onClose: () => void;
}

interface CartItem {
  productId: number;
  quantity: number;
  totalAmount: string;
  productName: string;
  productImage: string;
}

const AddtoCart: React.FC<AddtoCartProps> = ({ onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const updateCartItems = () => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(items);
  };

  useEffect(() => {
    // Load initial cart items
    updateCartItems();

    // Listen for storage events to update cart items
    window.addEventListener("storage", updateCartItems);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("storage", updateCartItems);
  }, []);

  const handleClearCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    setCartItems([]);
    window.dispatchEvent(new Event("storage")); // Update cart count and other listeners
  };

  return (
    <div className="relative" role="dialog" aria-labelledby="cart-title">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
        aria-label="Close cart dialog"
      >
        ✕
      </button>
      <h2 id="cart-title" className="text-2xl font-semibold mb-4">
        Your Cart
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th scope="col" className="p-2 border-b">
                  Image
                </th>
                <th scope="col" className="p-2 border-b">
                  Product
                </th>
                <th scope="col" className="p-2 border-b">
                  Quantity
                </th>
                <th scope="col" className="p-2 border-b">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={`${item.productId}-${index}`} className="border-b">
                  <td className="p-2">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">{item.productName}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleClearCart}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default AddtoCart;