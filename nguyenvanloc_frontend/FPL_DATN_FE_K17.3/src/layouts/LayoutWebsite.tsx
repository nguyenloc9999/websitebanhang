
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { useEffect } from "react";
import { checkAndRemoveExpiredData } from "@/checkAndRemoveExpiredData";
const LayoutWebsite = () => {
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  const accessToken = url.searchParams.get("token");
  // Gọi hàm kiểm tra và xóa khi ứng dụng khởi chạy (ví dụ: trong useEffect)
  useEffect(() => {
    checkAndRemoveExpiredData();
  }, []);
  useEffect(() => {
    // Kiểm tra xem có token hay không
    if (accessToken) {
      const expirationTime = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 giờ
      const dataToStore = { accessToken, expirationTime };
      localStorage.setItem('accessToken', JSON.stringify(dataToStore));
    } else {
      console.log("Không có token trong URL.");
    }
  }, [])
  return (
    <div className="mx-auto top-0  ">
      <Header />
      <section >
        <main className="max-w mx-auto  ">
          <Outlet />
        </main>
      </section>
      <Footer />
    </div>
  );
};

export default LayoutWebsite;
