import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import ShowProducts from "./chunks/ShowProducts";
import ProductDetail from "./chunks/ProductDetail";
import api from "@/api";

const RetailHomeView = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [firstProductId, setFirstProductId] = useState<string | null>(null);

  // Fetch categories using the provided API
  const { data: categories = [], isLoading: isCategoriesLoading, error: categoriesError } = api.product.GetCategory.useQuery();

  const handleShowAllProducts = () => {
    setSelectedCategoryId(null);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleFirstProductChange = (firstProductId: string | null) => {
    setFirstProductId(firstProductId);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2 min-h-full">
      {/* Section 111 - Popular Categories */}
      <div className="col-span-1 sm:col-span-3 h-fit bg-black/20 rounded-2xl p-4 text-white flex flex-col items-center">
        <h2 className="mt-3 text-2xl sm:text-5xl font-semibold mb-3 text-center">
          Popular Categories
        </h2>
        <p className="text-sm sm:text-2xl text-center max-w-2xl">
          Browse through our most popular product categories. Click to explore
          and quickly add items to your cart with ease.
        </p>

        {isCategoriesLoading && (
          <div className="mt-10 text-center">Loading categories...</div>
        )}
        {categoriesError && (
          <div className="mt-10 text-center text-red-600">
            Error loading categories: {categoriesError.message}
          </div>
        )}
        {!isCategoriesLoading && !categoriesError && (
          <div className="mt-10 flex items-center w-full gap-4 overflow-x-auto">
            {/* Left Button */}
            <button
              onClick={() => scroll("left")}
              className="bg-white p-3 rounded-full shadow hover:bg-gray-100"
            >
              ◀
            </button>

            {/* Scrollable Category Items */}
            <div
              ref={scrollRef}
              className="flex items-center space-x-7 overflow-hidden rounded-2xl px-4 py-2"
              style={{ scrollBehavior: "smooth", maxWidth: "100%" }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.categoryId}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className={`cursor-pointer bg-amber-300 shadow-lg rounded-2xl p-6 min-w-[200px] sm:min-w-[250px] text-center flex-shrink-0 
                    ${selectedCategoryId === category.categoryId ? "ring-4 ring-white" : ""}`}
                  onClick={() => setSelectedCategoryId(category.categoryId)}
                >
                  <h3 className="text-xl font-medium text-gray-700">{category.name}</h3>
                </motion.div>
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={() => scroll("right")}
              className="bg-white p-3 rounded-full shadow hover:bg-gray-100"
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* Section 222 - Product Cards */}
      <div className="col-span-1 sm:col-span-2 bg-black/20 rounded-2xl p-4 shadow">
        <h1 className="text-xl font-bold mb-4 text-white">Show Products Card</h1>
        <ShowProducts
          selectedCategoryId={selectedCategoryId}
          onShowAllProducts={handleShowAllProducts}
          onProductSelect={handleProductSelect}
          onFirstProductChange={handleFirstProductChange}
        />
      </div>

      {/* Section 333 - Product Detail */}
      <div className="col-span-1 bg-black/20 rounded-2xl p-4 shadow">
        <h1 className="text-xl font-bold mb-4 text-white">Product Detail</h1>
        <ProductDetail
          selectedProductId={selectedProductId}
          defaultProductId={firstProductId}
        />
      </div>
    </div>
  );
};

export default RetailHomeView;