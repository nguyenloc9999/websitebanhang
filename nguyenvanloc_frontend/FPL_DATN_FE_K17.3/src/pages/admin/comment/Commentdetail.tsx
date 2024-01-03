import { useGetCommentByProductIdQuery } from "@/api/commentApi";
import { Table } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { StarOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { IComment } from "@/interfaces/comment";

const Commentdetail = () => {
  const { id }: any = useParams();
  const { data, isLoading: isLoadingComments }: any = useGetCommentByProductIdQuery(id);
  const comments = isLoadingComments ? [] : data?.comments;
  const [filter, setFilter] = useState("all");
  const [sortedInfo, setSortedInfo] = useState({} as any);
  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo(sorter);
    if (false) {
      console.log(pagination);
      console.log(filters);
    }
  };
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };
  const data1 = comments?.map((comment: IComment, index: number) => {
    return {
      STT: index + 1,
      key: comment._id,
      name: comment.userId,
      email: comment.userId,
      description: comment.description,
      rating: comment.rating,
      formattedCreatedAt: format(new Date(comment.createdAt), "HH:mm a dd/MM/yyyy")
    }
  });
  const filteredData =
    filter === "positive"
      ? data1.filter((comment: IComment) => comment.rating > 3)
      : filter === "negative"
        ? data1.filter((comment: IComment) => comment.rating <= 3)
        : data1;
  const columns: any = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (index: number) => <a>{index}</a>,
      sorter: (a: any, b: any) => a.STT - b.STT, // Sắp xếp theo STT
      sortOrder: sortedInfo.columnKey === "STT" && sortedInfo.order,
      ellipsis: true,
      width: 90,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      render: (record: any) => (
        <div>
          {record?.first_name} {record?.last_name}
        </div>
      ),
    },
    {
      title: "Gmail",
      dataIndex: "email",
      render: (record: any) => <div>{record?.email}</div>,
    },
    {
      title: "Bình luận",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Đánh giá(*)",
      dataIndex: "rating",
      key: "rating",
      sorter: (a: any, b: any) => a.rating - b.rating,
      sortOrder: sortedInfo.columnKey === "rating" && sortedInfo.order,
      ellipsis: true,
      width: 200,
      render: (rating: number | any, index: number | string) => {
        if (false) {
          console.log(index);
        }
        const starIcons = [];
        for (let i = 1; i <= 5; i++) {
          starIcons.push(
            i <= rating ? (
              <StarOutlined key={i} style={{ color: "#ffc107" }} />
            ) : (
              <StarOutlined key={i} style={{ color: "#e0e0e0" }} />
            )
          );
        }

        return <div>{starIcons}</div>;
      },
    },
    {
      title: "Thời gian ",
      dataIndex: "formattedCreatedAt",
      key: "formattedCreatedAt",
      sorter: (a: any, b: any) =>
        a.formattedCreatedAt.localeCompare(b.formattedCreatedAt),
      sortOrder:
        sortedInfo.columnKey === "formattedCreatedAt" && sortedInfo.order,
    },
  ];

  return (
    <div>
      <div className="container">
        <h3 className="font-semibold py-3">Danh sách đánh giá của sản phẩm</h3>
        <ul className="font-medium flex flex-col p-3 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a
              href=""
              className={`no-underline text-gray-700 ${filter === "all" ? "font-bold" : ""
                }`}
              onClick={(e) => {
                e.preventDefault();
                handleFilterChange("all");
              }}
            >
              Tất cả
            </a>
          </li>
          <li>
            <a
              href=""
              className={`no-underline text-gray-700 ${filter === "negative" ? "font-bold" : ""
                }`}
              onClick={(e) => {
                e.preventDefault();
                handleFilterChange("negative");
              }}
            >
              Bình luận tiêu cực
            </a>
          </li>
          <li>
            <a
              href=""
              className={`no-underline text-gray-700 ${filter === "positive" ? "font-bold" : ""
                }`}
              onClick={(e) => {
                e.preventDefault();
                handleFilterChange("positive");
              }}
            >
              Bình luận tích cực
            </a>
          </li>
        </ul>
        <Table
          onChange={handleChange}
          dataSource={filteredData}
          columns={columns}
          pagination={{ defaultPageSize: 6 }}
          rowKey="key"
        />
      </div>
    </div>
  );
};

export default Commentdetail;
