import axios from "axios";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

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


