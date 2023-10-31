import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { GiStarFormation } from "react-icons/gi";
import { MdOutlineSearch } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormatCurrency from "../../../utils/FormatCurrency";
import FormatDateTime from "../../../utils/FormatDateTime";

const columns = [
    { name: "NAMA SEASON", uid: "nama_season" },
    { name: "JENIS SEASON", uid: "jenis_season" },
    { name: "JENIS KAMAR", uid: "jenis_kamar" },
    { name: "HARGA DASAR", uid: "harga_dasar" },
    { name: "PERUBAHAN TARIF", uid: "perubahan_tarif" },
    { name: "HARGA AKHIR", uid: "harga_akhir" },
    { name: "STATUS", uid: "status" },
    { name: "AKSI", uid: "aksi" },
  ];

const addData = async (request, token) => {
    let res;
    await axios
      .post("/tarif", request, {
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
      .put(`/tarif/${id}`, request, {
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

function TarifSM() {
  const [dataTarif, setDataTarif] = useState([]);
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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectJenisKamar, setSelectJenisKamar] = useState(false);
  const [selectSeason, setSelectSeason] = useState(false);
  const [dataJenisKamar, setDataJenisKamar] = useState([]);
  const [dataSeason, setDataSeason] = useState([]);
  const [tempDataSeason, setTempDataSeason] = useState({}); //tuk nampung data season id yg dipilih (tuk nampilin tanggal mulai, selesai dan status)

  const dataFilter = dataTarif?.filter((item) => {
    const namaSeason = item?.seasons?.nama_season.toLowerCase();
    const jenisSeason = item?.seasons?.jenis_season.toLowerCase();
    const jenisKamar = item?.jenis_kamars?.jenis_kamar.toLowerCase();
    const filter = filterData.toLowerCase();

    return (
      namaSeason.includes(filter) ||
      jenisSeason.includes(filter) ||
      jenisKamar.includes(filter) 
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
      .get(`/tarif`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        setDataTarif(data.reverse());
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
      .get(`/tarif/${id}`, {
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
  async function getDataJenisKamarAll() {
    await axios
      .get(`/jenis`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        setDataJenisKamar(data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }
  async function getDataSeasonAll() {
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
        setDataSeason(data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }
  async function getDataSeasonById(id) {
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
        setTempDataSeason(data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }
  const deleteData = async (id) => {
    await axios
      .delete(`/tarif/${id}`, {
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
    getDataJenisKamarAll();
    getDataSeasonAll();
    setTempId("");
    setTempData({});
    onOpenChange(true);
  }
  function clickBtnEdit(data) {
    setTempId("");
    getDataJenisKamarAll();
    getDataSeasonAll();
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
            <p className="text-bold text-sm">{data.seasons.nama_season}</p>
          </div>
        );
      case "jenis_season":
        return (
          <div className="flex flex-col">
            <Chip color={`${data.seasons.jenis_season === 'High' ? 'danger' : 'secondary'}`} variant="flat"className={`text-sm ${data.seasons.jenis_season === 'High' ? 'text-primary' : 'text-danger'}`}>{data.seasons.jenis_season}</Chip>
          </div>
        );
      case "jenis_kamar":
        return (
            <User
            avatarProps={{ radius: "lg", src: data.jenis_kamars.gambar }}
            description={<GiStarFormation className="text-yellow-500" />}
            name={data.jenis_kamars.jenis_kamar}
          >
            {data.jenis_kamars.jenis_kamar}
          </User>
        );
      case "harga_dasar":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
              {data?.jenis_kamars.harga_dasar && FormatCurrency(data?.jenis_kamars.harga_dasar)} 
            </p>
          </div>
        );
      case "perubahan_tarif":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
                {data?.perubahan_tarif && FormatCurrency(data?.perubahan_tarif)}
            </p>
          </div>
        );
      case "harga_akhir":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
                {data?.seasons.jenis_season === 'High' ?
                  FormatCurrency(data?.jenis_kamars.harga_dasar + data?.perubahan_tarif) :
                  FormatCurrency(data?.jenis_kamars.harga_dasar - data?.perubahan_tarif)
                }
            </p>
          </div>
        );
      case "status":

        return (
          <div className="flex flex-col justify-center">
            <p className={`font-bold text-sm w-full text-center px-3 py-0.5 rounded-sm text-gray-500 ${new Date(data?.seasons.tgl_selesai) < new Date() ? 'ring-2 bg-red-300 ring-red-500' : (new Date(data?.seasons.tgl_mulai) < new Date() ? 'ring-2 bg-green-300 ring-green-500' : (new Date() < new Date(data?.seasons.tgl_mulai) ? 'ring-2 bg-orange-300 ring-orange-500' : 'ring-2'))}`}>
                {new Date(data?.seasons.tgl_selesai) < new Date() ? 'Tidak Aktif' : (new Date(data?.seasons.tgl_mulai) < new Date() ? 'Aktif' : (new Date() < new Date(data?.seasons.tgl_mulai) ? 'Proses' : 'Apa e?'))}
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
        Tarif
    </p>
      <div className="flex justify-between items-center gap-5 my-5">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1 h-12 border-default-500 bg-white",
          }}
          placeholder="Cari berdasarkan Nama Season, Jenis Season, Jenis Kamar"
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
          Total {dataTarif.length} tarif
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
        }}
      >
        <ModalContent className="p-1 pb-3">
          <ModalHeader className="flex flex-col gap-1">
            {tempId ? "Ubah" : "Tambah"} Tarif
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
                <div className="flex gap-3 flex-col md:flex-row">
                  <Select
                    variant="bordered"
                    label="Jenis Kamar"
                    placeholder="Pilih Jenis Kamar"
                    selectedKeys={
                      tempData?.id_jenis_kamar
                        ? [tempData?.id_jenis_kamar.toString()]
                        : []
                    }
                    isInvalid={validation.id_jenis_kamar ? true : false}
                    errorMessage={validation.id_jenis_kamar}
                    onChange={(e) => {
                      setTempData({
                        ...tempData,
                        id_jenis_kamar: e.target.value,
                      });
                      validation.id_jenis_kamar = null;
                    }}
                    // className="bg-white rounded-xl"
                    isOpen={selectJenisKamar}
                    onClick={() => setSelectJenisKamar(!selectJenisKamar)}
                  >
                    {dataJenisKamar.map((jenis) => (
                      <SelectItem
                        key={jenis.id}
                        value={jenis.id}
                        onClick={() => setSelectJenisKamar(!selectJenisKamar)}
                      >
                        {jenis.jenis_kamar}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    variant="bordered"
                    label="Season"
                    placeholder="Pilih Season"
                    selectedKeys={
                      tempData?.id_season
                        ? [tempData?.id_season.toString()]
                        : []
                    }
                    isInvalid={validation.id_season ? true : false}
                    errorMessage={validation.id_season}
                    onChange={(e) => {
                      setTempDataSeason({});
                      setTempData({
                        ...tempData,
                        id_season: e.target.value,
                      });
                      validation.id_season = null;
                      getDataSeasonById(e.target.value);
                    }}
                    // className="bg-white rounded-xl"
                    isOpen={selectSeason}
                    onClick={() => setSelectSeason(!selectSeason)}
                  >
                    {dataSeason.map((season) => (
                      <SelectItem
                        key={season.id}
                        value={season.id}
                        onClick={() => setSelectSeason(!selectSeason)}
                      >
                        {season.nama_season}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                {tempData?.id_season && 
                  <div className="flex gap-3 items-center">
                    <div className={`font-bold h-full bg-gray-100 flex items-center text-center rounded-xl px-3 ${!tempDataSeason?.jenis_season && 'italic !font-normal'}`}>
                      {tempDataSeason?.jenis_season ? tempDataSeason?.jenis_season : 'Loading...'}
                    </div>
                    <Input
                    disabled
                    type="text"
                    variant="bordered"
                    placeholder=" "
                    label="Tanggal Mulai Season"
                    value={tempDataSeason?.tgl_mulai ? FormatDateTime(new Date(tempDataSeason?.tgl_mulai)) : ""}
                  />
                  <Input
                    disabled
                    type="text"
                    variant="bordered"
                    placeholder=" "
                    label="Tanggal Selesai Season"
                    value={tempDataSeason?.tgl_selesai ? FormatDateTime(new Date(tempDataSeason?.tgl_selesai)) : ""}
                  />
                  <div className={`font-bold text-sm w-3/5 h-max text-center px-3 py-0.5 rounded-full text-gray-500 ${new Date(tempDataSeason?.tgl_selesai) < new Date() ? 'ring-2 bg-red-300 ring-red-500' : (new Date(tempDataSeason?.tgl_mulai) < new Date() ? 'ring-2 bg-green-300 ring-green-500' : (new Date() < new Date(tempDataSeason?.tgl_mulai) ? 'ring-2 bg-orange-300 ring-orange-500' : 'ring-2 italic !font-normal'))}`}>
                    {new Date(tempDataSeason?.tgl_selesai) < new Date() ? 'Sudah Berakhir' : (new Date(tempDataSeason?.tgl_mulai) < new Date() ? 'Sedang Berjalan' : (new Date() < new Date(tempDataSeason?.tgl_mulai) ? 'OTW' : 'Loading...'))}
                  </div>
                  </div>
                }
                <Input
                    type="number"
                    variant="bordered"
                    label="Perubahan Tarif"
                    placeholder="Masukkan Perubahan Tarif"
                    value={tempData.perubahan_tarif}
                    isInvalid={validation.perubahan_tarif ? true : false}
                    errorMessage={validation.perubahan_tarif}
                    onChange={(e) => {
                      setTempData({
                        ...tempData,
                        perubahan_tarif: e.target.value,
                      });
                      validation.perubahan_tarif = null;
                    }}
                  />

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
            <p>Apakah yakin ingin menghapus data Tarif ini?</p>
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
  )
}

export default TarifSM