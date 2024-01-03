import { useGetUserByIdQuery, useUpdateUserByAdminMutation } from "@/api/authApi";
import { Button, Col, Form, Input, Row, Skeleton } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
import { toast } from "react-toastify";

type FieldType = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: number;
  address?: string | null;
  avatar?: object;
  role?: string;
};

const UserUpdate = () => {
  const { id } = useParams<{ id: any }>();
  const { Option } = Select;
  const { data: user, isLoading, isError } = useGetUserByIdQuery(id || "");
  const [updateUser, resultUpdate] = useUpdateUserByAdminMutation<any>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      setFields();
    }
  }, [user]);


  const setFields = () => {
    form.setFieldsValue({
      _id: user?._id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      avatar: user?.avatar ? user?.avatar : {},
      role: user?.role,
    });
  };

  const onFinish = async (values: any) => {
    try {
      const data = await updateUser({ _id: values._id, role: values.role }).unwrap();
      if (data) {
        toast.success(data.message);
      }
      navigate('/admin/users');
    }
    catch (error: any) {
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



  if (isLoading) return <Skeleton />;
  if (isError || !user) {
    return <div>Error: Unable to fetch users data.</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="card-body">
          <h5 className="card-title mt-4 fw-semibold mb-4 pl-5">
            Cập Nhật Hồ Sơ
          </h5>
          <Row gutter={[16, 16]}>
            <Col span={10}>
              <img className="ml-4 mt-28" src={typeof user?.avatar?.url === 'string' ? user?.avatar.url : 'https://static.thenounproject.com/png/363640-200.png'}
                style={{ width: '50%', height: 'auto', objectFit: 'cover', borderRadius: '5px' }}
              />
            </Col>
            <Col span={14}>
              <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 1000 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item label="" name="_id" style={{ display: "none" }}>
                  <Input />
                </Form.Item>
                <Form.Item<FieldType>
                  label="Họ"
                  name="first_name"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  style={{ marginLeft: "20px" }}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Tên"
                  name="last_name"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  style={{ marginLeft: "20px" }}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  style={{ marginLeft: "20px" }}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  style={{ marginLeft: "20px" }}

                >
                  <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Địa chỉ"
                  name="address"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  style={{ marginLeft: "20px" }}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Vai trò"
                  name="role"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  style={{ marginLeft: "20px" }}
                  rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                >
                  <Select placeholder="Chọn vai trò">
                    <Option value="admin">Quản trị</Option>
                    <Option value="member">Khách hàng</Option>
                  </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 16 }}>
                  <Button
                    className=" h-10 bg-red-500 text-xs text-white ml-5"
                    htmlType="submit"
                  >
                    {resultUpdate.isLoading ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      " Cập nhật hồ sơ"
                    )}
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default UserUpdate;
