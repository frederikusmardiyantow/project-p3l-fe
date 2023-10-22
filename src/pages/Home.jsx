import { useEffect, useState } from "react";
import NavbarComp from "../components/NavbarComp";
import { BsArrowRight } from "react-icons/bs";
import SliderComp from "../components/SliderComp";
import Typewriter from "../utils/TypeWriter";
import { Link } from "react-router-dom";

function Home() {
  const [isMenu, setIsMenu] = useState(false);

  useEffect(function () {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 512) {
        setIsMenu(true);
      } else {
        setIsMenu(false);
      }
    });
  }, []);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    // Tunggu 5 detik sebelum memuat ulang halaman
    const timeout = setTimeout(() => {
      setDisplayText(
        <div className="after:content-['*'] after:block after:mt-1 before:content-['*'] before:block">
          Pilihan Tempat Penginapan Terbaik Manusia Bumi yang{" "}
          <span className="bg-secondary font-bold px-1">
            Murah, Aman, Nyaman, dan Terpercaya..
          </span>
        </div>
      );
    }, 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex flex-col gap-20 text-blue-900">
      <NavbarComp kelas="absolute" setBg="false" />
      <div className="bg-hero-pattern h-128 bg-cover bg-center bg-fixed transition-all relative">
        <div className="font-bold text-5xl md:text-6xl flex justify-center items-center h-full text-white text-center">
          {/* Selamat Datang di{" "}
            <span className="bg-primary py-2 px-3"> Grand Atma Hotel</span> */}
          <Typewriter>Seelamat Datang di Grand Atma Hotel</Typewriter>
        </div>
        <div className="absolute bottom-10 md:bottom-16 lg:bottom-28 left-0 right-0 text-center text-xl font-medium text-slate-100 font-mono">
          {displayText}
        </div>
      </div>
      <NavbarComp kelas={isMenu ? "fixed" : "hidden"} setBg="true" />
      <div>
        <p className="text-3xl text-center uppercase tracking-wide font-medium">
          Kamar Utama Hotel
        </p>
        <Link to="/kamar">
        <p className="flex items-center font-normal italic justify-center mt-3 mb-5">
          Lihat Semua Kamar <BsArrowRight className="ms-1" />
        </p></Link>
        <SliderComp
          src={[
            "hotel/kamar-1.jpg",
            "hotel/kamar-2.jpg",
            "hotel/kamar-3.jpg",
            "hotel/kamar-4.jpg",
          ]}
        />
      </div>
      <div className="h-max bg-blue-50">
      <p className="text-3xl text-center uppercase tracking-wide font-normal mt-12">
          Cek Ketersediaan
        </p>
      </div>

      <div className="" style={{ height: "200vh" }}>
        xyy
      </div>
    </div>
  );
}

export default Home;
