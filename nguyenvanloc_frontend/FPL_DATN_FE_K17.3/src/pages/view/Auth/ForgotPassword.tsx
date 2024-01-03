import { useForgotPasswordMutation } from "@/api/authApi";
import { IUser } from "@/interfaces/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const ForgotPassword = () => {
  const [forgotPassword, resultAdd] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<IUser>();

  const onSubmit: SubmitHandler<IUser> = async data => {
    try {
      const response: any = await forgotPassword(data).unwrap();
      if (response) {
        toast.success(response.otpResponse.message)
        navigate(`/forgotpassword/verifyOTPForgotPassword/${response?.otpResponse.data.userId}`);
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
              style={{
                backgroundImage: 'url("https://res.cloudinary.com/dkvghcobl/image/upload/v1700831822/p4mtyilwfy22vt8rnjj4.png")',
                height: '400px',
                objectFit: 'cover'
              }}
            ></div>
            <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
              <h3 className="pt-4 text-3xl text-center">QUÊN MẬT KHẨU</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                <div className="mb-6">
                  <label className="block mb-4   text-sm font-bold text-gray-700" >
                    Vui lòng nhập email :
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                    {...register('email', { required: true, pattern: /^[^\s].*[^\s]$/ })}
                  />
                  {errors.email && errors.email.type === 'pattern' && (
                    <p className="text-red-500 text-xs italic">Email không được chứa dấu cách.</p>
                  )}
                </div>

                <div className=" text-center">
                  {resultAdd.isLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                  ) : (
                    <button
                      className="w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Gửi mã OTP
                    </button>
                  )}
                </div>
              </form>
              <p className="text-center text-sm text-gray-600">
                Vui lòng check email của bạn để được hướng dẫn đặt lại mật khẩu!
              </p>
              <div className="mb-2 text-center relative">
                <div className="flex justify-between items-center">
                  <hr className="border-t w-1/3" />
                  <hr className="border-t w-1/3" />
                  <hr className="border-t w-1/3" />
                </div>
              </div>
              <div className="flex items-center mb-4">
                <Link onClick={scrollToTop} to="/signin" className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 no-underline">
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}><IoMdArrowRoundBack /></span>
                    QUAY LẠI ĐĂNG NHẬP
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-300 p-4 rounded-b-lg"></div>
    </div>
  );
};
export default ForgotPassword;
