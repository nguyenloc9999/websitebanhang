import { useGetCategoryQuery } from "@/api/categoryApi";
import { Skeleton } from "antd";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useEffect, useState } from "react";

const Categories = () => {
    const { data: categories, error, isLoading: isLoadingFetching }: any = useGetCategoryQuery();
    const [slidesPerView, setSlidesPerView] = useState(1); // Mặc định là 1

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSlidesPerView(3); // Đối với laptop và màn hình lớn hơn
            } else if (window.innerWidth >= 768) {
                setSlidesPerView(2); // Đối với iPad
            } else {
                setSlidesPerView(1); // Đối với màn hình nhỏ hơn, ví dụ điện thoại
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Gọi lần đầu khi tải trang
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Cuộn mượt
        });
    };
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
    return (
        <section className="cate-pro">
            <div className="container">
                <div className="row category">
                    <Swiper
                        slidesPerView={slidesPerView}
                        navigation={true}
                        spaceBetween={53}
                        modules={[Navigation]}
                    >
                        <div aria-live="polite" className="slick-list draggable">
                            <div
                                className="slick-track"
                                role="listbox"
                                style={{
                                    opacity: 1,
                                    width: "2264px",
                                    transform: "translate3d(0px, 0px, 0px)",
                                }}
                            >
                                {categories && categories.category.docs.map((category: any, index: any) => (
                                    <SwiperSlide key={category._id} className="col-lg-4 col-md-4 col-sm-4 col-xs-6 a">
                                        {category && (
                                            <div
                                                className="item slick-slide slick-current slick-active"
                                                tabIndex={-1}
                                                role="option"
                                                aria-describedby={`slick-slide${index + 10}`}
                                                style={{ width: "395px" }}
                                                data-slick-index={`${index}`}
                                                aria-hidden="false"
                                            >
                                                <Link to={`/category/${category._id}`} onClick={scrollToTop} className="tl" title={category?.category_name}>
                                                    <p className="ttt">
                                                        {category?.category_name}
                                                        <span>Xem sản phẩm</span>
                                                    </p>
                                                    <picture>
                                                        <img
                                                            alt={category?.category_name}
                                                            src={category.category_image?.url}
                                                            className="category-image"
                                                        />
                                                    </picture>
                                                </Link>
                                            </div>
                                        )}
                                    </SwiperSlide>
                                ))}
                            </div>
                        </div>
                    </Swiper>

                </div>
            </div>
        </section>
    )
}

export default Categories