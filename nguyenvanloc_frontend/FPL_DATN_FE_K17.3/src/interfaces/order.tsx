import { IProduct } from "./product"

export interface InputOrder {
    productId?: string
    product_name?: string
    product_price?: number
    image?: string
    sizeId?: string
    colorId?: string
    materialId?: string
    hasReviewed?: boolean
    deposit?: number
    status?: string
    phone?: string
    address?: string
    notes?: string
    paymentId?: string
    paymentCode?: string
    payerId?: string
}
export interface IOrder {
    _id?: string
    id?: string
    message: string
    data: {
        products?: IProduct[]
        total?: number
        userId?: string
        couponId?: string
        status?: any
    }
}