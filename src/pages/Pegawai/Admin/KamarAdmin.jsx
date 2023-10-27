/* eslint-disable react-hooks/exhaustive-deps */
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
} from "@nextui-org/react";
// import {columns, users} from "./data";
import { RiDeleteBin5Line } from "react-icons/ri";
import { GiStarFormation } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineSearch } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

// const statusColorMap = {
//   active: "success",
//   paused: "danger",
//   vacation: "warning",
// };
// const jenisKamars = [
//   { name: "Superior", uid: "superior" },
//   { name: "Double Deluxe", uid: "double_deluxe" },
//   { name: "Executive Deluxe", uid: "executive_deluxe" },
//   { name: "Junior Suite", uid: "junior_suite" },
// ];
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
  const [dataKamar, setDataKamar] = useState([]);
  const token = localStorage.getItem("apiKey");
  const navigation = useNavigate();
  const [loadData, setLoadData] = useState(false);
  const [isOpen, onOpenChange] = useState(false);
  const [tempData, setTempData] = useState({});
  const [loadSubmit, setLoadSubmit] = useState(false);
  const [tempId, setTempId] = useState("");
  const [validation, setValidation] = useState([]);
    const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterData, setFilterData] = useState("");

  const pages = Math.ceil(dataKamar.length / rowsPerPage);

  const dataFilter = dataKamar?.filter((item) => {
    const noKamar = item?.nomor_kamar.toString().toLowerCase();
    const jenisBed = item?.jenis_bed.toLowerCase();
    const jenisKamar = item?.jenis_kamars?.jenis_kamar.toLowerCase();
    const filter = filterData.toLowerCase();

    return (noKamar.includes(filter) || jenisBed.includes(filter) || jenisKamar.includes(filter));
  })

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
        navigation("/login");
        toast.error(error.response.data.message);
      });
    setLoadData(false);
  }
  async function getDataById(id){
    await axios
      .get(`/kamar/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // res = response;
        const {data} = response.data;
        toast.success(response.data.message);
        setTempData(data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  useEffect(() => {
    getDataAll();
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
      getDataAll(token);
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
            <p className="text-bold text-sm">{data.jenis_kamars.harga_dasar}</p>
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
                onClick={() => {
                  getDataById(data.id);
                  setTempId(data.id);
                  onOpenChange(true);
                }}
              >
                <BiEditAlt />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete data">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <RiDeleteBin5Line />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center gap-5 my-5">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Cari berdasarkan"
          size="sm"
          startContent={<MdOutlineSearch className="text-default-300" />}
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
            onClick={() => {setTempId(""); setTempData({}); onOpenChange(true)}}
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
            {!loadData && 
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
            }
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
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
      >
        <ModalContent className="p-1 pb-3">
          <ModalHeader className="flex flex-col gap-1">
            {tempId ? 'Ubah' : 'Tambah'} Kamar
          </ModalHeader>
          <ModalBody>
            <div>
              <form
                onSubmit={(e) => {
                  {tempId ? handleSubmit(e, "update") : handleSubmit(e, "add")}
                }}
                className="grid gap-3"
              >
                <Input
                  type="text"
                  variant="bordered"
                  label="Jenis Kamar"
                  value={tempData.id_jenis_kamar}
                  isInvalid={validation.id_jenis_kamar ? true : false}
                  errorMessage={validation.id_jenis_kamar}
                  onChange={(e) => {
                    setTempData({
                      ...tempData,
                      id_jenis_kamar: e.target.value,
                    });
                    validation.id_jenis_kamar = null;
                  }}
                />
                <Input
                  type="text"
                  variant="bordered"
                  label="Nomor Kamar"
                  value={tempData.nomor_kamar}
                  isInvalid={validation.nomor_kamar ? true : false}
                  errorMessage={validation.nomor_kamar}
                  onChange={(e) => {
                    setTempData({ ...tempData, nomor_kamar: e.target.value });
                    validation.nomor_kamar = null;
                  }}
                />
                <Input
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
                <Input
                  type="text"
                  variant="bordered"
                  label="Nomor Lantai"
                  value={tempData.nomor_lantai}
                  isInvalid={validation.nomor_lantai ? true : false}
                  errorMessage={validation.nomor_lantai}
                  onChange={(e) => {
                    setTempData({ ...tempData, nomor_lantai: e.target.value });
                    validation.nomor_lantai = null;
                  }}
                />
                <Input
                  type="text"
                  variant="bordered"
                  label="Smoking Area"
                  value={tempData.smoking_area}
                  isInvalid={validation.smoking_area ? true : false}
                  errorMessage={validation.smoking_area}
                  onChange={(e) => {
                    setTempData({ ...tempData, smoking_area: e.target.value });
                    validation.smoking_area = null;
                  }}
                />
                <Input
                  type="text"
                  variant="bordered"
                  label="Catatan"
                  value={tempData.catatan}
                  isInvalid={validation.catatan ? true : false}
                  errorMessage={validation.catatan}
                  onChange={(e) => {
                    setTempData({ ...tempData, catatan: e.target.value });
                    validation.catatan = null;
                  }}
                />
                <Button type="submit" isLoading={loadSubmit}>
                  Tambah Data
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
      <div className="h-[200vh]"></div>
    </div>
  );
}
