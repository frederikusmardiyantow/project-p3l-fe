import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  Spinner,
  Tooltip,
  Image,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ModalFooter,
} from "@nextui-org/react";
import FormatDate from "../../../utils/FormatDate";
import FormatCurrency from "../../../utils/FormatCurrency";
import { GiBeastEye } from "react-icons/gi";
import { MdDownload, MdOutlineSearch } from "react-icons/md";
import { BsArrowLeftShort } from "react-icons/bs";
import FormatDateTime from "../../../utils/FormatDateTime";
import { FaMoneyBillWave } from "react-icons/fa";
import { TbCalendarCancel } from "react-icons/tb";
import ModalKonfYesNo from "../../../components/ModalKonfYesNo";

function RiwayatTrxCustomer() {
  const [dataRiwayatTrx, setDataRiwayatTrx] = useState({});
  const [dataDetailTrx, setDataDetailTrx] = useState({});
  const token = localStorage.getItem("apiKeyAdmin");
  const idPgwYgLogin = localStorage.getItem("idPgw");
  const { idCust } = useParams();
  const [openDetail, setOpenDetail] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [filterData, setFilterData] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  // const navigate = useNavigate();
  const [loadingCetakPDF, setLoadingCetakPDF] = useState(false);
  const [openUploadBukti, setOpenUploadBukti] = useState(false);
  const [inputJumlahUang, setInputJumlahUang] = useState(0);
  const [file, setFile] = useState(null);
  const [loadingKirimBukti, setLoadingKirimBukti] = useState(false);
  const [validasiBukti, setValidasiBukti] = useState([]);
  const [idOtwBayar, setIdOtwBayar] = useState(0);
  const [totalHarga, setTotalHarga] = useState(0);
  const [konfirmPembatalan, setKonfirmPembatalan] = useState(false);
  const [isLoadingKonfirm, setIsLoadingKonfirm] = useState(false);
  const [idOtwBatal, setIdOtwBatal] = useState(0);
  const [pesanPengembalianUang, setPesanPengembalianUang] = useState("");
  const [openCatatan, setOpenCatatan] = useState(false);

  const dataFilter = dataRiwayatTrx?.trx_reservasis?.filter((item) => {
    const idBooking = item?.id_booking.toLowerCase();
    const status = item?.status.toLowerCase();
    const filter = filterData.toLowerCase();

    return idBooking?.includes(filter) || status?.includes(filter);
  });

  const pages = Math.ceil(dataFilter?.length / rowsPerPage);

  const itemRiwayats = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return dataFilter?.slice(start, end);
  }, [page, dataFilter, rowsPerPage]);

  const onClear = useCallback(() => {
    setFilterData("");
    setPage(1);
  }, []);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  async function getDataRiwayatTrxByCustomer() {
    setLoadData(true);
    await axios
      .get(`/transaksi/${idCust}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        setDataRiwayatTrx(data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    setLoadData(false);
  }
  async function getDataDetailTrxById(id) {
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
        setDataDetailTrx(data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  useEffect(() => {
    getDataRiwayatTrxByCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clickBtnDetail(id) {
    getDataDetailTrxById(id);
    setOpenDetail(true);
  }

  async function cetakPdf(id) {
    setLoadingCetakPDF(true);
    await axios
      .get(`/export/pdf/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Mengatur tipe respons menjadi blob
      })
      .then((response) => {
        setLoadingCetakPDF(false);
        // Membuat blob URL dari respons PDF
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Membuka URL di tab atau jendela baru
        window.open(url, "_blank");

        // Hapus blob URL setelah PDF ditutup
        window.URL.revokeObjectURL(url);

        toast.success("PDF berhasil ditampilkan");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  function clickBtnUploadBukti(id, total) {
    setOpenUploadBukti(true);
    setIdOtwBayar(id);
    setTotalHarga(total);
  }
  function clickBtnBatalPesanan(tr) {
    setIdOtwBatal(tr.id);
    if(tr.status == 'Menunggu Pembayaran'){
      setKonfirmPembatalan(true)
    }else{
      setOpenCatatan(true);
    }
    if (new Date(tr?.waktu_check_in) > new Date().setDate(new Date().getDate() + 7)) {
      setPesanPengembalianUang('akan dikembalikan');
    } else {
      setPesanPengembalianUang('tidak dapat dikembalikan');
    }
  }

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const onFileUpload = async () => {
    setLoadingKirimBukti(true);
    try {
      const formData = new FormData();
      formData.append("gambar_bukti", file);
      formData.append("uang_jaminan", inputJumlahUang);

      // Change the API URL according to your needs
      const response = await axios.post(
        `/transaksi/reservasi/upload/${idOtwBayar}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIdOtwBayar(0);
      getDataRiwayatTrxByCustomer();
      setOpenUploadBukti(false);
      toast.success("Upload sukses:", response.data);
    } catch (error) {
      setValidasiBukti(error.response.data.message);
      toast.error("Gagal upload!");
      console.error("Upload gagal:", error);
      console.log(error.response.data);
    } finally {
      setLoadingKirimBukti(false);
    }
  };
  async function handlePembatalan(e) {
    e.preventDefault();
    setIsLoadingKonfirm(true);

    await axios
      .post(`/transaksi/pembatalan/kamar/${idOtwBatal}`, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getDataRiwayatTrxByCustomer();
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    setKonfirmPembatalan(false);
    setIdOtwBatal(0);
    setIsLoadingKonfirm(false);
  }


  return (
    <div>
      <p>
        <Link to="/admin/customer" className="flex gap-1 items-center text-sm">
          <BsArrowLeftShort />
          Kembali
        </Link>
      </p>
      <p className="uppercase text-3xl font-medium text-center mb-5 border-b-2 pb-3 border-gray-400">
        RIWAYAT TRANSAKSI {dataRiwayatTrx?.nama_customer}
      </p>
      <div className="">
        <div className="bg-white rounded-md mb-5 h-max ring-1 p-5">
          <table cellPadding={2}>
            <tbody>
              <tr>
                <td>Nama Customer</td>
                <td>:</td>
                <td>
                  {dataRiwayatTrx?.nama_customer
                    ? dataRiwayatTrx?.nama_customer
                    : "-"}
                </td>
              </tr>
              <tr>
                <td>Nama Institusi</td>
                <td>:</td>
                <td>
                  {dataRiwayatTrx?.nama_institusi
                    ? dataRiwayatTrx?.nama_institusi
                    : "-"}
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>:</td>
                <td>{dataRiwayatTrx?.email ? dataRiwayatTrx?.email : "-"}</td>
              </tr>
              <tr>
                <td>Nomor Telepon</td>
                <td>:</td>
                <td>
                  {dataRiwayatTrx?.no_telp ? dataRiwayatTrx?.no_telp : "-"}
                </td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>{dataRiwayatTrx?.alamat ? dataRiwayatTrx?.alamat : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-4">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1 h-12 border-default-500 bg-white",
            }}
            placeholder="Cari berdasarkan Kode Booking, Status"
            size="sm"
            startContent={
              <MdOutlineSearch className="text-default-500 w-6 h-6 " />
            }
            value={filterData}
            variant="bordered"
            onChange={(e) => {
              setFilterData(e.target.value);
              setPage(1);
            }}
            onClear={() => onClear()}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-default-400 text-small">
            Total {dataRiwayatTrx?.trx_reservasis?.length} riwayat transaksi
            customer
          </p>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
        <div className="my-5">
          <div
            className={`${
              itemRiwayats && itemRiwayats.length !== 0
                ? "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                : "text-center"
            } `}
          >
            {itemRiwayats && itemRiwayats?.length !== 0 ? (
              itemRiwayats?.map((item) => (
                <div key={item?.id}>
                  {item.id_pic == idPgwYgLogin && (
                    <Card className={`max-w-[400px] shadow-md hover:bg-opacity-90 ${item?.status == 'Batal' ? 'bg-danger-100' : item?.status == 'In' ? 'bg-success-100' : item?.status == 'Out' ? 'bg-success-300' : 'bg-gray-100'} `} >
                      <CardHeader className="flex gap-3 items-center">
                        <Image
                          alt="star"
                          height={40}
                          radius="sm"
                          src="https://tse2.mm.bing.net/th?id=OIP.vk1ddOG5ipDZdTrIz1YCDAHaFw&pid=Api&P=0&h=180"
                          width={40}
                        />
                        <div className="flex flex-col">
                          <p className="text-md font-medium text-xl">
                            {item?.id_booking}
                          </p>
                          <p
                            className={`text-small text-white border-1 rounded-md px-2 py-1 w-max ${
                              item?.status === "In"
                                ? "bg-green-600"
                                : item?.status === "Terkonfirmasi"
                                ? "bg-green-400"
                                : item?.status === "Out"
                                ? "bg-red-400"
                                : item?.status === "Batal"
                                ? "bg-red-600"
                                : "bg-secondary"
                            }`}
                          >
                            {item?.status}
                          </p>
                        </div>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <>
                          <p>
                            Waktu Reservasi :{" "}
                            {item?.waktu_reservasi &&
                              FormatDate(new Date(item?.waktu_reservasi))}
                          </p>
                          <p>
                            Nama Front Office :{" "}
                            {item?.fo?.nama_pegawai
                              ? item?.fo?.nama_pegawai
                              : "-"}
                          </p>
                          <p>
                            Waktu Check In :{" "}
                            {item?.waktu_check_in
                              ? FormatDate(new Date(item?.waktu_check_in))
                              : "-"}
                          </p>
                          <p>
                            Waktu Check Out :{" "}
                            {item?.waktu_check_out
                              ? FormatDate(new Date(item?.waktu_check_out))
                              : "-"}
                          </p>
                          <p className="mt-5">
                            Total Harga :{" "}
                            {item?.total_harga &&
                              FormatCurrency(item?.total_harga)}
                          </p>
                          <p>
                            Uang Jaminan :{" "}
                            {item?.uang_jaminan
                              ? FormatCurrency(item?.uang_jaminan)
                              : "-"}
                          </p>
                          <p>
                            Waktu Pembayaran :{" "}
                            {item?.waktu_pembayaran &&
                              FormatDate(new Date(item?.waktu_pembayaran))}
                          </p>
                        </>
                      </CardBody>
                      <Divider />
                      <CardFooter className="flex flex-col gap-2">
                        <Tooltip content="Lihat Detail">
                          <div
                            className="bg-primary hover:opacity-90 w-full h-8 rounded-lg text-white text-center flex items-center justify-center cursor-pointer gap-3"
                            onClick={() => clickBtnDetail(item?.id)}
                          >
                            <GiBeastEye />{" "}
                            <span className="text-xs">
                              Lihat Detail Transaksi
                            </span>
                          </div>
                        </Tooltip>
                        {item?.status == 'Menunggu Pembayaran' && 
                          <Tooltip content="Upload Bukti Bayar">
                            <div
                              className="bg-secondary hover:opacity-90 w-full h-8 rounded-lg text-white text-center flex items-center justify-center cursor-pointer gap-3"
                              onClick={() => {clickBtnUploadBukti(item?.id, item?.total_harga)}}
                            >
                              <FaMoneyBillWave />{" "}
                              <span className="text-xs">
                                Upload Bukti Pembayaran
                              </span>
                            </div>
                          </Tooltip>
                        }
                        {(item?.status != 'Out' && item?.status != 'Batal') &&
                          <div
                            className=" hover:opacity-90 w-max h-8 rounded-lg text-danger text-center flex items-center justify-center cursor-pointer gap-3"
                            onClick={() => clickBtnBatalPesanan(item)}
                          >
                            <TbCalendarCancel />{" "}
                            <span className="text-xs">Batalkan Transaksi</span>
                          </div>
                        }
                      </CardFooter>
                    </Card>
                  )}
                </div>
              ))
            ) : loadData ? (
              <Spinner />
            ) : (
              <div className="h-40 w-full text-gray-400 bg-gray-50 items-center flex justify-center">
                Tidak Ada Data yang ditemukan!
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full justify-center">
          {!loadData && (
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          )}
        </div>
      </div>
      <Modal
        backdrop="opaque"
        scrollBehavior="inside"
        isOpen={openDetail}
        onOpenChange={setOpenDetail}
        placement="center"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          //   base: "border-[#292f46] ",
          header: "bg-primary text-white w-full h-full",
          //   footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        className="md:max-w-3xl overflow-hidden"
        onClose={() => {
          setDataDetailTrx({});
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-between gap-1">
            <p>Detail Transaksi {dataDetailTrx?.id_booking}</p>
            {(dataDetailTrx?.status == "Terkonfirmasi" ||
              dataDetailTrx?.status == "In") && (
              <Button
                variant="bordered"
                className="me-5 flex items-center bg-primary text-white justify-center text-center"
                onClick={() => cetakPdf(dataDetailTrx?.id)}
                isLoading={loadingCetakPDF}
              >
                <MdDownload />
                Cetak Tanda Terima
              </Button>
            )}
          </ModalHeader>
          <ModalBody>
            {dataDetailTrx?.status == null ? (
              <Spinner />
            ) : (
              <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <p>
                    Tanggal Pesan :{" "}
                    {dataDetailTrx?.waktu_reservasi
                      ? FormatDateTime(new Date(dataDetailTrx?.waktu_reservasi))
                      : "-"}
                  </p>
                  {dataDetailTrx?.id_booking && (
                    <p>ID Booking : {dataDetailTrx?.id_booking}</p>
                  )}
                  <p>
                    Status : {dataDetailTrx?.status ? dataDetailTrx?.status : "-"}
                  </p>
                  {dataDetailTrx?.id_fo && (
                    <p>
                      Nama <i>Front Office</i> : {dataDetailTrx?.fo?.nama_pegawai}
                    </p>
                  )}
                  <p>Jumlah Dewasa : {dataDetailTrx?.jumlah_dewasa}</p>
                  <p>Jumlah Anak-anak : {dataDetailTrx?.jumlah_anak_anak}</p>
                  <p>
                    Tanggal <i>Check in</i> :{" "}
                    {dataDetailTrx?.waktu_check_in &&
                      FormatDate(new Date(dataDetailTrx?.waktu_check_in))}
                  </p>
                  <p>
                    Tanggal <i>Check out</i> :{" "}
                    {dataDetailTrx?.waktu_check_out &&
                      FormatDate(new Date(dataDetailTrx?.waktu_check_out))}
                  </p>
                  <p>
                    Total Harga Kamar :{" "}
                    {dataDetailTrx?.total_harga &&
                      FormatCurrency(dataDetailTrx?.total_harga)}
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  {dataDetailTrx?.bukti_pembayaran ? 
                    <img src={`https://project-p3l-be.frederikus.com/storage/posts/${dataDetailTrx?.bukti_pembayaran}`} alt="bukti" /> :
                    <p className="text-sm text-gray-400 italic">Belum Melakukan Pembayaran</p>
                  }
                </div>
              </div>
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
                      {dataDetailTrx?.trx_kamars &&
                        dataDetailTrx?.trx_kamars?.map((tl) => (
                          <TableRow key={tl?.id}>
                            <TableCell>
                              {tl?.jenis_kamars?.jenis_kamar}
                            </TableCell>
                            <TableCell>
                              {tl?.jenis_kamars?.kapasitas} Dewasa
                            </TableCell>
                            <TableCell>
                              {tl?.harga_per_malam &&
                                FormatCurrency(tl?.harga_per_malam)}
                            </TableCell>
                            {/* <TableCell>{tl.jumlah_malam}</TableCell>
                          <TableCell>{(tl.harga_per_malam * tl.jumlah_malam)}</TableCell> */}
                            <TableCell>
                              {tl.kamars !== null
                                ? tl?.kamars?.nomor_kamar
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {tl.kamars !== null ? tl?.kamars?.jenis_bed : "-"}
                            </TableCell>
                            <TableCell>
                              {tl.kamars !== null
                                ? tl?.kamars?.smoking_area === 1
                                  ? "Ya"
                                  : "Tidak"
                                : "-"}
                            </TableCell>
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
                    <TableBody
                      emptyContent={"Tidak ada Data Permintaan Layanan"}
                    >
                      {dataDetailTrx?.trx_layanans &&
                        dataDetailTrx.trx_layanans.map((tl) => (
                          <TableRow key={tl.id}>
                            <TableCell>{tl.layanans.nama_layanan}</TableCell>
                            <TableCell>{tl.jumlah}</TableCell>
                            <TableCell>{tl.layanans.satuan}</TableCell>
                            <TableCell>
                              {tl?.total_harga &&
                                FormatCurrency(tl?.total_harga)}
                            </TableCell>
                            <TableCell>
                              {tl?.waktu_pemakaian &&
                                FormatDateTime(new Date(tl?.waktu_pemakaian))}
                            </TableCell>
                            <TableCell>{tl.layanans.keterangan}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
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
      <Modal
        backdrop="opaque"
        scrollBehavior="inside"
        isOpen={openUploadBukti}
        onOpenChange={setOpenUploadBukti}
        placement="center"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          //   base: "border-[#292f46] ",
          // header: "bg-primary text-white w-full h-full",
          //   footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        className="md:max-w-3xl overflow-hidden"
        onClose={() => {}}
      >
        <ModalContent>
          {/* <ModalHeader className="flex items-center justify-between gap-1">
            <p>Detail Transaksi {dataDetailTrx?.id_booking}</p>
          </ModalHeader> */}
          <ModalBody>
            <p>Upload Bukti Pembayaran Customer Group</p>
            <p className="text-sm">Total harga untuk reservasi ini adalah {FormatCurrency(totalHarga)}. Untuk melanjutkan reservasi, wajib membayar uang muka minimal 50%, yakni minimal {FormatCurrency(totalHarga/2)}</p>
            <div className="text-sm mb-3 border-l-5 border-orange-400 ms-1 ps-2">
              Proses Pembayaran Reservasi dapat dilakukan menggunakan metode transfer bank dengan rincian sebagai berikut:
              <div className="my-2">
                <p className="ml-2">Bank Diamond</p>
                <p className="ml-2">No. Rekening: <span className="font-bold text-red-600 !text-base">770011770022</span></p>
                <p className="ml-2">Atas Nama: <span className="font-bold">Hotel Grand Atma Yogyakarta</span></p>
              </div>
            </div>
            <div>
              <label htmlFor="jmlUang">Masukkan Jumlah Uang Terbayar:</label>
              <Input
                type="number"
                id="jmlUang"
                variant="bordered"
                className="w-1/2 m-0"
                classNames={{ input: ["text-lg"] }}
                onChange={(e) => setInputJumlahUang(e.target.value)}
                isInvalid={parseInt(inputJumlahUang) < parseInt(totalHarga)/2}
                errorMessage={parseInt(inputJumlahUang) < parseInt(totalHarga)/2 && "Uang masih kurang. Setidaknya 50% harus dibayar!"}
              />
              <p className="text-xs mt-1">
                Terbayar :{" "}
                <span className="font-bold text-sm">
                  {FormatCurrency(inputJumlahUang)}
                </span>
              </p>
            </div>
            <div>
              <div className="file-upload-container w-full">
                <p className="text-sm text-red-500 text-center">
                  {validasiBukti?.gambar_bukti && validasiBukti.gambar_bukti}
                </p>
                <label
                  htmlFor="file-upload"
                  className="file-upload-label cursor-pointer"
                >
                  <div className="file-upload-box border-dashed border-2 border-gray-300 rounded w-full h-48 flex items-center justify-center overflow-hidden">
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Selected"
                        className="file-preview w-full h-full object-contain"
                      />
                    ) : (
                      <span className="file-placeholder text-gray-500 text-center">
                        <i>Drag & Drop</i> atau klik untuk unggah bukti
                        pembayaran
                      </span>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onClick={() => setValidasiBukti([])}
                  onChange={onFileChange}
                  className="file-input hidden"
                />
                <div className="flex gap-1 my-3 justify-center text-center">
                  <Button
                    onClick={() => {
                      setFile(null);
                      setValidasiBukti([]);
                    }}
                    variant="light"
                    color="danger"
                    className="upload-button px-4 py-2 rounded-xl"
                  >
                    Reset Gambar
                  </Button>
                  <Button
                    onClick={onFileUpload}
                    variant="solid"
                    color="primary"
                    className="upload-button px-4 py-2 "
                    isLoading={loadingKirimBukti}
                  >
                    Kirim
                  </Button>
                </div>
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
      <ModalKonfYesNo
        openKonfirm={konfirmPembatalan}
        setOpenKonfirm={setKonfirmPembatalan}
        onClickNo={() => {
          setKonfirmPembatalan(false);
          setIdOtwBatal(0);
          setPesanPengembalianUang("");
        }}
        onClickYes={(e) => {
          handlePembatalan(e);
        }}
        isLoading={isLoadingKonfirm}
        pesan={`Yakin nih mau membatalkan reservasi kamar ini?`}
      />
      <Modal
        backdrop="opaque"
        scrollBehavior="inside"
        isOpen={openCatatan}
        onOpenChange={setOpenCatatan}
        placement="center"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          //   base: "border-[#292f46] ",
          // header: "bg-primary text-white w-full h-full",
          //   footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        className="md:max-w-3xl overflow-hidden"
        onClose={() => {}}
      >
        <ModalContent>
          {/* <ModalHeader className="flex items-center justify-between gap-1">
            <p>Detail Transaksi {dataDetailTrx?.id_booking}</p>
          </ModalHeader> */}
          <ModalBody>
            <p className="text-base">
              <div className="animate-ping inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"></div>
              <span className="text-red-600 font-bold">Catatan:</span> 
              <p>Pengembalian uang hanya dapat dilakukan jika pembatalan dilakukan maksimal seminggu sebelum tanggal <i>check-in</i>
              <br /><br />
              Bila melakukan pembatalan untuk transaksi ini, maka uang yang sudah dibayarkan sebagai dp atau jaminan <span className="font-bold">{pesanPengembalianUang}</span></p>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => setOpenCatatan(false)}
            >
              Tidak
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onClick={() => {setOpenCatatan(false); setKonfirmPembatalan(true)}}
            >
              Mengerti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default RiwayatTrxCustomer;
