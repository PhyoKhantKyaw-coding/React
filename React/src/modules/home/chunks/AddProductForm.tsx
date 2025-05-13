import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '@/api'; // Adjust path to match your API module

// Zod schema for productPayload (matches AddProductDTO)
const productSchema = z.object({
  productName: z.string().max(100, 'Product name must be 100 characters or less').nullable(),
  stock: z.number().min(0, 'Stock must be 0 or greater').int('Stock must be an integer'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  cost: z.number().min(0, 'Cost must be 0 or greater'),
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
  description: z.string().trim().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
  imageFile: z.instanceof(File).optional().nullable(),
});

// Type inferred from Zod schema
type ProductFormData = z.infer<typeof productSchema>;

// Transform form data to CreateProductInput for mutation
const transformFormData = (data: ProductFormData): CreateProductInput => {
  const productPayload = {
    ProductName: data.productName,
    Stock: data.stock,
    Price: data.price,
    Cost: data.cost,
    CategoryId: data.categoryId,
    Description: data.description,
  };

  // Log the product payload for debugging
  console.log('Product Payload:', productPayload);

  return {
    product: productPayload,
    imageFile: data.imageFile,
  };
};

const AddProductForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: null,
      stock: 0,
      price: 0,
      cost: 0,
      categoryId: '',
      description: '',
      imageFile: null,
    },
  });

  const mutation = api.product.addProduct.useMutation({
    onSuccess: () => {
      toast.success('Product added successfully!');
      reset();
    },
    onError: (error) => {

      toast.error(`Failed to add product: ${error}`);
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const input = transformFormData(data);

    // Log FormData contents for debugging
    const formData = new FormData();
    formData.append('product', JSON.stringify(input.product));
    if (input.imageFile) {
      formData.append('imageFile', input.imageFile);
    }
    for (const [key, value] of formData.entries()) {
      console.log(`FormData ${key}:`, value);
    }

    mutation.mutate(input);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Name */}
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            id="productName"
            type="text"
            {...register('productName')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.productName && (
            <p className="mt-1 text-sm text-red-600">{errors.productName.message}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            step="1"
            {...register('stock', { valueAsNumber: true })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Cost */}
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Cost
          </label>
          <input
            id="cost"
            type="number"
            step="0.01"
            {...register('cost', { valueAsNumber: true })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.cost && (
            <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>
          )}
        </div>

        {/* Category ID */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category ID
          </label>
          <input
            id="categoryId"
            type="text"
            {...register('categoryId')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={4}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Image File */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
            Product Image (Optional)
          </label>
          <Controller
            name="imageFile"
            control={control}
            render={({ field }) => (
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            )}
          />
          {errors.imageFile && (
            <p className="mt-1 text-sm text-red-600">{errors.imageFile.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {mutation.isPending ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;