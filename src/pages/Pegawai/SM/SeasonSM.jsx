import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormatDate from "../../../utils/FormatDate";
import FormatTime from "../../../utils/FormatTime";

const columns = [
    { name: "NAMA SEASON", uid: "nama_season" },
    { name: "JENIS SEASON", uid: "jenis_season" },
    { name: "TANGGAL MULAI", uid: "tgl_mulai" },
    { name: "JAM MULAI", uid: "jam_mulai" },
    { name: "TANGGAL BERAKHIR", uid: "tgl_selesai" },
    { name: "JAM BERAKHIR", uid: "jam_selesai" },
    { name: "STATUS", uid: "status" },
    { name: "AKSI", uid: "aksi" },
  ];

const addData = async (request, token) => {
    let res;
    await axios
      .post("/season", request, {
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
  const updateData = async (id, request, token) => {
    let res;
    await axios
      .put(`/season/${id}`, request, {
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

function SeasonSM() {
  const [dataSeason, setDataSeason] = useState([]);
  const [loadData, setLoadData] = useState(false);
  const token = localStorage.getItem("apiKeyAdmin");
  const navigation = useNavigate();
  const [tempData, setTempData] = useState({});
  const [loadSubmit, setLoadSubmit] = useState(false);
  const [tempId, setTempId] = useState(false);
  const [isOpen, onOpenChange] = useState(false);
  const [validation, setValidation] = useState([]);
  const [openKonfirm, setOpenKonfirm] = useState(false);
  const [filterData, setFilterData] = useState("");
  const [selectJenisSeason, setSelectJenisSeason] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sdhInputTglMulai, setSdhInputTglMulai] = useState(false);
  const [sdhInputTglSelesai, setSdhInputTglSelesai] = useState(false);

  const dataFilter = dataSeason?.filter((item) => {
    const namaSeason = item?.nama_season.toLowerCase();
    const jenisSeason = item?.jenis_season.toLowerCase();
    const filter = filterData.toLowerCase();

    return (
      namaSeason.includes(filter) ||
      jenisSeason.includes(filter) 
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

  async function getDataAll() {
    setLoadData(true);
    await axios
      .get(`/season`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        setDataSeason(data.reverse());
        toast.success(response.data.message);
      })
      .catch((error) => {
        navigation("/loginAdm");
        toast.error(error.response.data.message);
      });
    setLoadData(false);
  }
  async function getDataById(id) {
    await axios
      .get(`/season/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        toast.success(response.data.message);
        setTempData(data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }
  const deleteData = async (id) => {
    await axios
      .delete(`/season/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        getDataAll();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    getDataAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e, temp) {
    let response;
    e.preventDefault();
    // setTempData({ ...tempData, tgl_mulai: tempMulai.tanggal+' '+tempMulai.jam, tgl_selesai: tempSelesai.tanggal+' '+tempSelesai.jam});
    setLoadSubmit(true);
    if (temp == "add") {
      response = await addData(
        {
          ...tempData,
          flag_stat: 1,
        },
        token
      );
    } else {
      response = await updateData(
        tempId,
        {
          ...tempData,
          flag_stat: 1,
        },
        token
      );
    }
    setLoadSubmit(false);
    if (response.data.status === "T") {
      getDataAll();
      toast.success(response.data.message);
      setTempData({});
      setTempId("");
      onOpenChange(false);
    } else {
      setValidation(response.data.message);
      toast.error(response.data.message);
      // refreshPage();
    }
  }
  function clickBtnAdd() {
    setTempId("");
    setTempData({});
    onOpenChange(true);
  }
  function clickBtnEdit(data) {
    setSdhInputTglMulai(true);
    setSdhInputTglSelesai(true);
    setTempId("");
    getDataById(data.id);
    setTempId(data.id);
    onOpenChange(true);
  }
  function clickBtnDelete(data) {
    setTempId(data.id);
    setOpenKonfirm(true);
  }

  const renderCell = useCallback((data, columnKey) => {
    switch (columnKey) {
      case "nama_season":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{data.nama_season}</p>
          </div>
        );
      case "jenis_season":
        return (
          <div className="flex flex-col">
            <Chip color={`${data.jenis_season === 'High' ? 'danger' : 'secondary'}`} variant="flat"className={`text-sm ${data.jenis_season === 'High' ? 'text-primary' : 'text-danger'}`}>{data.jenis_season}</Chip>
          </div>
        );
      case "tgl_mulai":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
              {data?.tgl_mulai && FormatDate(new Date(data?.tgl_mulai))} 
            </p>
          </div>
        );
      case "jam_mulai":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
              {data?.tgl_mulai && FormatTime(new Date(data?.tgl_mulai))} 
            </p>
          </div>
        );
      case "tgl_selesai":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{data?.tgl_selesai && FormatDate(new Date(data?.tgl_selesai))} </p>
          </div>
        );
      case "jam_selesai":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{data?.tgl_selesai && FormatTime(new Date(data?.tgl_selesai))} </p>
          </div>
        );
      case "status":

        return (
          <div className="flex flex-col justify-center">
            <p className={`font-bold text-sm w-full text-center px-3 py-0.5 rounded-sm text-gray-500 ${new Date(data?.tgl_selesai) < new Date() ? 'ring-2 bg-red-300 ring-red-500' : (new Date(data?.tgl_mulai) < new Date() ? 'ring-2 bg-green-300 ring-green-500' : (new Date() < new Date(data?.tgl_mulai) ? 'ring-2 bg-orange-300 ring-orange-500' : 'ring-2'))}`}>
                {new Date(data?.tgl_selesai) < new Date() ? 'Sudah Berakhir' : (new Date(data?.tgl_mulai) < new Date() ? 'Sedang Berjalan' : (new Date() < new Date(data?.tgl_mulai) ? 'OTW' : 'Apa e?'))}
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
            {(new Date(data.tgl_mulai) < new Date()) || ((new Date(data.tgl_mulai) - new Date()) < 5184000000) ? (
              <>
              <Tooltip content="Tidak bisa edit data, karena selisih dengan tanggal mulai < 2 bulan">
              <span
                className="text-lg text-gray-400 cursor-pointer opacity-75 active:opacity-50"
              >
                <BiEditAlt />
              </span>
            </Tooltip>
                <Tooltip color="default" content="Tidak bisa hapus data, karena selisih dengan tanggal mulai < 2 bulan">
                <span
                  className="text-lg text-gray-400 cursor-pointer opacity-75 active:opacity-50"
                >
                  <RiDeleteBin5Line />
                </span>
              </Tooltip>
              </>
            ) : (
              <>
              <Tooltip content="Edit data">
              <span
                className="text-lg text-primary cursor-pointer active:opacity-50"
                onClick={() => clickBtnEdit(data)}
              >
                <BiEditAlt />
              </span>
            </Tooltip>
                <Tooltip color="danger" content="Delete data">
                  <span
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                    onClick={() => clickBtnDelete(data)}
                  >
                    <RiDeleteBin5Line />
                  </span>
                </Tooltip>
              </>
            )}
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
        Season
    </p>
      <div className="flex justify-between items-center gap-5 my-5">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1 h-12 border-default-500 bg-white",
          }}
          placeholder="Cari berdasarkan Nama Season, Jenis Season"
          size="sm"
          startContent={
            <MdOutlineSearch className="text-default-500 w-6 h-6 " />
          }
          value={filterData}
          variant="bordered"
          onChange={(e) => {setFilterData(e.target.value); setPage(1);}}
          onClear={() => onClear()}
        />
        <div className="flex gap-3 items-center">
          <Button
            onClick={clickBtnAdd}
            size="md"
            className="bg-primary bg-opacity-90 text-gray-300 hover:text-white hover:bg-opacity-100 rounded-full ring-2 min-w-unit-0"
          >
            <FaPlus className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-default-400 text-small">
          Total {dataSeason.length} season
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
        aria-label="Tabel Season"
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
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={items}
          isLoading={loadData}
          emptyContent={!loadData ? "Tidak ada Data Permintaan Layanan" : "  "}
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
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="center"
        className="md:max-w-3xl"
        onClose={() => {
          setTempData({});
          setTempId("");
          setValidation([]);
          setSdhInputTglMulai(false);
        }}
      >
        <ModalContent className="p-1 pb-3">
          <ModalHeader className="flex flex-col gap-1">
            {tempId ? "Ubah" : "Tambah"} Season
          </ModalHeader>
          <ModalBody>
            <div>
              <form
                onSubmit={(e) => {
                  {
                    tempId ? handleSubmit(e, "update") : handleSubmit(e, "add");
                  }
                }}
                className="grid gap-3"
              >
                <div className="flex gap-3">
                <Input
                    type="text"
                    variant="bordered"
                    label="Nama Season"
                    placeholder="Masukkan Nama Season"
                    value={tempData.nama_season}
                    isInvalid={validation.nama_season ? true : false}
                    errorMessage={validation.nama_season}
                    onChange={(e) => {
                      setTempData({ ...tempData, nama_season: e.target.value });
                      validation.nama_season = null;
                    }}
                  />
                  {/* jenis: {tempData?.jenis_season} */}
                  <Select
                    variant="bordered"
                    label="Jenis Season"
                    placeholder="Pilih Jenis Season"
                    selectedKeys={
                      tempData?.jenis_season
                        ? [tempData?.jenis_season.toString()]
                        : []
                    }
                    isInvalid={validation.jenis_season ? true : false}
                    errorMessage={validation.jenis_season}
                    onChange={(e) => {
                      setTempData({
                        ...tempData,
                        jenis_season: e.target.value
                      });
                      validation.jenis_season = null;
                    }}
                    // className="bg-white rounded-xl"
                    isOpen={selectJenisSeason}
                    onClick={() => setSelectJenisSeason(!selectJenisSeason)}
                  >
                    {[{no: "1", nama: "High"}, {no: "2", nama: "Promo"}].map((season) => (
                      <SelectItem
                        key={season.nama}
                        value={season.nama}
                        onClick={() => setSelectJenisSeason(!selectJenisSeason)}
                      >
                        {season.nama}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                tanggal: {tempData.tgl_mulai}
                <div className="flex gap-3">
                  <Input
                    type="date"
                    variant="bordered"
                    label="Tanggal Mulai"
                    placeholder="Masukkan Tanggal Mulai"
                    value={tempData?.tgl_mulai && tempData?.tgl_mulai.split(' ')[0]}
                    isInvalid={validation.tgl_mulai ? true : false}
                    errorMessage={validation.tgl_mulai}
                    onChange={(e) => {
                      // tgl_mulai dicek dlu. kl null, maka langsung set e.tagret nya ke tgl_mulai. tp kalo tgl_mulai sdh ada isi, maka hanya ganti pada bagian tanggalny aja. wktunya tetap
                      setTempData({ ...tempData, tgl_mulai: tempData?.tgl_mulai ? e.target.value+' '+tempData?.tgl_mulai.split(' ')[1] : e.target.value });
                      validation.tgl_mulai = null;
                      setSdhInputTglMulai(true);
                    }}
                  />
                  <Input
                    type="time"
                    isDisabled={!sdhInputTglMulai}
                    variant="bordered"
                    label="Jam Mulai"
                    placeholder="Masukkan Jam Mulai"
                    value={tempData?.tgl_mulai ? tempData?.tgl_mulai.split(' ')[1] : ""}
                    isInvalid={validation.tgl_mulai ? true : false}
                    errorMessage={validation.tgl_mulai}
                    onChange={(e) => {
                      setTempData({ ...tempData, tgl_mulai: tempData.tgl_mulai.split(' ')[0]+' '+e.target.value+':00' });
                      validation.tgl_mulai = null;
                    }}
                  />
                  <Input
                    type="date"
                    variant="bordered"
                    label="Tanggal Berakhir"
                    placeholder="Masukkan Tanggal Berakhir"
                    value={tempData?.tgl_selesai && tempData?.tgl_selesai.split(' ')[0]}
                    isInvalid={validation.tgl_selesai ? true : false}
                    errorMessage={validation.tgl_selesai}
                    onChange={(e) => {
                      // tgl_selesai dicek dlu. kl null, maka langsung set e.tagret nya ke tgl_selesai. tp kalo tgl_selesai sdh ada isi, maka hanya ganti pada bagian tanggalny aja. wktunya tetap
                      setTempData({ ...tempData, tgl_selesai: tempData?.tgl_selesai ? e.target.value+' '+tempData?.tgl_selesai.split(' ')[1] : e.target.value });
                      validation.tgl_selesai = null;
                      setSdhInputTglSelesai(true);
                    }}
                  />
                  <Input
                    type="time"
                    isDisabled={!sdhInputTglSelesai}
                    variant="bordered"
                    label="Jam Mulai"
                    placeholder="Masukkan Jam Mulai"
                    value={tempData?.tgl_selesai ? tempData?.tgl_selesai.split(' ')[1] : ""}
                    isInvalid={validation.tgl_selesai ? true : false}
                    errorMessage={validation.tgl_selesai}
                    onChange={(e) => {
                      setTempData({ ...tempData, tgl_selesai: tempData.tgl_selesai.split(' ')[0]+' '+e.target.value+':00' });
                      validation.tgl_selesai = null;
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={loadSubmit}
                  className="bg-primary hover:bg-opacity-90 text-white"
                >
                  {tempId ? "Ubah" : "Tambah"} Data
                </Button>
              </form>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        backdrop="opaque"
        isOpen={openKonfirm}
        onOpenChange={setOpenKonfirm}
        placement="center"
        isDismissable={false}
        radius="2xl"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          //   base: "border-[#292f46] ",
          header: "bg-red-600 text-white",
          //   footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 "></ModalHeader>
          <ModalBody>
            <p>Apakah yakin ingin menghapus data Season ini?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              variant="light"
              onClick={() => {
                setOpenKonfirm(!openKonfirm);
                setTempId("");
              }}
            >
              Tidak
            </Button>
            <Button
              className="bg-red-500 text-white font-medium shadow-lg shadow-indigo-500/20"
              onClick={() => {
                deleteData(tempId);
                setOpenKonfirm(false);
                setTempId("");
              }}
            >
              Ya
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SeasonSM;
