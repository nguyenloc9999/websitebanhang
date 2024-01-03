export interface ICoupon{
    _id: string,
    id: string,
    coupon_name: string,
    coupon_code: string,
    coupon_content: string,
    coupon_quantity: number,
    discount_amount: number,
    expiration_date: Date,
    min_purchase_amount: number,
    item: string | number
}