import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';

function CardComp() {
  return (
    <Swiper
    modules={[Navigation, Pagination, Scrollbar, A11y]}
    spaceBetween={50}
    slidesPerView={3}
    navigation
    pagination={{ clickable: true }}
    scrollbar={{ draggable: true }}
    onSwiper={(swiper) => console.log(swiper)}
    onSlideChange={() => console.log('slide change')}
    >
      <SwiperSlide><img src="hotel/bagian-atas.jpg" alt="1" /></SwiperSlide>
      <SwiperSlide><img src="hotel/kamar-1.jpg" alt="1" /></SwiperSlide>
      <SwiperSlide><img src="hotel/bagian-atas.jpg" alt="1" /></SwiperSlide>
      <SwiperSlide><img src="hotel/kamar-2.jpg" alt="1" /></SwiperSlide>
      <SwiperSlide><img src="hotel/bagian-atas.jpg" alt="1" /></SwiperSlide>
      <SwiperSlide><img src="hotel/kamar-1.jpg" alt="1" /></SwiperSlide>
      <SwiperSlide><img src="hotel/bagian-atas.jpg" alt="1" /></SwiperSlide>
      <SwiperSlide><img src="hotel/kamar-2.jpg" alt="1" /></SwiperSlide>
    </Swiper>
  )
}

export default CardComp