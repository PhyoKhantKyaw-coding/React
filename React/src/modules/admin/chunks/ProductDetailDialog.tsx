import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GetProductById, GetCategory } from "@/api/product"; 

interface ProductDetailDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productId: string | null;
}

const API_BASE_URL = "https://localhost:7164";

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  isOpen,
  setIsOpen,
  productId,
}) => {
  const { data: product, isLoading, error } = GetProductById.useQuery(productId || "");
  const { data: categories, isLoading: isCategoryLoading, error: categoryError } = GetCategory.useQuery();

  const category = categories?.find((cat: Category) => cat.categoryId === product?.categoryId);
  const categoryName = category?.name || "Unknown";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg p-4 rounded-2xl shadow-md bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Product Details</DialogTitle>
        </DialogHeader>
        {isLoading && <div className="text-center text-white">Loading product...</div>}
        {error && (
          <div className="text-center text-red-500">
            Failed to load product: {error.message}
          </div>
        )}
        {product && !isLoading && !error && (
          <div className="text-white">
                    <img
                      src={
                        product.image
                          ? `${API_BASE_URL}${product.image}`
                          : "/fallback-image.jpg"
                      }
                      alt={product.productName || "Product image"}
                      className="w-full h-80 object-center rounded-lg mb-4"
                      onError={(e) => {
                        e.currentTarget.src = "/fallback-image.jpg";
                      }}
                    />
            <h2 className="text-xl font-semibold mb-2">{product.productName || "Unnamed Product"}</h2>
            <p className="mb-2">Price: ${product.price.toFixed(2)}</p>
            <div className="mb-2">
              Category:
              {isCategoryLoading ? (
                <span className="ml-2 text-gray-400">Loading...</span>
              ) : categoryError ? (
                <span className="ml-2 text-red-500">Failed to load category</span>
              ) : (
                <span className="ml-2">{categoryName}</span>
              )}
            </div>
            <p className="mb-2">
              Available Stock: {product.stock < 0 ? 0 : product.stock}
            </p>
            <p className="mb-4">
              Description: {product.description || "No description available."}
            </p>
                        <p className="mb-4">
              CreateAt: {product.createdAt || ""}
            </p>
                        <p className="mb-4">
              UpdateAt: {product.updatedAt || ""}
            </p>

            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full mt-2 text-white border-white hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;