import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/api";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
    productName: z.string().min(1, "Product name is required"),
    stock: z.number().min(0, "Stock must be non-negative"),
    price: z.number().positive("Price must be positive"),
    cost: z.number().positive("Cost must be positive"),
    description: z.string().optional(),
    productImage: z.instanceof(File).optional().or(z.literal(null)),
});

interface UpdateProductDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    productId: string | null;
    onClose?: () => void;
}

const UpdateProductDialog: React.FC<UpdateProductDialogProps> = ({
    isOpen,
    setIsOpen,
    productId,
    onClose,
}) => {
    // Fetch product data
    const { data: product, isLoading, error } = api.product.GetProductById.useQuery(productId || "", {
        enabled: isOpen && !!productId,
    });

    // Form setup
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            stock: 0,
            price: 0,
            cost: 0,
            description: "",
            productImage: null,
        },
    });

    // Update form with fetched data
    useEffect(() => {
        if (product) {
            form.reset({
                productName: product.productName || "",
                stock: product.stock || 0,
                price: product.price || 0,
                cost: product.cost || 0,
                description: product.description || "",
                productImage: null,
            });
        }
    }, [product, form]);

    // Update mutation
    const { mutate, isPending: isMutating } = api.product.updateProduct.useMutation({
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["products"] });
            form.reset();
            handleClose();
        },
        onError: (error) => {
            form.setError("root", { message: `Failed to update product: ${error.message}` });
        },
    });
    const queryClient = useQueryClient();
    const onSubmit = (values: z.infer<typeof formSchema>) => {

        const formData = new FormData();
        formData.append('ProductId', productId || "");
        if (values.productName) formData.append('ProductName', values.productName);

        formData.append('Stock', values.stock.toString());
        formData.append('Price', values.price.toString());
        formData.append('Cost', values.cost.toString());
        formData.append('CategoryId', product?.categoryId || "");
        formData.append('Description', values.description || "");
        if (values.productImage) {
            formData.append('imageFile', values.productImage);
        }
        mutate(formData);
    };

    const handleClose = () => {
        setIsOpen(false);
        form.reset();
        if (onClose) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="p-4 rounded-2xl shadow-md bg-gray-500 text-white max-w-md z-[1000]">
                <DialogHeader>
                    <DialogTitle>Update Product</DialogTitle>
                </DialogHeader>
                {isLoading && <div className="text-center">Loading product details...</div>}
                {error && (
                    <div className="text-center text-red-500">
                        Failed to load product: {error.message}
                    </div>
                )}
                {!isLoading && !error && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Product Name */}
                            <FormField
                                control={form.control}
                                name="productName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter product name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Stock */}
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                placeholder="Enter stock quantity"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Price */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                placeholder="Enter price"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Cost */}
                            <FormField
                                control={form.control}
                                name="cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cost</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                placeholder="Enter cost"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Enter description" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Image Section */}
                            <div className="flex items-start gap-4 sm:gap-2">
                                {product?.image && (
                                    <div className="flex-shrink-0">
                                        <FormLabel>Current Image</FormLabel>
                                        <img
                                            src={`https://localhost:7164${product.image}`}
                                            alt={product.productName || "Product Image"}
                                            className="w-16 h-16 object-cover rounded mt-1"
                                            onError={(e) => {
                                                e.currentTarget.src = "/fallback-image.jpg";
                                            }}
                                        />
                                    </div>
                                )}
                                <FormField
                                    control={form.control}
                                    name="productImage"
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                            <FormLabel>New Product Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="mt-1"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        field.onChange(file);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* Form Error */}
                            {form.formState.errors.root && (
                                <div className="text-red-500 text-sm">
                                    {form.formState.errors.root.message}
                                </div>
                            )}
                            {/* Buttons */}
                            <div className="flex justify-end space-x-2">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-white border-white hover:bg-gray-700"
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={isMutating}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isMutating ? "Updating..." : "Update"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProductDialog;