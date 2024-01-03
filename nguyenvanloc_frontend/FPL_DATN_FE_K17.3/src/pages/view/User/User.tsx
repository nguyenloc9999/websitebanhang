import { useGetUserByIdQuery } from "@/api/authApi";
import { getDecodedAccessToken } from "@/decoder";
import { Link, Outlet } from "react-router-dom";
import { MdOutlineManageAccounts } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { FaCartPlus } from "react-icons/fa";
import { BiSolidCoupon } from "react-icons/bi";
import { Skeleton } from "antd";
import { AiOutlineSync } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";


const UserPage = () => {
  const decodedToken: any = getDecodedAccessToken();
  const iduser = decodedToken ? decodedToken.id : null;
  const { data: user, isLoading, isError } = useGetUserByIdQuery(iduser);

  if (isLoading) return <Skeleton />;

  if (isError) {
    return <div>Có lỗi khi tải dữ liệu người dùng.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between w-full lg:w-[100%]">
      <div className="w-full lg:w-[350px] flex flex-col border-e bg-white">
        <div className="grid grid-row-2 pt-2">
          <div className="flex justify-center">
            {user && user.avatar ? <img
              alt="avatar"
              src={user?.avatar?.url}
              className="w-28 h-28 rounded-full"
            /> : <img
              alt="avatar"
              src='https://static.thenounproject.com/png/363640-200.png'
              className="w-28 h-28 rounded-full"
            />}

          </div>
          <div className="mt-2 flex justify-center text-3xl">
            {user?.first_name} {user?.last_name}
          </div>
        </div>

        <div className="md:mt-10 mt-2 flex md:h-screen flex-col justify-between border-e bg-white">
          <ul>
            <li>
              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center rounded-lg px-2 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  <span className="text-sx font-medium">
                    <a href="" className="text-black float-left mt-1">
                      <MdOutlineManageAccounts />
                    </a>{" "}
                    Tài khoản của tôi
                  </span>
                  <span className="pl-4 shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>
                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    <Link
                      to="/user/profile"
                      className="no-underline block rounded-lg px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                      <p className="text-black float-left mt-1 mr-1">
                        <ImProfile />
                      </p>{" "}
                      Hồ sơ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/favorite"
                      className="no-underline block rounded-lg px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                      <p className="text-black float-left mt-1 mr-1">
                        <CiHeart />
                      </p>{" "}
                      Sản phẩm yêu thích
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/user/changepasswordnew"
                      className="no-underline block rounded-lg px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                      <p className="text-black float-left mt-1 mr-1">
                        <AiOutlineSync />
                      </p>{" "}
                      Đổi mật khẩu
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <Link
                to="/user/orders"
                className="no-underline block rounded-lg px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <div className="text-black float-left mt-1 mr-1">
                  <FaCartPlus />
                </div>{" "}
                Đơn mua
              </Link>
            </li>
            {/* <li>
              <Link
                to=""
                className="no-underline block rounded-lg px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <p className="text-black float-left mt-1 mr-1">
                  <FaBell />
                </p>{" "}
                Thông báo
              </Link>
            </li> */}
            <li>
              <Link
                to="/user/voucher"
                className="no-underline block rounded-lg px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <p className="text-black float-left mt-1 mr-1">
                  <BiSolidCoupon />
                </p>{" "}
                Kho voucher
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default UserPage;
