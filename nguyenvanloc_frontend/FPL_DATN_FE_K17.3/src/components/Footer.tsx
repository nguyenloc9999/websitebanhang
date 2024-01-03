import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer >
      <section className="bg-slate-950 mt-5 ">
        <div className="lg:grid lg:grid-cols-4 md:gap-4   p-4 max-w-7xl mx-auto py-10 ">
          <div >
            <ul className=" space-y-2 text-sm pl-0">
              <h2 className="text-white font-bold text-base">Chính sách đổi trả</h2>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Chính sách đổi trả</Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Chính sách vẫn chuyển</Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Chính sách bảo hành </Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Chính sách trả góp </Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Chính sách Mua hàng</Link>
              </li>
            </ul>
          </div>
          <div >
            <ul className="text-white space-y-2 pl-0 text-sm ">
              <h2 className="text-white font-bold text-base">Kênh bán hàng</h2>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Zalo</Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Shoppe</Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Lazada </Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Tiki</Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Tiktok</Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="text-white space-y-2 pl-0 text-sm">
              <h2 className="text-white font-bold text-base">Về chúng tôi</h2>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Trang chủ</Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Sản Phẩm</Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Tin tức </Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Giới Thiệu</Link>
              </li>
              <li>
                <Link to={''} className=" text-slate-50 hover:text-[#ff7600] no-underline" >Liên hệ </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3 pl-0" >
            <h2 className="text-white font-bold text-base">Liên hệ </h2>
            <div className="flex">
              <div><img src="	https://bizweb.dktcdn.net/100/368/970/themes/740033/assets/on-maps.png?1693834920118" alt="" /></div>
              <Link to={''} className="text-white ml-2 text-sm">Ladeco Building, 266 Doi Can Street, Ba Dinh District, Hanoi.</Link>
            </div>
            <div className="flex">
              <div><img src="https://bizweb.dktcdn.net/100/368/970/themes/740033/assets/old-phone.png?1693834920118" alt="" /></div>
              <Link to={''} className="text-white ml-2 text-sm">1900 6750</Link>
            </div>
            <div className="flex ">
              <div><img src="https://bizweb.dktcdn.net/100/368/970/themes/740033/assets/email-envelope.png?1693834920118" alt="" /></div>
              <Link to={''} className="text-white ml-2 text-sm">casanoithat@gmail.com</Link>
            </div>

          </div>
        </div>
      </section>
      <section>
        <div className="text-center max-w-7xl mx-auto my-5 ">
          <div className="flex justify-center my-5" >
            <img src="https://res.cloudinary.com/dkvghcobl/image/upload/v1700053906/rw3dfdxjaknl7jlvnafj.png" alt="Logo Casa"
            />
          </div>
          <p className="text-sm px-2">Chúng tôi xây dựng Website Casa Furniture để mong rằng quý khách có trải nghiệm mua sắm trực tuyến đơn giản, tiện lợi.
            Đặt niềm tin và sự tin tưởng để chúng tôi có động lực phát triển hơn từng ngày!</p>
          <p>CHÂN THÀNH CẢM ƠN QUÝ KHÁCH HÀNG RẤT NHIỀU!</p>
          <div className="mx-auto  space-x-4 my-5 border-b border-t  border-y-zinc-500  max-w-3xl">
            <div className="flex justify-center space-x-5 py-2">
              <img src="https://bizweb.dktcdn.net/100/368/970/themes/740033/assets/facebook.png?1693834920118" alt="" />
              <img src="https://bizweb.dktcdn.net/100/368/970/themes/740033/assets/twitter.png?1693834920118" alt="" />
              <img src="https://bizweb.dktcdn.net/100/368/970/themes/740033/assets/instagram.png?1693834920118" alt="" />
              <img src="https://bizweb.dktcdn.net/100/368/970/themes/740033/assets/youtube.png?1693834920118" alt="" />
            </div>
          </div>
          <div className="mx-auto  space-x-4 my-5   max-w-3xl">
            <div className="flex justify-center space-x-5 py-2">
              <img className="first lazyload loaded" src="//bizweb.dktcdn.net/100/368/970/themes/740033/assets/payment-1.png?1693834920118" data-src="//bizweb.dktcdn.net/100/368/970/themes/740033/assets/payment-1.png?1693834920118" alt="payment-1" data-was-processed="true" />
              <img className="lazyload loaded" src="//bizweb.dktcdn.net/100/368/970/themes/740033/assets/payment-2.png?1693834920118" data-src="//bizweb.dktcdn.net/100/368/970/themes/740033/assets/payment-2.png?1693834920118" alt="payment-2" data-was-processed="true" />
              <img className="lazyload loaded" src="//bizweb.dktcdn.net/100/368/970/themes/740033/assets/payment-3.png?1693834920118" data-src="//bizweb.dktcdn.net/100/368/970/themes/740033/assets/payment-3.png?1693834920118" alt="payment-3" data-was-processed="true" />
              <img className="lazyload loaded" src="//bizweb.dktcdn.net/100/368/970/themes/740033/assets/payment-4.png?1693834920118" data-src="//bizweb.dktcdn.net/100/368/970/themes/740033/assets/payment-4.png?1693834920118" alt="payment-4" data-was-processed="true" />

            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}

export default Footer