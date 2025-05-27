import React from "react";
import { toast, Toaster } from "sonner";
import api from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/store/features/addtoCardSlice";
import { RootState } from "@/store";
import useAuth from "@/hooks/useAuth";

interface AddToCartProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}



const AddtoCart: React.FC<AddToCartProps> = ({ setIsOpen }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const queryClient = useQueryClient();
  const API_BASE_URL = "https://localhost:7164";
  const { decodedUserData } = useAuth();

  const onClose = () => {
    setIsOpen(false);
  };

  const { mutate: createSale, status, error, data } = api.sale.addSale.useMutation({
    onSuccess: (response) => {
      if (response.message === "Add Successfully") {
        dispatch(clearCart());
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success(`Sale created successfully! Sale ID: ${response.data?.saleId}`, {
          position: "top-right",
          duration: 3000,
          dismissible: true,
        });
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        onClose();
      } else {
        toast.error(`Failed to create sale: ${response.message}`, {
          position: "top-right",
          duration: 5000,
          dismissible: true,
        });
      }
    },
    onError: (err: Error) => {
      toast.error(`Error creating sale: ${err.message}`, {
        position: "top-right",
        duration: 5000,
        dismissible: true,
      });
    },
  });

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared!", {
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart!", {
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    const userId = decodedUserData?.nameIdentifier || "";

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.", {
        position: "top-right",
        duration: 5000,
        dismissible: true,
      });
      return;
    }

    createSale({ cartItems, userId });
  };

  const totalAmount = cartItems
    .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-2xl min-w-full" role="dialog" aria-labelledby="cart-title">
      <Toaster richColors />
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
        aria-label="Close cart dialog"
      >
        ✕
      </button>
      <h2 id="cart-title" className="text-2xl font-semibold mb-4 text-gray-800">
        Your Cart
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {status === "pending" && (
            <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th scope="col" className="p-2 border-b text-gray-700">Image</th>
                <th scope="col" className="p-2 border-b text-gray-700">Product</th>
                <th scope="col" className="p-2 border-b text-gray-700">Quantity</th>
                <th scope="col" className="p-2 border-b text-gray-700">Unit Price</th>
                <th scope="col" className="p-2 border-b text-gray-700">Total</th>
                <th scope="col" className="p-2 border-b text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={`${item.productId}-${index}`} className="border-b">
                  <td className="p-2">
                    <img
                      src={
                        item.productImage
                          ? `${API_BASE_URL}${item.productImage}`
                          : "/fallback-image.jpg"
                      }
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/fallback-image.jpg";
                      }}
                    />
                  </td>
                  <td className="p-2">{item.productName}</td>
                  <td className="p-2">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity === 1 || status === "pending"}
                        className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-100">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={status === "pending"}
                        className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-2">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="p-2">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={status === "pending"}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${item.productName} from cart`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold text-gray-800">Total: ${totalAmount}</p>
          </div>
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleClearCart}
            disabled={status === "pending"}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Clear Cart
          </button>
          <div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleCheckout}
              disabled={status === "pending"}
              className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                status === "pending" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {status === "pending" ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
      {(error || (data && data.message !== "Add Successfully")) && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          <p>
            {error
              ? `Error: ${error.message}`
              : data && `Error: ${data.message}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddtoCart;