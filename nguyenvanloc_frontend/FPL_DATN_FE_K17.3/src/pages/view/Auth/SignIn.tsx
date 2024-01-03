import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineGoogle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { useSignInMutation } from '@/api/authApi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IUser } from '@/interfaces/auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';



const Login = () => {
    const [signIn, resultAdd] = useSignInMutation();
    const { register, handleSubmit, formState: { errors } } = useForm<IUser>()
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_LOGIN_GOOGLE;
    }
    useEffect(() => {
        const currentURL = window.location.href;
        const url = new URL(currentURL);
        const type = url.searchParams.get("signin");
        if (type && type == 'failure') {
            toast.error("Gmail đã được đăng ký ở dạng thường!");
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const passwordInputType = showPassword ? 'text' : 'password';
    const eyeIcon = showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />;

    const onSubmit: SubmitHandler<IUser> = async (data: IUser) => {
        try {
            const response: any = await signIn(data).unwrap();
            if (response) {
                toast.success(response.message)
                navigate("/")
            }
            const accessToken: IUser = response.accessToken;
            const expirationTime = new Date().getTime() + 5 * 60 * 60 * 1000; // 2 giờ
            const dataToStore = { accessToken, expirationTime };
            localStorage.setItem('accessToken', JSON.stringify(dataToStore));
        } catch (error: any) {
            if (error.data && error.data.message === 'Vui lòng xác minh tài khoản trước khi đăng nhập') {
                toast.error(error.data.message);
                navigate(`/signup/verifyOTP/${error.data?.otpResponse?.data?.userId}`);
            } else {
                toast.error(error.data?.message);
            }
        }
    }
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
                            style={{ backgroundImage: 'url("https://res.cloudinary.com/dkvghcobl/image/upload/v1700830330/vood2p0tjs5posddk3cu.png")' }}
                        ></div>
                        <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
                            <h3 className="pt-4 text-3xl text-center">ĐĂNG NHẬP 🔑</h3>
                            <form onSubmit={handleSubmit(onSubmit)} className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
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
                                        <p className="text-red-500 text-xs italic">Email không được chứa dấu cách.</p>
                                    )}

                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-bold text-gray-700" >
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
                                        <p className="text-red-500 text-xs italic">Mật khẩu không được chứa dấu cách.</p>
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
                                            Đăng nhập ngay!
                                        </button>
                                    )}

                                </div>
                                <div className="text-left">
                                    <Link to="/forgotpassword" className="inline-block text-sm text-blue-700 align-baseline no-underline">
                                        Quên mật khẩu?
                                    </Link>
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
                                    <span>Bạn chưa có tài khoản? </span>
                                    <Link onClick={scrollToTop} to="/signup" className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 no-underline">
                                        Đăng ký!
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
export default Login;