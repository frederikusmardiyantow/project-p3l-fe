import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  Button,
  Input,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Pagination,
  Select,
  SelectItem,
  Textarea,
  ModalFooter,
} from "@nextui-org/react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { GiStarFormation } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineSearch } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import FormatCurrency from "../../../utils/FormatCurrency";

const columns = [
  { name: "NOMOR KAMAR", uid: "nomor_kamar" },
  { name: "JENIS KAMAR", uid: "jenis_kamar" },
  { name: "UKURAN KAMAR", uid: "ukuran_kamar" },
  { name: "JENIS BED", uid: "jenis_bed" },
  { name: "LANTAI", uid: "lantai" },
  { name: "AREA MEROKOK", uid: "area_merokok" },
  { name: "KAPASITAS", uid: "kapasitas" },
  { name: "HARGA DASAR", uid: "harga_dasar" },
  { name: "AKSI", uid: "aksi" },
];

const addData = async (request, token) => {
  let res;
  await axios
    .post("/kamar", request, {
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
    .put(`/kamar/${id}`, request, {
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

export default function KamarAdmin() {
  const [dataKamar, setDataKamar] = useState([]); //tuk nampung data from db kamar
  const token = localStorage.getItem("apiKey"); //tuk dpetin token bearer di localstorage
  const navigation = useNavigate(); //untuk navigasi
  const [loadData, setLoadData] = useState(false); //tuk load data di tabel kamar
  const [isOpen, onOpenChange] = useState(false); //tuk triger modal add/update data kamar
  const [tempData, setTempData] = useState({}); //tuk nampung data inputan add/update kamar
  const [loadSubmit, setLoadSubmit] = useState(false); //tuk load di button submit (add/update data)
  const [tempId, setTempId] = useState(""); //tuk nampung data id yang dipilih tuk di edit
  const [validation, setValidation] = useState([]); //tuk nampung data validasi yg didpt dari respon api
  const [page, setPage] = React.useState(1); //tuk set pagination awal ketika halaman diload
  const [rowsPerPage, setRowsPerPage] = useState(5); //tuk set nilai dari jumlah data yg ditampilin per page di pagination
  const [filterData, setFilterData] = useState(""); //tuk filter data kamar
  const [selectJenisKamar, setSelectJenisKamar] = useState(false);
  const [selectNoLantai, setSelectNoLantai] = useState(false);
  const [selectSmokingArea, setSelectSmokingArea] = useState(false);
  const [selectJenisBed, setSelectJenisBed] = useState(false);
  const [dataJenisKamar, setDataJenisKamar] = useState([]); //tuk nampung data from db jenis kamar
  const [openKonfirm, setOpenKonfirm] = useState(false); //tuk triger modal konfirmasi delete kamar
  const [pembantuInputanJenisBed, setPembantuInputanJenisBed] = useState(true); // buat bantu kl klik update, maka set jenis bed di inputan disabled. kalo jenis kamar di on chance, maka ubah ke dropdown lagi

  const pages = Math.ceil(dataKamar.length / rowsPerPage); //tuk membagi data yg tampil ditiap halaman

  const dataFilter = dataKamar?.filter((item) => {
    const noKamar = item?.nomor_kamar.toString().toLowerCase();
    const jenisBed = item?.jenis_bed.toLowerCase();
    const jenisKamar = item?.jenis_kamars?.jenis_kamar.toLowerCase();
    const filter = filterData.toLowerCase();

    return (
      noKamar.includes(filter) ||
      jenisBed.includes(filter) ||
      jenisKamar.includes(filter)
    );
  });

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return dataFilter?.slice(start, end);
  }, [page, dataFilter, rowsPerPage]);

  const onClear = useCallback(() => {
    setFilterData("");
    setPage(1);
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  async function getDataAll() {
    setLoadData(true);
    await axios
      .get(`/kamar`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        setDataKamar(data.reverse());
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
      .get(`/kamar/${id}`, {
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
  const deleteData = async (id) => {
    await axios
      .delete(`/kamar/${id}`, {
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
    setTempId("");
    setTempData({});
    onOpenChange(true);
  }
  function clickBtnEdit(data) {
    setPembantuInputanJenisBed(true);
    setTempId("");
    getDataJenisKamarAll();
    getDataById(data.id);
    setTempId(data.id);
    onOpenChange(true);
  }
  function clickBtnDelete(data) {
    setTempId(data.id);
    setOpenKonfirm(true);
  }

  const renderCell = React.useCallback((data, columnKey) => {
    switch (columnKey) {
      case "nomor_kamar":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-sm capitalize">{cellValue}</p> */}
            <p className="text-bold text-sm">{data.nomor_kamar}</p>
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
      case "ukuran_kamar":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-sm capitalize">{cellValue}</p> */}
            <p className="text-bold text-sm">
              {data.jenis_kamars.ukuran_kamar} m<sup>2</sup>
            </p>
          </div>
        );
      case "jenis_bed":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-sm capitalize">{cellValue}</p> */}
            <p className="text-bold text-sm">{data.jenis_bed}</p>
          </div>
        );
      case "lantai":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-sm capitalize">{cellValue}</p> */}
            <p className="text-bold text-sm">{data.nomor_lantai}</p>
          </div>
        );
      case "area_merokok":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-sm capitalize">{cellValue}</p> */}
            <p className="text-bold text-sm">
              {data.smoking_area ? "Ya" : "Tidak"}
            </p>
          </div>
        );
      case "kapasitas":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-sm capitalize">{cellValue}</p> */}
            <p className="text-bold text-sm">
              {data.jenis_kamars.kapasitas} Dewasa
            </p>
          </div>
        );
      case "harga_dasar":
        return (
          <div className="flex flex-col">
            {/* <p className="text-bold text-sm capitalize">{cellValue}</p> */}
            <p className="text-bold text-sm">
              {data?.jenis_kamars?.harga_dasar &&
                FormatCurrency(data?.jenis_kamars?.harga_dasar)}
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
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
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
      <div className="flex justify-between items-center gap-5 my-5">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1 h-12 border-default-500 bg-white",
          }}
          placeholder="Cari berdasarkan Nomor Kamar, Jenis Kamar, dan Jenis Bed"
          size="sm"
          startContent={
            <MdOutlineSearch className="text-default-500 w-6 h-6 " />
          }
          value={filterData}
          variant="bordered"
          onChange={(e) => setFilterData(e.target.value)}
          onClear={() => onClear()}
          // onValueChange={onSearchChange}
        />
        <div className="flex gap-3 items-center">
          {/* <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<MdArrowDropDown className="text-small" />}
                size="sm"
                variant="flat"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              // selectedKeys={statusFilter}
              selectionMode="multiple"
              // onSelectionChange={setStatusFilter}
            >
              {jenisKamars.map((jenis) => (
                <DropdownItem key={jenis.uid} className="capitalize">
                  {jenis.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown> */}
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
          Total {dataKamar.length} kamar
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
        aria-label="Tabel Kamar"
        removeWrapper
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
          emptyContent={"Tidak ada Data Permintaan Layanan"}
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
            {tempId ? "Ubah" : "Tambah"} Kamar
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
                        jenis_bed: "",
                      });
                      validation.id_jenis_kamar = null;
                      setPembantuInputanJenisBed(false);
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
                    label="Nomor Lantai"
                    placeholder="Pilih Nomor Lantai"
                    selectedKeys={
                      tempData?.nomor_lantai
                        ? [tempData?.nomor_lantai.toString()]
                        : []
                    }
                    isInvalid={validation.nomor_lantai ? true : false}
                    errorMessage={validation.nomor_lantai}
                    onChange={(e) => {
                      setTempData({
                        ...tempData,
                        nomor_lantai: e.target.value,
                      });
                      validation.nomor_lantai = null;
                    }}
                    // className="bg-white rounded-xl"
                    isOpen={selectNoLantai}
                    onClick={() => setSelectNoLantai(!selectNoLantai)}
                  >
                    {[
                      { no: "1" },
                      { no: "2" },
                      { no: "3" },
                      { no: "5" },
                      { no: "7" },
                      { no: "8" },
                      { no: "9" },
                      { no: "12" },
                    ].map((lantai) => (
                      <SelectItem
                        key={lantai.no}
                        value={lantai.no}
                        onClick={() => setSelectNoLantai(!selectNoLantai)}
                      >
                        {lantai.no}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    variant="bordered"
                    label="Smoking Area"
                    placeholder="Pilih Smoking Area"
                    selectedKeys={
                      tempData?.smoking_area
                        ? [tempData?.smoking_area.toString()]
                        : []
                    }
                    isInvalid={validation.smoking_area ? true : false}
                    errorMessage={validation.smoking_area}
                    onChange={(e) => {
                      setTempData({
                        ...tempData,
                        smoking_area: e.target.value,
                      });
                      validation.smoking_area = null;
                    }}
                    // className="bg-white rounded-xl"
                    isOpen={selectSmokingArea}
                    onClick={() => setSelectSmokingArea(!selectSmokingArea)}
                  >
                    {[
                      { no: "1", select: "Ya" },
                      { no: "0", select: "Tidak" },
                    ].map((item) => (
                      <SelectItem
                        key={item.no}
                        value={item.no}
                        onClick={() => setSelectSmokingArea(!selectSmokingArea)}
                      >
                        {item.select}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    variant="bordered"
                    label="Nomor Kamar"
                    placeholder="Masukkan Nomor Kamar"
                    value={tempData.nomor_kamar}
                    isInvalid={validation.nomor_kamar ? true : false}
                    errorMessage={validation.nomor_kamar}
                    onChange={(e) => {
                      setTempData({ ...tempData, nomor_kamar: e.target.value });
                      validation.nomor_kamar = null;
                    }}
                  />
                  {tempId && pembantuInputanJenisBed ? (
                    <Input
                      disabled
                      width={1 / 2}
                      type="text"
                      variant="bordered"
                      label="Jenis Bed"
                      value={tempData.jenis_bed}
                      isInvalid={validation.jenis_bed ? true : false}
                      errorMessage={validation.jenis_bed}
                      onChange={(e) => {
                        setTempData({ ...tempData, jenis_bed: e.target.value });
                        validation.jenis_bed = null;
                      }}
                    />
                  ) : (
                    <Select
                      variant="bordered"
                      label="Jenis Bed"
                      placeholder="Pilih Jenis Bed"
                      selectedKeys={[
                        tempData?.jenis_bed && tempData?.jenis_bed.toString(),
                      ]}
                      isInvalid={validation.jenis_bed ? true : false}
                      errorMessage={validation.jenis_bed}
                      onChange={(e) => {
                        setTempData({ ...tempData, jenis_bed: e.target.value });
                        validation.jenis_bed = null;
                      }}
                      // className="bg-white rounded-xl"
                      isOpen={selectJenisBed}
                      onClick={() => setSelectJenisBed(!selectJenisBed)}
                    >
                      {[
                        { jenis_kamar: "1", bed: ["Double", "Twin"] },
                        { jenis_kamar: "2", bed: ["Double", "Twin"] },
                        { jenis_kamar: "3", bed: ["King"] },
                        { jenis_kamar: "4", bed: ["King"] },
                      ].map(
                        (item) =>
                          item.jenis_kamar === tempData.id_jenis_kamar &&
                          item.bed.map((bed) => (
                            <SelectItem
                              key={bed}
                              value={bed}
                              onClick={() => setSelectJenisBed(!selectJenisBed)}
                            >
                              {bed}
                            </SelectItem>
                          ))
                      )}
                    </Select>
                  )}
                </div>

                <Textarea
                  key="bordered"
                  variant="bordered"
                  label="Catatan"
                  labelPlacement="inside"
                  placeholder="Masukkan Catatan (Opsional)"
                  value={tempData.catatan}
                  isInvalid={validation.catatan ? true : false}
                  errorMessage={validation.catatan}
                  onChange={(e) => {
                    setTempData({ ...tempData, catatan: e.target.value });
                    validation.catatan = null;
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
            <p>Apakah yakin ingin menghapus data Kamar ini?</p>
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
