import { GiBed } from "react-icons/gi";
import { TbAirConditioning } from "react-icons/tb";
import assets from "../../assets";
import Footer from "../../components/FooterComp";
import NavbarComp from "../../components/NavbarComp";
import CekKetersediaanComp from "../../components/CekKetersediaanComp";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Spinner,
} from "@nextui-org/react";
import { BiWifi } from "react-icons/bi";
import { FaAsymmetrik, FaRegStarHalf } from "react-icons/fa";
import { PiBathtubBold, PiTelevisionBold } from "react-icons/pi";
import { RiSafe2Fill } from "react-icons/ri";
import { BsBookmarkStar } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { KamarContex } from "../../contex/KamarContex";
import baseUrl from "../../config";
import ConvertTo24HourFormat from "../../utils/ConvertTo24HourFormat";
import { useNavigate } from "react-router-dom";
import ConvertDateToYYYYMMDD from "../../utils/ConvertDateToYYYYMMDD";
import FormatCurrency from "../../utils/FormatCurrency";

async function KamarSedia(request) {
  let res;
  await axios
    .post(`/ketersediaan/kamar`, request, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      res = response;
      // const { data } = response.data;
      // setKetersediaanKamar(data);
      // console.log(ketersediaanKamar);
      // toast.success(response.data.message);
    })
    .catch((error) => {
      res = error.response;
      // toast.error(error.response.data.message);
    });

    return res;
}

function KetersediaanKamar() {
  const {jumlahDewasa, jumlahAnak, jumlahKamar, checkIn, checkOut} = useContext(KamarContex);
  // const [tempCheckIn, setTempCheckIn] = useState(new Date());
  // const [tempCheckOut, setTempCheckOut] = useState(new Date());
  const [ketersediaanKamar, setKetersediaanKamar] = useState([]);
  const waktu_checkIn = new Date().toLocaleDateString() == checkIn.toLocaleDateString() && new Date().getHours() >= 14 ? ConvertTo24HourFormat(new Date(checkIn.setHours(checkIn.getHours() + 1)).toLocaleString().split(',')[1].trim()) : ConvertTo24HourFormat(new Date(checkIn.setHours(14, 0, 0)).toLocaleString().split(',')[1].trim());
  const waktu_checkOut = ConvertTo24HourFormat(new Date(checkOut.setHours(12, 0, 0)).toLocaleString().split(',')[1].trim());

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

  async function getKetersediaan() {
    let response;
    console.log(ConvertDateToYYYYMMDD(checkIn.toLocaleDateString())+' '+waktu_checkIn)
    response = await KamarSedia({
      tgl_check_in: `${ConvertDateToYYYYMMDD(checkIn.toLocaleDateString())} ${waktu_checkIn}`,
      tgl_check_out: `${ConvertDateToYYYYMMDD(checkOut.toLocaleDateString())} ${waktu_checkOut}`,
      jumlah_dewasa: jumlahDewasa,
      jumlah_anak_anak: jumlahAnak
    });

    if(response.data.status === 'T'){
      const { data } = response.data;
      setKetersediaanKamar(data);
      // console.log(ketersediaanKamar);
      toast.success(response.data.message);
    }else{
      toast.error(response.data.message)
    }

  }

  useEffect(() => {
    getKetersediaan();
  }, [checkIn, checkOut, jumlahAnak, jumlahDewasa, jumlahKamar]);

  return (
    <>
      <NavbarComp kelas="fixed" setBg="true" />
      <BsBookmarkStar className="absolute h-20 -left-36 top-24 w-full text-[rgba(209,209,209,.5)]"/>
      <div className={`bg-[url('${baseUrl}bg-head.png')] bg-cover `}>
        <div className="mt-20 mb-10">
          <div className="relative h-full flex md:justify-between md:flex-row flex-col">
            <div className="h-[60vh]">
              <div className="h-80 md:h-96 w-64 bg-secondary rounded-r-3xl"></div>
              <div className="absolute top-10 left-5 w-[28rem] max-w-[95%] md:w-[35rem] rounded-xl   overflow-hidden z-10">
                  <img
                  src={assets.PEMANDANGANSORE}
                  alt="kamar"
                  className="hover:scale-110 duration-700"
                  />
              </div>
                  <div className="absolute bg-secondary h-40 w-40 z-0 bottom-2 left-[28rem] rounded-r-2xl rounded-bl-2xl hidden lg:flex"></div>
            </div>
            <div className="me-32 items-center flex text-center">
              <p className="text-4xl md:text-6xl font-bold text-center md:text-end uppercase z-10">
                Kamar <br />
                Tersedia
              </p>
              <GiBed className="h-60 w-max absolute -bottom-5 right-4 text-[rgba(209,209,209,.5)] transform -scale-x-100 z-0" />
            </div>
          </div>
          <div className="my-5 mx-10 ring-2 p-5 rounded-xl relative">
              <FaRegStarHalf className="h-40 w-max absolute -left-20 top-0 text-[rgba(209,209,209,.5)] z-0 transform -scale-x-100"/>
            <CekKetersediaanComp handleCari={handleCari} tempCheckIn={tempCheckIn} tempCheckOut={tempCheckOut} setTempCheckIn={setTempCheckIn} setTempCheckOut={setTempCheckOut} setTempJumlahAnak={setTempJumlahAnak} setTempJumlahDewasa={setTempJumlahDewasa} setTempJumlahKamar={setTempJumlahKamar}/>
          </div>
          <div className="bg-gray-50 rounded-xl mx-3 h-max flex flex-col md:flex-row gap-2 p-5">
            <div className="h-full w-full md:w-[70%]">
              {ketersediaanKamar?.length != 0 ? 
                ketersediaanKamar?.map((kamar, index) => (
                  <Card className="w-full shadow-md rounded-md mb-2 overflow-hidden" key={index}>
                    <CardHeader className="flex gap-3">
                      <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src={assets.BINTANG}
                        width={40}
                        className="scale-150"
                      />
                      <div className="flex flex-col">
                        <p className="text-lg font-bold">{kamar.jenis_kamar}</p>
                        <p className="text-small text-default-500">⭐⭐⭐⭐⭐</p>
                      </div>
                    </CardHeader>
                    <Divider className="h-[0.1px]" />
                    <CardBody className="p-0">
                      <div className="flex gap-1 flex-col md:flex-row">
                          <div className="md:w-[35rem] h-60 max-w-full overflow-hidden bg-cover">
                            <img src={kamar.jenis_kamars.gambar} alt="kamar" className="h-full w-full duration-[3000ms] hover:scale-150"/>
                          </div>
                          <div className="p-3 w-full">
                              <p className="text-gray-500 text-sm mb-2 font-medium"> {kamar.jenis_kamar == 'Superior' || kamar.jenis_kamar == 'Double Deluxe' ? 'Double/Twin' : 'King'} - Merokok/Tidak Merokok - {kamar.jenis_kamars.ukuran_kamar}m<sup>2</sup></p>
                              <p className="text-[10px] text-danger mb-3">Tersisa {kamar.jumlah_kamar} kamar</p>
                              <div className="grid grid-cols-2">
                                {kamar?.jenis_kamars?.fasilitas_kamar && kamar?.jenis_kamars?.fasilitas_kamar?.split(' - ').map((item, index) => (
                                  <div className="flex items-center gap-2 h-12" key={index}>
                                      <FaAsymmetrik className="text-gray-500"/> {item}
                                  </div>
                                ))}
                              </div>
                              <div className="text-end w-full mt-10">
                                {kamar.jenis_season == 'Promo' && 
                                  <p className="line-through text-gray-500 text-sm">{FormatCurrency(kamar.harga_dasar)}</p>
                                }  
                                  <p className="text-success text-2xl font-bold">{FormatCurrency(kamar.harga_saat_ini)}</p>
                              </div>
                          </div>
                      </div>
                    </CardBody>
                    <CardFooter>
                      <div className="flex gap-10 text-center mx-auto text-sm text-gray-500">
                          <p className="flex text-center items-center gap-2"><BiWifi/> Wifi Gratis</p>
                          <p className="flex text-center items-center gap-2"><PiTelevisionBold/> Televisi LCD</p>
                          <p className="flex text-center items-center gap-2"><PiBathtubBold/> Bathtub dan Shower terpisah</p>
                          <p className="flex text-center items-center gap-2"><TbAirConditioning/> AC Premium</p>
                          <p className="flex text-center items-center gap-2"><RiSafe2Fill/> Brankas</p>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              : <Spinner/>}
              
            </div>
            <div className="h-full w-full md:w-[30%] bg-blue-300">
              Kamar Pilihan Anda
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default KetersediaanKamar;
