import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
import { HiArrowSmLeft, HiArrowSmRight } from 'react-icons/hi';
import { useGetBannerQuery } from '@/api/bannerApi';
import { Skeleton } from 'antd';

const Homeslides = () => {
  const { data, isLoading: isLoadingBanner } = useGetBannerQuery<any>();
  const listBanner = data?.banner.docs;

  if (isLoadingBanner) return <Skeleton />;
  return (
    <div>
      <Swiper
        className='relative group'
        spaceBetween={50}
        slidesPerView={1}
        navigation={{
          nextEl: '.button-next-slie',
          prevEl: '.button-prev-slie',
        }}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false, // Keep autoplay after user interaction
        }}
        loop={true} // Enable loop
      >
        {listBanner && listBanner?.map((items: any, index: number) => (
          <SwiperSlide key={index}>
            <div className="image">
              <img src={items?.image?.url} alt=""
                className='w-[100%]' />
            </div>
          </SwiperSlide>
        ))}

        <div className='top-[50%] absolute z-10 button-next-slie group-hover:left-0 -left-[23rem] duration-500 text-white w-[40px] h-[40px] bg-black grid place-items-center'>
          <HiArrowSmLeft />
        </div>
        <div className='top-[50%] absolute z-10 button-prev-slie text-white group-hover:right-0 -right-[23rem] duration-500 w-[40px] h-[40px] bg-black grid place-items-center'>
          <HiArrowSmRight />
        </div>
      </Swiper>
    </div>
  );
}

export default Homeslides;
