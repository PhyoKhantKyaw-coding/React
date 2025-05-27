
type Product = {
  productId: string;
  productName: string | null;
  stock: number;
  price: number;
  cost: number;
  profit: number; 
  image: string | null;
  categoryId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  activeFlag: boolean;
};

type productPayload = {
  ProductName: string | null;
  Stock: number;
  Price: number;
  Cost: number;
  CategoryId: string; 
  Description: string;
};

type productResponse = {
  message: string;
  status: number;
  data: Product; 
};


type CreateProductInput = {
  product: productPayload;
  imageFile?: File | null;
};
type productsResponse ={
    message: string;
  status: number;
  data: Product[] ;
}
type Category ={
  categoryId: string;
  name: string;
}
type catResponse ={
  message: string;
  status: number;
  data: Category[];
}
type CategoryResponse = {
  data: Category;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: string;
  productName: string;
  productImage: string;
}