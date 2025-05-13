import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { allProducts } from "./ShowProducts";

interface ProductDetailProps {
  selectedProductId: number | null;
  defaultProductId: number | null;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  selectedProductId,
  defaultProductId,
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [selectedProductId, defaultProductId]);

  const productId = selectedProductId ?? defaultProductId ?? 1;
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="text-center mt-4">
        <h2 className="text-lg font-semibold text-gray-800">Product Not Found</h2>
      </div>
    );
  }

  const price = parseFloat(product.price.replace("$", ""));
  const totalAmount = (price * quantity).toFixed(2);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      quantity,
      totalAmount: `$${totalAmount}`,
      productName: product.name,
      productImage: product.image,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...existingCart, cartItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Dispatch storage event to update cart count and AddtoCart dialog
    window.dispatchEvent(new Event("storage"));

    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });

    console.log("Added to cart:", cartItem);
  };

  return (
    <div className="p-4 bg-amber-300 rounded-2xl shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-80 object-cover rounded-lg mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-2">Price: {product.price}</p>
      <p className="text-gray-600 mb-2">Category ID: {product.categoryId}</p>
      <p className="text-gray-600 mb-4">
        Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <div className="flex items-center mb-4">
        <span className="text-gray-600 mr-4">Quantity:</span>
        <button
          onClick={handleDecrement}
          disabled={quantity === 1}
          className="px-3 py-1 bg-gray-300 rounded-l-full hover:bg-gray-400 disabled:opacity-50"
        >
          −
        </button>
        <span className="px-4 py-1 bg-gray-100 text-gray-800">{quantity}</span>
        <button
          onClick={handleIncrement}
          className="px-3 py-1 bg-gray-300 rounded-r-full hover:bg-gray-400"
        >
          +
        </button>
      </div>
      <p className="text-gray-600 mb-4">Total: ${totalAmount}</p>
      <button
        onClick={handleAddToCart}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;