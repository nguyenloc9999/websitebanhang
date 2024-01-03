import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import { getDecodedAccessToken } from "@/decoder";
import { useGetUserByIdQuery } from "@/api/authApi";
import { FiUsers } from "react-icons/fi";
import { useGetCartsQuery } from "@/api/cartApi";
import "./Header.css";

const Header = () => {
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const decodedToken: any = getDecodedAccessToken();
  const iduser = decodedToken ? decodedToken.id : null;
  const { data: user, refetch } = useGetUserByIdQuery(iduser);
  const navigate = useNavigate();
  const { data: carts } = useGetCartsQuery(iduser);
  const [cartItemCount, setCartItemCount] = useState(0);
  useEffect(() => {
    // Nếu dữ liệu giỏ hàng tồn tại, cập nhật số lượng sản phẩm
    if (carts?.data?.products) {
      const totalProducts = carts.data.products.length;
      setCartItemCount(totalProducts);
    }
  }, [carts]);
  const toggleMenu = () => {
    setIsMenuHidden(!isMenuHidden);
  };
  const logout = () => {
    Promise.resolve().then(() => {
      localStorage.removeItem("accessToken");
      navigate("/");
    })
    refetch()
  };

  return (
    <div>
      <header className="header mx-auto shadow-lg z-50 top-0">
        <section className="py-2 bg-white">
          <div className="md:grid md:grid-cols-[30%,70%] max-w-7xl mx-auto p-0 m-0 ">
            <div className="md:flex items-center ">
              <div className="flex md:p-0 pl-3">
                <Link to={'/'}>
                  <img
                    src="https://res.cloudinary.com/dkvghcobl/image/upload/v1700052990/hby7nyozorvpib8k7z9h.png"
                    width={85}
                    className="logo"
                  />
                </Link>
              </div>
              <Search />
            </div>
            <div
              className={` ${isMenuHidden ? 'block' : 'hidden'} md:flex justify-between justify-items-center mt-2  } `}
            >
              <div className={` flex md:m-0 justify-between `}>
                <ul className="md:flex font-bold  pl-2  sm:mx-3 text-base md:p-0 md:m-0 items-center">
                  <li>
                    <Link
                      className="no-underline text-gray-900 hover:text-[#ff7600] mr-4"
                      to={"/"}
                    >
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="no-underline text-gray-900 hover:text-[#ff7600] mr-4"
                      to={"/products"}
                    >
                      Sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="no-underline text-gray-900 hover:text-[#ff7600] mr-4"
                      to={"/news"}
                    >
                      Tin tức
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="no-underline text-gray-900 hover:text-[#ff7600] mr-4"
                      to={"/review"}
                    >
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="no-underline text-gray-900 hover:text-[#ff7600] mr-4"
                      to={"/contact"}
                    >
                      Liên hệ
                    </Link>
                  </li>
                </ul>
                <button onClick={toggleMenu} className="md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="44"
                    fill="currentColor"
                    className="bi bi-justify"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-end mr-3">

                <div
                  className={`nav-user flex items-center menu-item text-[20px] cursor-pointer relative ${user ? "hover-trigger" : ""
                    }`}
                >
                  {iduser && user ? (
                    <div className="relative mr-5 group">
                      <div className="py-2">
                        <img
                          className="w-8 h-8 block rounded-full"
                          src={
                            user.avatar?.url ||
                            `https://res.cloudinary.com/dndyxqosg/image/upload/v1699260603/hhegkbrro5wwaxpjkuwx.png`
                          }
                          alt=""
                        />
                      </div>
                      <ul
                        className={`hidden group-hover:block absolute  z-50 w-[180px] bg-white right-[-50px] top-[10px] mt-[30px] `}
                      >
                        {user.role === "admin" ? (
                          <li>
                            <Link
                              to="/admin"
                              className="text-[12px] no-underline text-[#000] hover:text-[#ff7600]"
                            >
                              Trang quản trị
                            </Link>
                          </li>
                        ) : (
                          ""
                        )}
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
                            to="/products/favorite"
                            className="text-[12px] no-underline text-[#000] hover:text-[#ff7600]"
                          >
                            Sản phẩm yêu thích
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/signup"
                            className="text-[12px] no-underline text-[#000] hover:text-[#ff7600]"
                          >
                            Đăng ký
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="user/changepasswordnew"
                            className="text-[12px] no-underline text-[#000] hover:text-[#ff7600]"
                          >
                            Đổi mật khẩu
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
                  ) : (
                    <div className="mr-5 relative group">
                      <div className="text-2xl" >
                        <FiUsers />
                      </div>
                      <div className="hidden group-hover:block absolute z-50 w-[150px] bg-white right-[-30px] top-[8px] mt-3 px-3 py-1">
                        <div>
                          <Link
                            to={"/signup"}
                            className="text-[12px] no-underline text-[#000] hover:text-[#ff7600]"
                          >
                            Đăng kí
                          </Link>
                        </div>
                        <div>
                          <Link
                            to={"/signin"}
                            className="text-[12px] no-underline text-[#000] hover:text-[#ff7600]"
                          >
                            Đăng Nhập
                          </Link>
                        </div>
                      </div>

                    </div>

                  )}
                </div>
                {/* Giỏ hàng */}
                <div className="ml-2 items-center flex relative group">
                  <Link to={"/carts"}>
                    <div className="relative">
                      <img
                        src="https://bizweb.dktcdn.net/100/368/970/themes/740033/assets/cart.png?1693834920118"
                        width="30px"
                        alt="Giỏ hàng"
                      />
                      {iduser && cartItemCount > 0 && (
                        <div className="absolute top-0 bottom-8 right-0 mt-2 bg-orange-500 rounded-full h-6 w-6 text-white text-center text-sm">
                          <strong>{cartItemCount}</strong>
                        </div>
                      )}
                      {!iduser && cartItemCount === 0 && (
                        <div className="absolute top-0 bottom-8 right-0 mt-2 bg-orange-500 rounded-full h-6 w-6 text-white text-center">
                          0
                        </div>
                      )}
                      {!iduser && cartItemCount === 0 && (
                        <div className="absolute text-xs text-center mt-1 mnpq">
                          Không có sản phẩm nào
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
                {/* Sản phẩm tự thiết kế */}
                <div className="ml-6 items-center flex relative group">
                  <Link to={"/customizedProducts"}>
                    <div className="relative">
                      <img
                        src="https://res.cloudinary.com/dkvghcobl/image/upload/v1701261988/jwjbsoiwfslskorccmij.png"
                        width="30px"
                        alt="Sản phẩm tự thiết kế"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            {!isMenuHidden && (
              <button onClick={toggleMenu} className="md:hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44"
                  height="44"
                  fill="currentColor"
                  className="bi bi-justify"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </button>
            )}
          </div>

        </section>
      </header>
    </div>
  );
}

export default Header;
