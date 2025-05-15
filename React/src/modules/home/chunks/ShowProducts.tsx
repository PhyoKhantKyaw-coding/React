import React, { useState, useMemo, useEffect, useRef } from "react";
import api from "@/api";

interface ShowProductsProps {
  selectedCategoryId: string | null;
  onShowAllProducts: () => void;
  onProductSelect: (productId: string) => void;
  onFirstProductChange: (firstProductId: string | null) => void;
}

const ShowProducts: React.FC<ShowProductsProps> = ({
  selectedCategoryId,
  onShowAllProducts,
  onProductSelect,
  onFirstProductChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4 * 2;
  const lastFirstProductId = useRef<string | null>(null);

  const { data: products = [], isLoading, error } = api.product.GetProducts.useQuery();

  const filteredProducts = useMemo(() => {
    return selectedCategoryId
      ? products.filter((p) => p.categoryId === selectedCategoryId)
      : products;
  }, [products, selectedCategoryId]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    const firstProductId = currentProducts.length > 0 ? currentProducts[0].productId : null;
    if (firstProductId !== lastFirstProductId.current && typeof onFirstProductChange === "function") {
      onFirstProductChange(firstProductId);
      lastFirstProductId.current = firstProductId;
    }
  }, [currentProducts, onFirstProductChange]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  if (isLoading) {
    return <div className="text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error loading products: {error.message}</div>;
  }

  const API_BASE_URL = "https://localhost:7164"; // Hardcoded backend URL

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div
            key={product.productId}
            className="bg-white/80 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={product.image ? `${API_BASE_URL}${product.image}` : "/fallback-image.jpg"}
              alt={product.productName || "Product image"}
              className="w-full h-40 object-cover"
              onError={(e) => {
                e.currentTarget.src = "/fallback-image.jpg";
              }}
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.productName}
              </h3>
              <p className="text-gray-600 mb-3">${product.price.toFixed(2)}</p>
              <button
                onClick={() => onProductSelect(product.productId)}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selectedCategoryId && (
        <div className=" Distance between the top and the bottom of the window is 6 units (mt-6), text is centered">
          <button
            onClick={onShowAllProducts}
            className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Show All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowProducts;