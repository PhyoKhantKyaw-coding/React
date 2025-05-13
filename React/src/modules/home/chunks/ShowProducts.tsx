import React, { useState, useMemo } from "react";

type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  categoryId: number;
};

interface ShowProductsProps {
  selectedCategoryId: number | null;
  onShowAllProducts: () => void;
  onProductSelect: (productId: number) => void;
  onFirstProductChange: (firstProductId: number | null) => void; // New callback
}

export const allProducts: Product[] = Array.from({ length: 24 }).map((_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: `$${(index + 1) * 5}`,
  image: `https://via.placeholder.com/150?text=Prod+${index + 1}`,
  categoryId: (index % 8) + 1, // 8 categories (1 to 8)
}));

const ShowProducts: React.FC<ShowProductsProps> = ({
  selectedCategoryId,
  onShowAllProducts,
  onProductSelect,
  onFirstProductChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4 * 2; // 4 per row × 2 rows

  // Filtered by category if selected
  const filteredProducts = useMemo(() => {
    return selectedCategoryId
      ? allProducts.filter((p) => p.categoryId === selectedCategoryId)
      : allProducts;
  }, [selectedCategoryId]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Update first product ID whenever currentProducts changes
  React.useEffect(() => {
    const firstProductId = currentProducts.length > 0 ? currentProducts[0].id : null;
    onFirstProductChange(firstProductId);
  }, [currentProducts, onFirstProductChange]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white/80 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-3">{product.price}</p>
              <button
                onClick={() => onProductSelect(product.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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

      {/* Show All Products Button */}
      {selectedCategoryId && (
        <div className="mt-6 text-center">
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