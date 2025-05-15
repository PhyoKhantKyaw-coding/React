
// Type for the product entity returned by the API
type Product = {
  productId: string;
  productName: string | null;
  stock: number;
  price: number;
  cost: number;
  profit?: number; // Optional, not in backend but included in frontend
  image: string | null;
  categoryId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  activeFlag: boolean;
};

// Type for the product payload (matches AddProductDTO)
type productPayload = {
  ProductName: string | null;
  Stock: number;
  Price: number;
  Cost: number;
  CategoryId: string; // Sent as string, parsed as Guid in backend
  Description: string;
};

// Type for the API response
type productResponse = {
  message: string;
  status: number;
  data: Product; // Single Product, not product[]
};

// Type for the mutation input (product payload + optional image)
type CreateProductInput = {
  product: productPayload;
  imageFile?: File | null;
};
type productsResponse ={
    message: string;
  status: number;
  data: Product[] ;
}
interface Category {
  categoryId: string;
  name: string;
}

interface CategoryResponse {
  data: Category;
}

interface CartItem {
  productId: string;
  quantity: number;
  totalAmount: string;
  productName: string;
  productImage: string;
}