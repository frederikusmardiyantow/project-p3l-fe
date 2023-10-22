/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';

function SliderComp({src}) {
  return (
    <Swiper
    modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
    spaceBetween={10}
    slidesPerView={3}
    // height={300}
    width={2000}
    navigation
    pagination={{ clickable: true }}
    scrollbar={{ draggable: true }}
    onSwiper={(swiper) => console.log(swiper)}
    onSlideChange={() => console.log('slide change')}
    autoplay={true}
    speed={1000}
    >
      {src.map((item, index) => (
        <SwiperSlide key={index} ><img className='' src={item} alt="1" /></SwiperSlide>
      ))}
      
    </Swiper>
  )
}

export default SliderComp