import { BiLayerPlus } from "react-icons/bi";
import Footer from "../../components/FooterComp";
import NavbarComp from "../../components/NavbarComp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { PiCubeTransparentFill } from "react-icons/pi";
import FormatDateTime from "../../utils/FormatDateTime";
import FormatCurrency from "../../utils/FormatCurrency";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody
} from "@nextui-org/react";
import FormatDate from "../../utils/FormatDate";

function RiwayatReservasi() {
  const [data, setData] = useState({});
  const token = localStorage.getItem("apiKey");
  const navigation = useNavigate();
  const [isOpen, onOpenChange] = useState(false);
  const [dataDetail, setDataDetail] = useState({});

  async function detailPemesanan(id) {
    await axios
      .get(`/transaksi/detail/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        console.log(data);
        setDataDetail(data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`/transaksi`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // res = response;
          const { data } = response.data;
          setData(data);
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
    fetchData();
  }, [navigation, token]);

  async function handleClickDetail(id) {
    onOpenChange(true);
    await detailPemesanan(id);
  }

  return (
    <>
      <div className="relative">
        <NavbarComp kelas="fixed" setBg="true" />
        <div className="h-[400px] md:h-[300px] bg-[url('http://127.0.0.1:5173/bg-profil.jpg')] bg-cover bg-no-repeat bg-fixed">
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-4xl md:text-6xl font-bold text-center uppercase tracking-wider text-white">
              Riwayat Pemesanan Kamar
            </p>
          </div>
        </div>
        <div className="relative h-max">
          <div className="absolute h-28 min-h-max bg-primary text-white w-3/4 -top-12 inset-x-0 flex mx-auto rounded-lg drop-shadow-md italic text-center items-center px-16">
            Kami ingin Anda tahu bahwa Anda adalah bagian penting dari keluarga
            kami di Grand Atma Hotel. Anda membantu menciptakan atmosfer yang
            hangat dan ramah, dan kami berharap Anda akan kembali dalam waktu
            dekat. Tunggu kejutan spesial kami ya!
          </div>
        </div>
        <div className="h-max ring-2 ring-primary my-10 w-[95%] flex flex-col gap-5 mx-auto rounded-md px-5 py-10 md:p-10">
          {data?.trx_reservasis && data?.trx_reservasis.length !== 0 ? (
            <div className=" h-max w-full">
              <Accordion
                variant="splitted"
                defaultExpandedKeys={["1"]}
                selectionMode="multiple"
              >
                <AccordionItem
                  key="1"
                  aria-label="SELESAI"
                  title="SELESAI"
                  className=""
                >
                  {data.trx_reservasis.map(
                    (tr) =>
                      (tr.status === "Lunas" || tr.status === "Out") && (
                        <div
                          className="h-30 ring-1 ring-slate-500 text-gray-700 bg-blue-100 hover:bg-blue-50 rounded-md p-4 m-1 mb-4"
                          onClick={() => {
                            handleClickDetail(tr.id);
                          }}
                          key={tr.id}
                        >
                          <div className="uppercase font-medium text-lg border-b-2 border-solid border-gray-600 pb-3 flex justify-between">
                            <p className="flex items-center gap-1">
                              <PiCubeTransparentFill /> Transaksi #
                              {tr.id_booking}
                            </p>
                            <p
                              className={`${
                                tr.status === "Lunas"
                                  ? "bg-green-500"
                                  : "bg-green-700"
                              } text-white rounded-full w-max px-4 py-1 text-sm`}
                            >
                              {tr.status}
                            </p>
                          </div>
                          <div className="pt-3 px-1 space-y-1 flex flex-col md:flex-row gap-2">
                            <div className="w-full md:w-1/2 ">
                              <p>
                                Waktu Pemesanan :{" "}
                                {tr?.waktu_reservasi &&
                                  FormatDateTime(new Date(tr?.waktu_reservasi))}
                              </p>
                              <div>
                                Waktu Menginap :
                                <div className="flex gap-5 ms-3 mt-2">
                                  <div className=" rounded-sm flex flex-col text-center ring-1 ring-slate-600 font-medium ">
                                    <span className="border-b-1 border-solid border-slate-600">
                                      {tr?.waktu_check_in &&
                                        new Date(
                                          tr?.waktu_check_in
                                        ).getFullYear()}
                                    </span>
                                    <span className="px-5 h-10 flex items-center">
                                      {tr?.waktu_check_in &&
                                        new Date(
                                          tr?.waktu_check_in
                                        ).getDay()}{" "}
                                      {tr?.waktu_check_in &&
                                        new Date(
                                          tr?.waktu_check_in
                                        ).toLocaleString("id-ID", {
                                          month: "long",
                                        })}
                                    </span>
                                  </div>
                                  <div className="items-center flex italic">
                                    s.d
                                  </div>
                                  <div className=" rounded-sm flex flex-col text-center ring-1 ring-slate-600 font-medium ">
                                    <span className="border-b-1 border-solid border-slate-600">
                                      {tr?.waktu_check_out &&
                                        new Date(
                                          tr?.waktu_check_out
                                        ).getFullYear()}
                                    </span>
                                    <span className="px-5 h-10 flex items-center">
                                      {tr?.waktu_check_out &&
                                        new Date(
                                          tr?.waktu_check_out
                                        ).getDay()}{" "}
                                      {tr?.waktu_check_out &&
                                        new Date(
                                          tr?.waktu_check_out
                                        ).toLocaleString("id-ID", {
                                          month: "long",
                                        })}
                                    </span>
                                  </div>
                                </div>
                                {/* {console.log(tr.waktu_pembayaran)} */}
                                <p className="mt-5 italic text-primary">
                                  Waktu Pembayaran :{" "}
                                  {tr?.waktu_pembayaran &&
                                    FormatDateTime(
                                      new Date(tr?.waktu_pembayaran)
                                    )}
                                </p>
                              </div>
                            </div>
                            <div className="w-full md:w-1/2 md:text-end !mt-5 flex flex-col md:justify-end space-y-1">
                              <p className="text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                                Total Harga Pesanan
                              </p>
                              <p className="text-xl font-bold">
                                {FormatCurrency(tr.total_harga)}
                              </p>
                              <p className="text-[10px] italic">
                                <span className="text-red-500">*</span>) Harga
                                untuk pesan kamar, belum termasuk biaya layanan
                                fasilitas berbayar
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="MENUNGGU PEMBAYARAN"
                  title="MENUNGGU PEMBAYARAN"
                >
                  {data.trx_reservasis.map(
                    (tr) =>
                      tr.status === "Menunggu Pembayaran" && (
                        <div
                          className="h-30 ring-1 ring-slate-500 text-gray-700 bg-blue-100 hover:bg-blue-50 rounded-md p-4 m-1 mb-4"
                          key={tr.id} onClick={() => {
                            handleClickDetail(tr.id);
                          }}
                        >
                          <div className="uppercase font-medium text-lg border-b-2 border-solid border-gray-600 pb-3 flex justify-between">
                            <p className="flex items-center gap-1">
                              <PiCubeTransparentFill /> Transaksi #{tr.id}
                            </p>
                            <p className="bg-secondary text-white rounded-full w-max px-4 py-1 text-sm text-center max-w-[130px]">
                              {tr.status}
                            </p>
                          </div>
                          <div className="pt-3 px-1 space-y-1 flex flex-col md:flex-row gap-2">
                            <div className="w-full md:w-1/2 ">
                              <p>
                                Waktu Pemesanan :{" "}
                                {tr?.waktu_reservasi &&
                                  FormatDateTime(new Date(tr?.waktu_reservasi))}
                              </p>
                              <div>
                                Waktu Menginap :
                                <div className="flex gap-5 ms-3 mt-2">
                                  <div className=" rounded-sm flex flex-col text-center ring-1 ring-slate-600 font-medium ">
                                    <span className="border-b-1 border-solid border-slate-600">
                                      {tr?.waktu_check_in &&
                                        new Date(
                                          tr?.waktu_check_in
                                        ).getFullYear()}
                                    </span>
                                    <span className="px-5 h-10 flex items-center">
                                      {tr?.waktu_check_in &&
                                        new Date(
                                          tr?.waktu_check_in
                                        ).getDay()}{" "}
                                      {tr?.waktu_check_in &&
                                        new Date(
                                          tr?.waktu_check_in
                                        ).toLocaleString("id-ID", {
                                          month: "long",
                                        })}
                                    </span>
                                  </div>
                                  <div className="items-center flex italic">
                                    s.d
                                  </div>
                                  <div className=" rounded-sm flex flex-col text-center ring-1 ring-slate-600 font-medium ">
                                    <span className="border-b-1 border-solid border-slate-600">
                                      {tr?.waktu_check_out &&
                                        new Date(
                                          tr?.waktu_check_out
                                        ).getFullYear()}
                                    </span>
                                    <span className="px-5 h-10 flex items-center">
                                      {tr?.waktu_check_out &&
                                        new Date(
                                          tr?.waktu_check_out
                                        ).getDay()}{" "}
                                      {tr?.waktu_check_out &&
                                        new Date(
                                          tr?.waktu_check_out
                                        ).toLocaleString("id-ID", {
                                          month: "long",
                                        })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="w-full md:w-1/2 md:text-end !mt-5 flex flex-col md:justify-end space-y-1">
                              <p className="text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                                Total Harga Pesanan
                              </p>
                              <p className="text-xl font-bold">
                                {FormatCurrency(tr.total_harga)}
                              </p>
                              <p className="text-[10px] italic">
                                <span className="text-red-500">*</span>) Harga
                                untuk pesan kamar, belum termasuk biaya layanan
                                fasilitas berbayar
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </AccordionItem>
                <AccordionItem key="3" aria-label="BATAL" title="BATAL">
                  {data.trx_reservasis.map(
                    (tr) =>
                      tr.status === "Batal" && (
                        <div
                          className="h-30 ring-1 ring-slate-500 text-gray-700 bg-blue-100 hover:bg-blue-50 rounded-md p-4 m-1 mb-4"
                          key={tr.id}
                        >
                          <div className="uppercase font-medium text-lg border-b-2 border-solid border-gray-600 pb-3 flex justify-between">
                            <p className="flex items-center gap-1">
                              <PiCubeTransparentFill /> Transaksi #{tr.id}
                            </p>
                            <p className="bg-danger rounded-full w-max px-4 py-1 text-sm">
                              {tr.status}
                            </p>
                          </div>
                          <div className="pt-3 px-1 space-y-1 flex flex-col md:flex-row gap-2">
                            <div className="w-full md:w-1/2 ">
                              <p>
                                Waktu Pemesanan :{" "}
                                {tr?.waktu_reservasi &&
                                  FormatDateTime(new Date(tr?.waktu_reservasi))}
                              </p>
                              <div>
                                Waktu Menginap :
                                <div className="flex gap-5 ms-3 mt-2">
                                  <div className=" rounded-sm flex flex-col text-center ring-1 ring-slate-600 font-medium ">
                                    <span className="border-b-1 border-solid border-slate-600">
                                      {tr?.waktu_check_in &&
                                        new Date(
                                          tr?.waktu_check_in
                                        ).getFullYear()}
                                    </span>
                                    <span className="px-5 h-10 flex items-center">
                                      {tr?.waktu_check_in &&
                                        new Date(
                                          tr?.waktu_check_in
                                        ).getDay()}{" "}
                                      {tr?.waktu_check_in &&
                                        new Date(
                                          tr?.waktu_check_in
                                        ).toLocaleString("id-ID", {
                                          month: "long",
                                        })}
                                    </span>
                                  </div>
                                  <div className="items-center flex italic">
                                    s.d
                                  </div>
                                  <div className=" rounded-sm flex flex-col text-center ring-1 ring-slate-600 font-medium ">
                                    <span className="border-b-1 border-solid border-slate-600">
                                      {tr?.waktu_check_out &&
                                        new Date(
                                          tr?.waktu_check_out
                                        ).getFullYear()}
                                    </span>
                                    <span className="px-5 h-10 flex items-center">
                                      {tr?.waktu_check_out &&
                                        new Date(
                                          tr?.waktu_check_out
                                        ).getDay()}{" "}
                                      {tr?.waktu_check_out &&
                                        new Date(
                                          tr?.waktu_check_out
                                        ).toLocaleString("id-ID", {
                                          month: "long",
                                        })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="w-full md:w-1/2 md:text-end !mt-5 flex flex-col md:justify-end space-y-1">
                              <p className="text-sm after:content-['*'] after:ml-0.5 after:text-red-500">
                                Total Harga Pesanan
                              </p>
                              <p className="text-xl font-bold">
                                {FormatCurrency(tr.total_harga)}
                              </p>
                              <p className="text-[10px] italic">
                                <span className="text-red-500">*</span>) Harga
                                untuk pesan kamar, belum termasuk biaya layanan
                                fasilitas berbayar
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="bg-slate-100 w-full h-128 rounded-sm p-5 text-gray-500 text-center justify-center flex flex-col italic">
              <div className="text-center flex justify-center">
                <BiLayerPlus className="h-20 w-20" />
              </div>
              - Belum ada riwayat pemesanan kamar -
              <br />
              Tingkatkan transaksi Anda untuk mendapatkan penawaran menarik dari
              kami.
              <br />
              <span className="mt-5 bg-white rounded-md">
                ~Grand Atma Hotel D.I Yogyakarta~
              </span>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="center"
        className="md:max-w-3xl"
      >
        <ModalContent className="p-1 pb-3">
          <ModalHeader className="flex flex-col gap-1">
            Detail Transaksi Pemesanan
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <p>
                Tanggal Pesan :{" "}
                {dataDetail?.waktu_reservasi &&
                  FormatDateTime(new Date(dataDetail?.waktu_reservasi))}
              </p>
              {dataDetail.id_booking && <p>ID Booking : {dataDetail?.id_booking}</p>}
              <p>Status : {dataDetail.status}</p>
              {dataDetail.id_fo && (
                <p>
                  Nama <i>Front Office</i> : {dataDetail.fo.nama_pegawai}
                </p>
              )}
              <p>Jumlah Dewasa : {dataDetail.jumlah_dewasa}</p>
              <p>Jumlah Anak-anak : {dataDetail.jumlah_anak_anak}</p>
              <p>
                Tanggal <i>Check in</i> :{" "}
                {dataDetail?.waktu_check_in &&
                  FormatDate(new Date(dataDetail?.waktu_check_in))}
              </p>
              <p>
                Tanggal <i>Check out</i> :{" "}
                {dataDetail?.waktu_check_out &&
                  FormatDate(new Date(dataDetail?.waktu_check_out))}
              </p>
              <p>Total Harga Kamar : {dataDetail?.total_harga && FormatCurrency(dataDetail?.total_harga)}</p>
              <div className="space-y-4 !mb-5">
                <p>Pemesanan Kamar :</p>
                <Table aria-label="Tabel Permintaan Layanan">
                  <TableHeader>
                    <TableColumn>JENIS KAMAR</TableColumn>
                    <TableColumn>KAPASITAS</TableColumn>
                    <TableColumn>HARGA PER MALAM</TableColumn>
                    {/* <TableColumn>JUMLAH MALAM</TableColumn>
                    <TableColumn>TOTAL HARGA</TableColumn> */}
                    <TableColumn>NOMOR KAMAR</TableColumn>
                    <TableColumn>JENIS BED</TableColumn>
                    <TableColumn>AREA MEROKOK</TableColumn>
                    
                  </TableHeader>
                  <TableBody>
                    {dataDetail?.trx_kamars &&
                      dataDetail.trx_kamars.map((tl) => (
                        <TableRow key={tl.id}>
                          <TableCell>{tl.jenis_kamars.jenis_kamar}</TableCell>
                          <TableCell>{tl.jenis_kamars.kapasitas} Dewasa</TableCell>
                          <TableCell>{tl?.harga_per_malam && FormatCurrency(tl?.harga_per_malam)}</TableCell>
                          {/* <TableCell>{tl.jumlah_malam}</TableCell>
                          <TableCell>{(tl.harga_per_malam * tl.jumlah_malam)}</TableCell> */}
                          <TableCell>{tl.kamars !== null ? tl?.kamars.nomor_kamar : '-'}</TableCell>
                          <TableCell>{tl.kamars !== null ? tl?.kamars.jenis_bed : '-'}</TableCell>
                          <TableCell>{tl.kamars !== null ? tl?.kamars.smoking_area : '-'}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="space-y-4">
                <p>Permintaan Layanan :</p>
                <Table aria-label="Tabel Permintaan Layanan">
                  <TableHeader>
                    <TableColumn>NAMA LAYANAN</TableColumn>
                    <TableColumn>JUMLAH</TableColumn>
                    <TableColumn>SATUAN</TableColumn>
                    <TableColumn>TOTAL HARGA</TableColumn>
                    <TableColumn>WAKTU PEMAKAIAN</TableColumn>
                    <TableColumn>KETERANGAN</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"Tidak ada Data Permintaan Layanan"}>
                    {dataDetail?.trx_layanans &&
                      dataDetail.trx_layanans.map((tl) => (
                        <TableRow key={tl.id}>
                          <TableCell>{tl.layanans.nama_layanan}</TableCell>
                          <TableCell>{tl.jumlah}</TableCell>
                          <TableCell>{tl.layanans.satuan}</TableCell>
                          <TableCell>{tl?.total_harga && FormatCurrency(tl?.total_harga)}</TableCell>
                          <TableCell>{tl?.waktu_pemakaian && FormatDateTime(new Date(tl?.waktu_pemakaian))}</TableCell>
                          <TableCell>{tl.layanans.keterangan}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ModalBody>
          {/* <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => onOpenChange(false)}
            >
              Tutup
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}

export default RiwayatReservasi;
