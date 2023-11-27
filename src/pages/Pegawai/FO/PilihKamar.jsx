import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { LuBedDouble } from "react-icons/lu";
import { TiDelete } from "react-icons/ti";
import {
  FaArrowRightLong,
  FaBanSmoking,
  FaDoorClosed,
  FaDoorOpen,
  FaSmoking,
} from "react-icons/fa6";
import { Button, Checkbox, CheckboxGroup, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Spinner } from "@nextui-org/react";
import { BsCalendarWeekFill, BsLadder, BsPersonVcardFill } from "react-icons/bs";
import { MdMiscellaneousServices, MdOutlineSearch } from "react-icons/md";
import { CustomCheckbox } from "../../../components/CustomCheckBox";
import FormatCurrency from "../../../utils/FormatCurrency";
import FormatDateTime from "../../../utils/FormatDateTime";
import ModalKonfYesNo from "../../../components/ModalKonfYesNo";

  const fixCheckIn = async (request, token, idResv) => {
    let res;
    await axios
      .post(`/reservasi/kamar/check-in/${idResv}`, request, {
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
  };

function PilihKamar() {
  const { idReservasi } = useParams();
  const token = localStorage.getItem("apiKeyAdmin");
  const [dataTrx, setDataTrx] = useState({});
  const [dataKamar, setDataKamar] = useState([]);
  const [filterData, setFilterData] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 18;
  const [loadData, setLoadData] = useState(false);
  const [jenisKamarSelected, setJenisKamarSelected] = useState([]);
  const [tampunganKamar, setTampunganKamar] = useState([]);
  const [konfirmLanjutCheckIn, setKonfirmLanjutCheckIn] = useState(false);
  const [loadingKonfirm, setLoadingKonfirm] = useState(false);
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [isOpenDeposit, onOpenDepositChange] = useState(false);
  const [isSelectedDeposit, setIsSelectedDeposit] = useState(false);
  const [countByJenisKamar, setCountByJenisKamar] = useState({});
  const navigation = useNavigate();

  const dataFilter = dataKamar?.filter((item) => {
    const noKamar = item?.kamar.nomor_kamar.toLowerCase();
    const jenisKamar = item?.kamar.jenis_kamars.jenis_kamar.toLowerCase();
    const filter = filterData.toLowerCase();

    if(jenisKamarSelected.length != 0){
      return noKamar.includes(filter) && jenisKamarSelected.includes(jenisKamar);
    }else{
      return noKamar.includes(filter) || jenisKamar.includes(filter);
    }
  });

  const pages = Math.ceil(dataFilter.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return dataFilter?.slice(start, end);
  }, [page, dataFilter, rowsPerPage]);

  const onClear = useCallback(() => {
    setFilterData("");
    setPage(1);
  }, []);

  async function getDataTransaksiById(id, token) {
    await axios
      .get(`/transaksi/detail/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { data } = response.data;
        setDataTrx(data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }
  async function getDataKamarTersediaAll(token) {
    setLoadData(true);
    await axios
      .get(`/reservasi/kamar/tersedia`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { data } = response.data;
        setDataKamar(data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    setLoadData(false);
  }
  useEffect(() => {
    getDataTransaksiById(idReservasi, token);
    getDataKamarTersediaAll(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (dataTrx && dataTrx.trx_kamars && Array.isArray(dataTrx.trx_kamars)) {
      // Mengambil hanya jenis_kamar dari setiap objek dalam response dataTrx
      const jenisKamars = dataTrx.trx_kamars.map((trxKamar) => trxKamar.jenis_kamars.jenis_kamar);
      // Menghitung berapa kali masing-masing jenis_kamar muncul
      const countByJenisKamar = jenisKamars.reduce((acc, jenisKamar) => {
        acc[jenisKamar] = (acc[jenisKamar] || 0) + 1;
        return acc;
      }, {});
      // Menyimpan hasil perhitungan ke dalam state
      setCountByJenisKamar(countByJenisKamar);
    }
  }, [dataTrx, dataTrx.trx_kamars]);

  const handleDeleteClick = (idToDelete) => {
    // Menggunakan filter() untuk membuat array baru tanpa elemen yang memiliki ID yang sama dengan idToDelete
    const newArrayData = tampunganKamar.filter(item => item.id !== idToDelete);

    // Mengupdate state dengan array baru yang tidak memiliki elemen tersebut
    setTampunganKamar(newArrayData);
  };

  function isKamarSelected(kamarId) {
    return tampunganKamar.some((kamar) => kamar.id === kamarId);
  }

  function handleLanjutCheckIn(e){
    e.preventDefault();
    setLoadingKonfirm(true);
    onOpenDepositChange(true);
    setLoadingKonfirm(false);
  }
  function prepareKamarForAPI(tampunganKamar) {
    return tampunganKamar.map((kamar) => {
      return { "id_kamar": kamar.id };
    });
  }
  async function handleFixCheckIn(e){
    e.preventDefault();
    setLoadingCheckIn(true);
    const kamar = prepareKamarForAPI(tampunganKamar);
    const response = await fixCheckIn(
      {
        kamar : kamar,
        deposit : 300000
      },
      token,
      idReservasi
    )
    setLoadingCheckIn(false);
    if (response.data.status === "T") {
      setTampunganKamar([]);
      getDataKamarTersediaAll();
      navigation('/admin/reservasi');
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
    onOpenDepositChange(false);
    setKonfirmLanjutCheckIn(false);
  }

  return (
    <div>
      <p className="uppercase text-3xl font-bold text-center bg-white p-3 ring-1 rounded-md mb-5">
        Pilih Kamar
      </p>
      <div className="mb-5">
        <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%] mb-2",
              inputWrapper: "border-1 h-12 border-default-500 bg-white",
            }}
            placeholder="Cari berdasarkan Nomor Kamar"
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
          <div className="flex items-center gap-3 w-full">
            <CheckboxGroup
              className="gap-1"
              label=""
              orientation="horizontal"
              value={jenisKamarSelected}
              onChange={setJenisKamarSelected}
            >
              <CustomCheckbox value="superior">Superior</CustomCheckbox>
              <CustomCheckbox value="double deluxe">Double Deluxe</CustomCheckbox>
              <CustomCheckbox value="executive deluxe">Executive Deluxe</CustomCheckbox>
              <CustomCheckbox value="junior suite">Junior Suite</CustomCheckbox>
            </CheckboxGroup>
            <button className="text-sm text-red-600 underline" onClick={() => {setJenisKamarSelected([]); setFilterData("")}}>reset</button>
          </div>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-[70%] flex flex-wrap h-max gap-4 justify-center">
          {items.length != 0 ?
            items.map((kamar) => (
              <div
                className={`${kamar.ketersediaan == 1 ? (isKamarSelected(kamar.kamar.id) ? 'bg-gray-500 hover:!ring-0' : 'bg-green-400') : 'bg-red-500'} w-36 h-36 rounded-md p-2 hover:ring-2 hover:ring-secondary overflow-hidden`} onClick={() => {
                  if (kamar.ketersediaan == 1 && !isKamarSelected(kamar.kamar.id)) {
                    setTampunganKamar([...tampunganKamar, {id : kamar.kamar.id, nomor_kamar : kamar.kamar.nomor_kamar, jenis_kamar : kamar.kamar.jenis_kamars.jenis_kamar}])
                  }
                }}
                key={kamar.kamar.id}
              >
                <p className="text-2xl justify-center flex items-center text-primary">
                  {kamar.ketersediaan == 1 ? <FaDoorOpen /> : <FaDoorClosed />}
                </p>
                <p className="text-2xl text-center font-medium my-1">
                  {kamar.kamar.nomor_kamar}
                </p>
                <p className="text-sm text-center flex items-center gap-1 justify-center">
                  <LuBedDouble />
                  {kamar.kamar.jenis_bed} | <BsLadder />
                  {kamar.kamar.nomor_lantai} |{" "}
                  {kamar.kamar.smoking_area != "0" ? <FaSmoking /> : <FaBanSmoking />}
                </p>
                <Divider className="my-0.5 w-8 bg-gray-200 mx-auto" />
                <p className="text-sm text-center font-bold">
                  {kamar.kamar.jenis_kamars.jenis_kamar}
                </p>
              </div>
            )) : 
            <div className="italic text-sm text-center bg-slate-200 w-full h-52 items-center flex justify-center rounded-xl">~ Tidak ada data tertampil ~</div>}
          {items.length != 0 &&
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
          }
        </div>
        <div className="w-full lg:w-[30%]">
        {tampunganKamar.length != 0 &&
          <div className="bg-white rounded-md shadow-md mb-3 overflow-hidden">
            <p className="uppercase font-medium bg-gray-900 text-white p-3">Kamar dipilih</p>
            <div className="p-3 min-h-[150px] flex flex-col justify-between">
              {tampunganKamar.length != 0 ? tampunganKamar.map((kamar) => (
                <div className="bg-gray-100 p-2 rounded-md grid grid-cols-[50px,135px,1fr] overflow-hidden mb-2" key={kamar.id}>
                  <p className="font-medium">{kamar.nomor_kamar}</p>
                  <Chip size="sm" className="text-xs text-center">{kamar.jenis_kamar}</Chip>
                  <div className="text-end"><button onClick={() => handleDeleteClick(kamar.id)}><TiDelete className="text-danger"/></button></div>
                </div>
              )) : 
              <div className="italic text-sm text-center bg-slate-100 w-full h-24 items-center flex justify-center rounded-xl">~ Tidak ada kamar terpilih ~</div>
              }
              <Button className="w-full rounded-md flex items-center mt-2 " color="primary" onClick={() => setKonfirmLanjutCheckIn(true)}>Lanjutkan <FaArrowRightLong/></Button>
            </div>
          </div>
        }
        <div className="mb-3">
            {dataTrx != null ? (
            <div className="bg-white rounded-md shadow-md p-3 text-[15px]">
              <p className="font-medium text-center">Data Reservasi</p>
              <BsCalendarWeekFill className="w-16 h-max text-center mx-auto p-1"/>
              <p className="text-medium font-bold text-center">{dataTrx.id_booking}</p>
              <Divider className="mb-2"/>
              {dataTrx?.customers?.jenis_customer != 'P' && 
                <p>PIC : <span className="font-medium">{dataTrx?.pic?.nama_pegawai}</span></p>
              }
              <p>Jenis Kamar dipesan : {JSON.stringify(countByJenisKamar)}</p>
              <p>Jumlah Penginap : <span className="font-medium">{dataTrx?.jumlah_dewasa}</span> Dewasa + <span className="font-medium">{dataTrx?.jumlah_anak_anak}</span> Anak</p>
              <p>Waktu Reservasi : <span className="font-medium">{dataTrx?.waktu_reservasi && FormatDateTime(new Date(dataTrx?.waktu_reservasi))}</span></p>
              <p>Waktu Check In : <span className="font-medium">{dataTrx?.waktu_check_in && FormatDateTime(new Date(dataTrx?.waktu_check_in))}</span></p>
              <p>Waktu Check Out : <span className="font-medium">{dataTrx?.waktu_check_out && FormatDateTime(new Date(dataTrx?.waktu_check_out))}</span></p>
              <p>Total Harga Kamar : <span className="font-medium">{FormatCurrency(dataTrx?.total_harga)}</span></p>
            </div>
            ): 
            <Spinner/>}
          </div>
          <div className="mb-3 duration-1000 ease-in-out transform transition-all">
            {dataTrx != null ? (
            <div className="bg-white rounded-md shadow-md p-3 text-[15px] overflow-hidden h-28 hover:h-max">
              <p className="font-medium text-center">Data Customer</p>
              <BsPersonVcardFill className="w-16 h-max text-center mx-auto"/>
              <Divider className="mb-2"/>
              <p>Nama Customer : <span className="font-medium">{dataTrx?.customers?.nama_customer}</span></p>
              <p>Email : <span className="font-medium">{dataTrx?.customers?.email}</span></p>
              <p>Jenis : <span className="font-medium">{dataTrx?.customers?.jenis_customer == 'P' ? 'Personal' : 'Group'}</span></p>
              <p>Identitas : <span className="font-medium">{dataTrx?.customers?.jenis_identitas}</span> / <span className="font-medium">{dataTrx?.customers?.no_identitas}</span></p>
              <p>No. Telp : <span className="font-medium">{dataTrx?.customers?.no_telp}</span></p>
              <p>Alamat : <span className="font-medium">{dataTrx?.customers?.alamat}</span></p>
            </div>
            ): 
            <Spinner/>}
          </div>
          <div>
            {dataTrx != null ? (
            <div className="bg-white rounded-md shadow-md p-3 text-[15px]">
              <p className="font-medium text-center">Data Pemesanan Layanan Tambahan</p>
              <MdMiscellaneousServices className="w-16 h-max text-center mx-auto"/>
              <Divider className="mb-2"/>
              {dataTrx?.trx_layanans?.map((layanan) => (
                <div className="p-2 ring-2 ring-gray-200 rounded-sm grid grid-cols-2 lg:grid-cols-[100px,140px,30px,100px] text-sm font-medium overflow-hidden hover:bg-gray-50" key={layanan.id}>
                  <p>{layanan.layanans.nama_layanan}</p>
                  <p>{FormatCurrency(layanan.layanans.harga)} /{layanan.layanans.satuan}</p>
                  <p>x{layanan.jumlah}</p>
                  <p className="text-end">{FormatCurrency(layanan.total_harga)}</p>
                </div>
              ))}
            </div>
            ): 
            <Spinner/>}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpenDeposit}
        onOpenChange={onOpenDepositChange}
        scrollBehavior="inside"
        placement="center"
        className="md:max-w-3xl"
        onClose={() => {
          
        }}
      >
        <ModalContent className="pb-3 overflow-hidden">
          <ModalHeader className="flex flex-col gap-1 uppercase bg-blue-100 mb-2">
            Pembayaran Deposit
          </ModalHeader>
          <ModalBody>
            <div>
              <p className="text-center mb-4">Silakan centang pernyataan berikut untuk melanjutkan check-in.</p>
              <Checkbox isSelected={isSelectedDeposit} onValueChange={setIsSelectedDeposit}>
                Customer sudah membayar biaya deposit sebesar <b>Rp 300.000,-</b> dan Saya sudah menjelaskan alur adanya biaya deposit ini.
              </Checkbox>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="solid"
              className='rounded-md'
              isDisabled={!isSelectedDeposit && 'true'}
              isLoading={loadingCheckIn}
              onClick={(e) => handleFixCheckIn(e)}
            >
              Lanjut
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ModalKonfYesNo openKonfirm={konfirmLanjutCheckIn} setOpenKonfirm={setKonfirmLanjutCheckIn} onClickNo={() => setKonfirmLanjutCheckIn(false)} onClickYes={(e) => {handleLanjutCheckIn(e)}} isLoading={loadingKonfirm} pesan="Apakah yakin dengan pilihan kamar dan lakukan check-in?"/>
    </div>
  );
}

export default PilihKamar;
