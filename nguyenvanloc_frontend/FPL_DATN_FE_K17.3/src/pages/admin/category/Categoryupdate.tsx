import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from '@/api/categoryApi';
import { useDeleteImageMutation, useUpdateImageMutation } from '@/api/uploadApi';
import { ICategory } from '@/interfaces/category';
import { Button, Form, Input, Skeleton, Upload, message } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type FieldType = {
    category_name?: string;
    category_image?: object;
};

const Categoryupdate = () => {
    const { id }: any = useParams();
    const { data: categories, isLoading, isError }: any = useGetCategoryByIdQuery(id);
    const [updateCategory, resultUpdate] = useUpdateCategoryMutation();
    const [updateImage, resultImage] = useUpdateImageMutation();
    const [deleteImage, resultDelete] = useDeleteImageMutation();
    const [fileList, setFileList] = useState<RcFile[]>([]); // Khai báo state để lưu danh sách tệp đã chọn
    const [imageUrl, setImageUrl] = useState<any>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (categories) {
            setFields();
        }
    }, [categories]);

    const [form] = Form.useForm();

    const setFields = () => {
        form.setFieldsValue({
            _id: categories.category?._id,
            category_name: categories.category?.category_name,
            category_image: categories.category?.category_image
                ? categories.category.category_image
                : {}, // Nếu có ảnh, thêm vào mảng để hiển thị
        });
    };

    const onFinish = async (values: ICategory) => {
        try {
            if (Object.keys(imageUrl).length > 0) {
                values.category_image = imageUrl;
            }
            const data: any = await updateCategory(values);
            if (data) {
                toast.success(`${data.data.message}`);
            }
            navigate('/admin/categories');
        } catch (error: any) {
            if (Array.isArray(error.data.message)) {
                // Xử lý trường hợp mảng
                const messages = error.data.message;
                messages.forEach((message: any) => {
                    toast.error(message);
                });
            } else {
                // Xử lý trường hợp không phải mảng
                toast.error(error.data.message);
            }
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const props: UploadProps = {
        name: 'category_image',
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
                            const response: any = await updateImage({
                                publicId: categories.category?.category_image?.publicId,
                                files: formData,
                            } as any);
                            if (response.data && response.data.publicId) {
                                info.file.status = 'done';
                                setFileList(info.fileList);
                                const publicId = response.data.publicId;
                                const url = response.data.url;
                                setImageUrl({ url: url, publicId: publicId });
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

    if (isLoading) return <Skeleton />;
    if (isError || !categories || !categories.category) {
        return <div>Error: Unable to fetch category data.</div>;
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4 pl-5">Cập Nhật Danh Mục</h5>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 1000 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item label="" name="_id" style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Tên danh mục"
                            name="category_name"
                            labelCol={{ span: 24 }} // Đặt chiều rộng của label
                            wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                            style={{ marginLeft: '20px' }}
                            rules={[
                                { required: true, message: 'Tên danh mục không được để trống!' },
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
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }} // Đặt chiều rộng của label
                            wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                            style={{ marginLeft: '20px' }}
                            id="images"
                            name="category_image"
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
                                beforeUpload={file => {
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
                            {Object.keys(imageUrl).length <= 0 &&
                                categories.category.category_image &&
                                categories.category.category_image.url && (
                                    <div className="mt-3">
                                        <img
                                            src={categories.category.category_image.url}
                                            alt="Ảnh danh mục hiện tại"
                                            style={{ maxWidth: '100px' }}
                                        />
                                    </div>
                                )}
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 16 }}>
                            <Button
                                className=" h-10 bg-red-500 text-xs text-white ml-5"
                                disabled={resultImage.isLoading || resultDelete.isLoading}
                                htmlType="submit"
                            >
                                {resultUpdate.isLoading ? (
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    ' Cập nhật danh mục'
                                )}
                            </Button>
                            <Button
                                className=" h-10 bg-blue-500 text-xs text-white ml-5"
                                onClick={() => navigate('/admin/categories')}
                                htmlType="submit"
                            >
                                Danh sách danh mục
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Categoryupdate;
