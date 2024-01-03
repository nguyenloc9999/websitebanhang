import { useResetPasswordMutation } from "@/api/authApi";
import { IResetPassword } from "@/interfaces/auth";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";



const ResetPassword = () => {
    const [resetPassword, resultAdd] = useResetPasswordMutation();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<IResetPassword>();
    const { userId } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const passwordInputType = showPassword ? 'text' : 'password';
    const confirmPasswordInputType = showConfirmPassword ? 'text' : 'password';
    const eyeIcon = showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />;
    const confirmEyeIcon = showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />;


    const onSubmit: SubmitHandler<IResetPassword> = async (data: IResetPassword) => {
        try {
            const response: any = await resetPassword({
                userId,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            }).unwrap();
            if (response) {
                toast.success(response.message);
                navigate("/signin");
            }
        } catch (error: any) {
            if (Array.isArray(error.data.message)) {
                const messages = error.data.message;
                messages.forEach((message: any) => {
                    toast.error(message);
                });
            } else {
                toast.error(error.data.message);
            }
        }

    };


    return (
        <div className="system-ui bg-gray-300">
            <div className="container mx-auto">
                <div className="flex justify-center my-12">
                    <div className="w-full xl:w-3/4 lg:w-11/12 flex">
                        <div
                            className="w-full h-auto bg-gray-400 hidden lg:block lg:w-6/12 bg-cover rounded-l-lg"
                            style={{ backgroundImage: 'url("https://res.cloudinary.com/dkvghcobl/image/upload/v1700835508/w2nhwllgmg7n0icwwglt.png")' }}
                        ></div>
                        <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
                            <h3 className="pt-4 text-3xl text-center">ĐẶT LẠI MẬT KHẨU</h3>
                            <form onSubmit={handleSubmit(onSubmit)} className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" >
                                        Mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errors.newPassword ? 'border-red-500' : 'border'}`}
                                            id="password"
                                            type={passwordInputType}
                                            placeholder="******************"
                                            {...register('newPassword', { required: true, pattern: /^[^\s].*[^\s]$/ })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 mt-2 mr-2"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {eyeIcon}
                                        </button>
                                    </div>
                                    {errors.newPassword && errors.newPassword.type === 'pattern' && (
                                        <p className="text-red-500 text-xs italic">Mật khẩu mới không được chứa dấu cách.</p>
                                    )}

                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" >
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : 'border'}`}
                                            id="password"
                                            type={confirmPasswordInputType}
                                            placeholder="******************"
                                            {...register('confirmPassword', { required: true, pattern: /^[^\s].*[^\s]$/ })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 mt-2 mr-2"
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {confirmEyeIcon}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && errors.confirmPassword.type === 'pattern' && (
                                        <p className="text-red-500 text-xs italic">Xác nhận mật khẩu mới không được chứa dấu cách.</p>
                                    )}
                                </div>

                                <div className="mb-6 text-center">
                                    {resultAdd.isLoading ? (
                                        <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                                    ) : (
                                        <button
                                            className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none focus:shadow-outline"
                                            type="submit"
                                        >
                                            Đặt mật khẩu mới
                                        </button>
                                    )}
                                </div>

                                <div className="mb-6 text-center relative">
                                    <div className="flex justify-between items-center">
                                        <hr className="border-t w-1/3" />
                                        <hr className="border-t w-1/3" />
                                        <hr className="border-t w-1/3" />
                                    </div>
                                </div>
                                <p className="text-center text-sm text-gray-600">
                                    Vui lòng quý khách lưu nhớ mật khẩu mới ^^
                                </p>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
            <div className="bg-gray-300 p-4 rounded-b-lg"></div>
        </div>
    );
};

export default ResetPassword;
