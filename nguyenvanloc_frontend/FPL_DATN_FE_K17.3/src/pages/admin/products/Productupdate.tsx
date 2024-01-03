import { useGetBrandQuery } from '@/api/brandApi';
import { useGetCategoryQuery } from '@/api/categoryApi';
import { useGetMaterialQuery } from '@/api/materialApi';
import { useGetProductByIdQuery, useUpdateProductMutation } from '@/api/productApi';
import { useDeleteImageMutation, useUpdateImageMutation } from '@/api/uploadApi';
import { Button, Form, Input, Upload, Select, InputNumber, message } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IProduct } from '@/interfaces/product';
import { ICategory } from '@/interfaces/category';
import { IBrand } from '@/interfaces/brand';
import { IMaterials } from '@/interfaces/materials';
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

const Productupdate = () => {
    const { id }: any = useParams();
    const { data: productData }: any = useGetProductByIdQuery(id);
    const [updateProduct, resultUpdate] = useUpdateProductMutation();
    const { data: categories } = useGetCategoryQuery<any>();
    const { data: brands } = useGetBrandQuery<any>();
    const { data: materials } = useGetMaterialQuery<any>();
    const [updateImage, resultImage] = useUpdateImageMutation();
    const [deleteImage, resultDelete] = useDeleteImageMutation();
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [imageUrl, setImageUrl] = useState<any>([]);
    const [publicId, setpublicId] = useState<string>();
    const [productDescription, setProductDescription] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (productData) {
            setFields();
            setImageUrl(productData?.product?.image);
        }
    }, [productData]);
    const [form] = Form.useForm();
    const setFields = () => {
        form.setFieldsValue({
            _id: productData?.product?._id,
            product_name: productData?.product?.product_name,
            product_price: productData?.product?.product_price,
            image: productData?.product?.image ? productData?.product.image : [], // Nếu có ảnh, thêm vào mảng để hiển thị
            description: productData?.product?.description,
            categoryId: productData?.product?.categoryId,
            brandId: productData?.product?.brandId,
            materialId: productData?.product?.materialId,
        });
    };

    const onFinish = async (values: IProduct) => {
        values.description = productDescription;
        try {
            values.image = imageUrl;
            const data = await updateProduct(values).unwrap();
            if (data) {
                toast.success(data.message);
            }
            navigate('/admin/products');
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
        customRequest: async ({ file }) => {
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
                                publicId: publicId,
                                files: formData,
                            } as any);
                            if (response.data && response.data.publicId) {
                                info.file.status = 'done';
                                info.file.uid = response.data.publicId;
                                const publicId1 = response.data.publicId;
                                const url = response.data.url;
                                const updatedImage = { url: url, publicId: publicId1 };
                                setFileList(info.fileList);
                                setImageUrl((prevUrls: any) =>
                                    prevUrls.map((item: any) => {
                                        if (item.publicId === publicId) {
                                            return updatedImage; // Thay thế ảnh có publicId tương ứng
                                        }
                                        return item;
                                    }),
                                );
                            }
                        }
                    })();
                } catch (error) {
                    console.error(error);
                }
                if (info.file.status === 'error') {
                    message.error(` upload thất bại.`);
                } else if (info.file.status === 'removed') {
                    const publicId = info.file.uid;
                    (async () => {
                        await deleteImage(publicId);
                        const removedFile = info.file;
                        const updatedFileList = fileList.filter(
                            (item) => item.uid !== removedFile.uid,
                        );
                        setFileList(updatedFileList);
                        const updateImage = imageUrl.filter(
                            (item: any) => item.publicId !== removedFile.uid,
                        );
                        setImageUrl(updateImage);
                    })();
                }
            }
        },
    };

    const uploadButton = (
        <div>
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const handleImageUpdate = (index: number) => {
        const selectedImage = imageUrl[index];
        setpublicId(selectedImage.publicId);
    };

    const validatePositiveNumber = (_: any, value: any) => {
        if (parseFloat(value) < 0) {
            return Promise.reject('Giá trị phải là số dương');
        }
        return Promise.resolve();
    };
    return (
        <div className="container-fluid mb-7">
            <div className="row">
                <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4 pl-5  text-3xl">
                        Cập Nhật Sản Phẩm
                    </h5>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 1000, height: 1000 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType> name="_id" style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Tên"
                            name="product_name"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { required: true, message: 'Tên sản phẩm không được để trống!' },
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
                                { min: 2, message: 'Nhập ít nhất 2 ký tự' },
                            ]}
                            hasFeedback
                            style={{ marginLeft: '20px' }}
                        >
                            <Input placeholder="Tên sản phẩm" />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Giá Niêm Yết"
                            name="product_price"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { required: true, message: 'Trường giá không được để trống!' },
                                { validator: validatePositiveNumber },
                                { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' },
                            ]}
                            style={{ marginLeft: '20px' }}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                            label="Ảnh"
                            rules={[{ required: true, message: 'Ảnh không được để trống' }]}
                            hasFeedback
                        >
                            {imageUrl &&
                                imageUrl?.map((img: any, index: any) => (
                                    <Upload
                                        {...props}
                                        key={img?.publicId}
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
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
                                                handleImageUpdate(index)
                                            }
                                            // Trả về false để ngăn chặn việc tải lên nếu kích thước tệp lớn hơn 2MB hoặc không phải là ảnh
                                            return isLt2M && isImage;
                                        }}
                                    >
                                        {img ? (
                                            <img
                                                src={img?.url}
                                                alt="avatar"
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                        ) : (
                                            uploadButton
                                        )}
                                    </Upload>
                                ))}
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Danh mục"
                            name="categoryId"
                            rules={[{ required: true, message: 'Danh mục không được để trống!' }]}
                            hasFeedback
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                        >
                            <Select>
                                {categories &&
                                    categories?.category.docs?.map((category: ICategory) => {
                                        return (
                                            <Select.Option key={category?._id} value={category._id}>
                                                {category?.category_name}
                                            </Select.Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Thương hiệu"
                            name="brandId"
                            rules={[
                                { required: true, message: 'Thương hiệu không được để trống!' },
                            ]}
                            hasFeedback
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                        >
                            <Select>
                                {brands &&
                                    brands?.brand?.map((brand: IBrand) => {
                                        return (
                                            <Select.Option key={brand?._id} value={brand._id}>
                                                {brand?.brand_name}
                                            </Select.Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Vật liệu"
                            name="materialId"
                            rules={[{ required: true, message: 'Vật liệu không được để trống!' }]}
                            hasFeedback
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ marginLeft: '20px' }}
                        >
                            <Select>
                                {materials &&
                                    materials?.material?.map((mate: IMaterials) => {
                                        return (
                                            <Select.Option key={mate?._id} value={mate._id}>
                                                {mate?.material_name}
                                            </Select.Option>
                                        );
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
                                data={productData?.product?.description}
                                config={{
                                    mediaEmbed: {
                                        previewsInData: true,
                                    },
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
                                    ' Cập nhật sản phẩm'
                                )}
                            </Button>
                            <Button
                                className=" h-10 bg-blue-500 text-xs text-white ml-5"
                                onClick={() => navigate('/admin/products')}
                                htmlType="submit"
                            >
                                Danh sách sản phẩm
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Productupdate;
