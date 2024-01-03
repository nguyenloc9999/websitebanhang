import "../Home/Homepage.css";
import "../Home/Responsive_homepage.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/api/productApi";
import { useGetCategoryQuery } from "@/api/categoryApi";
import { Pagination } from "@mui/material";
import { Skeleton } from "antd";
import { FaArrowRight } from "react-icons/fa6";
import { useGetBrandQuery } from "@/api/brandApi";
import Model from "@/components/Model";
import { ICategory } from "@/interfaces/category";
import { IBrand } from "@/interfaces/brand";

interface Product {
  brandId: string;
  categoryId: string;
  createdAt: string;
  deleted: boolean;
  description: string;
  image: { url: string }[];
  materialId: string;
  product_name: string;
  product_price: number;
  sold_quantity: number;
  updatedAt: string;
  views: number;
  _id: string;
  // Các trường khác nếu có
}

const ProductPage = () => {
  const {
    data: products,
    error,
    isLoading: isLoadingFetching,
  } = useGetProductsQuery<any>();
  const { data: categories } = useGetCategoryQuery<any>();
  const { data: brands } = useGetBrandQuery<any>();

  const [selectedPriceFilter, setSelectedPriceFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const formatCurrency = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

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

  const filteredProducts = products?.product?.docs?.filter((product: Product) => {
    const categoryMatches =
      selectedCategory === "all" || product.categoryId === selectedCategory;
    const brandMatches =
      selectedBrand === "all" || product.brandId === selectedBrand;
    if (selectedPriceFilter === "all") {
      return categoryMatches && brandMatches;
    } else if (selectedPriceFilter === "100000-1000000") {
      return (
        categoryMatches &&
        brandMatches &&
        product.product_price >= 100000 &&
        product.product_price <= 1000000
      );
    } else if (selectedPriceFilter === "1000000-5000000") {
      return (
        categoryMatches &&
        brandMatches &&
        product.product_price >= 1000000 &&
        product.product_price <= 5000000
      );
    } else if (selectedPriceFilter === "5000000-10000000") {
      return (
        categoryMatches &&
        brandMatches &&
        product.product_price >= 5000000 &&
        product.product_price <= 10000000
      );
    } else if (selectedPriceFilter === "10000000+") {
      return (
        categoryMatches && brandMatches && product.product_price >= 10000000
      );
    }
  });
  //  Phân trang........................
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = filteredProducts?.slice(startIndex, endIndex);
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
        <div className="py-3">Sản Phẩm</div>
      </div>
      {/* <div className=" py-3 text-xl font-bold">
        Giúp bạn tìm sản phẩm nhanh hơn
      </div> */}
      <div className="mt-2 py-3 md:flex ">
        <select
          id="small"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block mr-4 p-2.5 mb-6 text-sm text-gray-900 border border-orange-400 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //...
        >
          <option value="all">Tất cả danh mục</option>
          {categories?.category?.docs.map((category: ICategory) => (
            <option key={category._id} value={category._id}>
              {category.category_name}
            </option>
          ))}
        </select>
        <select
          id="small"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="block mr-4 p-2.5 mb-6 text-sm text-gray-900 border border-orange-400 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //...
        >
          <option value="all">Tất cả thương hiệu</option>
          {brands?.brand?.map((brand: IBrand) => (
            <option key={brand._id} value={brand._id}>
              {brand.brand_name}
            </option>
          ))}
        </select>
        <select
          id="small"
          value={selectedPriceFilter}
          onChange={(e) => setSelectedPriceFilter(e.target.value)}
          className="block mr-4 p-2.5 mb-6 text-sm text-gray-900 border border-orange-400 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //...
        >
          <option value="all">Tất cả giá</option>
          <option value="100000-1000000">100.000 - 1.000.000₫</option>
          <option value="1000000-5000000">1.000.0000 - 5.000.000₫</option>
          <option value="5000000-10000000">5.000.000 - 10.000.000₫</option>
          <option value="10000000+">10.000.000₫+</option>
        </select>
      </div>
      <div>
        <div className="new_title lt clear_pd " style={{ width: "1255px" }}><h4><a href="/">Tất cả sản phẩm</a></h4></div>

        <div className="sock_slide slider-items slick_margin slick-initialized slick-slider">

          {displayedProducts?.length > 0 ? (
            displayedProducts?.map((product: Product, index: string) => (

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
                            src={product.image[0]?.url}
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
                            to={''}
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
                                  {formatCurrency(product.product_price)}₫
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
                            <Link to={`/products/${product?._id}`}>
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
            ))
          ) : (
            <div>
              <div
                className="grid  px-4 bg-white place-content-center  pb-3"
                style={{ height: "500px" }}
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
                    Không có sản phẩm nào, vui lòng đợi cập nhật sản phẩm !
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="flex w-full py-4 justify-center ">
        <Pagination
          count={Math.ceil(filteredProducts?.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default ProductPage;