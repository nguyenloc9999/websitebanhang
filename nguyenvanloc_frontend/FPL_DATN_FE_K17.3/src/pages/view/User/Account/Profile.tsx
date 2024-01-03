import { useGetUserByIdQuery } from "@/api/authApi";
import { getDecodedAccessToken } from "@/decoder";
import { Link } from "react-router-dom";
import "./Profile.css"

const Profile = () => {
  const decodedToken: any = getDecodedAccessToken();
  const id = decodedToken ? decodedToken.id : null;
  const { data: user } = useGetUserByIdQuery(id);
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container-xl ">
      <div className="header ">
        <h3 className="text-lg font-semibold md:mt-4 mt-2 md:ml-4">Quản Lý Thông Tin Hồ Sơ</h3>
        <hr />
      </div>
      <div className="bottom flex">
        <div className="left">
          <form action="">
            <table className="md:w-[602px] border-collapse border-spacing-0 justify-center">
              <tr className="">
                <td className="w-20">
                  <label className="pl-4 pb-3 py-3 ">Họ :</label>
                </td>
                <td>
                  <div className="py-4">
                    <input
                      type="text"
                      placeholder={user.first_name}
                      className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md transition duration-300 hover:ease-in-out"
                      disabled
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="pl-4 pb-3 py-3">Tên :</label>
                </td>
                <td>
                  <div className="py-4">
                    <input
                      type="text"
                      placeholder={user.last_name}
                      className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                      disabled
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="pl-4 pb-3 py-3">Email :</label>
                </td>
                <td>
                  <div className="py-4">
                    <input
                      type="text"
                      placeholder={user.email}
                      className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                      disabled
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="pl-4 pb-3 py-3">SĐT :</label>
                </td>
                <td>
                  <div className="py-4">
                    <input
                      type="text"
                      placeholder={user.phone}
                      className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                      disabled
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="pl-4 pb-3 py-3">Địa chỉ :</label>
                </td>
                <td>
                  <div className="py-4">
                    <input
                      type="text"
                      placeholder={user.address}
                      className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                      disabled
                    />
                  </div>
                </td>
              </tr>
            </table>
            <br />
            <Link className="bg-green-500 rounded py-2 px-4 ml-4 mt-4" to={"/user/profile/edit"} style={{ textDecoration: "none", color: "white" }}>Cập Nhật Hồ Sơ</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
