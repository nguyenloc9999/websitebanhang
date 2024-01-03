import { IImage } from "./auth"
export interface INew {
    _id: string
    id: string | number
    new_name: string
    new_image: IImage
    new_description: string
    category_image: IImage
}