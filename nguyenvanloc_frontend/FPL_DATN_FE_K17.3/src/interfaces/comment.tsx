import { IImage } from "./auth"

export interface IComment {
    _id?: string
    id?: string
    userId?: string
    productId?: string
    description?: string
    rating?: number | any
    image?: IImage
    orderId?: string
    product?: string
    product_name?: string
    comments_count?: number
    STT?: number
    key?: string | number
    item?: string | number
    createdAt?: Date | any
    comment?: number | string
}