import { useGetNewsQuery } from "@/api/newsApi";
import { INew } from "@/interfaces/new";
import { Skeleton } from "antd";
import { useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";

const News = () => {
  const { data, isLoading: isLoadingFetching } = useGetNewsQuery<any>();
  const newList = data?.news?.docs;
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  // Tính chỉ số của tin tức đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newList?.slice(indexOfFirstItem, indexOfLastItem);
  // Số lượng trang
  const pageNumbers = Math.ceil(newList?.length / itemsPerPage);
  // Mảng các số trang
  const pages = [];
  for (let i = 1; i <= pageNumbers; i++) {
    pages.push(i);
  }

  if (isLoadingFetching) return <Skeleton />;

  if (!data || !data?.news || newList === 0) {
    return (
      <div>
        <div
          className="grid  px-4 bg-white place-content-center   pb-3"
          style={{ height: "500px" }}
        >
          <div className="">
            <img
              className="w-[400px]"
              src="https://i.ytimg.com/vi/SGMm1Nda9gk/maxresdefault.jpg"
              alt=""
            />

            <h1
              className="mt-6  font-bold tracking-tight text-gray-900 "
              style={{ fontSize: "17px" }}
            >
              Không có tin tức, Xin hãy đợi CASA cập nhật tin tức !
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto ">
      <h1 className="text-4xl font-bold py-8 text-center">Tin tức nội thất</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {currentItems &&
          currentItems?.map((newsItem: INew, index: number) => (
            <div key={index} className="bg-white p-6 rounded shadow-md">
              <Link to={''} className="group block">
                <img
                  src={newsItem?.new_image?.url}
                  className="object-cover w-full h-48 mx-auto group-hover:scale-105"
                />
              </Link>
              <div className="mt-4">
                <Link to={''} className="no-underline">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:underline group-hover:underline-offset-2">
                    {newsItem?.new_name}
                  </h3>
                </Link>
                <p className="mt-2 text-sm text-gray-700">
                  {newsItem?.new_description}
                </p>
              </div>
            </div>
          ))}

      </div>
      <div
        aria-label="Page navigation example"
        className="mt-4 text-right mr-4"
      >
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <Link
              to={''}
              onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
              aria-disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <GrPrevious />
            </Link>
          </li>
          {pages?.map((page) => (
            <li key={page}>
              <Link
                to={''}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center justify-center px-3 h-8 ${currentPage === page
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
              >
                {page}
              </Link>
            </li>
          ))}

          <li>
            <Link
              to={''}
              onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              aria-disabled={currentPage === pageNumbers}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <GrNext />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default News;
