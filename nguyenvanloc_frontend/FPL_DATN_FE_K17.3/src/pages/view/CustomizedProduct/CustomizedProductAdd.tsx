import { FaArrowRight } from "react-icons/fa";
import "./CustomizedProductAdd.css";
import "./Responsive_CustomizedProductAdd.css";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "@/api/productApi";
import { useGetMaterialQuery } from "@/api/materialApi";
import { Button, Skeleton, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useGetColorsQuery } from "@/api/colorApi";
import { useGetSizeByDesignQuery } from "@/api/sizeApi";
import { Tab, initTE } from "tw-elements";
import { getDecodedAccessToken } from "@/decoder";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useGetCategoryQuery } from "@/api/categoryApi";
import { useAddCustomProductMutation } from "@/api/CustomizedProductAPI";
import Swal from "sweetalert2";
import { IoIosAddCircle } from "react-icons/io";
import { BiSolidMinusCircle } from "react-icons/bi";
import { toast } from "react-toastify";

const CustomizedProductAdd = () => {
  const { idProduct }: any = useParams();
  const decodedToken: any = getDecodedAccessToken();
  const id = decodedToken ? decodedToken.id : null;
  const {
    data,
    isLoading: isLoadingFetching,
    error,
  }: any = useGetProductByIdQuery(idProduct || "");
  const { data: colors, isLoading: isLoadingColor } = useGetColorsQuery<any>();
  const { data: sizes, isLoading: isLoadingSize } = useGetSizeByDesignQuery<any>();
  const { data: materials, isLoading: isLoadingMaterial } =
    useGetMaterialQuery<any>();
  const [quantity, setQuantity] = useState<any>(1); // Sử dụng useState để quản lý số lượng
  const [activeColor, setActiveColor] = useState(null);
  const [colorPrice, setColorPrice] = useState(0);
  const [sizePrice, setSizePrice] = useState(0);
  const [materialPrice, setMaterialPrice] = useState(0);
  const [activeSize, setActiveSize] = useState(null);
  const [activeMaterial, setActiveMaterial] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const listOneData = data?.product;
  const navigate = useNavigate();

  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { data: catgory }: any = useGetCategoryQuery();
  const categoryLish = catgory?.category.docs;
  const categoryLishOne = categoryLish?.find(
    (categoryLish: any) => categoryLish?._id === listOneData?.categoryId
  )?.category_name;
  useEffect(() => {
    initTE({ Tab });
  }, [selectedIndex]);
  const handleToggleColors = () => {
    setShowAllColors(!showAllColors);
    setExpanded(!expanded);
  };

  const handleToggleMaterials = () => {
    setShowAllMaterials(!showAllMaterials);
  };
  const [addCustom, resultAdd]: any = useAddCustomProductMutation();

  const handleAddToCart = async () => {
    try {
      if (data && id) {
        const data: any = {
          userId: id,
          productId: idProduct,
          categoryId: listOneData.categoryId,
          product_name: listOneData.product_name,
          product_price: Number(listOneData?.product_price + colorPrice + sizePrice + materialPrice),
          image: listOneData.image,
          stock_quantity: quantity,
          colorId: activeColor,
          sizeId: activeSize,
          materialId: activeMaterial,
        };
        const result = await Swal.fire({
          title: "Bạn chắc chứ?",
          text: "Sản phẩm sẽ được thêm vào giỏ hàng!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Vâng, tôi chắc chắn!",
          cancelButtonText: "Huỷ",
        });

        if (result.isConfirmed) {
          // Thực hiện thêm vào giỏ hàng
          const response: any = await addCustom(data).unwrap();
          if (response) {
            toast.success(response.message);
            navigate("/customizedProducts");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Hiển thị thông báo hủy thêm vào giỏ hàng
          toast.info("Đã hủy thêm sản phẩm tự thiết kế ");
        }
      }
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
  };



  const formatCurrency = (number: { toString: () => string }) => {
    if (number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
      return "0"; // Giá trị mặc định hoặc xử lý khác
    }
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // Cập nhật số lượng
    }
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleClickSize = ({ sizeId, price }: any) => {
    setActiveSize(sizeId);
    setSizePrice(price);
  };
  const handleClickColor = ({ colorId, price }: any) => {
    setActiveColor(colorId);
    setColorPrice(price);
  };
  const handleClickMaterial = ({ materialId, price }: any) => {
    setActiveMaterial(materialId);
    setMaterialPrice(price)
  };

  if (isLoadingColor) return <Skeleton />;
  if (isLoadingSize) return <Skeleton />;
  if (isLoadingMaterial) return <Skeleton />;
  if (isLoadingFetching) return <Skeleton />;

  if (error) {
    if ("data" in error && "status" in error) {
      return (
        <div>
          {error.status} - {JSON.stringify(error.data)}
        </div>
      );
    }
  }

  const content1Element = document.querySelector(".content1") as HTMLElement;

  if (content1Element) {
    content1Element.style.height = `${expanded ? 1380 : 1062}px`;
  } else {
    console.error('Không tìm thấy phần tử có lớp là "content1"');
  }

  return (
    <div className={`container_swap ${expanded ? "expanded" : ""}`}>
      <div className="container">
        <div className="flex items-center my-4 px-3">
          <div className="float-left font-bold">Trang Chủ</div>
          <FaArrowRight className="ml-2" />
          <div className="pl-2">{categoryLishOne}</div>
          <FaArrowRight className="ml-2" />
          <div className="pl-2">{listOneData?.product_name}</div>
        </div>
        <div className="content1 py-3 ">
          <div className="grid grid-cols-2 gap-2 ">
            <div className="px-3">
              <div className="mb-6s">

                {listOneData?.image?.map((img: any, index: any) => (
                  <div
                    className={`data-[te-tab-active] ${selectedIndex === index ? 'block' : 'hidden'}`}
                    id={`image-tab-${index}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${index}`}
                    key={`image-content-${index}`}
                  >
                    <img
                      src={img?.url}
                      className="object-cover object-cover md:w-[250] md:h-[180]"
                    />
                  </div>
                ))}
              </div>
              <ul
                className="mb-5s flex list-none flex-col flex-wrap pl-0 md:flex-row"
                id="pills-tab"
                role="tablist"
                data-te-nav-ref
              >
                {listOneData?.image?.map((img: any, index: any) => (
                  <li className="ima" role="presentation" key={index}>
                    <button
                      onClick={() => setSelectedIndex(index)}
                      className={`test my-2 block rounded bg-neutral-100 text-xs font-medium uppercase leading-tight text-neutral-500 ${selectedIndex === index ? 'bg-primary-100 text-primary-700' : 'bg-neutral-700 text-white'
                        } md:mr-4 `}
                      id={`image-tab-${index}`}
                      data-te-toggle="tab"
                      data-te-tab-active={selectedIndex === index ? 'true' : 'false'}
                      role="tab"
                      aria-controls={`image-tab-${index}`}
                      aria-selected={selectedIndex === index ? 'true' : 'false'}
                    >
                      <img src={img?.url} className="pill-img" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="">
              <div className=" flex items-center justify-between ">
                <h3 className="font-bold iklm">{listOneData?.product_name}</h3>
              </div>
              {activeColor && activeSize && activeMaterial ? <p className=" text-red-700 font-bold text-2xl py-3"> {formatCurrency(listOneData?.product_price + colorPrice + sizePrice + materialPrice)}₫</p> : <p className=" text-red-700 font-bold text-2xl py-3"> {formatCurrency(listOneData?.product_price)}₫</p>}

              <div
                className="text-l font-bold py-2"
                style={{ height: showAllColors ? "auto" : "" }}
              >
                <p>Màu sắc</p>
                <div className="flex flex-wrap">
                  {colors ? (
                    colors?.color
                      .slice(0, showAllColors ? colors.color.length : 3)
                      .map((color: any) => {
                        const isActive = color._id === activeColor;
                        return (
                          <div key={color._id} className="flex-row mb-2 mr-2">
                            <button
                              aria-label="M"
                              aria-disabled="false"
                              className={` ${isActive ? "active1" : ""} text-[12px] py-1  min-w-32 border border-gray-500 rounded-md px-3 ${isActive ? "bg-blue-500 text-white" : "bg-white text-black"
                                }`}
                              onClick={() => handleClickColor({ colorId: color._id, price: color.color_price })}
                            >
                              {color?.colors_name}
                            </button>
                          </div>
                        );
                      })
                  ) : (
                    <p className="sp2s">Không có màu</p>
                  )}
                </div>
                {colors && colors?.color?.length > 3 && (
                  <button
                    onClick={handleToggleColors}
                    className={`btn-show-more flex items-center ${showAllColors ? "collapses" : "expand"}`}
                  >
                    <span className={`${showAllColors ? "text-red-500 text-1xl" : "text-green-500 "} text-2xl mr-20`}>
                      {showAllColors ? <BiSolidMinusCircle /> : <IoIosAddCircle />}
                    </span>
                  </button>
                )}
              </div>

              <div className="text-l font-bold py-2">
              <div class="product-size">
                  <p>Kích thước <span class="note">(được đo theo chiều Dài x Rộng x Cao - cm)</span></p>
                </div>
                <div className="flex flex-wrap">
                  {sizes ? (
                    sizes?.size
                      .slice(0, showAllSizes ? sizes?.size?.length : 3)
                      .map((size: any) => {
                        const isActive = size._id === activeSize;
                        return (
                          <div key={size._id} className="flex-row mb-2 mr-2">
                            <button
                              aria-label="M"
                              aria-disabled="false"
                              className={` ${isActive ? "active1" : ""}  text-[12px] py-1 border border-gray-500 rounded-md px-3 ${isActive ? "bg-blue-500 text-white" : "bg-white text-black"
                                }`}
                              onClick={() => handleClickSize({ sizeId: size._id, price: size.size_price })}
                            >
                              {size?.size_name}
                            </button>
                          </div>
                        );
                      })
                  ) : (
                    <p className="sp2s">Không có kích thước</p>
                  )}
                  {sizes && sizes?.size?.length > 3 && (
                    <button
                      onClick={() => setShowAllSizes(!showAllSizes)}
                      className={`btn-show-more flex items-center ${showAllColors ? "collapses" : "expand"}`}
                    >
                      <span className={`${showAllSizes ? "text-red-500 text-1xl" : "text-green-500 "} text-2xl mr-20`}>
                        {showAllSizes ? <BiSolidMinusCircle /> : <IoIosAddCircle />}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div
                className="text-l font-bold py-2"
                style={{ height: showAllMaterials ? "auto" : "" }}
              >
                <p>Nguyên vật liệu</p>
                <div className="flex flex-wrap">
                  {materials ? (
                    materials?.material
                      .slice(
                        0,
                        showAllMaterials ? materials?.material?.length : 3
                      )
                      .map((material: any) => {
                        const isActive = material._id === activeMaterial;
                        return (
                          <div key={material._id} className="flex-row mb-2 mr-2">
                            <button
                              aria-label="M"
                              aria-disabled="false"
                              className={` ${isActive ? "active1" : ""} text-[12px] py-1  border border-gray-500 rounded-md px-3 ${isActive ? "bg-blue-500 text-white" : "bg-white text-black"
                                }`}
                              onClick={() => handleClickMaterial({ materialId: material._id, price: material.material_price })}
                            >
                              {material?.material_name}
                            </button>
                          </div>
                        );
                      })
                  ) : (
                    <p className="sp2s">Không có nguyên vật liệu</p>
                  )}
                </div>
                {materials && materials.material.length > 3 && (
                  <button
                    onClick={handleToggleMaterials}
                    className={`btn-show-more flex items-center ${showAllColors ? "collapses" : "expand"}`}
                  >
                    <span className={`${showAllMaterials ? "text-red-500 text-1xl" : "text-green-500 "} text-2xl mr-20`}>
                      {showAllMaterials ? <BiSolidMinusCircle /> : <IoIosAddCircle />}
                    </span>
                  </button>
                )}
              </div>

              <div className="flex button1 ">
                <button
                  aria-label="Decrease"
                  className="btn3s btn-solid-primary3s btn-cs"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <input
                  className="btn4s btn-solid-primary4 btn-ds mn1"
                  aria-live="assertive"
                  aria-valuenow={1}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      setQuantity(value);
                    } else {
                      setQuantity(null);
                    }
                  }} />
                <button
                  aria-label="Increase"
                  className="btn5s btn-solid-primary5s btn-es"
                  onClick={increaseQuantity}
                >
                  +
                </button>

                <Tooltip
                  title={
                    id && activeColor && activeSize && activeMaterial
                      ? ""
                      : "Bạn phải đăng nhập, chọn màu, kích thước và nguyên vật liệu"
                  }
                >
                  {resultAdd.isLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                  ) : (
                    <Button
                      aria-disabled={
                        !id || !activeColor || !activeSize || !activeMaterial
                      }
                      className="btn6s btn-solid-primary6s btn-fs"
                      onClick={() => {
                        if (id && activeColor && activeSize && activeMaterial) {
                          handleAddToCart();
                        }
                      }}
                    >
                      Thêm sản phẩm
                    </Button>
                  )}
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomizedProductAdd;
