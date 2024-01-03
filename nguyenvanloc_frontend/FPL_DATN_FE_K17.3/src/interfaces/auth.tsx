export interface IUser {
    id?: string
    _id?: string,
    first_name?: string
    last_name?: string
    password?: string
    confirmPassword?: string
    email?: string
    phone?: string
    address?: string,
    avatar?: IImage,
    role?: string,
    googeId?: string
    facebookId?: string
    authType?: string
    createdAt?: string,
    passwordResetToken?: string
    passwordResetExpires?: string
    passwordChangeAt?: string
    userId?: string;
    otp?: string
    accessToken?: string | number
}

export interface IResetPassword {
    userId?: string;
    newPassword: string;
    confirmPassword: string;
}


export interface IChangPassword {
    currentPassword?: string;
    newPassword?: string;
}
  
export interface IImage {
    url: string;
    publicId: string;
}