import {
  useAddChildProductMutation
} from "@/api/chilProductApi";
import { useGetColorsQuery } from "@/api/colorApi";
import { useGetSizeQuery } from "@/api/sizeApi";
import { Button, Form, InputNumber, Select, Spin } from "antd";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const AddChildProduct = () => {
  const { productId }: any = useParams<string>();
  const { data: Colors, isLoading: isLoadingColors }: any = useGetColorsQuery();
  const { data: Sizes, isLoading: isLoadingSizes }: any = useGetSizeQuery();
  const [addChildProduct, resultAdd] = useAddChildProductMutation();
  const colors = isLoadingColors ? [] : Colors?.color;
  const sizes = isLoadingSizes ? [] : Sizes?.size;
  const navigate = useNavigate();
  const formRef: any = useRef(null);

  const onFinish = async (values: any) => {
    try {
      const dataToSend = { ...values, productId };
      const data = await addChildProduct(dataToSend).unwrap();
      if (data) {
        toast.success(data.message);
      }
      formRef.current.resetFields();
      navigate(`/admin/products/childProduct/${productId}`);
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
    console.log("Failed:", errorInfo);
  };

  type FieldType = {
    product_price?: number;
    stock_quantity?: number;
    colorsId?: string;
    productId?: string;
    sizeId?: string;
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
          <p className="card-title fw-semibold mb-4 pl-5 text-xl">
            Thêm Sản Phẩm Con
          </p>
          {resultAdd.isLoading && isLoadingColors && isLoadingSizes ? (
            <Spin className="pt-5" tip="Loading" size="large">
              <div></div>
            </Spin>
          ) : (
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 1000, height: 1000 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              ref={formRef}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="Giá Sản Phẩm"
                name="product_price"
                labelCol={{ span: 24 }} // Đặt chiều rộng của label
                wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                rules={[{ required: true, message: "Giá sản phẩm không được để trống!" },
                { validator: validatePositiveNumber },
                { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}
                style={{ marginLeft: "20px" }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item<FieldType>
                label="Số lượng sản phẩm"
                name="stock_quantity"
                labelCol={{ span: 24 }} // Đặt chiều rộng của label
                wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                rules={[{ required: true, message: "Số lượng sản phẩm không được để trống!" },
                { validator: validatePositiveNumber },
                { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}
                style={{ marginLeft: "20px" }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="colorId"
                label="Danh sách màu"
                labelCol={{ span: 24 }} // Đặt chiều rộng của label
                wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                rules={[
                  { required: true, message: "Danh sách màu không được để trống!" },
                ]}
                hasFeedback
                style={{ marginLeft: "20px" }}
              >
                <Select>
                  {colors.map((color: any) => (
                    <Select.Option key={color._id} value={color._id}>
                      {color.colors_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="sizeId"
                label="Danh sách kích cỡ"
                labelCol={{ span: 24 }} // Đặt chiều rộng của label
                wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
                rules={[
                  { required: true, message: "Danh sách kích cỡ không được để trống!" },
                ]}
                hasFeedback
                style={{ marginLeft: "20px" }}
              >
                <Select>
                  {sizes.map((size: any) => (
                    <Select.Option key={size._id} value={size._id}>
                      {size.size_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16 }}>
                <Button
                  className=" h-10 bg-red-500 text-xs text-white ml-5"
                  htmlType="submit"
                >
                  Thêm sản phẩm con
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddChildProduct;
