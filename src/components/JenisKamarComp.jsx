import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import "./JenisKamarComp.css"
import { FiUsers } from "react-icons/fi";
import { IoMdResize } from "react-icons/io";
import { BiBed } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function JenisKamarComp() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
          await axios
            .get(`/jenis`, {
              headers: {
                "Content-Type": "application/json"
              },
            })
            .then((response) => {
              // res = response;
              setData(response.data.data);
              console.log(data);
              toast.success(response.data.message);
            })
            .catch((error) => {
              console.log(error.response);
              toast.error(error.response.data.message);
            });
        }
        fetchData();
      }, []);

  return (
    <div className="mx-24">
        <Swiper
        slidesPerView={3}
        spaceBetween={20}
        autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="w-full"
        >
            {data.map((jk) => (
                <SwiperSlide className="flex-col rounded-md bg-white overflow-hidden drop-shadow-[0_0_1px_rgba(0,0,0,0.25)] m-1 p-5 h-[550px] flex justify-start" key={jk.id}>
                    <div className="w-full h-50 rounded-md overflow-hidden">
                        <img src={jk.gambar} alt="logo" className="bg-gray-700 aspect-[5/3]"/>
                    </div>
                    <div className="text-base py-3 text-start w-full space-y-1">
                        <div className="uppercase font-medium text-gray-400 text-sm">Kamar</div>
                        <div className="text-lg font-bold leading-6">Kamar {jk.jenis_kamar} dengan 1 Tempat Tidur</div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2"><FiUsers/> {jk.kapasitas} Orang</div>
                            <div className="flex items-center"><IoMdResize className="mr-2"/>{jk.ukuran_kamar} m<sup>2</sup></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2"><BiBed/> 1 x Tempat Tidur Queen</div>
                        </div>
                        <div className="italic !mt-3"><Link to={`/kamar/${jk.id}`} className="flex items-center gap-1">Lihat selengkapnya <BsArrowRight/></Link></div>
                        <div className="flex justify-center fixed bottom-10 left-0 w-full">
                            <Button className="uppercase bg-primary text-white font-medium rounded-md w-3/4 text-center !mt-5 tracking-widest">Pesan Sekarang!</Button>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        
    </div>
  );
}

export default JenisKamarComp;
