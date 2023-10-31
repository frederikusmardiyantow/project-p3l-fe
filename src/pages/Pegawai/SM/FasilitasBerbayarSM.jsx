import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
  User,
} from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormatCurrency from "../../../utils/FormatCurrency";

const columns = [
  { name: "NAMA LAYANAN", uid: "nama_layanan" },
  { name: "HARGA", uid: "harga" },
  { name: "KETERANGAN", uid: "keterangan" },
  { name: "AKSI", uid: "aksi" },
];

const addData = async (request, token) => {
  let res;
  await axios
    .post("/layanan", request, {
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
    .put(`/layanan/${id}`, request, {
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

function FasilitasBerbayarSM() {
  const [dataFasilitas, setDataFasilitas] = useState([]);
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

  const dataFilter = dataFasilitas?.filter((item) => {
    const namaLayanan = item?.nama_layanan.toLowerCase();
    const satuan = item?.satuan.toLowerCase();
    const filter = filterData.toLowerCase();

    return namaLayanan.includes(filter) || satuan.includes(filter);
  });

  const pages = Math.ceil(dataFilter?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return dataFilter.slice(start, end);
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
      .get(`/layanan`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        setDataFasilitas(data.reverse());
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
      .get(`/layanan/${id}`, {
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
      .delete(`/layanan/${id}`, {
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
    setTempId("");
    setTempData({});
    onOpenChange(true);
  }
  function clickBtnEdit(data) {
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
      case "nama_layanan":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{data.nama_layanan}</p>
          </div>
        );
      case "harga":
        return (
            <User
            avatarProps={{radius: "full", src: "https://cdn.pixabay.com/photo/2022/05/10/03/54/rupiah-7185866_1280.png"}}
            description={'/'+data?.satuan}
            name={data?.harga && FormatCurrency(data?.harga)}
          >
            {data?.harga && FormatCurrency(data?.harga)}
          </User>
          
        );
      case "keterangan":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{data?.keterangan}</p>
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
        Fasilitas Berbayar
      </p>
      <div className="flex justify-between items-center gap-5 my-5">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1 h-12 border-default-500 bg-white",
          }}
          placeholder="Cari berdasarkan Nama Layanan, Satuan"
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
          Total {dataFasilitas.length} fasilitas
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
        aria-label="Tabel Fasilitas"
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
            {tempId ? "Ubah" : "Tambah"} Fasilitas
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
                    label="Nama Layanan"
                    placeholder="Masukkan Nama Layanan"
                    value={tempData.nama_layanan}
                    isInvalid={validation.nama_layanan ? true : false}
                    errorMessage={validation.nama_layanan}
                    onChange={(e) => {
                      setTempData({
                        ...tempData,
                        nama_layanan: e.target.value,
                      });
                      validation.nama_layanan = null;
                    }}
                  />
                  <Input
                    type="text"
                    variant="bordered"
                    label="Harga"
                    placeholder="Masukkan Harga"
                    value={tempData.harga}
                    isInvalid={validation.harga ? true : false}
                    errorMessage={validation.harga}
                    onChange={(e) => {
                      setTempData({ ...tempData, harga: e.target.value });
                      validation.harga = null;
                    }}
                  />
                  <Input
                    type="text"
                    variant="bordered"
                    label="Satuan"
                    placeholder="Masukkan Satuan"
                    value={tempData.satuan}
                    isInvalid={validation.satuan ? true : false}
                    errorMessage={validation.satuan}
                    onChange={(e) => {
                      setTempData({ ...tempData, satuan: e.target.value });
                      validation.satuan = null;
                    }}
                  />
                </div>
                <Textarea
                  key="bordered"
                  variant="bordered"
                  label="Keterangan"
                  labelPlacement="inside"
                  placeholder="Masukkan Keterangan (Opsional)"
                  value={tempData.keterangan}
                  isInvalid={validation.keterangan ? true : false}
                  errorMessage={validation.keterangan}
                  onChange={(e) => {
                    setTempData({ ...tempData, keterangan: e.target.value });
                    validation.keterangan = null;
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
            <p>Apakah yakin ingin menghapus data Fasilitas ini?</p>
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

export default FasilitasBerbayarSM;
