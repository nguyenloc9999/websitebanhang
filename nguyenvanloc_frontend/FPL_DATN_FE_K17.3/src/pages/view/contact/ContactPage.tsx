import { Button, Form, Input } from 'antd';
import './contactPage.css';
import { useAddContactMutation } from '@/api/contactApi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
const ContactPage = () => {
    const [addContact, resultAdd] = useAddContactMutation();
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 22 },
    };

    const onFinish = async (values: any) => {
        try {
            const data:any = await addContact(values).unwrap();
            if(data){
                toast.success(data.message);
            }
        } catch (error:any) {
            toast.error(error.data.message);
        }
    };

    const validateNoSpaces = (_: any, value: any) => {
        if (value && value.trim()) {
            return Promise.resolve();
        } else {
            return Promise.reject('Vui lòng không nhập dấu cách!');
        }
    };

    return (
        <div>
            <div className="App">
                <h1 className="text-4xl font-bold py-8 text-center">Địa chỉ liên hệ</h1>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7448.881391979301!2d105.7725777764121!3d21.015045600000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454aa6e1ff1f5%3A0xddcadef454134a5a!2zQ-G7rWEgSMOgbmcgTuG7mWkgVGjhuqV0IENhc2E!5e0!3m2!1svi!2s!4v1696931063075!5m2!1svi!2s"
                    width="1500"
                    height="500"
                    style={{ border: 0, margin: 'auto' }}
                    className="custom-iframe"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ml-4 mt-10">
                <div className="rounded-lg">
                    <div className="title text italic text opacity-70">Nội thất Casa</div>
                    <h4 className="mt-2">BẠN CÓ BẤT KỲ CÂU HỎI NÀO?</h4>
                    <p className="opacity-70 mt-2 mb-10">Nội thất Casa cam kết cung cấp giải pháp thương mại điện tử với trải nghiệm mua sắm tốt nhất cho người tiêu dùng trong định hình phong cách sống hiện đại và mua sắm nội thất tại Việt Nam. Mọi thông tin liên hệ xin gửi vào form dưới đây hoặc liên hệ chúng tôi theo địa chỉ.</p>
                    <div className="font-semibold float-left ">Địa Chỉ : <p className="font-normal ml-1 float-right ">Số 668, Xuân Phương, Nam Từ Liêm, Hà Nội</p></div> <br /> <br />
                    <div className="font-semibold float-left ">Điện Thoại : <p className="font-normal ml-1 float-right">1900 6750</p></div> <br /> <br />
                    <div className="font-semibold float-left">Email : <p className="font-normal ml-1 float-right">noithatcasa@gmail.com</p></div> <br />
                </div>
                <div className="rounded-lg mt-12 ">
                    <Form
                        {...layout}
                        name="nest-messages"
                        onFinish={onFinish}
                        className="centered-form"
                        form={form}
                    >

                        <Form.Item name={['contact_name']} rules={[{ required: true, message: "Vui lòng nhập họ tên" }, { validator: validateNoSpaces }]}>
                            <Input placeholder="Họ tên" style={{ width: '100%', height: '40px' }} />
                        </Form.Item>
                        <Form.Item name={['contact_email']} rules={[{ required: true, message: 'Vui lòng nhập Email!' }, { type: 'email', message: "Vui lòng nhập đúng định dạng email" }, { validator: validateNoSpaces }]}>
                            <Input placeholder="Email" style={{ width: '100%', height: '40px' }} />
                        </Form.Item>
                        <Form.Item name={['contact_phone']} rules={[
                            {
                                pattern: /^[0-9]{10}$/,
                                message: 'Vui lòng nhập đúng định dạng số điện thoại!',
                            },
                            { required: true, message: "Vui lòng nhập số điện thoại " },
                            { validator: validateNoSpaces }
                        ]}
                        >
                            <Input placeholder="Số điện thoại" style={{ width: '100%', height: '40px' }} />
                        </Form.Item>
                        <Form.Item name={['contact_description']} rules={[{ required: true, message: "Vui lòng nhập mô tả" },
                        { validator: validateNoSpaces }]}>
                            <Input.TextArea placeholder="Mô tả" style={{ width: '100%', resize: 'vertical', height: '100' }} />
                        </Form.Item>
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                            {resultAdd.isLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                            ) : (
                                <Button style={{ background: "orange", float: 'right', marginRight: '60px', color: 'white', width: '150px', height: '40px' }} htmlType="submit" >
                                    Gửi Tin Nhắn
                                </Button>
                            )}

                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ContactPage