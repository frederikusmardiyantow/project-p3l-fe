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
} from "@nextui-org/react";
import FormatDate from "../../../utils/FormatDate";
import FormatCurrency from "../../../utils/FormatCurrency";
import { GiBeastEye } from "react-icons/gi";
import { MdOutlineSearch } from "react-icons/md";
import { BsArrowLeftShort } from "react-icons/bs";
import FormatDateTime from "../../../utils/FormatDateTime";

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
        <div className="bg-white rounded-md mb-5 h-max ring-1">
          <table cellPadding="20">
            <td>
              <tr>Nama Customer</tr>
              <tr>Nama Institusi</tr>
              <tr>Email</tr>
              <tr>Nomor Telepon</tr>
              <tr>Alamat</tr>
            </td>
            <td>
              <tr>:</tr>
              <tr>:</tr>
              <tr>:</tr>
              <tr>:</tr>
              <tr>:</tr>
            </td>
            <td>
              <tr>
                {dataRiwayatTrx?.nama_customer
                  ? dataRiwayatTrx?.nama_customer
                  : "-"}
              </tr>
              <tr>
                {dataRiwayatTrx?.nama_institusi
                  ? dataRiwayatTrx?.nama_institusi
                  : "-"}
              </tr>
              <tr>{dataRiwayatTrx?.email ? dataRiwayatTrx?.email : "-"}</tr>
              <tr>{dataRiwayatTrx?.no_telp ? dataRiwayatTrx?.no_telp : "-"}</tr>
              <tr>{dataRiwayatTrx?.alamat ? dataRiwayatTrx?.alamat : "-"}</tr>
            </td>
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
                <>
                  {item.id_pic == idPgwYgLogin && (
                    <Card
                      className="max-w-[400px] shadow-md hover:bg-gray-50"
                      key={item?.id}
                    >
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
                                ? "bg-green-400"
                                : item?.status === "Out"
                                ? "bg-red-400"
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
                            {item?.fo.nama_pegawai
                              ? item?.fo.nama_pegawai
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
                      <CardFooter>
                        <Tooltip content="Lihat Detail">
                          <div
                            className="bg-primary hover:opacity-90 w-full h-8 rounded-lg text-white text-center flex items-center justify-center cursor-pointer"
                            onClick={() => clickBtnDetail(item?.id)}
                          >
                            <GiBeastEye />
                          </div>
                        </Tooltip>
                      </CardFooter>
                    </Card>
                  )}
                </>
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
          <ModalHeader className="flex flex-col gap-1">
            Detail Transaksi {dataDetailTrx?.id_booking}
          </ModalHeader>
          <ModalBody>
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
                          <TableCell>{tl?.jenis_kamars?.jenis_kamar}</TableCell>
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
                            {tl.kamars !== null ? tl?.kamars?.nomor_kamar : "-"}
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
                  <TableBody emptyContent={"Tidak ada Data Permintaan Layanan"}>
                    {dataDetailTrx?.trx_layanans &&
                      dataDetailTrx.trx_layanans.map((tl) => (
                        <TableRow key={tl.id}>
                          <TableCell>{tl.layanans.nama_layanan}</TableCell>
                          <TableCell>{tl.jumlah}</TableCell>
                          <TableCell>{tl.layanans.satuan}</TableCell>
                          <TableCell>
                            {tl?.total_harga && FormatCurrency(tl?.total_harga)}
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
    </div>
  );
}

export default RiwayatTrxCustomer;
