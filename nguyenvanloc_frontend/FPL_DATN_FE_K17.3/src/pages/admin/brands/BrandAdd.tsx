
import { useAddBrandMutation } from '@/api/brandApi';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



type FieldType = {
  brand_name?: string;

};
const BrandAdd = () => {
  const [addBrand, resultAdd] = useAddBrandMutation();
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    try {
      const data: any = await addBrand(values).unwrap();
      if (data) {
        toast.success(`${data.message}`)
      }
      navigate('/admin/brands')
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
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="card-body">
          <h5 className="card-title fw-semibold mb-4 pl-5  text-3xl">Thêm thương hiệu</h5>
          <div className="flex items-center ">
          </div>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 1000 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Tên thương hiệu"
              name="brand_name"
              rules={[{ required: true, message: 'Tên thương hiệu không được để trống!' },
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

            <Form.Item wrapperCol={{ span: 16 }}>
              <Button className=" h-10 bg-red-500 text-xs text-white ml-5" htmlType="submit">
                {resultAdd.isLoading ? <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div> : " Thêm thương hiệu"}
              </Button>
              <Button className=" h-10 bg-blue-500 text-xs text-white ml-5" onClick={() => navigate("/admin/brands")} htmlType="submit">
                Danh sách thương hiệu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default BrandAdd