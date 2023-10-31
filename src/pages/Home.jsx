import { useEffect, useState } from "react";
import NavbarComp from "../components/NavbarComp";
import { BsArrowRight } from "react-icons/bs";
import Typewriter from "../utils/TypeWriter";
import { Link } from "react-router-dom";
import InputDateComp from "../components/InputDateComp";

import FasilitasComp from "../components/FasilitasComp";
import Footer from "../components/FooterComp";
import JenisKamarComp from "../components/JenisKamarComp";

import { Button, Select, SelectItem } from "@nextui-org/react";


const jumlahs = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
];

function Home() {
  const [isMenu, setIsMenu] = useState(false);
  const [selectOpenDewasa, setSelectOpenDewasa] = useState(false);
  const [selectOpenAnak, setSelectOpenAnak] = useState(false);
  const [selectOpenKamar, setSelectOpenKamar] = useState(false);
  const [jumlahDewasa, setJumlahDewasa] = useState("");

  useEffect(function () {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 512) {
        setIsMenu(true);
      } else {
        setIsMenu(false);
      }
    });
    window.addEventListener("scroll", () => {
      setSelectOpenAnak(false);
      setSelectOpenDewasa(false);
      setSelectOpenKamar(false);
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
        <div className="h-max bg-blue-50 px-10 py-16">
          <p className="text-3xl text-center uppercase tracking-wide font-normal mb-9">
            Cek Ketersediaan Kamar
          </p>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 items-center">
            <InputDateComp label="Check In" />
            <InputDateComp label="Check Out" />
            <Select
              variant="bordered"
              label="Jumlah Dewasa"
              placeholder="Pilih Jumlah Dewasa"
              onChange={(e) => setJumlahDewasa(e.target.value)}
              className="bg-white rounded-xl"
              isOpen={selectOpenDewasa}
              onClick={() => setSelectOpenDewasa(!selectOpenDewasa)}
            >
              {jumlahs.map((jumlah) => (
                <SelectItem
                  key={jumlah.value}
                  value={jumlah.value}
                  onClick={() => setSelectOpenDewasa(!selectOpenDewasa)}
                >
                  {jumlah.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              variant="bordered"
              label="Jumlah Anak"
              placeholder="Pilih Jumlah Anak"
              className="bg-white rounded-xl"
              isOpen={selectOpenAnak}
              onClick={() => setSelectOpenAnak(!selectOpenAnak)}
            >
              {jumlahs.map((jumlah) => (
                <SelectItem
                  key={jumlah.value}
                  value={jumlah.value}
                  onClick={() => setSelectOpenAnak(!selectOpenAnak)}
                >
                  {jumlah.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              variant="bordered"
              label="Jumlah Kamar"
              placeholder="Pilih Jumlah Kamar"
              className="bg-white rounded-xl"
              isOpen={selectOpenKamar}
              onClick={() => setSelectOpenKamar(!selectOpenKamar)}
            >
              {jumlahs.map((jumlah) => (
                <SelectItem
                  key={jumlah.value}
                  value={jumlah.value}
                  onClick={() => setSelectOpenKamar(!selectOpenKamar)}
                >
                  {jumlah.label}
                </SelectItem>
              ))}
            </Select>
            <Button className="bg-primary hover:bg-secondary text-slate-100 font-medium">
              Cari
            </Button>
            {/* <Calendar onChange={onChange} value={value}/> */}
          </div>
          <p className="text-center mt-7 italic">
            Ingin memesan kamar lebih dari 10?
            <Link to="/kamar">
              <span className="not-italic font-medium"> Hubungi Kami</span>
            </Link>
          </p>
        </div>
        <div className="my-20">
          <FasilitasComp/>
        </div>
        <div>
        <p className="text-3xl text-center uppercase tracking-wide font-medium mb-7">
            Temukan Kami
          </p>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.098128168296!2d110.41612909999999!3d-7.779419499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f1fb2f2b45%3A0x20986e2fe9c79cdd!2sUniversitas%20Atma%20Jaya%20Yogyakarta%20-%20Kampus%203%20Gedung%20Bonaventura%20Babarsari!5e0!3m2!1sid!2sid!4v1698610205040!5m2!1sid!2sid" className="w-full h-[400px] border-0" allowfullscreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
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
