/* eslint-disable react/no-unescaped-entities */
import { useContext, useEffect, useState } from "react";
import NavbarComp from "../components/NavbarComp";
import { BsArrowRight } from "react-icons/bs";
import Typewriter from "../utils/TypeWriter";
import { Link, useNavigate } from "react-router-dom";

import FasilitasComp from "../components/FasilitasComp";
import Footer from "../components/FooterComp";
import JenisKamarComp from "../components/JenisKamarComp";

import CekKetersediaanComp from "../components/CekKetersediaanComp";
import { KamarContex } from "../contex/KamarContex";

function Home() {
  const {checkIn, checkOut} = useContext(KamarContex);
  const [isMenu, setIsMenu] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const {setCheckIn, setCheckOut, setJumlahAnak, setJumlahDewasa, setJumlahKamar} = useContext(KamarContex);
  const [tempCheckIn, setTempCheckIn] = useState(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut);
  const [tempJumlahDewasa, setTempJumlahDewasa] = useState("");
  const [tempJumlahAnak, setTempJumlahAnak] = useState("");
  const [tempJumlahKamar, setTempJumlahKamar] = useState("");
  const navigate = useNavigate();
  const handleCari = (e) => {
    e.preventDefault();
    setCheckIn(tempCheckIn);
    setCheckOut(tempCheckOut);
    setJumlahAnak(tempJumlahAnak);
    setJumlahDewasa(tempJumlahDewasa);
    setJumlahKamar(tempJumlahKamar);
    navigate("/ketersediaan/kamar");
  }

  useEffect(function () {
    setCheckIn(new Date());
  }, []);
  
  useEffect(function () {
    setCheckOut(new Date(new Date(checkIn).setDate(checkIn.getDate() + 1)));
  }, [checkIn]);
  
  useEffect(function () {
    setJumlahAnak("");
    setJumlahDewasa("");
    setJumlahKamar("");
  }, []);
  
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
    <>
      <div className="flex flex-col text-blue-900">
        <NavbarComp kelas="absolute" setBg="false" />
        <div className={`bg-hero-pattern h-128 bg-cover bg-center bg-fixed transition-all relative`}>
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
        <div className="h-[250px] bg-yellow-800 text-white py-10 px-40 text-center space-y-6">
          <p className="uppercase text-xl font-medium tracking-widest">Grand Atma Hotel: Pintu Gerbang Menuju Kenyamanan</p>
          <p className="leading-relaxed">
          Kami dengan penuh kebanggaan dan senang hati menyambut Anda di Grand Atma Hotel. Ini bukan hanya sebuah hotel, tetapi juga sebuah tempat yang kami katakan sebagai "rumah kedua Anda." Kami percaya bahwa setiap tamu adalah bagian penting dari keluarga kami, dan dengan setiap kunjungan Anda, kami berkomitmen untuk memberikan pengalaman yang tak terlupakan.
          </p>
        </div>
        <div className="my-20">
          <p className="text-3xl text-center uppercase tracking-wide font-medium">
            Kamar Utama Hotel
          </p>
          <Link to="/kamar">
            <p className="flex items-center font-normal italic justify-center mt-3 mb-5">
              Lihat Semua Kamar <BsArrowRight className="ms-1" />
            </p>
          </Link>
          {/* <SliderComp
            src={[
              "hotel/kamar-1.jpg",
              "hotel/kamar-2.jpg",
              "hotel/kamar-3.jpg",
              "hotel/kamar-4.jpg",
            ]}
          /> */}
          <JenisKamarComp/>
        </div>
        <div className="p-10 m-5 rounded-3xl ring-2">
          <p className="text-3xl text-center uppercase tracking-wide font-medium mb-9">
            Cek Ketersediaan Kamar
          </p>
          <CekKetersediaanComp handleCari={handleCari} tempCheckIn={tempCheckIn} tempCheckOut={tempCheckOut} setTempCheckIn={setTempCheckIn} setTempCheckOut={setTempCheckOut} setTempJumlahAnak={setTempJumlahAnak} setTempJumlahDewasa={setTempJumlahDewasa} setTempJumlahKamar={setTempJumlahKamar}/>
        </div>
        <div className="my-20">
          <FasilitasComp/>
        </div>
        <div>
        <p className="text-3xl text-center uppercase tracking-wide font-medium mb-7">
            Temukan Kami
          </p>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.098128168296!2d110.41612909999999!3d-7.779419499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f1fb2f2b45%3A0x20986e2fe9c79cdd!2sUniversitas%20Atma%20Jaya%20Yogyakarta%20-%20Kampus%203%20Gedung%20Bonaventura%20Babarsari!5e0!3m2!1sid!2sid!4v1698610205040!5m2!1sid!2sid" className="w-full h-[400px] border-0" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>

        {/* <div className="" style={{ height: "200vh" }}>
          xyy
        </div> */}
        <Footer/>
      </div>
    </>
  );
}

export default Home;
