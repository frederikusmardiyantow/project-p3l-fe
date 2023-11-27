import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormatDateTime from "../../../utils/FormatDateTime";
import FormatDate from "../../../utils/FormatDate";
import FormatCurrency from "../../../utils/FormatCurrency";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import ModalKonfYesNo from "../../../components/ModalKonfYesNo";

const checkOut = async (request, token) => {
  let res;
  await axios
    .post(`/reservasi/kamar/check-out`, request, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      res = response.data;
    })
    .catch((error) => {
      res = error.response.data;
    });

  return res;
};

function CheckOut() {
  const [dataDetail, setDataDetail] = useState({});
  const [loadSubmit, setLoadSubmit] = useState(false);
  const [loadCheckOut, setLoadCheckOut] = useState(false);
  const [konfirmCheckOut, setKonfirmCheckOut] = useState(false);
  const token = localStorage.getItem("apiKeyAdmin");
  const navigation = useNavigate();
  const { idReservasi } = useParams();
  const [isOpenInputKekurangan, onOpenChangeInputKekurangan] = useState(false);
  const [inputJumlahUang, setInputJumlahUang] = useState(0);

  async function getDataTrxCheckOut() {
    await axios
      .get(`/transaksi/detail/${idReservasi}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        setDataDetail(data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  useEffect(() => {
    getDataTrxCheckOut();
  }, []);

  async function handleBayarKekurangan(e) {
    e.preventDefault();
    setLoadSubmit(true);
    setKonfirmCheckOut(true);
    setLoadSubmit(false);
  }

  async function handleCheckOut(e){
    e.preventDefault();
    setLoadCheckOut(true);
    const response = await checkOut(
      {
        id_trx_reservasi : idReservasi,
        tgl_lunas : new Date().toLocaleDateString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2'),
        total_harga_kamar : dataDetail.totalHargaKamarAll,
        total_harga_layanan : dataDetail.totalHargaLayananAll,
        pajak_layanan : dataDetail.pajakLayanan,
        total_semua : dataDetail.total_semua,
        temp_lebih_kurang : dataDetail.kurang_atau_kembali < 0 ? 1 : 0,
        total_lebih_kurang : dataDetail.kurang_atau_kembali < 0 ? dataDetail.kurang_atau_kembali * (-1) : dataDetail.kurang_atau_kembali,
        jumlah_bayar : inputJumlahUang
      }, 
    token);
    setLoadCheckOut(false);
    if(response.status == 'T'){
      toast.success(response.message);
      navigation(`/admin/reservasi`);
    }else{
      console.log(response);
      toast.error(response.message);
    }
  }

  return (
    <div>
      <div className="flex justify-center">
        <p className="text-4xl font-bold pb-4 md:w-3/4 !mb-7 border-b-1 border-gray-400 uppercase text-center">
          TRANSAKSI RESERVASI {dataDetail.id_booking}
        </p>
      </div>
      <div className="space-y-2">
        <p>
          Tanggal Pesan :{" "}
          {dataDetail?.waktu_reservasi &&
            FormatDateTime(new Date(dataDetail?.waktu_reservasi))}
        </p>
        {dataDetail.id_booking && <p>ID Booking : {dataDetail?.id_booking}</p>}
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
        <p>
          Total Harga Kamar :{" "}
          {dataDetail?.total_harga && FormatCurrency(dataDetail?.total_harga)}
        </p>
        <div className="space-y-4 !mb-5">
          <p>Pemesanan Kamar :</p>
          <Table aria-label="Tabel Permintaan Layanan">
            <TableHeader>
              <TableColumn>JENIS KAMAR</TableColumn>
              <TableColumn>JUMLAH KAMAR</TableColumn>
              <TableColumn>HARGA PER MALAM</TableColumn>
              {/* <TableColumn>JUMLAH MALAM</TableColumn>
                    <TableColumn>TOTAL HARGA</TableColumn> */}
              <TableColumn>JUMLAH MALAM</TableColumn>
              <TableColumn>SUB TOTAL</TableColumn>
            </TableHeader>
            <TableBody>
              {dataDetail["trxKamarPesananPerJenis"] &&
                Object.keys(dataDetail["trxKamarPesananPerJenis"]).map((tl) => {
                  const transaksi = dataDetail["trxKamarPesananPerJenis"][tl];

                  return (
                    <TableRow key={tl}>
                      <TableCell>{transaksi.jenis_kamar}</TableCell>
                      <TableCell>{transaksi.jumlah}</TableCell>
                      <TableCell>
                        {transaksi.harga_per_malam &&
                          FormatCurrency(transaksi.harga_per_malam)}
                      </TableCell>
                      <TableCell>{dataDetail.jumlah_malam}</TableCell>
                      <TableCell>
                        {transaksi.harga_per_malam &&
                          FormatCurrency(transaksi.total_per_jenis)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="font-bold ">
                  {dataDetail.totalHargaKamarAll &&
                    FormatCurrency(dataDetail.totalHargaKamarAll)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="space-y-4">
          <p>Permintaan Layanan :</p>
          <Table aria-label="Tabel Permintaan Layanan">
            <TableHeader>
              <TableColumn>NAMA LAYANAN</TableColumn>
              <TableColumn>TANGGAL</TableColumn>
              <TableColumn>JUMLAH</TableColumn>
              <TableColumn>HARGA</TableColumn>
              <TableColumn>SUB TOTAL</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Tidak ada Data Permintaan Layanan"}>
              {dataDetail["trxLayananPesan"] &&
                Object.keys(dataDetail["trxLayananPesan"]).map((tl) => {
                  const transaksiDetail = dataDetail["trxLayananPesan"][tl];

                  return (
                    <TableRow key={tl}>
                      <TableCell>{transaksiDetail.nama_layanan}</TableCell>
                      <TableCell>
                        {transaksiDetail.tgl_pemakaian &&
                          new Date(transaksiDetail.tgl_pemakaian).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                        }
                      </TableCell>
                      <TableCell>{transaksiDetail.jumlah}</TableCell>
                      <TableCell>
                        {transaksiDetail.harga_per_satuan &&
                          FormatCurrency(transaksiDetail.harga_per_satuan)}
                      </TableCell>
                      <TableCell>
                        {transaksiDetail.total_per_layanan &&
                          FormatCurrency(transaksiDetail.total_per_layanan)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="font-bold ">
                  {dataDetail.totalHargaLayananAll &&
                    FormatCurrency(dataDetail.totalHargaLayananAll)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="pe-10 pt-3">
          <table className="w-full">
            <thead>
              <tr className="text-center">
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-end">
                <td colSpan="3" className="w-52"></td>
                <td>Pajak</td>
                <td>{FormatCurrency(dataDetail.pajakLayanan)}</td>
              </tr>
              <tr className="text-end">
                <td colSpan="3"></td>
                <td className="font-bold">TOTAL</td>
                <td className="font-bold">
                  {FormatCurrency(dataDetail.total_semua)}
                </td>
              </tr>
              <tr className="text-end">
                <td colSpan="5"></td>
              </tr>
              <tr className="text-end">
                <td colSpan="3"></td>
                <td>Jaminan</td>
                <td>{FormatCurrency(dataDetail.uang_jaminan)}</td>
              </tr>
              <tr className="text-end">
                <td colSpan="3"></td>
                <td>Deposit</td>
                <td>{FormatCurrency(dataDetail.deposit)}</td>
              </tr>
              {dataDetail.kurang_atau_kembali < 0 ? (
                <tr className="text-end">
                  <td colSpan="3"></td>
                  <td className="font-bold">Uang Kembali</td>
                  <td className="font-bold">
                    {FormatCurrency(dataDetail.kurang_atau_kembali * -1)}
                  </td>
                </tr>
              ) : (
                <tr className="text-end">
                  <td colSpan="3"></td>
                  <td className="font-bold">Kekurangan</td>
                  <td className="font-bold">
                    {FormatCurrency(dataDetail.kurang_atau_kembali)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-5">
        {dataDetail.kurang_atau_kembali < 0 ?
          <Button fullWidth className="bg-red-600 text-medium text-white hover:bg-red-500 uppercase">Lakukan Check Out</Button>
        :
          <Button fullWidth className="bg-green-600 text-medium text-white hover:bg-green-500 uppercase" onClick={() => {onOpenChangeInputKekurangan(true)}}>Input Pembayaran Kekurangan</Button>
        }
      </div>

      <Modal
        isOpen={isOpenInputKekurangan}
        onOpenChange={onOpenChangeInputKekurangan}
        scrollBehavior="inside"
        placement="center"
        className="md:max-w-3xl rounded-md"
        onClose={() => {
          // setFasilitasSelected({});
        }}
      >
        <ModalContent className="pb-3 overflow-hidden">
          <ModalHeader className="flex flex-col gap-1 uppercase bg-primary text-white">
            Input Uang Kekurangan
          </ModalHeader>
          <ModalBody>
          <div>
            <p className="text-[15px] mb-3">Kekurangan pembayaran : <b>{FormatCurrency(dataDetail?.kurang_atau_kembali)}</b></p>
            <form onSubmit={(e) => {handleBayarKekurangan(e)}}>
              <label htmlFor="jmlUang">Masukkan Jumlah Uang Terbayar:</label>
                <Input
                  type="number"
                  id="jmlUang"
                  variant="bordered"
                  className="w-1/2 m-0"
                  classNames={{ input: ["text-lg"] }}
                  onChange={(e) => setInputJumlahUang(e.target.value)}
                  isInvalid={parseInt(inputJumlahUang) != parseInt(dataDetail.kurang_atau_kembali)}
                  errorMessage={parseInt(inputJumlahUang) < parseInt(dataDetail.kurang_atau_kembali) ? "Uang masih kurang!" : parseInt(inputJumlahUang) > parseInt(dataDetail.kurang_atau_kembali) ? "Uang kelebihan!" : ""}
                />
                <p className="text-xs mt-1 mb-3">
                  Terbayar :{" "}
                  <span className="font-bold text-sm">
                    {FormatCurrency(inputJumlahUang)}
                  </span>
                </p>

                <Button
                  type="submit"
                  isLoading={loadSubmit}
                  className="bg-primary hover:bg-opacity-90 text-white"
                  fullWidth
                  isDisabled={parseInt(inputJumlahUang) != parseInt(dataDetail.kurang_atau_kembali)}
                >
                  Konfirmasi
                </Button>
            </form>
          </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalKonfYesNo openKonfirm={konfirmCheckOut} setOpenKonfirm={setKonfirmCheckOut} onClickNo={() => setKonfirmCheckOut(false)} onClickYes={(e) => {handleCheckOut(e)}} isLoading={loadCheckOut} pesan="Apakah yakin ingin melakukan check out untuk reservasi ini?"/>
    </div>
  );
}

export default CheckOut;
