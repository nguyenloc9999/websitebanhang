import { useGetSizeByIdQuery, useUpdateSizeMutation } from '@/api/sizeApi';
import { ISize } from '@/interfaces/size';
import { Button, Form, Input, InputNumber, Select, Skeleton } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


interface FieldType {
  _id?: string;
  size_name?: string;
  size_height?: number;
  size_length?: number;
  size_weight?: number;
  size_width?: number

}
const SizesUpdate = () => {
  const { idSize }: string | any = useParams();
  const { data: sizes, isLoading } = useGetSizeByIdQuery<ISize | any>(idSize);
  const [updateSize, resultAdd] = useUpdateSizeMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (sizes) {
      setFields();
    }
  }, [sizes]);
  const setFields = () => {
    form.setFieldsValue({
      _id: sizes.size?._id,
      size_name: sizes.size?.size_name,
      size_height: sizes.size?.size_height,
      size_length: sizes.size?.size_length,
      size_weight: sizes.size?.size_weight,
      size_width: sizes.size?.size_width,
      size_price: sizes.size?.size_price,
    });
  };
  const onFinish = async (values: any) => {
    try {
      const data = await updateSize(values).unwrap();
      if (data) {
        toast.success(data.message)
      }
      navigate('/admin/sizes');
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

  if (isLoading) return <Skeleton />;

  const validatePositiveNumber = (_: any, value: any) => {
    if (parseFloat(value) < 0) {
      return Promise.reject("Giá trị phải là số dương");
    }
    return Promise.resolve();
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="card-body">
          <h5 className="card-title fw-semibold mb-4 pl-5  text-3xl">Cập nhật kích cỡ</h5>
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

            <Form.Item<FieldType> label="" name="_id" style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Tên kích cỡ"
              name="size_name"
              rules={[{ required: true, message: 'Tên kích cỡ không được để trống!' },
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
            <Form.Item<FieldType>
              label="Giá kích cỡ"
              name="size_price"
              labelCol={{ span: 24 }} // Đặt chiều rộng của label
              wrapperCol={{ span: 24 }} // Đặt chiều rộng của ô input
              rules={[{ required: true, message: "Giá kích cỡ không được để trống!" },
              { validator: validatePositiveNumber },
              { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}
              style={{ marginLeft: "20px" }}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Tự thiết kế thì chọn"
              name="size_info"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginLeft: '20px' }}
            >
              <Select >
                <Select.Option value={'design'}>Kích cỡ tự thiết kế</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item<FieldType>
              label="Chiều cao kích cỡ (cm)"
              name="size_height"
              rules={[{ required: true, message: 'Chiều cao kích cỡ không được để trống!' },
              { validator: validatePositiveNumber },
              { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginLeft: '20px' }}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Chiều dài kích cỡ"
              name="size_length"
              rules={[{ required: true, message: 'Chiều dài dài kích cỡ không được để trống!' },
              { validator: validatePositiveNumber },
              { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginLeft: '20px' }}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Cân nặng kích cỡ (gram)"
              name="size_weight"
              rules={[{ required: true, message: 'Cân nặng kích cỡ không được để trống!' },
              { validator: validatePositiveNumber },
              { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginLeft: '20px' }}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Chiều rộng kích cỡ (cm)"
              name="size_width"
              rules={[{ required: true, message: 'Chiều rộng kích cỡ không được để trống!' },
              { validator: validatePositiveNumber },
              { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginLeft: '20px' }}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 16 }}>
              <Button className=" h-10 bg-red-500 text-xs text-white ml-5" htmlType="submit">
                {resultAdd.isLoading ? <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div> : " Cập nhật kích cỡ"}
              </Button>
              <Button className=" h-10 bg-blue-500 text-xs text-white ml-5" onClick={() => navigate("/admin/sizes")} htmlType="submit">
                Danh sách kích cỡ
              </Button>
            </Form.Item>

          </Form>
        </div>
      </div>
    </div>
  )
}

export default SizesUpdate

