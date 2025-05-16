import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/api";
import { useDispatch } from "react-redux";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
interface ProductDetailProps {
  selectedProductId: string | null;
  defaultProductId: string | null;
}
 
const ProductDetail: React.FC<ProductDetailProps> = ({
  selectedProductId,
  defaultProductId,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<
    { productId: string; quantity: number }[]
  >([]);
 const dispatch = useDispatch();
  const {
    data: products = [],
    isLoading,
    error,
  } = api.product.GetProducts.useQuery();

  // Update cart items from localStorage
  const updateCartItems = () => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(items);
  };

  useEffect(() => {
    updateCartItems();
    window.addEventListener("storage", updateCartItems);
    return () => window.removeEventListener("storage", updateCartItems);
  }, []);

  useEffect(() => {
    setQuantity(1);
  }, [selectedProductId, defaultProductId]);

  const productId = selectedProductId ?? defaultProductId ?? null;
  const product = productId
    ? products.find((p) => p.productId === productId)
    : null;

  const categoryId = product?.categoryId ?? "";
  const {
    data: CategoryResponse,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = api.product.CategoryGetById.useQuery(categoryId);

  if (isLoading) {
   if(isLoading){
     dispatch(openLoader())
   }
   else{
     dispatch(hideLoader())
   }
  }

  if (error) {
    return (
      <div className="text-center mt-4 text-red-600">
        Error loading product: {error.message}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Product Not Found
        </h2>
      </div>
    );
  }

  // Calculate cart quantity for this product
  const cartQuantity = cartItems
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + item.quantity, 0);

  // Available stock = API stock - cart quantity - selected quantity
  const availableStock = product.stock - cartQuantity - quantity;
  const totalAmount = (product.price * quantity).toFixed(2);

  const handleIncrement = () => {
    if (quantity < product.stock - cartQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    if (quantity > product.stock - cartQuantity) {
      toast.error(`Only ${product.stock - cartQuantity} items in stock!`, {
        position: "top-right",
        duration: 3000,
        dismissible: true,
      });
      return;
    }

    const cartItem = {
      productId: product.productId,
      quantity,
      totalAmount: `$${totalAmount}`,
      productName: product.productName,
      productImage: product.image,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item: typeof cartItem) => item.productId === product.productId
    );

    let updatedCart;
    if (existingItemIndex >= 0) {
      // Update quantity if product exists in cart
      updatedCart = [...existingCart];
      updatedCart[existingItemIndex].quantity += quantity;
      updatedCart[existingItemIndex].totalAmount = `$${(
        product.price * updatedCart[existingItemIndex].quantity
      ).toFixed(2)}`;
    } else {
      // Add new item
      updatedCart = [...existingCart, cartItem];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
    setQuantity(1); // Reset quantity after adding to cart

    toast.success(`${product.productName} added to cart!`, {
      position: "top-right",
      duration: 3000,
      dismissible: true,
    });
  };

  const API_BASE_URL = "https://localhost:7164";

  return (
    <div className="p-4 rounded-2xl text-white shadow-md">
      <img
        src={
          product.image
            ? `${API_BASE_URL}${product.image}`
            : "/fallback-image.jpg"
        }
        alt={product.productName || "Product image"}
        className="w-full h-80 object-cover rounded-lg mb-4"
        onError={(e) => {
          e.currentTarget.src = "/fallback-image.jpg";
        }}
      />
      <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
      <p className="mb-2">Price: ${product.price.toFixed(2)}</p>
      <div className="mb-2">
        Category:
        {isCategoryLoading ? (
          <span className="ml-2 text-gray-400">Loading...</span>
        ) : categoryError ? (
          <span className="ml-2 text-red-500">Failed to load category</span>
        ) : (
          <span className="ml-2">{CategoryResponse || "Unknown"}</span>
        )}
      </div>
      <p className="mb-2">
        Available Stock: {availableStock < 0 ? 0 : availableStock}
      </p>
      <p className="mb-4">
        Description: {product.description || "No description available."}
      </p>
      <div className="flex items-center mb-4">
        <span className="mr-4">Quantity:</span>
        <button
          onClick={handleDecrement}
          disabled={quantity === 1}
          className="px-3 py-1 bg-gray-800 rounded-l-full hover:bg-gray-400 disabled:opacity-50"
        >
          -
        </button>
        <span className="px-4 py-1 text-black bg-gray-100">{quantity}</span>
        <button
          onClick={handleIncrement}
          disabled={quantity >= product.stock - cartQuantity}
          className="px-3 py-1 bg-gray-800 rounded-r-full hover:bg-gray-400 disabled:opacity-50"
        >
          +
        </button>
      </div>
      <p className="mb-4">Total: ${totalAmount}</p>
      <button
        onClick={handleAddToCart}
        disabled={product.stock - cartQuantity === 0}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;