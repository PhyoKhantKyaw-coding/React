import axios from "axios";
import { UseMutationOptions, UseQueryOptions, useMutation,useQuery } from "@tanstack/react-query";

export const addProduct = {
  useMutation: (
    opt?: Partial<UseMutationOptions<Product, Error, FormData>>
  ) => {
    return useMutation<Product, Error, FormData>({
      mutationFn: async (formData: FormData): Promise<Product> => {
        for (const [key, value] of formData.entries()) {
          console.log(`FormData ${key}:`, value);
        }

        const response = await axios.post<productResponse>(
          "Product/AddProduct",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data.data;
      },
      ...opt,
    });
  },
};
export const GetProducts = {
  useQuery: (
    opt?: Partial<UseQueryOptions<Product[], Error>>
  ) => {
    return useQuery<Product[], Error>({
      queryKey: ["products"],
      queryFn: async (): Promise<Product[]> => {
        const response = await axios.get<productsResponse>("Product/GetAllProducts");
        return response.data.data;
      },
      ...opt,
    });
  },
};
export const GetProductById = {
  useQuery: (
    productId: string,
    opt?: Partial<UseQueryOptions<Product, Error>>
  ) => {
    return useQuery<Product, Error>({
      queryKey: ["product", productId],
      queryFn: async (): Promise<Product> => {
        const response = await axios.get<productResponse>(
          `Product/GetProductById?id=${productId}`
        );
        return response.data.data;
      },
      enabled: !!productId,
      ...opt,
    });
  },
};
export const GetCategory ={
  useQuery: (
    opt?: Partial<UseQueryOptions<Category[],Error>>
  )=>{
    return useQuery<Category[],Error>({
      queryKey:["category"],
      queryFn: async ():Promise<Category[]> =>{
        const response = await axios.get<catResponse>("Category/GetAllCategory");
        return response.data.data;
      },
      ...opt,
    });
  },
};
export const CategoryGetById = {
  useQuery: (
    categoryId: string,
    opt?: Partial<UseQueryOptions<string, Error>>
  ) => {
    return useQuery<string, Error>({
      queryKey: ["category", categoryId],
      queryFn: async (): Promise<string> => {
        const response = await axios.get<{ data: string }>(
          `Category/GetbyId?categoryId=${categoryId}`
        );
        return response.data.data; 
      },
      enabled: !!categoryId,
      ...opt,
    });
  },
};