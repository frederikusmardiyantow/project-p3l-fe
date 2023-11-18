/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaAsymmetrik } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CekKetersediaanComp from "../../../components/CekKetersediaanComp";
import { KamarContex } from "../../../contex/KamarContex";
import ConvertTo24HourFormat from "../../../utils/ConvertTo24HourFormat";
import HitungJumlahMalam from "../../../utils/HitungJumlahMalam";
import ConvertDateToYYYYMMDD from "../../../utils/ConvertDateToYYYYMMDD";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import FormatCurrency from "../../../utils/FormatCurrency";
import TampunganPesananComp from "../../../components/TampunganPesananComp";
import { MdLibraryBooks } from "react-icons/md";
import { BiWifi } from "react-icons/bi";
import { PiBathtubBold, PiTelevisionBold } from "react-icons/pi";
import { TbAirConditioning } from "react-icons/tb";
import { RiSafe2Fill } from "react-icons/ri";
import assets from "../../../assets";
import ModalKonfYesNo from "../../../components/ModalKonfYesNo";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import FormatDate from "../../../utils/FormatDate";

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
    })
    .catch((error) => {
      res = error.response;
    });

  return res;
}
async function AddReservasi(request, token) {
    let res;
    await axios
      .post(`/transaksi/reservasi/kamar`, request, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res = response;
      })
      .catch((error) => {
        res = error.response;
      });
  
    return res;
  }
  
  async function AddTrxLayanan(request, token) {
    let res;
    await axios
      .post(`/transaksi/layanan`, request, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        res = response;
      })
      .catch((error) => {
        res = error.response;
      });
  
    return res;
  }

function AddReservasiGroup() {
  const token = localStorage.getItem("apiKeyAdmin");
  const { idCust } = useParams();
//   const [loadData, setLoadData] = useState(false);
  const [dataCustomer, setDataCustomer] = useState({});
  const navigation = useNavigate();
  const [konfirmLanjutPesan, setKonfirmLanjutPesan] = useState(false);
  const [konfirmFixPesan, setKonfirmFixPesan] = useState(false);
  const [loadingKonfirm, setLoadingKonfirm] = useState(false);
  const [isOpenReqFasilitas, onOpenChangeReqFasilitas] = useState(false);
  const [isOpenDetailPesanan, onOpenChangeDetailPesanan] = useState(false);


  const [fasilitasSelected, setFasilitasSelected] = useState([]);
  // const [dateJumlahFasilitas, setDateJumlahFasilitas] = useState(false);
  const [dataFasilitas, setDataFasilitas] = useState([]);
  const [reqLayanan, setReqLayanan] = useState("");
  const [stringFasilitasDiPilih, setStringFasilitasDiPilih] = useState("");
  const { jumlahDewasa, jumlahAnak, jumlahKamar, checkIn, checkOut } =
    useContext(KamarContex);
  const [ketersediaanKamar, setKetersediaanKamar] = useState([]);
  const [tampunganPesanan, setTampunganPesanan] = useState([]);
  const waktu_checkIn = ConvertTo24HourFormat(
    new Date(checkIn.setHours(14, 0, 0)).toLocaleString().split(",")[1].trim()
  );
  const waktu_checkOut = ConvertTo24HourFormat(
    new Date(checkOut.setHours(12, 0, 0)).toLocaleString().split(",")[1].trim()
  );
  const [jumlahMalam, setJumlahMalam] = useState(0);
  const [totalHargaList, setTotalHargaList] = useState([]);
  const [totalHargaPesanan, setTotalHargaPesanan] = useState(0);
  const {
    setCheckIn,
    setCheckOut,
    setJumlahAnak,
    setJumlahDewasa,
    setJumlahKamar,
  } = useContext(KamarContex);
  const [tempCheckIn, setTempCheckIn] = useState(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut);
  const [tempJumlahDewasa, setTempJumlahDewasa] = useState("");
  const [tempJumlahAnak, setTempJumlahAnak] = useState("");
  const [tempJumlahKamar, setTempJumlahKamar] = useState("");
  //   const navigate = useNavigate();
  const handleCari = (e) => {
    e.preventDefault();
    setJumlahMalam(0);
    setTampunganPesanan([]);
    setTotalHargaList([]);
    setCheckIn(tempCheckIn);
    setCheckOut(tempCheckOut);
    setJumlahAnak(tempJumlahAnak);
    setJumlahDewasa(tempJumlahDewasa);
    setJumlahKamar(tempJumlahKamar);
  };

  useEffect(() => {
    console.log(fasilitasSelected);
    const namaFasilitasDiPilih = fasilitasSelected?.map((id) => {
      const fasilitas = dataFasilitas.find((fasilitas) => fasilitas?.id == id);
      return fasilitas ? fasilitas?.nama_layanan : null;
    });
    console.log(namaFasilitasDiPilih);
    setStringFasilitasDiPilih(namaFasilitasDiPilih.join(", "));
  }, [dataFasilitas, fasilitasSelected]);

  useEffect(() => {
    const jml = HitungJumlahMalam(
      new Date(ConvertDateToYYYYMMDD(checkOut.toLocaleDateString())),
      new Date(ConvertDateToYYYYMMDD(checkIn.toLocaleDateString()))
    );
    setJumlahMalam(jml);
  }, [checkIn, checkOut]);

  useEffect(() => {
    let temp = 0;
    if (totalHargaList.length != 0) {
      totalHargaList?.map((list) => {
        temp += list.hargaTotal;
      });
      console.log(totalHargaList);
      setTotalHargaPesanan(temp);
    }
  }, [totalHargaList]);

  async function getKetersediaan() {
    let response;
    response = await KamarSedia({
      tgl_check_in: `${ConvertDateToYYYYMMDD(
        checkIn.toLocaleDateString()
      )} ${waktu_checkIn}`,
      tgl_check_out: `${ConvertDateToYYYYMMDD(
        checkOut.toLocaleDateString()
      )} ${waktu_checkOut}`,
      jumlah_dewasa: jumlahDewasa,
      jumlah_anak_anak: jumlahAnak,
    });

    if (response.data.status === "T") {
      const { data } = response.data;
      setKetersediaanKamar(data);
      // console.log(ketersediaanKamar);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  }

  useEffect(() => {
    getKetersediaan();
  }, [checkIn, checkOut, jumlahAnak, jumlahDewasa, jumlahKamar]);

  async function getDataCustGroup() {
    // setLoadData(true);
    await axios
      .get(`/customer/${idCust}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        if (data.jenis_customer != "G") {
          toast.error("Customer bukan Group");
        } else {
          setDataCustomer(data);
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        navigation("/admin/dashboard");
        toast.error(error.response.data.message);
      });
    // setLoadData(false);
  }

  useEffect(() => {
    getDataCustGroup();
  }, [token]);

  function handleLanjutPesan(e) {
    e.preventDefault();
    setKonfirmLanjutPesan(true);
    setLoadingKonfirm(false);
  }

  async function handleYakinLanjutPesan() {
    setKonfirmLanjutPesan(false);
    setLoadingKonfirm(true);
    handleTampilFasilitas();
    setLoadingKonfirm(false);
  }

  async function handleTampilFasilitas(){
    await axios
        .get(`/layanan`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const {data} = response.data;
          setDataFasilitas(data);
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    onOpenChangeReqFasilitas(true);
  }

  function handleLanjutDiFasilitas() {
    onOpenChangeReqFasilitas(false);
    onOpenChangeDetailPesanan(true);
  }

  function handleKembaliDiDetailPesanan(){
    onOpenChangeDetailPesanan(false);
    onOpenChangeReqFasilitas(true);
  }

  function handlePesanDiDetailPesanan() {
    setLoadingKonfirm(false);
    setKonfirmFixPesan(true);
  }

  async function handleYakinFixPesan(){
    setLoadingKonfirm(true);
    const listReq = totalHargaList.map((item) => ({
      id_jenis_kamar: item.id,
      jumlah: item.jumlahPesanan,
      harga_per_malam: item.hargaPerMalam,
    }));

    const response = await AddReservasi(
      {
        id_customer: idCust,
        kamar: listReq,
        jumlah_dewasa: jumlahDewasa,
        jumlah_anak_anak: jumlahAnak,
        jumlah_malam: jumlahMalam,
        req_layanan: reqLayanan,
        waktu_check_in: `${ConvertDateToYYYYMMDD(
          checkIn.toLocaleDateString()
        )} ${waktu_checkIn}`,
        waktu_check_out: `${ConvertDateToYYYYMMDD(
          checkOut.toLocaleDateString()
        )} ${waktu_checkOut}`,
        flag_stat: 1,
      },
      token
    );
    if (response.data.status === "T") {
      toast.success(response.data.message);
      await addDataTrxFasilitas(response.data.data.id);
      setTampunganPesanan([]);
      setKonfirmFixPesan(false);
      onOpenChangeDetailPesanan(false);
      onOpenChangeReqFasilitas(false);
      setKetersediaanKamar([]);
      navigation(`/admin/customer/riwayat/${idCust}`);
    } else {
      toast.error(response.data.message);
    }
    setLoadingKonfirm(false);
    setKonfirmFixPesan(false);
  }

  async function addDataTrxFasilitas(idTrxReservasi){
    if (fasilitasSelected.length != 0) {
      for (const id of fasilitasSelected) {
        const harga = dataFasilitas.find((item) => item.id === id)?.harga;
        const response = await AddTrxLayanan(
          {
            id_layanan: id,
            id_trx_reservasi: idTrxReservasi,
            jumlah: 1,
            total_harga: harga,
            flag_stat: 1,
          },
          token
        );
        // Handle the response as needed
        console.log('addDataFasilitas id: '+id+' dgn status: '+response.data.status);
      }
    }
  }


  return (
    <div>
      <p>
        <Link to="/admin/customer" className="flex gap-1 items-center text-sm">
          <BsArrowLeftShort />
          Kembali
        </Link>
      </p>
      <p className="font-extrabold text-3xl">Reservasi Group</p>
      <p className="text-gray-600 my-2">
        {dataCustomer.nama_customer} - {dataCustomer.nama_institusi} - email:{" "}
        {dataCustomer.email} - alamat: {dataCustomer.alamat}
      </p>
      <div className="my-5 ring-2 p-5 rounded-xl relative">
        <CekKetersediaanComp
          handleCari={handleCari}
          tempCheckIn={tempCheckIn}
          tempCheckOut={tempCheckOut}
          setTempCheckIn={setTempCheckIn}
          setTempCheckOut={setTempCheckOut}
          setTempJumlahAnak={setTempJumlahAnak}
          setTempJumlahDewasa={setTempJumlahDewasa}
          setTempJumlahKamar={setTempJumlahKamar}
          keterangan="false"
        />
      </div>
      <div className="bg-gray-50 rounded-xl h-max flex flex-col lg:flex-row gap-2 p-1">
        <div className="h-full w-full lg:w-[65%]">
          {/* {JSON.stringify(totalHargaList)} */}
          {/* jumlah kamar yg dipesan: {totalJumlahKamarPesanan} */}
          {ketersediaanKamar?.length != 0 ? (
            ketersediaanKamar?.map((kamar, index) => (
              kamar.jumlah_kamar != 0 && 
              <Card
                className="w-full shadow-md rounded-md mb-2 overflow-hidden"
                key={index}
              >
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
                    <div className="md:w-[35rem]">
                      <div className=" h-60 max-w-full overflow-hidden mt-[2px]">
                        <img
                          src={kamar.jenis_kamars.gambar}
                          alt="kamar"
                          className="h-full w-full duration-[5000ms] hover:scale-150 object-cover"
                        />
                      </div>
                      <div className="flex justify-center text-center">
                        <Button className="mt-2 w-3/4 bg-orange-400 hover:bg-orange-500 text-white tracking-wide rounded-md" onClick={() => navigation(`/kamar/${kamar.id_jenis_kamar}`)}>
                          Lihat Rincian
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 w-full">
                      <p className="text-gray-500 text-sm mb-2 font-medium">
                        {" "}
                        {kamar.jenis_kamar == "Superior" ||
                        kamar.jenis_kamar == "Double Deluxe"
                          ? "Double/Twin"
                          : "King"}{" "}
                        - Merokok/Tidak Merokok -{" "}
                        {kamar.jenis_kamars.ukuran_kamar}m<sup>2</sup>
                      </p>
                      <p className="text-[12px] text-danger mb-3">
                        Tersisa {kamar.jumlah_kamar} kamar
                      </p>
                      <div className="grid grid-cols-2">
                        {kamar?.jenis_kamars?.fasilitas_kamar &&
                          kamar?.jenis_kamars?.fasilitas_kamar
                            ?.split(" - ")
                            .map((item, index) => (
                              <div
                                className="flex items-center gap-2 text-sm"
                                key={index}
                              >
                                <FaAsymmetrik className="text-gray-500" />{" "}
                                {item}
                              </div>
                            ))}
                      </div>
                      <div className="text-end w-full mt-10 h-max flex justify-end">
                        <div className="flex justify-end items-center gap-5 w-max">
                          <div className="py-2 ps-3">
                            {kamar.jenis_season == "Promo" && (
                              <p className="line-through text-gray-500 text-sm">
                                {FormatCurrency(kamar.harga_dasar)}
                              </p>
                            )}
                            <p className="text-success text-2xl font-bold">
                              {FormatCurrency(kamar.harga_saat_ini)}
                            </p>
                          </div>
                          {tampunganPesanan.length != 0 &&
                          tampunganPesanan.findIndex(
                            (tampungan) =>
                              tampungan.jenis_kamar === kamar.jenis_kamar
                          ) != -1 ? (
                            <Button
                              className="uppercase bg-primary h-3/4 rounded-md p-3 flex items-center text-white font-medium w-24 justify-center cursor-pointer hover:bg-blue-700"
                              isDisabled
                            >
                              Pesan
                            </Button>
                          ) : (
                            <Button
                              className="uppercase bg-primary h-3/4 rounded-md p-3 flex items-center text-white font-medium w-24 justify-center cursor-pointer hover:bg-blue-700"
                              onClick={() => {
                                setTampunganPesanan([
                                  ...tampunganPesanan,
                                  kamar,
                                ]);
                              }}
                            >
                              Pesan
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="flex gap-10 text-center mx-auto text-sm text-gray-500">
                    <p className="flex text-center items-center gap-2">
                      <BiWifi /> Wifi Gratis
                    </p>
                    <p className="flex text-center items-center gap-2">
                      <PiTelevisionBold /> Televisi LCD
                    </p>
                    <p className="flex text-center items-center gap-2">
                      <PiBathtubBold /> Bathtub dan Shower terpisah
                    </p>
                    <p className="flex text-center items-center gap-2">
                      <TbAirConditioning /> AC Premium
                    </p>
                    <p className="flex text-center items-center gap-2">
                      <RiSafe2Fill /> Brankas
                    </p>
                  </div>
                </CardFooter>
              </Card>
              
            ))
          ) : (
            <Spinner />
          )}
        </div>
        <div className="h-full w-full lg:w-[35%] sticky top-4">
          <div className="bg-white h-max w-full rounded-lg shadow-lg overflow-hidden">
            <div className="uppercase border-b-1 border-solid border-gray-300 bg-primary text-white">
              <p className="py-5 px-4 font-medium text-xl flex gap-2 items-center">
                <MdLibraryBooks />
                Tarif Pilihan Saat ini
              </p>
            </div>
            <div className="p-3">
              <div className="min-h-[100px]">
                {tampunganPesanan?.length != 0 ? (
                  tampunganPesanan?.map((pesanan) => (
                    <TampunganPesananComp
                      key={pesanan.jenis_kamars.id}
                      pesanan={pesanan}
                      tampunganPesanan={tampunganPesanan}
                      setTampunganPesanan={setTampunganPesanan}
                      jumlahMalam={jumlahMalam}
                      totalHargaList={totalHargaList}
                      setTotalHargaList={setTotalHargaList}
                    />
                  ))
                ) : (
                  <div className="bg-gray-50 flex items-center justify-center text-center h-[100px] rounded-xl">
                    <p className="italic text-sm font-thin text-gray-500">
                      belum ada data pilihan
                    </p>
                  </div>
                )}
              </div>
              {tampunganPesanan.length != 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-end gap-3 text-end m-5">
                    <p className="text-xl">Total : </p>
                    <p className="text-2xl font-bold text-success">
                      {FormatCurrency(totalHargaPesanan)}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      className="rounded-md w-3/4 bg-primary text-white text-md"
                      onClick={(e) => handleLanjutPesan(e)}
                    >
                      Lanjutkan Pemesanan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalKonfYesNo openKonfirm={konfirmLanjutPesan} setOpenKonfirm={setKonfirmLanjutPesan} onClickNo={() => setKonfirmLanjutPesan(false)} onClickYes={(e) => {handleYakinLanjutPesan(e)}} isLoading={loadingKonfirm} pesan="Apakah Yakin ingin memesan kamar ini?"/>
      <ModalKonfYesNo openKonfirm={konfirmFixPesan} setOpenKonfirm={setKonfirmFixPesan} onClickNo={() => setKonfirmFixPesan(false)} onClickYes={(e) => {handleYakinFixPesan(e)}} isLoading={loadingKonfirm} pesan="Tekan 'Ya' jika ingin benar benar memesan."/>
      <Modal
        isOpen={isOpenReqFasilitas}
        onOpenChange={onOpenChangeReqFasilitas}
        scrollBehavior="inside"
        placement="center"
        className="md:max-w-3xl"
      >
        <ModalContent className="p-1 pb-3">
          <ModalHeader className="flex flex-col gap-1">
            Tambahan Fasilitas
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <div className="font-bold">
                Apakah Ingin menambah fasilitas tambahan?
              </div>
              <p className="text-md !p-0 !m-0">Fasilitas tambahan yang dapat dipilih:</p>
              <div className="flex flex-col gap-1 w-full">
                <CheckboxGroup
                  // label="Fasilitas Tambahan"
                  value={fasilitasSelected}
                  onChange={setFasilitasSelected}
                  classNames={{
                    base: "w-full"
                  }}
                >
                  <div className="grid grid-cols-3 gap-3">
                  {dataFasilitas && dataFasilitas?.map((data) => (
                    <Checkbox value={data.id} key={data.id}>{data.nama_layanan}</Checkbox>

                  ))}
                  </div>
                  
                </CheckboxGroup>
                <p className="mt-4">
                  Permintaan Lainnya:
                  <p className="text-xs">Tuliskan permintaan <i>(cth: &apos;Smoking Area&apos;)</i> </p>
                  <Textarea
                    variant="bordered"
                    value={reqLayanan}
                    placeholder="Masukkan permintaan lainnya (opsional)"
                    // disableAnimation
                    disableAutosize
                    classNames={{
                      base: "w-full",
                      input: "text-md",
                    }}
                    onChange={(e) => {setReqLayanan(e.target.value)}}
                  />
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="solid"
              onClick={() => handleLanjutDiFasilitas()}
              className="flex items-center"
            >
              Lanjut <BsArrowRightShort/>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenDetailPesanan}
        onOpenChange={onOpenChangeDetailPesanan}
        scrollBehavior="normal"
        placement="center"
        className="md:max-w-3xl"
      >
        <ModalContent className="p-1 pb-3">
          <ModalHeader className="flex flex-col gap-1">
            Detail Pesanan
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
                <p>
                  Tanggal <i>Check in</i> :{" "}
                  {checkIn &&
                    FormatDate(new Date(checkIn))}
                </p>
                <p>
                  Tanggal <i>Check out</i> :{" "}
                  {checkOut &&
                    FormatDate(new Date(checkOut))}
                </p>
                <p>Jumlah Malam : {jumlahMalam} malam</p>
                <p>Jumlah Dewasa : {jumlahDewasa}</p>
                <p>Jumlah Anak-anak : {jumlahAnak}</p>
                <p>Total Harga Kamar : {totalHargaPesanan && FormatCurrency(totalHargaPesanan)}</p>
                <div className="space-y-4 !mb-5">
                  <p>Pemesanan Kamar :</p>
                  <Table 
                    aria-label="Tabel Permintaan Layanan"
                    removeWrapper
                    color="default"
                    // selectionMode="single"
                    classNames={{
                      th: [
                        "bg-transparent",
                        "text-default-500",
                        "h-0"
                      ],
                    }}
                    >
                    <TableHeader>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                    </TableHeader>
                    <TableBody>
                      {tampunganPesanan && tampunganPesanan.map((tp) => {
                        const harga = totalHargaList.find((item) => item.id == tp.id_jenis_kamar)?.hargaPerMalam;
                        const jumlah = totalHargaList.find((item) => item.id == tp.id_jenis_kamar)?.jumlahPesanan;

                        return (
                          <TableRow key={tp.id_jenis_kamar}>
                            <TableCell><img src={tp.jenis_kamars.gambar} alt={tp.jenis_kamar} className="h-10"/></TableCell>
                            <TableCell>Kamar {tp.jenis_kamar}</TableCell>
                            <TableCell>Kapasitas {tp.jenis_kamars.kapasitas} Dewasa</TableCell>
                            <TableCell>{FormatCurrency(harga)}</TableCell>
                            <TableCell>x{jumlah} kamar</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="space-y-4">
                  <p>Permintaan Layanan :</p>
                  <p className="ms-1 !mt-2 !p-0">{stringFasilitasDiPilih}</p>
                  <p>Permintaan Tambahan :</p>
                  <p className="ms-1 !mt-2 !p-0 capitalize">{reqLayanan}</p>
                </div>
                <div className="flex justify-center text-center items-center gap-2">
                  Total Pembayaran Reservasi : <span className="text-success text-2xl font-bold">{FormatCurrency(totalHargaPesanan)}</span>
                </div>
                <p className="italic text-xs text-end text-gray-400 font-light">*) harga reservasi hanya untuk kamar. Belum termasuk fasilitas tambahan</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              variant="bordered"
              onClick={() => handleKembaliDiDetailPesanan()}
              className="flex items-center"
            >
              Kembali
            </Button>
            <Button
              color="primary"
              variant="solid"
              onClick={() => handlePesanDiDetailPesanan()}
              className="flex items-center"
            >
              Pesan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default AddReservasiGroup;
