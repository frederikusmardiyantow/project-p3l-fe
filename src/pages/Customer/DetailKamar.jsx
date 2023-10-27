import { FiUsers } from "react-icons/fi";
import NavbarComp from "../../components/NavbarComp";
import { BiBed } from "react-icons/bi";
import { IoMdResize } from "react-icons/io";
import CekKetersediaanComp from "../../components/CekKetersediaanComp";
import Footer from "../../components/FooterComp";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function DetailKamar() {
  const [detailKamar, setDetailKamar] = useState({});
  const {id} = useParams();

  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`/jenis/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // res = response;
          const { data } = response.data;
          setDetailKamar(data);
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
    fetchData();
  }, [id]);

  return (
    <div>
        <NavbarComp kelas="fixed" setBg="true"/>
        <div className="h-128 overflow-hidden items-center flex">
          <img src={detailKamar.gambar} alt="kamar" className="w-full bg-cover bg-fixed -z-10"/>
        </div>
        <div className="w-full h-max">
          <div className="bg-slate-50 -mt-20 h-max w-4/5 p-8 mx-auto inset-x-0 rounded-lg drop-shadow-sm space-y-10 mb-10">
            <div className="mx-10 space-y-5">
              <p className="text-3xl font-medium border-b-2 border-solid border-gray-900 py-5 w-1/2 uppercase">{detailKamar.jenis_kamar}</p>
              <p className="text-justify">Kamar {detailKamar.jenis_kamar} seluas {detailKamar.ukuran_kamar} meter persegi yang baru direnovasi didesain ulang dengan indah dan didekorasi dengan perabotan penuh gaya. Semua kamar memiliki balkon ekstra luas dengan pemandangan kolam renang yang dikelilingi oleh Taman Kerajaan yang rimbun, dan situs warisan Istana Kerajaan. Fitur khusus lainnya termasuk akses Internet nirkabel gratis, Smart LED TV, fasilitas kopi dan teh, brankas dalam kamar seukuran laptop, dan tempat tidur premium dengan kasur dengan bantalan ekstra lembut.</p>
            </div>
            <div className="flex w-full gap-3">
              <div className="w-[60%]  h-max p-3">
                <img src={detailKamar.gambar} alt="kamar" className="w-full aspect-video rounded-lg"/>
                <div className="mt-4">
                  
                  <div className="grid grid-cols-3 mt-4 gap-4">
                    <div className="flex flex-col justify-center text-center rounded-lg ring-1 ring-gray-700 p-2">
                      <FiUsers className="w-10 h-10 mx-auto text-gray-400"/>
                      <span className="text-[14px]">Kapasitas</span>
                      <span className="text-xl font-bold">{detailKamar.kapasitas}</span>
                    </div>
                    <div className="flex flex-col justify-center text-center rounded-lg ring-1 ring-gray-700">
                      <BiBed className="w-10 h-10 mx-auto text-gray-400"/>
                      <span className="text-[14px]">Tipe Tempat Tidur</span>
                      <span className="text-xl font-bold">Single</span>
                    </div>
                    <div className="flex flex-col justify-center text-center rounded-lg ring-1 ring-gray-700">
                      <IoMdResize className="w-10 h-10 mx-auto text-gray-400"/>
                      <span className="text-[14px]">Luas Kamar</span>
                      <span className="text-xl font-bold">{detailKamar.ukuran_kamar} m<sup>2</sup></span>
                    </div>
                  </div>
                  <div className="mt-5 px-5 space-y-3">
                    <p className="uppercase text-2xl font-medium border-b-2 border-solid border-gray-300 py-2 ">Rincian Kamar</p>
                    {detailKamar.deskripsi}
                    <ul className="list-disc list-inside space-y-1 ms-4">
                      <li>a</li>
                      <li>a</li>
                      <li>a</li>
                      <li>a</li>
                      <li>a</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-[40%] h-full space-y-3">
              <p className="uppercase text-2xl font-medium border-b-2 border-solid border-gray-300 py-2 ">Fasilitas</p>
              {detailKamar.fasilitas_kamar}
                    <ul className="list-disc list-inside space-y-1 ms-4">
                      <li>a</li>
                      <li>a</li>
                      <li>a</li>
                      <li>a</li>
                      <li>a</li>
                    </ul>
              </div>
            </div>
          </div>
        </div>
        <CekKetersediaanComp/>
        <Footer/>
    </div>
  )
}

export default DetailKamar