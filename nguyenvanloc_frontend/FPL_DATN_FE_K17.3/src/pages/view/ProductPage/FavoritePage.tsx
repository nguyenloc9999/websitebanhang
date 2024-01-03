import "../Home/Homepage.css";
import "../Home/Responsive_homepage.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "@mui/material";
import { Skeleton } from "antd";
import { FaArrowRight } from "react-icons/fa6";
import { useGetFavoriteUserQuery, useRemoveFavoriteMutation } from "@/api/favoriteProductApi";
import { getDecodedAccessToken } from "@/decoder";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const FavoritePage = () => {
    const decodedToken: any = getDecodedAccessToken();
    const id = decodedToken ? decodedToken.id : null;
    const {
        data: products,
        error,
        isLoading: isLoadingFetching,
    } = useGetFavoriteUserQuery<any>(id);
    const [removeProduct] = useRemoveFavoriteMutation();

    const formatCurrency = (number: number) => {
        if (typeof number !== 'number') {
            return '0';
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const deleteProduct = async (id: any) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Sản phẩm sẽ được xoá bỏ yêu thích!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });
            if (result.isConfirmed) {
                const data = await removeProduct(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy xoá sản phẩm yêu thích');
            }
        } catch (error: any) {
            toast.error(error.data.message);
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;


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
    //  Phân trang........................
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedProducts = products?.favoriteProducts?.slice(startIndex, endIndex);
    const handlePageChange = (event: any, page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
        if (false) {
            console.log(event);
        }
    };
    return (
        <div className="md:px-6 ml-5 md:ml-28">
            <div className="flex items-center ">
                <div className="float-left py-2">
                    <Link
                        to="/"
                        className="font-bold text-black "
                        style={{ textDecoration: "none", color: "orange" }}
                    >
                        Trang Chủ
                    </Link>
                </div>
                <div className="px-2">
                    <FaArrowRight className="" />
                </div>
                <div className="py-3">Sản phẩm yêu thích</div>
            </div>
            <div>
                <div className="new_title lt clear_pd " style={{ width: "1255px" }}><h4><a href="/">Sản phẩm yêu thích</a></h4></div>
                <div className="sock_slide slider-items slick_margin slick-initialized slick-slider">
                    {displayedProducts?.length > 0 ? (
                        displayedProducts?.map((product: any, index: string) => (
                            <div
                                key={product._id}
                                className="item slick-slide slick-current slick-active mt-10"
                                tabIndex={-1}
                                role="option"
                                aria-describedby={`slick-slide${index + 10}`}
                                style={{ width: "273px" }}
                                data-slick-index={`${index}`}
                                aria-hidden="false"
                            >
                                <div className="col-item1 ">
                                    <div className="item-inner">
                                        <div className="product-wrapper">
                                            <div className="thumb-wrapper">
                                                <Link
                                                    to={''}
                                                    className="thumb flip"
                                                    title={product?.product_name}
                                                    tabIndex={0}
                                                >
                                                    <img
                                                        className="lazyload loaded"
                                                        src={product?.productId?.image[0]?.url}
                                                        alt={product?.productId?.product_name}
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="item-info">
                                            <div className="info-inner">
                                                <h3 className="item-title">
                                                    {" "}
                                                    <Link
                                                        to={''}
                                                        title={product?.productId?.product_name}
                                                        tabIndex={0}
                                                    >
                                                        {product?.productId?.product_name}
                                                    </Link>{" "}
                                                </h3>
                                                <div className="item-content">
                                                    <div className="item-price">
                                                        <div className="price-box">
                                                            <span className="regular-price">
                                                                {" "}
                                                                <span className="price">
                                                                    {formatCurrency(product?.productId?.product_price)}₫
                                                                </span>{" "}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="actions hidden-xs hidden-sm remove_html">
                                                <form>
                                                    <button
                                                        className="button btn-cart btn-more"
                                                        title="Chi tiết sản phẩm"
                                                        type="button"
                                                        tabIndex={0}
                                                    >
                                                        <Link to={`/products/${product?.productId?._id}`}>
                                                            Chi tiết
                                                        </Link>
                                                    </button>
                                                    <input type="hidden" tabIndex={0} />
                                                    <button
                                                        className="button btn-cart btn-more"
                                                        title="Chi tiết sản phẩm"
                                                        type="button"
                                                        tabIndex={0}
                                                    >
                                                        <Link to={''} onClick={() => deleteProduct(product._id)}>
                                                            Bỏ yêu thích
                                                        </Link>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <div
                                className="grid  px-4 bg-white place-content-center  pb-3"
                                style={{ height: "500px", width: '90.5%' }}
                            >
                                <div className="">
                                    <img
                                        className="w-[400px]"
                                        src="https://etecvn.com/default/template/img/cart-empty.png"
                                    />

                                    <h1
                                        className="mt-6  font-bold tracking-tight text-gray-900 "
                                        style={{ fontSize: "17px" }}
                                    >
                                        Không có sản phẩm nào, vui lòng thêm sản phẩm yêu thích !
                                    </h1>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <div className="flex w-full py-4 justify-center mt-2">
                <Pagination
                    count={Math.ceil(products?.favoriteProducts?.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                />
            </div>
        </div>
    );
};

export default FavoritePage;