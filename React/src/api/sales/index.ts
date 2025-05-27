import axios from "axios";
import { UseMutationOptions, useMutation,UseQueryOptions,useQuery } from "@tanstack/react-query";
export const addSale = {
  useMutation: (
    opt?: Partial<UseMutationOptions<SaleResponse, Error, CreateSaleInput>>
  ) => {
    return useMutation<SaleResponse, Error, CreateSaleInput>({
      mutationFn: async ({ cartItems, userId }: CreateSaleInput): Promise<SaleResponse> => {
        const salePayload: SaleDTO = {
          userId,
          saleDetails: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price:parseFloat(item.price), 
          })),
        };
        const response = await axios.post<SaleResponse>(
          "Sale/AddSale",
          salePayload
        );
        return response.data;
      },
      ...opt,
    });
  },
};

export const GetAllSales = {
  useQuery: (
    opt?: Partial<UseQueryOptions<Sale[], Error>>
  ) => {
    return useQuery<Sale[], Error>({
      queryKey: ["sales"],
      queryFn: async (): Promise<Sale[]> => {
        const response = await axios.get<SaleResponse>(
          "Sale/GetAllSales"
        );     
        return Array.isArray(response.data.data) ? response.data.data as Sale[] : [];
      },
      ...opt,
    });
  },
};
export const GetSaleDetailsBySaleId = {
  useQuery: (
    saleId: string,
    opt?: Partial<UseQueryOptions<SaleDetails[], Error>>
  ) => {
    return useQuery<SaleDetails[], Error>({
      queryKey: ["saleDetails", saleId],
      queryFn: async (): Promise<SaleDetails[]> => {
        const response = await axios.get<SaleDetailResponse>(
          `SaleDetails/GetSaleDetailBySaleId?saleId=${saleId}`
        );
        return Array.isArray(response.data.data) ? response.data.data as SaleDetails[] : [];
      },
      ...opt,
    });
  }
};

export const GetSalesByUserId = {
  useQuery: (
    userId: string,
    opt?: Partial<UseQueryOptions<Sale[], Error>>
  ) => {
    return useQuery<Sale[], Error>({
      queryKey: ["sales", userId],
      queryFn: async (): Promise<Sale[]> => {
        const response = await axios.get<SaleResponse>(
          `Sale/GetSaleByUserId?userId=${userId}`
        );
        return Array.isArray(response.data.data) ? response.data.data as Sale[] : [];
      },
      ...opt,
    });
  },
};
 