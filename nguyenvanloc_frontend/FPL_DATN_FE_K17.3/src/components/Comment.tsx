import { useState } from "react";
import { Button, Form, Upload, Modal, message, Select } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import "../pages/view/Orders/order.css"
import { FaUpload } from "react-icons/fa";
import TextArea from "antd/es/input/TextArea";
import { useAddCommentMutation } from "@/api/commentApi";
import { getDecodedAccessToken } from "@/decoder";
import { useAddImageMutation, useDeleteImageMutation } from "@/api/uploadApi";
import { RcFile, UploadProps } from "antd/es/upload";
import { toast } from "react-toastify";
import { useGetColorsQuery } from "@/api/colorApi";
import { useGetSizeQuery } from "@/api/sizeApi";


const Comment = ({ order }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const decodedToken: any = getDecodedAccessToken();
    const id = decodedToken ? decodedToken.id : null;
    const { data: colors } = useGetColorsQuery<any>();
    const { data: sizes } = useGetSizeQuery<any>();
    const [addComment, resultAdd] = useAddCommentMutation<any>();
    const [addImage, resultImage] = useAddImageMutation();
    const [deleteImage, resultDelete] = useDeleteImageMutation();
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [imageUrl, setImageUrl] = useState<any>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>({});
    const navigate = useNavigate();
    const color = colors?.color;
    const size = sizes?.size
    const handleProductChange = (value: string, productId: string, sizeId: string, colorId: string, materialId: string) => {
        if (false) {
            console.log(value);
        }
        setSelectedProduct({
            productId,
            sizeId,
            colorId,
            materialId,
        });
    };

    const onFinish = async (values: any) => {
        try {
            values.image = imageUrl;
            const comment: any = await addComment({
                productId: selectedProduct.productId,
                sizeId: selectedProduct.sizeId,
                colorId: selectedProduct.colorId,
                materialId: selectedProduct.materialId,
                description: values.description,
                userId: id,
                rating: parseInt(values.rating),
                image: values.image,
                orderId: order._id
            }).unwrap();
            if (comment) {
                toast.success(comment.message);
                navigate('/user/orders?commentAdded=true');
                setIsModalOpen(false);
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

    const props: UploadProps = {
        name: 'image',
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




    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button onClick={showModal} className="text-white bg-orange-500 border-solid rounded border-1 py-1 px-3 text-white">
                <Link
                    className="ctorder text-white"
                    to={``}
                    style={{ textDecoration: "none", color: "black" }}
                >
                    Phản hồi
                </Link>
            </button>
            <Modal
                title="Đánh giá sản phẩm"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null} // Remove the footer entirely
            >
                <div>
                    <div className="comment-box">
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 800 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Chọn sản phẩm đánh giá"
                                name="productId"
                                rules={[{ required: true, message: 'Sản phẩm không được để trống!' }]}
                                hasFeedback
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Select onChange={(value: any, option: any) => handleProductChange(value, option?.productId, option?.sizeId, option?.colorId, option?.materialId)}>
                                    {order && order?.products?.map((product: any) => {
                                        if (!product.hasReviewed) {
                                            const sizesname = size?.find((s: any) => s._id == product?.sizeId);
                                            const colorname = color?.find((colors: any) => colors._id == product?.colorId);
                                            return (
                                                <Select.Option
                                                    key={product?._id}
                                                    value={product._id}
                                                    productId={product.productId}
                                                    sizeId={product.sizeId}
                                                    colorId={product.colorId}
                                                    materialId={product.materialId}
                                                >
                                                    {product?.product_name} - {colorname?.colors_name} - {sizesname?.size_name}
                                                </Select.Option>
                                            );
                                        }
                                        return null; // Bỏ qua sản phẩm đã được đánh giá
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item<any>
                                name="rating"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Phải chọn số sao đánh giá!' }]}
                            >
                                <div className="rating">
                                    <input type="radio" name="rating" value="5" id="inp5" /><label htmlFor="inp5">☆</label>
                                    <input type="radio" name="rating" value="4" id="inp4" /><label htmlFor="inp4">☆</label>
                                    <input type="radio" name="rating" value="3" id="inp3" /><label htmlFor="inp3">☆</label>
                                    <input type="radio" name="rating" value="2" id="inp2" /><label htmlFor="inp2">☆</label>
                                    <input type="radio" name="rating" value="1" id="inp1" /><label htmlFor="inp1">☆</label>
                                </div>
                            </Form.Item>
                            <Form.Item<any>
                                label="Nội dung"
                                name="description"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Mô tả không được để trống!' }]}
                                hasFeedback
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item
                                id="images" name="image"
                            >
                                <Upload {...props} listType="picture" multiple
                                    fileList={fileList}
                                    beforeUpload={file => {
                                        setFileList([...fileList, file]);
                                    }}
                                >
                                    <Button icon={<FaUpload />}>Thêm ảnh</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 16 }}>
                                <Button className="h-10 bg-red-500 text-xs text-white"
                                    disabled={resultImage.isLoading || resultDelete.isLoading}
                                    htmlType="submit">
                                    {resultAdd.isLoading ? <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div> : "Đánh giá"}
                                </Button>
                            </Form.Item>
                        </Form>

                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Comment;
