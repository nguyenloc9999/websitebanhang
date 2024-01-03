

import { useGetColorByIdQuery, useUpdateColorMutation } from '@/api/colorApi';
import { Button, Form, Input, InputNumber, Skeleton } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';



interface Color {
  _id?: string;
  colors_name?: string;
  color_price?: number
}
const ColorsUpdate = () => {
  const { idColor }: any = useParams();
  const { data: colors, isLoading }: any = useGetColorByIdQuery(idColor);
  const [updateColor, resultAdd] = useUpdateColorMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (colors) {
      setFields();
    }
  }, [colors]);
  const setFields = () => {
    form.setFieldsValue({
      _id: colors.color?._id,
      colors_name: colors.color?.colors_name,
      color_price: colors.color?.color_price,
    });
  };


  const onFinish = async (values: any) => {
    try {
      const data = await updateColor(values).unwrap();
      if (data) {
        toast.success(data.message);
      }
      navigate('/admin/colors');
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
  const validatePositiveNumber = (_: any, value: any) => {
    if (parseFloat(value) < 0) {
      return Promise.reject("Giá trị phải là số dương");
    }
    return Promise.resolve();
  }


  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  if (isLoading) return <Skeleton />;
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="card-body">
          <h5 className="card-title fw-semibold mb-4 pl-5  text-3xl">Cập nhật màu</h5>
          <div className="flex items-center ">
          </div>
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
            <Form.Item<Color>
              label="Tên màu"
              name="colors_name"
              rules={[{ required: true, message: 'Tên màu không được để trống!' },
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
              { min: 2, message: "Nhập ít nhất 2 ký tự" }]}
              hasFeedback
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginLeft: '20px' }}
            >
              <Input />
            </Form.Item>
            <Form.Item<Color>
              label="Giá Sản Phẩm"
              name="color_price"
              labelCol={{ span: 24 }} // Đặt chiều rộng của label
              wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
              rules={[{ required: true, message: "Giá màu không được để trống!" },
              { validator: validatePositiveNumber },
              { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}

              style={{ marginLeft: "20px" }}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 16 }}>
              <Button className=" h-10 bg-red-500 text-xs text-white ml-5" htmlType="submit">
                {resultAdd.isLoading ? <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div> : " Cập nhật màu"}
              </Button>
              <Button className=" h-10 bg-blue-500 text-xs text-white ml-5" onClick={() => navigate("/admin/colors")} htmlType="submit">
                Danh sách màu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ColorsUpdate
