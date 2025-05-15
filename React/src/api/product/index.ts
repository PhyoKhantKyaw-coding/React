import axios from "axios";
import { UseMutationOptions, UseQueryOptions, useMutation,useQuery } from "@tanstack/react-query";

export const addProduct = {
  useMutation: (
    opt?: Partial<UseMutationOptions<Product, Error, CreateProductInput>>
  ) => {
    return useMutation<Product, Error, CreateProductInput>({
      mutationFn: async ({ product, imageFile }: CreateProductInput): Promise<Product> => {
        const formData = new FormData();

        console.log("Product Payload:", product);
        formData.append("product", JSON.stringify(product));

        if (imageFile) {
          formData.append("imageFile", imageFile);
        }
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
        return response.data.data; // ← just return the string directly
      },
      enabled: !!categoryId,
      ...opt,
    });
  },
};


