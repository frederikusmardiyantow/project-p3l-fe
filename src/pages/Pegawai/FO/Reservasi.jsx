import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormatCurrency from "../../../utils/FormatCurrency";
import ModalKonfYesNo from "../../../components/ModalKonfYesNo";
import FormatDate from "../../../utils/FormatDate";
import { FaPlus } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

const columns = [
    { name: "ID BOOKING", uid: "id_booking", width: "125px" },
    { name: "NAMA CUSTOMER", uid: "nama_customer", width: "110px" },
    { name: "REQ LAYANAN", uid: "request_layanan", width: "130px" },
    { name: "CHECK IN", uid: "check_in", width: "150px" },
    { name: "CHECK OUT", uid: "check_out", width: "150px" },
    { name: "TOTAL HARGA", uid: "total_harga", width: "150px" },
    { name: "STATUS", uid: "status", width: "140px" },
    { name: "AKSI", uid: "aksi", width: "50px" },
  ];

  async function cekWaktuCheckIn(id, token) {
    let res;
    await axios
      .get(`/reservasi/kamar/check-in/${id}/cek-waktu`, {
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
        res = response.data;
      })
      .catch((error) => {
        res = error.response.data;
      });
  
    return res;
  }

function Reservasi() {
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [loadData, setLoadData] = useState(false);
  const [loadNotaLunas, setLoadNotaLunas] = useState(false);
  const token = localStorage.getItem("apiKeyAdmin");
  const navigation = useNavigate();
  const [tempId, setTempId] = useState("");
  const [isOpenTambahFasilitas, onOpenChangeTambahFasilitas] = useState(false);
  const [filterData, setFilterData] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [konfirmCheckIn, setKonfirmCheckIn] = useState(false);
  const [konfirmCheckOut, setKonfirmCheckOut] = useState(false);
  const [konfirmTambahFasilitas, setKonfirmTambahFasilitas] = useState(false);
  const [loadingKonfirm, setLoadingKonfirm] = useState(false);
  const [fasilitasSelected, setFasilitasSelected] = useState({});
  const [dataFasilitas, setDataFasilitas] = useState([]);

  const dataFilter = dataTransaksi?.filter((item) => {
    const idBooking = item?.id_booking.toLowerCase();
    const namaCustomer = item?.customers?.nama_customer.toLowerCase();
    const status = item?.status.toLowerCase();
    const filter = filterData.toLowerCase();

    return (
      idBooking.includes(filter) ||
      namaCustomer.includes(filter) ||
      status.includes(filter) 
    );
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

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  async function getDataAllTransaksi() {
    setLoadData(true);
    await axios
      .get(`/transaksi/reservasi/show`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        setDataTransaksi(data.reverse());
        toast.success(response.data.message);
      })
      .catch((error) => {
        navigation("/loginAdm");
        toast.error(error.response.data.message);
      });
    setLoadData(false);
  }
  async function cetakPdfNotaLunas(id) {
    await axios
      .get(`/export/nota-lunas/pdf/${id}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Mengatur tipe respons menjadi blob
      })
      .then((response) => {
        // Membuat blob URL dari respons PDF
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Membuka URL di tab atau jendela baru
        window.open(url, "_blank");

        // Hapus blob URL setelah PDF ditutup
        window.URL.revokeObjectURL(url);
        toast.success("PDF Berhasil ditampilkan");
      })
      .catch((error) => {
        toast.error(`PDF Gagal ditampilkan! ${error}`);
      });
  }

  async function addDataTrxFasilitas(idLayanan, jumlah, waktu){
    const harga = dataFasilitas.find((item) => item.id == idLayanan)?.harga;
    const response = await AddTrxLayanan(
      {
        id_layanan: idLayanan,
        id_trx_reservasi: tempId,
        jumlah: jumlah,
        total_harga: harga * jumlah,
        waktu_pemakaian: waktu,
        flag_stat: 1,
      },
      token
    );
    if(response.status == 'T'){
      toast.success(response.message);
    }else{
      toast.error(JSON.stringify(response.message));
    }
  }
  
  useEffect(() => {
    getDataAllTransaksi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCheckIn(e) {
    e.preventDefault();
    setLoadingKonfirm(true)
    const response = await cekWaktuCheckIn(tempId, token);
    setLoadingKonfirm(false);
    if(response.status == 'T'){
      toast.success(response.message);
      navigation(`/admin/reservasi/${tempId}/pilih-kamar`);
    }else{
      setKonfirmCheckIn(false);
      getDataAllTransaksi();
      toast.error(response.message);
    }
  }
  function handleCheckOut(e) {
    e.preventDefault();
    setLoadingKonfirm(true)
    navigation(`/admin/checkOut/${tempId}`);
    setLoadingKonfirm(false);
  }
  async function handleTambahFasilitas(e){
    e.preventDefault();
    setLoadingKonfirm(true);
    const fasilitasDiPilih = Object.keys(fasilitasSelected);
    for(let i=0; i<fasilitasDiPilih.length; i++){
      await addDataTrxFasilitas(fasilitasDiPilih[i], fasilitasSelected[fasilitasDiPilih[i]].jumlah, fasilitasSelected[fasilitasDiPilih[i]].tanggalPenggunaan);
    }
    setLoadingKonfirm(false);
    setFasilitasSelected({});
    onOpenChangeTambahFasilitas(false);
    setKonfirmTambahFasilitas(false);
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

    onOpenChangeTambahFasilitas(true);
  }
  const handleCheckboxChange = (id) => {
    setFasilitasSelected((prevSelected) => {
      const updatedSelected = { ...prevSelected };
      if (updatedSelected[id]) {
        delete updatedSelected[id];
      } else {
        updatedSelected[id] = {
          tanggalPenggunaan: getFormattedDate(),
          jumlah: 1,
        };
      }
      return updatedSelected;
    });
  };

  const handleDateChange = (event, id) => {
    setFasilitasSelected((prevSelected) => ({
      ...prevSelected,
      [id]: {
        ...prevSelected[id],
        tanggalPenggunaan: event.target.value,
      },
    }));
  };

  const handleJumlahChange = (event, id) => {
    setFasilitasSelected((prevSelected) => ({
      ...prevSelected,
      [id]: {
        ...prevSelected[id],
        jumlah: parseInt(event.target.value, 10),
      },
    }));
  };

  function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  }

  const renderCell = useCallback((data, columnKey) => {
    switch (columnKey) {
      case "id_booking":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{data.id_booking}</p>
          </div>
        );
      case "nama_customer":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{data.customers.nama_customer}</p>
          </div>
        );
      case "request_layanan":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{data?.req_layanan ? data.req_layanan : '-'}</p>
          </div>
        );
      case "check_in":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{FormatDate(new Date(data?.waktu_check_in))}</p>
          </div>
        );
      case "check_out":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{FormatDate(new Date(data?.waktu_check_out))}</p>
          </div>
        );
      case "total_harga":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
                {data?.total_harga && FormatCurrency(data?.total_harga)}
            </p>
          </div>
        );
      case "status":
        return (
          <div className="flex flex-col justify-center">
            <p className={`font-medium text-sm w-full text-center px-3 py-0.5 rounded-sm text-gray-500 ${data.status == 'Menunggu Pembayaran' ? 'ring-2 bg-orange-400 ring-orange-500 text-white' : (data.status == 'Terkonfirmasi' ? 'ring-2 bg-green-400 ring-green-500 text-white' : (data.status == 'In' ? 'ring-2 bg-green-100 text-green-600 ring-green-500' : (data.status == 'Out' ? 'ring-2 bg-red-100 ring-red-500 text-red-600': 'ring-2 bg-red-500 ring-red-600 text-white')))}`}>
                {data.status}
            </p>
          </div>
        );
      case "aksi":
        return (
          <div className="relative flex items-center gap-2">
            {/* <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <GiBeastEye />
              </span>
            </Tooltip> */}
            {data.status == 'Terkonfirmasi' || data.status == 'Menunggu Pembayaran' ?
              <Button className={`text-white rounded-md`} isIconOnly size="sm" color="success" onClick={() => {setKonfirmCheckIn(true); setTempId(data.id)}} isDisabled={data.status != 'Terkonfirmasi'}>CI</Button> 
              : 
              data.status == 'Batal' ? '' : data.status == 'Out' ? 
              <Button className={`text-white rounded-md`} size="sm" color="primary" onClick={async () => {setLoadNotaLunas(true); await cetakPdfNotaLunas(data.id); setLoadNotaLunas(false)}} isLoading={loadNotaLunas}>{loadNotaLunas ? '' : 'Cetak Nota'}</Button>
              :
              <>
                <Button className={`text-white rounded-md`} isIconOnly size="sm" color="danger" onClick={() => {setKonfirmCheckOut(true); setTempId(data.id)}} isDisabled={data.status != 'In'}>CO</Button>
                <Tooltip content="Tambah Fasilitas">
                  <Button className={`text-white rounded-md`} isIconOnly size="sm" color="secondary" onClick={() => {handleTampilFasilitas(); setTempId(data.id)}} isDisabled={data.status != 'In'}><FaPlus/></Button>
                </Tooltip>
              </>
            }
          </div>
        );
      default:
        return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <p className="text-4xl font-medium max-w-lg pb-4 !mb-7 border-b-1 border-gray-400 uppercase">
        Data Reservasi Customer
    </p>
      <div className="flex justify-between items-center gap-5 my-5">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1 h-12 border-default-500 bg-white",
          }}
          placeholder="Cari berdasarkan ID Booking, Nama Customer, Status"
          size="sm"
          startContent={
            <MdOutlineSearch className="text-default-500 w-6 h-6 " />
          }
          value={filterData}
          variant="bordered"
          onChange={(e) => {setFilterData(e.target.value); setPage(1);}}
          onClear={() => onClear()}
        />
      </div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-default-400 text-small">
          Total {dataTransaksi.length} reservasi
        </p>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>

      <Table
        aria-label="Tabel Tarif"
        removeWrapper
        color="default"
        selectionMode="single"
        classNames={{
          th: [
            "bg-transparent",
            "text-default-500",
            "border-b",
            "border-divider",
          ],
        }}
        bottomContent={
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
        className="bg-white py-3 px-2 shadow-md rounded-sm"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "aksi" ? "center" : "start"}
              width={column.width || "auto"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={items}
          isLoading={loadData}
          emptyContent={!loadData ? "Tidak ada Data Transaksi Reservasi" : "  "}
          loadingContent={<Spinner />}
          loadingState={loadData}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpenTambahFasilitas}
        onOpenChange={onOpenChangeTambahFasilitas}
        scrollBehavior="inside"
        placement="center"
        className="md:max-w-3xl rounded-md"
        onClose={() => {
          setTempId("");
          setFasilitasSelected({});
        }}
      >
        <ModalContent className="pb-3 overflow-hidden">
          <ModalHeader className="flex flex-col gap-1 uppercase bg-secondary">
            Tambah Layanan Fasilitas Berbayar
          </ModalHeader>
          <ModalBody>
          <div>
            <p className="text-md mb-3 mt-1">Fasilitas tambahan yang dapat dipilih:</p>
            <div className="flex flex-col gap-1 w-full">
              <div className="grid grid-cols-1 gap-3">
                {dataFasilitas.map((data) => (
                  <div key={data.id}>
                    <label>
                      <Checkbox
                        value={data.id}
                        checked={fasilitasSelected[data.id] !== undefined}
                        onChange={() => handleCheckboxChange(data.id)}
                      >
                        <div className="grid grid-cols-[180px,90px,50px,1fr] gap-4">
                          <p>{data.nama_layanan}</p>
                          <p>{FormatCurrency(data.harga)}</p>
                          <p>per {data.satuan}</p>
                          <p>{data.keterangan}</p>
                        </div>
                      </Checkbox>
                    </label>

                    {fasilitasSelected[data.id] && (
                      <div className="grid grid-cols-[80px,200px] gap-2 ms-7">
                        <Input
                          type="number"
                          placeholder="Jumlah"
                          labelPlacement="outside"
                          variant="bordered"
                          value={fasilitasSelected[data.id].jumlah}
                          onChange={(event) => handleJumlahChange(event, data.id)}
                          startContent={
                            <FaCalendarAlt className="text-[15px] text-default-400" />
                          }
                          size="sm"
                        />
                        <Input
                          type="date"
                          placeholder="Tanggal Penggunaan"
                          labelPlacement="outside"
                          variant="bordered"
                          value={fasilitasSelected[data.id].tanggalPenggunaan}
                          onChange={(event) => handleDateChange(event, data.id)}
                          startContent={
                            <FaCalendarAlt className="text-[15px] text-default-400" />
                          }
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="solid"
              onClick={() => setKonfirmTambahFasilitas(true)}
            >
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ModalKonfYesNo openKonfirm={konfirmCheckIn} setOpenKonfirm={setKonfirmCheckIn} onClickNo={() => setKonfirmCheckIn(false)} onClickYes={(e) => {handleCheckIn(e)}} isLoading={loadingKonfirm} pesan="Apakah yakin ingin melakukan check-in untuk reservasi ini?"/>
      <ModalKonfYesNo openKonfirm={konfirmCheckOut} setOpenKonfirm={setKonfirmCheckOut} onClickNo={() => setKonfirmCheckOut(false)} onClickYes={(e) => {handleCheckOut(e)}} isLoading={loadingKonfirm} pesan="Apakah yakin ingin melakukan check-out untuk reservasi ini?"/>
      <ModalKonfYesNo openKonfirm={konfirmTambahFasilitas} setOpenKonfirm={setKonfirmTambahFasilitas} onClickNo={() => setKonfirmTambahFasilitas(false)} onClickYes={(e) => {handleTambahFasilitas(e)}} isLoading={loadingKonfirm} pesan="Apakah yakin ingin menambahkan fasilitas ini kepada transaksi?"/>
    </>
  )
}

export default Reservasi