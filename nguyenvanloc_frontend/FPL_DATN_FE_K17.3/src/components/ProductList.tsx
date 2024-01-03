import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useGetProductsQuery } from '@/api/productApi';
import { useGetCategoryQuery } from '@/api/categoryApi';
import { Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Model from './Model';

const ProductList = () => {
  const { data: categories, isLoading: isLoadingCate }: any = useGetCategoryQuery();
  const { data: products, error, isLoading: isLoadingFetching }: any = useGetProductsQuery();
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(4);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formatCurrency = (number: number) => {
    if (typeof number !== 'number') {
      return '0';
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isLoadingCate) return <Skeleton />;
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
  if (!categories || !categories.category || categories.category.docs.length === 0) {
    return <div>
      <div
        className="grid px-4 place-content-center pb-3"
        style={{ height: "100px" }}
      >
        <div className="">
          <h1
            className="mt-6 font-bold tracking-tight text-gray-900 "
            style={{ fontSize: "17px" }}
          >
            Không danh mục nào !
          </h1>
        </div>
      </div>
    </div>;
  }

  return (
    <div >
      {categories && categories?.category.docs.map((category: any) => {
        if (!products || !products.product || !products.product.docs) {
          return <p key={category._id}>Không có sản phẩm nào.</p>;
        }
        const categoryProducts = products.product.docs.filter((product: any) => product.categoryId === category._id);

        if (categoryProducts.length === 0) {
          // Skip rendering the category if it has no products
          return null;
        }

        return (
          <div key={category._id} className="main-col2 bg_menu lazyload " data-was-processed="true">
            <div className="container ">
              <div className="std">
                <div
                  className="best-seller-pro menu"
                  style={{ visibility: "visible" }}
                >
                  <div className="slider-items-products bg-none">
                    <div className="new_title  lt clear_pd" style={{ background: "none" }}>
                      <h4>
                        <Link to={`/category/${category._id}`} title={category?.category_name}>
                          {category.category_name}
                        </Link>
                      </h4>
                    </div>
                    <div id="best-seller-slider" className="hidden-buttons">
                      <div className="sock_slide slider-items slick_margin slick-initialized slick-slider">
                        <Swiper
                          slidesPerView={slidesPerView}
                          navigation={true}
                          spaceBetween={40}
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
                              {categoryProducts?.map((product: any, index: number) => (
                                <SwiperSlide key={product._id}>
                                  <div
                                    className="item slick-slide slick-current slick-active"
                                    tabIndex={-1}
                                    role="option"
                                    aria-describedby={`slick-slide${index + 10}`}
                                    style={{ width: "283px" }}
                                    data-slick-index={`${index}`}
                                    aria-hidden="false"
                                  >
                                    <div className="col-item1 ">
                                      <div className="item-inner">
                                        <div className="product-wrapper">
                                          <div className="thumb-wrapper">
                                            <Link
                                              to={`/products/${product._id}`}
                                              className="thumb flip"
                                              title={product?.product_name}
                                              tabIndex={0}
                                            >
                                              <img
                                                className="lazyload loaded"
                                                src={product?.image[0]?.url}
                                                alt={product?.product_name}
                                              />
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="item-info">
                                          <div className="info-inner">
                                            <h3 className="item-title">
                                              {" "}
                                              <Link
                                                to={`/products/${product._id}`}
                                                title={product?.product_name}
                                                tabIndex={0}
                                              >
                                                {product?.product_name}
                                              </Link>{" "}
                                            </h3>
                                            <div className="item-content">
                                              <div className="item-price">
                                                <div className="price-box">
                                                  <span className="regular-price">
                                                    {" "}
                                                    <span className="price">
                                                      {formatCurrency(product?.product_price)}₫
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
                                                <Link onClick={scrollToTop} to={`/products/${product._id}`}>
                                                  Chi tiết
                                                </Link>
                                              </button>
                                              <input type="hidden" tabIndex={0} />
                                              <Model products={product} />
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              ))}
                            </div>
                          </div>
                        </Swiper>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
