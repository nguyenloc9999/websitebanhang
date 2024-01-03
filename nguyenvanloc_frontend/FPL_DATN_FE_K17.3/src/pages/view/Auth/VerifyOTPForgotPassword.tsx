import { useGetUserByIdQuery, useResendNewForgotOTPMutation, useVerifyOTPResetPasswordMutation } from "@/api/authApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Input, Button } from 'antd';
import { useEffect, useState } from "react";
import { SiMinutemailer } from "react-icons/si";

const VerifyOTPForgotPassword = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: any }>();
    const [verifyOTPResetPassword] = useVerifyOTPResetPasswordMutation();
    const [resendNewForgotOTP] = useResendNewForgotOTPMutation();
    const { data } = useGetUserByIdQuery(userId || "");
    const email = data?.email
    const [resendEnabled, setResendEnabled] = useState(false);
    const [timer, setTimer] = useState(180); // 3 phút = 180 giây
    const [form] = Form.useForm();


    // Set thời gian
    useEffect(() => {
        let interval: any;
        if (resendEnabled) {
            interval = setInterval(() => {
                setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [resendEnabled]);


    const startResendTimer = async () => {
        if (!resendEnabled) {
            setResendEnabled(true);
            try {
                await resendNewForgotOTP({ userId, email: email });
            } catch (error) {
                console.error("Error Resend OTP:", error);
            }
            // Reset the timer after sending a new OTP
            setTimer(180);
        }
    };


    const handleContainerPaste = async (e: any) => {
        e.preventDefault();
        try {
            const clipboardText = await navigator.clipboard.readText();
            const otpArray = clipboardText.slice(0, 6).split('');
            otpArray.forEach((value, index) => {
                form.setFieldsValue({ [`OTP${index + 1}`]: value });
            });
        } catch (error) {
            console.error('Error reading from clipboard: ', error);
        }
    };

    const onFinish = async (values: any) => {
        try {
            const { OTP1, OTP2, OTP3, OTP4, OTP5, OTP6 } = values;
            const combinedOTP = `${OTP1}${OTP2}${OTP3}${OTP4}${OTP5}${OTP6}`;
            const response: any = await verifyOTPResetPassword({ userId, otp: combinedOTP }).unwrap();
            if (response) {
                toast.success(response.message);
                navigate(`/forgotpassword/resetPassword/${response.user._id}`)
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
        <div className='h-80'>
            <Form onFinish={onFinish} form={form} layout="vertical">
                <h3 className="pt-4 text-3xl text-center mb-4">Nhập mã OTP để đổi mật khẩu</h3>
                <div
                    style={{ display: 'flex', justifyContent: 'center' }}
                    onPaste={handleContainerPaste}
                >
                    <div className="flex space-x-4">
                        {[...Array(6).keys()].map((index) => (
                            <Form.Item
                                key={index}
                                name={`OTP${index + 1}`}
                                rules={[{ required: true, message: 'Nhập mã' }]}
                                style={{ textAlign: 'center' }}
                            >
                                <Input
                                    type="text"
                                    maxLength={1}
                                    style={{ width: '40px', height: '40px', textAlign: 'center' }}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        if (value && index < 5) {
                                            form.setFieldsValue({ [`OTP${index + 2}`]: '' });
                                            form.getFieldInstance(`OTP${index + 2}`)?.focus();
                                        }
                                    }}
                                />
                            </Form.Item>
                        ))}
                    </div>
                </div>
                <div className="mt-2 text-center">
                    {resendEnabled && timer > 0 ? (
                        <p className="text-center">
                            Bạn chưa nhận được mã?  Thử lại sau {timer} giây.
                        </p>
                    ) : (
                        <p className="text-center">
                            Mã xác nhận đã được gửi đến gmail của bạn!
                            <span
                                className="text-blue-500 cursor-pointer ml-2 inline-flex items-center"
                                onClick={startResendTimer}
                            >
                                Gửi lại mã
                                <span className="ml-1">
                                    <SiMinutemailer />
                                </span>
                            </span>
                        </p>
                    )}
                </div>
                <div className="mt-4 text-center">
                    <Button
                        htmlType="submit"
                        className="w-80 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none focus:shadow-outline"
                    >
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </div>
    );
}


export default VerifyOTPForgotPassword;
