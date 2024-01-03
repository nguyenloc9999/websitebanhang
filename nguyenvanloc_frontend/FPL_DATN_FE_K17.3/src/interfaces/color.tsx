export interface IColor {
    _id?: string
    id?: string
    colors_name?: string
    color_price?: number | string
}

export interface IColorData {
    color: IColor[]
}