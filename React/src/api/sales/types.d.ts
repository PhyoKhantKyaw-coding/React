type SaleDetailsDTO = {
  productId: string;
  quantity: number;
  price: number;
}

type SaleDTO = {
  saleDetails: SaleDetailsDTO[];
  userId: string;
}

type SaleResponse = {
  message: string;
  status: string;
  data?: { saleId: string };
}

type CreateSaleInput = {
  cartItems: CartItem[];
  userId: string;
}
type Sale = {
  saleId: string;
  saleDate: string;
  userId: string;
  totalAmount: number;
  totalProfit: number;
  totalCost: number;
  userName: string;
}
type SaleDetails = {
  sDId: string;
  quantity: number;
  productName: string;
  catName: string;
  description: string;
  totalPrice: number;
  totalCost: number;
}
type SaleResponse = {
  message: string;
  status: string;
  data?: Sale[] | { saleId: string };
}
type SaleDetailResponse = {
  message: string;
  status: string;
  data?: SaleDetails[] | { saleId: string };
}