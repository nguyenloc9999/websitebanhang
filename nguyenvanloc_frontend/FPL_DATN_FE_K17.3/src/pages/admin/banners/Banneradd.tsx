import { useAddBannerMutation } from '@/api/bannerApi';
import { useAddImageMutation, useDeleteImageMutation } from '@/api/uploadApi';
import { IImage } from '@/interfaces/auth';
import { IBanner } from '@/interfaces/banner';
import { Button, Form, Upload, UploadProps, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import { FaUpload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';



const Banneradd = () => {
    const [addBanner, resultAdd] = useAddBannerMutation();
    const [addImage, resultImage] = useAddImageMutation();
    const [deleteImage, resultDelete] = useDeleteImageMutation();

    // Khai báo state để lưu danh sách tệp đã chọn
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [imageUrl, setImageUrl] = useState<IImage>({ url: '', publicId: '' });
    const navigate = useNavigate();

    const onFinish = async (values: IBanner) => {
        if (Object.keys(imageUrl).length > 0) {
            values.image = imageUrl;
            const data = await addBanner(values).unwrap();
            if (data) {
                toast.success(data.message);
            }
            navigate("/admin/banners");
        } else {
            return
        }
    };


    const props: UploadProps = {
        name: 'image',
        // Sử dụng state fileList
        fileList: fileList,
        customRequest: async ({ file }) => {
            console.log(file);
        },
        onChange(info: any) {
            if (info.file) {
                const formData = new FormData();
                formData.append('images', info.file.originFileObj);
                try {
                    (async () => {
                        if (info.file.status === 'uploading') {
                            const response: any = await addImage(formData);
                            console.log(response);

                            if (response.data && response.data.urls) {
                                info.file.status = 'done'
                                setFileList(info.fileList);
                                setImageUrl(response.data.urls[0])
                            }
                        }
                    })()
                } catch (error) {
                    console.log(error);
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
                        setImageUrl({} as IImage);
                    })();
                } if (info.fileList.length > 1) {
                    const updatedFileList = [info.fileList[0]];
                    setFileList(updatedFileList);
                }
            }
        },
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4 pl-5 text-3xl">Thêm ảnh quảng cáo</h5>
                    <div className="flex items-center ">
                    </div>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 1000, height: 1000 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                            id="images" name="image" label="Ảnh" rules={[{ required: true, message: 'Trường ảnh không được để trống' }]}
                            hasFeedback
                        >
                            <Upload {...props} maxCount={1} listType="picture" multiple
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
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 16 }}>
                            <Button className=" h-10 bg-red-500 text-xs text-white ml-5"
                                disabled={resultImage.isLoading || resultDelete.isLoading}
                                htmlType="submit">
                                {resultAdd.isLoading ? <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div> : "Thêm Banner"}
                            </Button>
                            <Button className=" h-10 bg-blue-500 text-xs text-white ml-5" onClick={() => navigate("/admin/banners")} htmlType="submit">
                                Danh sách banner
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Banneradd