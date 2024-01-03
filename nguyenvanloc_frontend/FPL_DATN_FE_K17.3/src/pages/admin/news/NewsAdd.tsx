import { useAddNewMutation } from '@/api/newsApi';
import { useAddImageMutation, useDeleteImageMutation } from '@/api/uploadApi';
import { INew } from '@/interfaces/new';
import { Button, Form, Input, Upload, UploadProps, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaUpload } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type FieldType = {
    new_name?: string;
    new_description?: string;
    new_image?: object;
};
const NewsAdd = () => {
    const [addNew, resultAdd] = useAddNewMutation();
    const [addImage, resultImage] = useAddImageMutation();
    const [deleteImage, resultDelete] = useDeleteImageMutation();
    const [fileList, setFileList] = useState<RcFile[]>([]); // Khai báo state để lưu danh sách tệp đã chọn
    const [imageUrl, setImageUrl] = useState<any>({});
    const navigate = useNavigate();

    const onFinish = async (values: INew) => {
        try {
            if (Object.keys(imageUrl).length > 0) {
                values.new_image = imageUrl;
                const data = await addNew(values).unwrap();
                if (data) {
                    toast.success(data.message);
                }
                navigate('/admin/news');
            } else {
                return;
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
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const props: UploadProps = {
        name: 'new_image',
        fileList: fileList, // Sử dụng state fileList
        customRequest: async ({ file }: any) => {
            // eslint-disable-next-line no-constant-condition
            if (false) {
                console.log(file);
            }
        },
        onChange(info: any) {
            if (info.file) {
                const formData = new FormData();
                formData.append('images', info.file.originFileObj);
                try {
                    (async () => {
                        if (info.file.status === 'uploading') {
                            const response: any = await addImage(formData);
                            if (response.data && response.data.urls) {
                                info.file.status = 'done';
                                setFileList(info.fileList);
                                setImageUrl(response.data.urls[0]);
                            }
                        }
                    })();
                } catch (error) {
                    console.error(error);
                }
                if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                } else if (info.file.status === 'removed') {
                    const publicId = imageUrl.publicId;
                    (async () => {
                        await deleteImage(publicId);
                        const removedFile = info.file;
                        const updatedFileList = fileList.filter(
                            (item) => item.uid !== removedFile.uid,
                        );
                        setFileList(updatedFileList);
                        setImageUrl({});
                    })();
                }
                if (info.fileList.length > 1) {
                    const updatedFileList: any = [info.fileList[0]];
                    setFileList(updatedFileList);
                }
            }
        },
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4 pl-5  text-3xl">Thêm tin tức</h5>
                    <div className="flex items-center "></div>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 1000, height: 1000 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Tiêu đề"
                            name="new_name"
                            labelCol={{ span: 24 }} // Đặt chiều rộng của label
                            wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                            rules={[
                                { required: true, message: 'Tiêu đề bắt buộc nhập!' },
                                { min: 2, message: 'Nhập ít nhất 2 ký tự' },
                                {
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.resolve();
                                        }
                                        if (/ {2,}/.test(value)) {
                                            return Promise.reject(
                                                'Không được nhập liên tiếp các khoảng trắng!',
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            hasFeedback
                            style={{ marginLeft: '20px' }}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Mô tả"
                            name="new_description"
                            labelCol={{ span: 24 }} // Đặt chiều rộng của label
                            wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input (tăng giá trị span)
                            rules={[
                                { required: true, message: 'Mô tả bắt buộc nhập!' },
                                { min: 10, message: 'Nhập ít nhất 10 ký tự' },
                                {
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.resolve();
                                        }
                                        if (/ {2,}/.test(value)) {
                                            return Promise.reject(
                                                'Không được nhập liên tiếp các khoảng trắng!',
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            hasFeedback
                            style={{ marginLeft: '20px' }}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                            id="images"
                            name="new_image"
                            label="Ảnh"
                            rules={[{ required: true, message: 'Trường ảnh không được để trống' }]}
                            hasFeedback
                        >
                            <Upload
                                {...props}
                                maxCount={1}
                                listType="picture"
                                multiple
                                fileList={fileList}
                                beforeUpload={(file) => {
                                    // Kiểm tra kích thước của tệp
                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                    // Kiểm tra loại tệp
                                    const isImage = file.type.startsWith('image/');
                                    if (!isLt2M) {
                                        message.error('Ảnh phải nhỏ hơn 2MB!');
                                    } else if (!isImage) {
                                        message.error('Chỉ được tải lên các tệp ảnh!');
                                    } else {
                                        setFileList([file]);
                                    }
                                    // Trả về false để ngăn chặn việc tải lên nếu kích thước tệp lớn hơn 2MB hoặc không phải là ảnh
                                    return isLt2M && isImage;
                                }}
                            >
                                <Button icon={<FaUpload />}>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 16 }}>
                            <Button
                                className=" h-10 bg-red-500 text-xs text-white ml-5"
                                disabled={resultImage.isLoading || resultDelete.isLoading}
                                htmlType="submit"
                            >
                                {resultAdd.isLoading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                                ) : (
                                    ' Thêm tin tức'
                                )}
                            </Button>
                            <Button
                                className=" h-10 bg-blue-500 text-xs text-white ml-5"
                                onClick={() => navigate('/admin/news')}
                                htmlType="submit"
                            >
                                Danh sách tin tức
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default NewsAdd;
