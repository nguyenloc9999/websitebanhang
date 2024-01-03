import { Table, Button, Skeleton, Image } from "antd";
import { FaTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./CartPage.css";
import {
  useChangeQuantityMutation,
  useGetCartsQuery,
  useRemoveProductInCartMutation,
} from "@/api/cartApi";
import Swal from "sweetalert2";
import { useGetColorsQuery } from "@/api/colorApi";
import { useGetSizeQuery } from "@/api/sizeApi";
import { useGetMaterialQuery } from "@/api/materialApi";
import { getDecodedAccessToken } from "@/decoder";
import { useState } from "react";
import { useGetChildProductPriceQuery } from "@/api/chilProductApi";
import { toast } from "react-toastify";
const CartPage = () => {
  const decodedToken: any = getDecodedAccessToken();
  const id = decodedToken ? decodedToken.id : null;
  const { data: colors } = useGetColorsQuery<any>();
  const { data: sizes } = useGetSizeQuery<any>();
  const { data: materials } = useGetMaterialQuery<any>();
  const { data: carts, isLoading, error } = useGetCartsQuery(id);
  const [removeProductInCart, resultRemove] = useRemoveProductInCartMutation();
  const [changeQuantity, resultChangeQuantity] = useChangeQuantityMutation();
  const color = colors?.color;
  const size = sizes?.size;
  const material = materials?.material;
  const productsInCart = carts?.data.products;
  const [quantityInput, setQuantityInput] = useState<any>({});
  const [idProduct, setIdProduct] = useState<string>(``);
  const [activeColor, setActiveColor] = useState<string>(``);
  const [activeSize, setActiveSize] = useState<string>(``);
  const { data: childProduct }: any = useGetChildProductPriceQuery({
    productId: idProduct,
    sizeId: activeSize,
    colorId: activeColor,
  });

  const updateQuantity = (
    productId: string,
    sizeId: string,
    colorId: string,
    materialId: string,
    newQuantity?: any
  ) => {
    changeQuantity({
      data: { stock_quantity: newQuantity },
      userId: id,
      productId: productId,
      sizeId: sizeId,
      colorId: colorId,
      materialId: materialId,
    }).then(() => {
      setActiveColor(colorId);
      setActiveSize(sizeId);
      setIdProduct(productId);
    });
  };

  const handleQuantityChange = (productId: string, sizeId: any, colorId: any, materialId: any, text?: any) => {
    if (text < 1) return;
    if (text > childProduct?.product?.stock_quantity) return 0;

    updateQuantity(productId, sizeId, colorId, materialId, text);

    setQuantityInput({ ...quantityInput, [productId]: text });

  };

  const deleteCart = async ({ productId, sizeId, colorId, materialId }: any) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn chắc chứ?',
        text: 'Banner sẽ bị xoá và không thể khôi phục!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, tôi chắc chắn!',
        cancelButtonText: 'Huỷ',
      });
      if (result.isConfirmed) {
        const data: any = await removeProductInCart({
          userId: id,
          productId: productId,
          colorId: colorId,
          sizeId: sizeId,
          materialId: materialId,
        }).unwrap();
        if (data) {
          toast.success(data.message);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('Hủy Sản phẩm  xoá khỏi giỏ hàng');
      }
    } catch (error: any) {
      toast.error(error.data.message);
    }

  };
  const formatCurrency = (number: number | undefined) => {
    if (number !== undefined) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
      return "0"; // Giá trị mặc định hoặc xử lý khác
    }
  };

  const columns: any = [
    {
      title: "Ảnh sản phẩm",
      dataIndex: "image",
      key: "image",
      render: (image: any) => <Image width={130} src={image} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      className: "custom-name",
    },
    {
      title: "Kích thước",
      dataIndex: "sizeId",
      key: "sizeId",
      render: (record: any) => {
        const sizename = size?.find((size: any) => size._id === record);
        return sizename ? sizename.size_name : "";
      },
    },
    {
      title: "Màu sắc",
      dataIndex: "colorId",
      key: "colorId",
      render: (record: any) => {
        const colorname = color?.find((color: any) => color._id === record);
        return colorname ? colorname.colors_name : "";
      },
    },
    {
      title: "Vật liệu",
      dataIndex: "materialId",
      key: "materialId",
      render: (record: any) => {
        const materialname = material?.find(
          (material: any) => material._id === record
        );
        return materialname ? materialname.material_name : "";
      },
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "product_price",
      key: "product_price",
      className: "custom-total",
      render: (price: any) => <p>{formatCurrency(price)}₫</p>,
    },
    {
      title: "Số lượng",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      render: (text: number, record: any) => (
        <div className="quantity-input">
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(record.productId, record.sizeId, record.colorId, record.materialId, text - 1)}
          >
            -
          </button>
          {resultChangeQuantity.isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin m-auto" />
          ) : (
            <input
              min="1"
              max={childProduct?.product?.stock_quantity}
              value={quantityInput[`${record.productId}_${record.sizeId}_${record.colorId}_${record.materialId}`] || text}
              readOnly
            />
          )}
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(record.productId, record.sizeId, record.colorId, record.materialId, text + 1)}
          >
            +
          </button>
        </div>
      ),
    },
    {
      title: "Tạm tính",
      dataIndex: "product_price",
      key: "total",
      className: "custom-total",
      render: (price: any, quantity: any) => <p>{formatCurrency(price * quantity?.stock_quantity)}₫</p>,
    },
    {
      title: "Chức năng",
      render: (record: any) => (
        <div>
          <Button
            onClick={() =>
              deleteCart({
                productId: record.productId,
                colorId: record.colorId,
                sizeId: record.sizeId,
                materialId: record.materialId,
              })
            }
            className="text-red-500"
          >
            {resultRemove.isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin m-auto" />
            ) : (
              <FaTrashCan />
            )}
          </Button>
        </div>
      ),
    },
  ];
  if (!id) {
    return (
      <div>
        <div
          className="grid px-4 bg-white place-content-center  pb-3"
          style={{ height: "500px" }}
        >
          <div className="">
            <img
              className="w-[400px]"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRllmpIxnyIgtYuaJhrUERHnONFy6GdgWfgbg&usqp=CAU"
              alt=""
            />

            <h1
              className="mt-6 font-bold tracking-tight text-gray-900 "
              style={{ fontSize: "17px" }}
            >
              Bạn chưa đăng nhập, hãy tiến hành đăng nhập đã nhé !
            </h1>

            <Link
              to="/signin"
              className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-  focus:outline-none focus:ring no-underline "
              style={{ background: "#ff7600", marginLeft: "90px" }}
            >
              Đăng nhập cùng Casa
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (!carts || !carts?.data || carts?.data.products.length === 0) {
    return (
      <div>
        <div
          className="grid  px-4 bg-white place-content-center  pb-3"
          style={{ height: "500px" }}
        >
          <div className="">
            <img
              className="w-[400px]"
              src="https://nhanhieuquocgia.com.vn/assets/images/no-cart.png"
              alt=""
            />

            <h1
              className="mt-6  font-bold tracking-tight text-gray-900 "
              style={{ fontSize: "17px" }}
            >
              Giỏ hàng của bạn còn trống, hãy lựa mua ngay nhé !
            </h1>

            <Link
              to="/"
              className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-  focus:outline-none focus:ring no-underline "
              style={{ background: "#ff7600", marginLeft: "90px" }}
            >
              Mua sắm cùng Casa
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (isLoading) return <Skeleton />;
  if (error) {
    if ("data" in error && "status" in error) {
      <div>
        {error.status}-{JSON.stringify(error.data)}
      </div>;
    }
  }

  return (
    <div className="bg-gray-100 container mx-auto">
      <h1 className="pt-10 pb-10">Giỏ hàng của bạn</h1>
      <Table
        dataSource={productsInCart.map((item: any, index: any) => ({
          ...item,
          key: index,
        }))}
        columns={columns}
        className="custom-table"
      />
      <div className="pt-20 pb-10">
        <button className="w-60 h-12 bg-slate-600 text-white font-bold ">
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              cursor: "pointer",
            }}
            to={"/"}
          >
            TIẾP TỤC MUA HÀNG
          </Link>
        </button>
        <span className="float-right font-bold">
          Tổng tiền :{" "}
          <Link
            to={""}
            className="pl-4  "
            style={{ textDecoration: "none", color: "#FF0606" }}
          >
            {formatCurrency(carts.data.total)}₫
          </Link>
        </span>
      </div>
      <div className="pb-20">
        <button className="w-60 h-12 bg-slate-600 text-white font-bold float-right ">
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              cursor: "pointer",
            }}
            to={"/pay"}
          >
            TIẾN HÀNH THANH TOÁN
          </Link>
        </button>
      </div>
    </div>
  );
};

export default CartPage;
