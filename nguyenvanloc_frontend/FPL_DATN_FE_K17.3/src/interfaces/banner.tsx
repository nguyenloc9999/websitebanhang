import { IImage } from "./auth"
export interface IBanner {
  _id?: string
  id: string | number,
  uid: string;
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  size: number;
  type: string;
  webkitRelativePath: string;
  image?: IImage
}