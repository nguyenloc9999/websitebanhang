import { useGetBrandQuery } from '@/api/brandApi';
import { useGetCategoryQuery } from '@/api/categoryApi';
import { useGetMaterialQuery } from '@/api/materialApi';
import { useAddProductMutation } from '@/api/productApi';
import { useAddImageMutation, useDeleteImageMutation } from '@/api/uploadApi';
import { Button, Form, Input, Upload, Select, message, InputNumber } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { useState } from 'react';
import { FaUpload } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IProduct } from '@/interfaces/product';
import { toast } from 'react-toastify';

type FieldType = {
    product_name?: string;
    product_price?: string;
    image?: any;
    description?: string;
    categoryId?: string;
    brandId?: string;
    materialId?: string;
};

const Productadd = () => {
    const [addProduct, resultAdd] = useAddProductMutation();
    const { data: categories } = useGetCategoryQuery<any>();
    const { data: brands } = useGetBrandQuery<any>();
    const { data: materials } = useGetMaterialQuery<any>();
    const [addImage, resultImage] = useAddImageMutation();
    const [deleteImage, resultDelete] = useDeleteImageMutation();
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [imageUrl, setImageUrl] = useState<any>([]);
    const navigate = useNavigate();
    const [productDescription, setProductDescription] = useState('');


    const onFinish = async (values: IProduct) => {
        try {
            values.description = productDescription
            if (imageUrl.length > 0) {
                values.image = imageUrl;
                const data: any = await addProduct(values).unwrap();
                if (data) {
                    toast.success(data.message);
                }
                navigate("/admin/products");
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
        name: 'image',
        fileList: fileList, // Sử dụng state fileList
        customRequest: async ({ file }: any) => {
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
                            if (response.data && response.data.urls) {
                                info.file.status = 'done'
                                info.file.uid = response.data.urls[0].publicId
                                setFileList(info.fileList);
                                setImageUrl((prevUrls: any) => [...prevUrls, response.data.urls[0]]);
                            }
                        }
                    })()
                } catch (error) {
                    console.error(error);
                }
                if (info.file.status === 'error') {
                    message.error(`${info.file.name} upload ảnh thất bại.`);
                } else if (info.file.status === 'removed') {
                    const publicId = info.file.uid;
                    (async () => {
                        await deleteImage(publicId);
                        const removedFile = info.file;
                        const updatedFileList = fileList.filter(item => item.uid !== removedFile.uid);
                        setFileList(updatedFileList);
                        const updateImage = imageUrl.filter((item: any) => item.publicId !== removedFile.uid);
                        setImageUrl(updateImage);
                    })();
                }
            }
        },
    };

    const validatePositiveNumber = (_: any, value: any) => {
        if (parseFloat(value) < 0) {
            return Promise.reject("Giá trị phải là số dương");
        }
        return Promise.resolve();
    }
    return (
        <div className="container-fluid mb-7">
            <div className="row">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4 pl-5  text-3xl">Thêm Sản Phẩm</h5>
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
                            label="Tên"
                            name="product_name"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Tên sản phẩm không được để trống!' },
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
                            { min: 2, message: "Nhập ít nhất 2 ký tự" }
                            ]}
                            hasFeedback
                            style={{ marginLeft: '20px' }}
                        >
                            <Input placeholder='Tên sản phẩm' />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Giá Niêm Yết"
                            name="product_price"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Trường giá không được để trống!' },
                            { validator: validatePositiveNumber },
                            { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}
                            style={{ marginLeft: '20px' }}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                            id="images" name="image" label="Ảnh" rules={[{ required: true, message: 'Ảnh không được để trống' }]}
                        >
                            <Upload {...props} listType="picture" multiple
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
                        <Form.Item
                            label="Danh mục"
                            name="categoryId"
                            rules={[{ required: true, message: 'Danh mục không được để trống!' }]}
                            hasFeedback
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                        >
                            <Select >
                                {categories && categories?.category.docs?.map((category: any) => {
                                    return <Select.Option key={category?._id} value={category._id}>{category?.category_name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Thương hiệu"
                            name="brandId"
                            rules={[{ required: true, message: 'Thương hiệu không được để trống!' }]}
                            hasFeedback
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                        >
                            <Select >
                                {brands && brands?.brand?.map((brand: any) => {
                                    return <Select.Option key={brand?._id} value={brand._id}>{brand?.brand_name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Vật liệu"
                            name="materialId"
                            rules={[{ required: true, message: 'Vật liệu không được để trống!' }]}
                            hasFeedback
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                        >
                            <Select >
                                {materials && materials?.material?.map((mate: any) => {
                                    return <Select.Option key={mate?._id} value={mate._id}>{mate?.material_name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mô tả"
                            name="description"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            hasFeedback
                            style={{ marginLeft: '20px' }}
                        >
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    mediaEmbed: {
                                        previewsInData: true
                                    }
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setProductDescription(data);
                                    if (false) {
                                        console.log(event);
                                    }
                                }}
                            />
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 16 }}>
                            <Button className=" h-10 bg-red-500 text-xs text-white ml-5"
                                disabled={resultImage.isLoading || resultDelete.isLoading}
                                htmlType="submit">
                                {resultAdd.isLoading ? <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div> : " Thêm sản phẩm"}
                            </Button>
                            <Button className=" h-10 bg-blue-500 text-xs text-white ml-5" onClick={() => navigate("/admin/products")} htmlType="submit">
                                Danh sách sản phẩm
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div >
    )
}

export default Productadd