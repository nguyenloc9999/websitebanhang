export interface IProduct {
    id?: string
    product_name?: string;
    product_price?: number;
    image?: {
        url?: string;
        publicId?: string;
    };
    sold_quantity?: number;
    views?: number;
    description?: string;
    categoryId?: string;
    brandId?: string;
    materialId?: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: string;
}