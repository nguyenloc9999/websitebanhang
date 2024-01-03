import { useGetNewsQuery } from "@/api/newsApi";
import { useState } from "react";
import { Link } from "react-router-dom";
import './New.css';
import { Skeleton } from "antd";

const NewsComponent = () => {
  const { data, isLoading: isLoadingFetching }: any = useGetNewsQuery();
  const initialVisibleItems = 3;
  const [visibleItems, setVisibleItems] = useState(initialVisibleItems);

  const handleToggle = () => {
    setVisibleItems((prev) => (prev === initialVisibleItems ? Math.min(6, data?.news?.docs.length) : initialVisibleItems));
  };

  if (isLoadingFetching) return <Skeleton />;

  return (
    <div className="main-col5">
      <section className="latest-blog">
        <div className="container">
          <div
            className="blog-title  new_title lt"
            style={{ background: "none" }}
          >
            <h1>
              <a href="tin-tuc" title="Kiến thức Phong Thủy">
                <span>Tin Tức Mới Nhất</span>
              </a>
            </h1>
          </div>

          <div className="row x">
            {data?.news?.docs &&
              data?.news?.docs.slice(0, visibleItems).map((newItems: any, index: number) => (
                <div
                  key={index}
                  className="col-xs-12 col-sm-6 col-md-4 item_bl_index"
                >
                  <div className="blog_inner border rounded-lg">
                    <div className="blog-img blog-l">
                      <Link to={''}>
                        <img
                          className="lazyload loaded object-fill h-48 w-96 ppqq"
                          src={newItems.new_image.url}
                          alt="Thiết kế phòng bếp hiện đại 2020"
                        />
                      </Link>
                    </div>
                    <div className="px-3">
                      <h3>
                        <Link to={''}>{newItems.new_name}</Link>
                      </h3>
                      <p className="justify wwtt">{newItems.new_description}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="view_more" onClick={handleToggle}>
            <Link to={''} title="Xem thêm">
              {visibleItems === initialVisibleItems ? 'Xem thêm' : 'Thu gọn'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsComponent;
