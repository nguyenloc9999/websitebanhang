import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { BsFillHouseDashFill, BsSearch } from 'react-icons/bs';
import { TbBrandProducthunt } from 'react-icons/tb';
import { MdCategory } from 'react-icons/md';
import { FaAccusoft, FaRegImage } from "react-icons/fa";
import { AiOutlineAntDesign, AiOutlineBranches, AiOutlineComment, AiOutlineFontColors, AiOutlineFontSize, AiOutlineMenu, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import '@/layouts/LayoutAdmin.css'
import { BiNews, BiSolidCoupon } from 'react-icons/bi';
import { IoMdContact } from "react-icons/io";
import { useSearchProductsQuery } from '@/api/productApi';
import { checkAndRemoveExpiredData } from '@/checkAndRemoveExpiredData';
import { getDecodedAccessToken } from '@/decoder';
import { useGetUserByIdQuery } from '@/api/authApi';
import { Skeleton } from 'antd';


const LayoutAdmin = () => {
  const [isSidebarHidden, setSidebarHidden] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const decodedToken: any = getDecodedAccessToken();
  const iduser = decodedToken ? decodedToken.id : null;
  const { data: user, isLoading } = useGetUserByIdQuery(iduser);
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem("accessToken")
    navigate("/");
  };
  useEffect(() => {
    checkAndRemoveExpiredData();
  }, []);
  const handleSearchChange = (event: any) => {
    event.preventDefault();
    setSearchKeyword(event.target.value);
  };
  const { data: searchProducts }: any = useSearchProductsQuery(searchKeyword);
  useEffect(() => {
    checkAndRemoveExpiredData();
  }, []);

  const toggleSidebar = () => {
    setSidebarHidden(prevState => !prevState);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 576) {
        setSidebarHidden(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li .a');

    allSideMenu.forEach(item => {

      const li = item.parentElement;

      item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
          i.parentElement?.classList.remove('active');
        })
        li?.classList.add('active');
      })
    });

    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    searchButton?.addEventListener('click', function (e) {
      if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm?.classList.toggle('show');
        if (searchForm?.classList.contains('show')) {
          searchButtonIcon?.classList.replace('bx-search', 'bx-x');
        } else {
          searchButtonIcon?.classList.replace('bx-x', 'bx-search');
        }
      }
    })
  }, [])

  const formatCurrency = (number: number) => {
    if (typeof number !== 'number') {
      // Xử lý khi number không phải là số
      return '0'; // Hoặc giá trị mặc định khác tùy vào yêu cầu của bạn
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  if (isLoading) return <Skeleton />;

  return (
    <div>
      <section id="sidebar" className={isSidebarHidden ? 'hide' : ''}>
        <Link className="brand text-center" to={'/'}>
          {user && (
            <div >
              <div className='flex justify-center'>
                <><img
                  className=" block rounded-full img  items-center "
                  src={user.avatar?.url ||
                    `https://res.cloudinary.com/dndyxqosg/image/upload/v1699260603/hhegkbrro5wwaxpjkuwx.png`}
                  alt="" />
                </>
              </div>
              <div className='text-center'>
                <span >{user.first_name} {user.last_name}</span>
              </div>
            </div>
          )
          }

        </Link>
        <ul className="side-menu top">
          <li className="active">
            <Link to={'dashboard'} className="a">
              <span className="icon"><BsFillHouseDashFill /></span>
              <span className="text1">Bảng điều khiển</span>
            </Link>
          </li>
          <li>
            <Link to={'products'} className="a">
              <span className="icon"><TbBrandProducthunt /></span>
              <span className="text1">Sản phẩm</span>
            </Link>
          </li>
          <li>
            <Link to={'categories'} className="a">
              <span className="icon"><MdCategory /></span>
              <span className="text1">Danh mục</span>
            </Link>
          </li>
          <li>
            <Link to={'users'} className="a">
              <span className="icon"><AiOutlineUser /></span>
              <span className="text1">Khách hàng</span>
            </Link>
          </li>
          <li>
            <Link to={'comments'} className="a">
              <span className="icon"><AiOutlineComment /></span>
              <span className="text1">Đánh giá</span>
            </Link>
          </li>
          <li>
            <Link to={'brands'} className="a">
              <span className="icon"><AiOutlineBranches /></span>
              <span className="text1">Thương hiệu</span>
            </Link>
          </li>
          <li>
            <Link to={'coupons'} className="a">
              <span className="icon"><BiSolidCoupon /></span>
              <span className="text1">Phiếu giảm giá</span>
            </Link>
          </li>
          <li>
            <Link to={'colors'} className="a">
              <span className="icon"><AiOutlineFontColors /></span>
              <span className="text1">Màu sắc</span>
            </Link>
          </li>
          <li>
            <Link to={'sizes'} className="a">
              <span className="icon"><AiOutlineFontSize /></span>
              <span className="text1">Kích cỡ</span>
            </Link>
          </li>
          <li>
            <Link to={'materials'} className="a">
              <span className="icon"><FaAccusoft /></span>
              <span className="text1">Vật liệu</span>
            </Link>
          </li>
          <li>
            <Link to={'orders'} className="a">
              <span className="icon"><AiOutlineShoppingCart /></span>
              <span className="text1">Đơn hàng</span>
            </Link>
          </li>
          <li>
            <Link to={'news'} className="a">
              <span className="icon"><BiNews /></span>
              <span className="text1">Tin tức</span>
            </Link>
          </li>
          <li>
            <Link to={'contact'} className="a">
              <span className="icon"><IoMdContact /></span>
              <span className="text1">Liên hệ</span>
            </Link>
          </li>
          <li>
            <Link to={'banners'} className="a">
              <span className="icon"><FaRegImage /></span>
              <span className="text1">Ảnh quảng cáo</span>
            </Link>
          </li>
          <li>
            <Link to={'customized-products-list'} className="a">
              <span className="icon"><AiOutlineAntDesign /></span>
              <span className="text1">Sản phẩm thiết kế</span>
            </Link>
          </li>
          {/* <li>
            <Link to="#" className="logout">
              <span className="icon"><RiLogoutCircleLine /></span>
              <span className="text1" onClick={() => ''}>Đăng xuất</span>
            </Link>
          </li> */}
        </ul>
      </section>

      <section id="content">
        <nav>
          <span className="menu" onClick={toggleSidebar}><AiOutlineMenu /></span>
          <Link to="#" className="nav-link"></Link>
          <form >
            <div className="form-input">
              <input type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchKeyword}
                onChange={handleSearchChange}
              />
              <button type="submit" className="search-btn"><BsSearch /></button>
            </div>
          </form>

          <div className='keyword' >
            {searchKeyword && (
              <div className="rounded-md z-50 absolute mt-5" id="listProduct" style={{ top: '20%', left: '22%', transform: 'translateX(-50%)', width: "31%", maxHeight: "400px", overflowY: "scroll" }}>
                <div className='container'>
                  <div className="p-2 bg-white rounded-md">
                    {searchKeyword && searchProducts && searchProducts.product.docs && searchProducts.product.docs.length > 0 ? (
                      searchProducts.product.docs.map((product: any, index: any) => (

                        <div key={index}>
                          <div className="grid grid-cols-[50px,auto] h-full p-1 rounded-md gap-y-5 focus:visible bg-gray-100 mt-1">
                            <div>
                              <Link to={`/products/${product._id}`}>
                                <img
                                  src={product.image[0].url}
                                  alt="ảnh"
                                  className="transition duration-200 ease-in-out hover:scale-105 md:h-[50px] md:w-[50px] ml-2 mt-1"
                                />
                              </Link>
                            </div>
                            <div className="gap-y-3">
                              <Link
                                to={`/products/${product._id}`}
                                className="text-black hover:text-yellow-500 transition duration-200 no-underline ml-4 mt-1 font-semibold"
                              >
                                {product.product_name}
                              </Link>
                              <p className="text-red-500 ml-4 font-semibold">
                                {formatCurrency(product.product_price)}₫
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center">Không tìm thấy sản phẩm nào</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* <input type="checkbox" id="switch-mode" hidden /> */}
          {/* <Link to="#" className="notification">
            <AiFillMessage />
            <span className="num">8</span>
          </Link> */}
          <div className="profile">
            {user && (
              <div className="relative mr-5 group">
                <div className="py-2">
                  <img
                    className=" block rounded-full"
                    width={5}
                    src={
                      user.avatar?.url ||
                      `https://res.cloudinary.com/dndyxqosg/image/upload/v1699260603/hhegkbrro5wwaxpjkuwx.png`
                    }
                    alt=""
                  />
                </div>

                <ul
                  className={`hidden group-hover:block absolute  absolute z-50 w-[150px] bg-white right-[25px] top-[10px] mt-[30px] `}
                >
                  <li>
                    <Link
                      to="/user/profile"
                      className="text-[12px] no-underline text-[#000] hover:text-[#ff7600]"
                    >
                      Thông tin tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link
                      to=""
                      onClick={logout}
                      className="text-[12px] no-underline text-[#000] hover:text-[#ff7600]"
                    >
                      Đăng xuất
                    </Link>
                  </li>
                </ul>


              </div>
            )}
          </div>
        </nav >
        <main>
          <Outlet />
        </main>
      </section >
    </div >
  );
};

export default LayoutAdmin;
