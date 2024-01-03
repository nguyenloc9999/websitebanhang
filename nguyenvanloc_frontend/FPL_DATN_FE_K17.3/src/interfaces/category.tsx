import { IImage } from "./auth"

export interface ICategory {
  _id?: string
  id: string | number
  category_name?: string
  category_image?: IImage
}