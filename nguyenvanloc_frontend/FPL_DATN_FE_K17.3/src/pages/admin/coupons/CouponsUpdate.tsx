import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, InputNumber, Skeleton } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { DatePicker } from 'antd';
import {
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
} from '@/api/couponsApi';
import localeData from 'dayjs/plugin/localeData';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { ICoupon } from '@/interfaces/coupon';


type FieldType = {
  _id?: string;
  coupon_name?: string;
  coupon_code?: string;
  coupon_content?: string;
  coupon_quantity?: number;
  discount_amount?: number;
  expiration_date?: Date;
  min_purchase_amount?: number;
};

const CouponsUpdate = () => {
  const { idCoupon }: any = useParams();
  const { data: coupons, isLoading }: any = useGetCouponByIdQuery(idCoupon || '');
  const [updateCoupon, resultAdd] = useUpdateCouponMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  dayjs.extend(localeData);
  const dateFormat = "DD-MM-YYYY";

  const init = {
    expiration_date: dayjs(),
  };

  const isPastDate = (selectedDate: dayjs.Dayjs) => {
    const currentDate = dayjs();
    return selectedDate.isBefore(currentDate, 'day');
  };

  useEffect(() => {
    if (coupons) {
      setFields();
    }
  }, [coupons]);

  const setFields = () => {
    form.setFieldsValue({
      _id: coupons.coupon?._id,
      coupon_name: coupons.coupon?.coupon_name,
      coupon_code: coupons.coupon?.coupon_code,
      coupon_content: coupons.coupon?.coupon_content,
      coupon_quantity: coupons.coupon?.coupon_quantity,
      discount_amount: coupons.coupon?.discount_amount,
      expiration_date: coupons.coupon?.expiration_date
        ? dayjs(coupons.coupon?.expiration_date)
        : null,
      min_purchase_amount: coupons.coupon?.min_purchase_amount,
    });
  };

  const onFinish = async (values: ICoupon) => {
    try {
      // values.expiration_date = values.expiration_date ? values.expiration_date.toDate() : null;
      values.expiration_date = values.expiration_date !== null
        ? new Date(values.expiration_date)
        : new Date();
      const data = await updateCoupon(values).unwrap();
      if (data) {
        toast.success(data.message);
      }
      navigate("/admin/coupons");
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
          <h5 className="card-title fw-semibold mb-4 pl-5  text-3xl">Cập nhật phiếu giảm giá</h5>
          <div className="flex items-center ">
          </div>

          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 1000 }}
            initialValues={{ ...init, remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="" name="_id" style={{ display: 'none' }}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Tên phiếu giảm giá"
              name="coupon_name"
              rules={[{ required: true, message: 'Tên phiếu giảm giá không được để trống!' },
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
              label="Mã phiếu giảm giá"
              name="coupon_code"
              rules={[{ required: true, message: 'Mã phiếu giảm giá không được để trống!' },
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
              <Input disabled />
            </Form.Item>

            <Form.Item<FieldType>
              label="Nội dung phiếu giảm giá"
              name="coupon_content"
              rules={[{ required: true, message: 'Nội dung phiếu giảm giá không được để trống!' },
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
              <TextArea />
            </Form.Item>

            <Form.Item<FieldType>
              label="Số lượng phiếu giảm giá"
              name="coupon_quantity"
              rules={[{ required: true, message: 'Số lượng phiếu giảm giá không được để trống!' },
              { validator: validatePositiveNumber },
              { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}

              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginLeft: '20px' }}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Phần trăm giảm giá (%)"
              name="discount_amount"
              rules={[{ required: true, message: 'Số tiền chiết khấu không được để trống!' },
              { validator: validatePositiveNumber },
              { pattern: /^[0-9]+$/, message: 'Không được nhập chữ' }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginLeft: '20px' }}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>


            <Form.Item<FieldType>
              label="Ngày hết hạn"
              name="expiration_date"
              rules={[
                { required: true, message: 'Ngày hết hạn không được để trống!' },
                {
                  validator: (_, value) => {
                    const selectedDate = dayjs(value);
                    if (isPastDate(selectedDate)) {
                      return Promise.reject('Không được chọn ngày quá khứ!');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              hasFeedback
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginLeft: '20px' }}
            >
              <DatePicker style={{ width: "100%" }} format={dateFormat} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Số tiền mua tối thiểu"
              name="min_purchase_amount"
              rules={[{ required: true, message: 'Số tiền mua tối thiểu không được để trống!' },
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
                </div> : " Cập nhật phiếu giảm giá"}
              </Button>
              <Button className=" h-10 bg-blue-500 text-xs text-white ml-5" onClick={() => navigate("/admin/coupons")} htmlType="submit">
                Danh sách phiếu giảm giá
              </Button>
            </Form.Item>

          </Form>
        </div>
      </div>
    </div>
  )
}

export default CouponsUpdate






