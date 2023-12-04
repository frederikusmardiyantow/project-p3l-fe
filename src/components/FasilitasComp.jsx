// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRef } from "react";
// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./FasilitasComp.css"

function FasilitasComp() {
    const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  return (
    <div className="">
      <p className="text-3xl text-center uppercase tracking-wide font-medium mb-9">
        Fasilitas yang Tersedia
      </p>
      <div className="flex flex-wrap md:flex-nowrap gap-1">
        <div className="my-auto w-full md:w-1/2">
          <div className="ring-2 m-4 ring-yellow-800 px-3 py-8 !font-['Zeyada'] font-extrabold text-lg uppercase text-center">
            Fasilitas yang Beranekaragam disediakan oleh Grand Atma Hotel untuk Anda. Kenyamanan Anda adalah Tujuan kami.
          </div>
        </div>
        <div className="bg-red-50 h-[450px] w-full md:w-3/5">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={false}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className="w-full h-full"
          >
            <SwiperSlide><img src="hotel/kamar-1.jpg" alt="1" /></SwiperSlide>
            <SwiperSlide><img src="hotel/kamar-2.jpg" alt="2" /></SwiperSlide>
            <div className="autoplay-progress" slot="container-end">
              <svg viewBox="0 0 48 48" ref={progressCircle}>
                <circle cx="24" cy="24" r="20"></circle>
              </svg>
              <span ref={progressContent}></span>
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default FasilitasComp;
