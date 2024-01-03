import { IProduct } from "./product"


export interface InputCustomizedProduct {
    product_name?: string
    product_price?: number
    image?: string
    stock_quantity?: number
    description?: string
    categoryId?: string
    brandId?: string
    colorId?: string
    sizeId?: string
    materialId?: string
}

export interface ICustomizedProduct {
    _id: string
    id: string
    message: string
    data: {
        products: IProduct[]
        total: number
        userId: string
        productId: string
    }
}