import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineGoogle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUpMutation } from '@/api/authApi';
import { useForm, SubmitHandler } from 'react-hook-form'
import { IUser } from '@/interfaces/auth';
import { useState } from 'react';
import { toast } from 'react-toastify';



const Signup = () => {
    const [signUp, resultAdd] = useSignUpMutation()
    const { register, handleSubmit, formState: { errors } } = useForm<IUser>();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_LOGIN_GOOGLE;
    }
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

    const onSubmit: SubmitHandler<IUser> = async (data: IUser) => {
        try {
            const response: any = await signUp(data);
            if (response.error) {
                toast.error(response.error.data.messsage);
                if (response.error && response.error.data && response.error.data.message[0]) {
                    const messages = response.error.data.message;
                    messages.forEach((message: any) => {
                        toast.error(message);
                    });
                }
            } else {
                if (response.data?.user?.confirmed) {
                    toast.success('Tài khoản đã được xác nhận!');
                } else {
                    toast.success('Vui lòng xác minh tài khoản!');
                    navigate(`/signup/verifyOTP/${response?.data?.user?._id}`);
                }
            }
        } catch (error: any) {
            console.log(error);

            toast.error(error.data.message);
        }
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Cuộn mượt
        });
    };
    return (
        <div className="system-ui bg-gray-300">
            <div className="container mx-auto">
                <div className="flex justify-center my-12">
                    <div className="w-full xl:w-3/4 lg:w-11/12 flex">
                        <div
                            className="w-full h-auto bg-gray-400 hidden lg:block lg:w-6/12 bg-cover rounded-l-lg"
                            style={{
                                backgroundImage: 'url("https://res.cloudinary.com/dkvghcobl/image/upload/v1700830393/kxezpbocqy36krmssbg8.png")',
                                height: '400px',
                                objectFit: 'cover'
                            }}
                        ></div>
                        <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
                            <h3 className="pt-4 text-3xl text-center">ĐĂNG KÝ TÀI KHOẢN! 👤</h3>
                            <form onSubmit={handleSubmit(onSubmit)} className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                                <div className="mb-4 md:flex md:justify-between">
                                    <div className="mb-4 md:mr-2 md:mb-0">
                                        <label className="block mb-2 text-sm font-bold text-gray-700" >
                                            Tên
                                        </label>
                                        <input
                                            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                            id="firstName"
                                            type="text"
                                            placeholder="Tên"
                                            {...register('first_name', { required: true, pattern: /^[^\s].*[^\s]$/ })}
                                        />
                                        {errors.first_name && errors.first_name.type === 'pattern' && (
                                            <p className="text-red-500 text-xs italic">Không được chứa dấu cách.</p>
                                        )}
                                    </div>
                                    <div className="md:ml-2">
                                        <label className="block mb-2 text-sm font-bold text-gray-700" >
                                            Họ
                                        </label>
                                        <input
                                            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                            id="lastName"
                                            type="text"
                                            placeholder="Họ"
                                            {...register('last_name', { required: true, pattern: /^[^\s].*[^\s]$/ })}
                                        />
                                        {errors.last_name && errors.last_name.type === 'pattern' && (
                                            <p className="text-red-500 text-xs italic">Không được chứa dấu cách.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" >
                                        Email
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        {...register('email', { required: true, pattern: /^[^\s].*[^\s]$/ })}
                                    />
                                    {errors.email && errors.email.type === 'pattern' && (
                                        <p className="text-red-500 text-xs italic">Không được chứa dấu cách.</p>
                                    )}
                                </div>
                                <div className="mb-4 md:flex md:justify-between">
                                    <div className="mb-4 md:mr-2 md:mb-0">
                                        <label className="block mb-2 text-sm font-bold text-gray-700">
                                            Mật khẩu
                                        </label>
                                        <div className="relative">
                                            <input
                                                className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : 'border'}`}
                                                id="password"
                                                type={passwordInputType}
                                                placeholder="******************"
                                                {...register('password', { required: true, pattern: /^[^\s].*[^\s]$/ })}
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 mt-2 mr-2"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {eyeIcon}
                                            </button>
                                        </div>
                                        {errors.password && errors.password.type === 'pattern' && (
                                            <p className="text-red-500 text-xs italic">Không được chứa dấu cách.</p>
                                        )}
                                    </div>
                                    <div className="md:ml-2">
                                        <label className="block mb-2 text-sm font-bold text-gray-700">
                                            Xác nhận mật khẩu
                                        </label>
                                        <div className="relative">
                                            <input
                                                className={`w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                                id="confirmPassword"
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
                                            <p className="text-red-500 text-xs italic">Không được chứa dấu cách.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-6 text-center">
                                    {resultAdd.isLoading ? (
                                        <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                                    ) : (
                                        <button
                                            className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none focus:shadow-outline"
                                            type="submit"
                                        >
                                            ĐĂNG KÝ NGAY
                                        </button>
                                    )}

                                </div>
                                <div className="mb-6 text-center relative">
                                    <div className="flex justify-between items-center">
                                        <hr className="border-t w-1/3" />
                                        <p className="text-sm bg-white">HOẶC</p>
                                        <hr className="border-t w-1/3" />
                                    </div>
                                </div>
                                <div className="mb-4 flex justify-between ml-4">
                                    <button
                                        className="flex-1 px-3 py-2 text-sm leading-tight text-white bg-red-500 border rounded shadow appearance-none focus:outline-none focus:shadow-outline flex items-center justify-center"
                                        onClick={handleGoogleLogin}
                                    >
                                        <AiOutlineGoogle style={{ marginRight: '4px' }} />Google
                                    </button>
                                    <div className="mx-2"></div>
                                </div>
                                <div className="text-center">
                                    <span> Bạn đã có tài khoản? </span>
                                    <Link onClick={scrollToTop} to="/signin" className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 no-underline">
                                        Đăng nhập!
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-300 p-4 rounded-b-lg"></div>
        </div>
    )
}
export default Signup
