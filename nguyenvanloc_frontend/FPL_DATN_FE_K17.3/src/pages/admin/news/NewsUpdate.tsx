
import { useGetNewByIdQuery, useUpdateNewMutation } from '@/api/newsApi';
import { useDeleteImageMutation, useUpdateImageMutation } from '@/api/uploadApi';
import { INew } from '@/interfaces/new';
import { Button, Form, Input, Skeleton, Upload, message } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaUpload } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


type FieldType = {
    new_name?: string;
    new_description?: string;
    new_image?: object;
};

const NewsUpdate = () => {
    const { id }: any = useParams();
    const { data: news, isLoading, isError }: any = useGetNewByIdQuery(id);
    const [updateNew, resultUpdate] = useUpdateNewMutation();
    const [updateImage, resultImage] = useUpdateImageMutation();
    const [deleteImage, resultDelete] = useDeleteImageMutation();
    const [fileList, setFileList] = useState<RcFile[]>([]); // Khai báo state để lưu danh sách tệp đã chọn
    const [imageUrl, setImageUrl] = useState<any>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (news) {
            setFields();
        }
    }, [news]);

    const [form] = Form.useForm();

    const setFields = () => {
        form.setFieldsValue({
            _id: news.news?._id,
            new_name: news.news?.new_name,
            new_description: news.news?.new_description,
            new_image: news.news?.new_image ? news.news.new_image : {}, // Nếu có ảnh, thêm vào mảng để hiển thị
        });
    };

    const onFinish = async (values: INew) => {
        try {
            if (Object.keys(imageUrl).length > 0) {
                values.new_image = imageUrl;
            }
            const data: any = await updateNew(values).unwrap();
            if (data) {
                toast.success(`${data.message}`);
            }
            navigate("/admin/news");
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
                            const response: any = await updateImage(({
                                publicId: news.news?.new_image?.publicId,
                                files: formData,
                            } as any));
                            if (response.data && response.data.publicId) {
                                info.file.status = 'done'
                                setFileList(info.fileList);
                                const publicId = response.data.publicId;
                                const url = response.data.url;
                                setImageUrl({ url: url, publicId: publicId })
                            }
                        }
                    })()
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
                        const updatedFileList = fileList.filter(item => item.uid !== removedFile.uid);
                        setFileList(updatedFileList);
                        setImageUrl({});
                    })();
                } if (info.fileList.length > 1) {
                    const updatedFileList: any = [info.fileList[0]];
                    setFileList(updatedFileList);
                }
            }
        },
    };

    if (isLoading) return <Skeleton />;
    if (isError || !news || !news.news) {

        return <div>Error: Unable to fetch new data.</div>;
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4 pl-5">Cập Nhật Tin Tức</h5>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 1000, }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item label="" name="_id" style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Tiêu đề"
                            name="new_name"
                            labelCol={{ span: 24 }} // Đặt chiều rộng của label
                            wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                            style={{ marginLeft: '20px' }}
                            rules={[{ required: true, message: 'Tiêu đề không được để trống!' },
                            { min: 2, message: "Nhập ít nhất 2 ký tự" },
                            {
                                validator: (_, value) => {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    if (/ {2,}/.test(value)) {
                                        return Promise.reject('Không được nhập liên tiếp các khoảng trắng!');
                                    }
                                    return Promise.resolve();
                                },
                            },
                            ]}
                            hasFeedback
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mô tả"
                            name="new_description"
                            labelCol={{ span: 24 }} // Đặt chiều rộng của label
                            wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                            style={{ marginLeft: '20px' }}
                            rules={[{ required: true, message: 'Mô tả không được để trống!' },
                            { min: 10, message: "Nhập ít nhất 10 ký tự" }, { whitespace: true, message: "không được nhập các khoảng trắng" }

                            ]}
                            hasFeedback
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }} // Đặt chiều rộng của label
                            wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                            style={{ marginLeft: '20px' }}
                            id="images" name="new_image" label="Ảnh" rules={[{ required: true, message: 'Trường ảnh không được để trống' }]}
                            hasFeedback
                        >
                            <Upload {...props} maxCount={1} listType="picture" multiple
                                fileList={fileList}
                                beforeUpload={file => {
                                    setFileList([file]);
                                }}>
                                <Button icon={<FaUpload />}>Chọn ảnh</Button>
                            </Upload>
                            {Object.keys(imageUrl).length <= 0 && news.news.new_image && news.news.new_image.url && (
                                <div className="mt-3">
                                    <img src={news.news.new_image.url} alt="Ảnh sản phẩm hiện tại" style={{ maxWidth: '100px' }} />
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 16 }}>

                            <Button className=" h-10 bg-red-500 text-xs text-white ml-5"
                                disabled={resultImage.isLoading || resultDelete.isLoading}
                                htmlType="submit">
                                {resultUpdate.isLoading ? <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                                    : " Cập nhật tin tức"}
                            </Button>
                            <Button className=" h-10 bg-blue-500 text-xs text-white ml-5" onClick={() => navigate("/admin/news")} htmlType="submit">
                                Danh sách tin tức
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default NewsUpdate