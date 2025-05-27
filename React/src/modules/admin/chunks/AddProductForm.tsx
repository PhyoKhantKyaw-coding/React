import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '@/api';

const productSchema = z.object({
  ProductName: z.string().max(100, 'Product name must be 100 characters or less').nullable(),
  Stock: z.number().min(0, 'Stock must be 0 or greater').int('Stock must be an integer'),
  Price: z.number().min(0, 'Price must be 0 or greater'),
  Cost: z.number().min(0, 'Cost must be 0 or greater'),
  CategoryId: z.string().uuid('Category ID must be a valid UUID'),
  Description: z.string().trim().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
  image: z.instanceof(File).optional().nullable(),
});

type ProductFormData = z.infer<typeof productSchema>;

const transformFormData = (data: ProductFormData) => {
  return {
    ProductName: data.ProductName,
    Stock: data.Stock,
    Price: data.Price,
    Cost: data.Cost,
    CategoryId: data.CategoryId,
    Description: data.Description,
    imageFile: data.image, // File is sent separately
  };
};

const AddProductForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ProductName: null,
      Stock: 0,
      Price: 0,
      Cost: 0,
      CategoryId: '',
      Description: '',
      image: null,
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

  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = api.product.GetCategory.useQuery();

  const onSubmit = (data: ProductFormData) => {
    const input = transformFormData(data);

    const formData = new FormData();
    if (input.ProductName) formData.append('ProductName', input.ProductName);
    formData.append('Stock', input.Stock.toString());
    formData.append('Price', input.Price.toString());
    formData.append('Cost', input.Cost.toString());
    formData.append('CategoryId', input.CategoryId);
    formData.append('Description', input.Description);
    if (input.imageFile) {
      formData.append('imageFile', input.imageFile);
    }

    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-blue-300 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="ProductName" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            id="ProductName"
            type="text"
            {...register('ProductName')}
            className="mt-1 h-9 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.ProductName && (
            <p className="mt-1 text-sm text-red-600">{errors.ProductName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="Stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            id="Stock"
            type="number"
            step="1"
            {...register('Stock', { valueAsNumber: true })}
            className="mt-1 h-9 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.Stock && (
            <p className="mt-1 text-sm text-red-600">{errors.Stock.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="Price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            id="Price"
            type="number"
            step="0.01"
            {...register('Price', { valueAsNumber: true })}
            className="mt-1 h-9 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.Price && (
            <p className="mt-1 text-sm text-red-600">{errors.Price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="Cost" className="block text-sm font-medium text-gray-700">
            Cost
          </label>
          <input
            id="Cost"
            type="number"
            step="0.01"
            {...register('Cost', { valueAsNumber: true })}
            className="mt-1 h-9 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.Cost && (
            <p className="mt-1 text-sm text-red-600">{errors.Cost.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="CategoryId" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <Controller
            name="CategoryId"
            control={control}
            render={({ field }) => (
              <select
                id="CategoryId"
                {...field}
                className="mt-1 h-9 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isCategoriesLoading || !!categoriesError}
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          />
          {isCategoriesLoading && (
            <p className="mt-1 text-sm text-gray-600">Loading categories...</p>
          )}
          {categoriesError && (
            <p className="mt-1 text-sm text-red-600">Failed to load categories</p>
          )}
          {errors.CategoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.CategoryId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="Description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="Description"
            {...register('Description')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={4}
          />
          {errors.Description && (
            <p className="mt-1 text-sm text-red-600">{errors.Description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Product Image (Optional)
          </label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                className="mt-1 h-9 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            )}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
          )}
        </div>

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