import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Pagination,
    Select,
    SelectItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Textarea,
    User,
  } from "@nextui-org/react";
  import axios from "axios";
  import { useCallback, useEffect, useMemo, useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import { MdOutlineSearch } from "react-icons/md";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";
import FormatDate from "../../../utils/FormatDate";
import ModalKonfYesNo from "../../../components/ModalKonfYesNo";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { BiLayerPlus } from "react-icons/bi";
import { LuCalendarCheck2 } from "react-icons/lu";
  
  const columns = [
    { name: "NAMA PEMIMPIN GROUP", uid: "nama_customer" },
    { name: "NAMA INSTITUSI", uid: "nama_institusi" },
    { name: "JENIS IDENTITAS", uid: "jenis_identitas" },
    { name: "NO IDENTITAS", uid: "no_identitas" },
    { name: "NO TELP", uid: "no_telp" },
    { name: "ALAMAT", uid: "alamat" },
    { name: "TANGGAL DIDAFTARKAN", uid: "tgl_daftar" },
    { name: "AKSI", uid: "aksi" },
  ];
  
  const addData = async (request, token) => {
    let res;
    await axios
      .post("/register/group", request, {
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

function CustomerSM() {
    const [dataCustomer, setDataCustomer] = useState([]);
    const [loadData, setLoadData] = useState(false);
    const token = localStorage.getItem("apiKeyAdmin");
    const navigation = useNavigate();
    // const history = useHistory();
    const [tempData, setTempData] = useState({});
    const [loadSubmit, setLoadSubmit] = useState(false);
    const [tempId, setTempId] = useState(false);
    const [isOpen, onOpenChange] = useState(false);
    const [validation, setValidation] = useState([]);
    const [filterData, setFilterData] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectJenisIdentitas, setSelectJenisIdentitas] = useState(false);
    const [konfirmAdd, setKonfirmAdd] = useState(false);
    const [loadingKonfirm, setLoadingKonfirm] = useState(false);
  
    const dataFilter = dataCustomer?.filter((item) => {
      const namaCustomer = item?.nama_customer.toLowerCase();
      const namaInstitusi = item?.nama_institusi.toLowerCase();
      const email = item?.email.toLowerCase();
      const filter = filterData.toLowerCase();
  
      return (
        namaCustomer.includes(filter) ||
        namaInstitusi.includes(filter) ||
        email.includes(filter) 
      );
    });
  
    const pages = Math.ceil(dataFilter?.length / rowsPerPage);
  
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
  
    async function getDataAllGroup() {
      setLoadData(true);
      await axios
        .get(`/customer_group`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // res = response;
          const { data } = response.data;
          setDataCustomer(data.reverse());
          toast.success(response.data.message);
        })
        .catch((error) => {
          navigation("/loginAdm");
          toast.error(error.response.data.message);
        });
      setLoadData(false);
    }
    // async function getDataRiwayatTrxByCustomer(id) {
    //   await axios
    //     .get(`/transaksi/${id}`, {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then((response) => {
    //       // res = response;
    //       const { data } = response.data;
    //       setDataRiwayatTrxByCustomer(data.reverse());
    //       toast.success(response.data.message);
    //     })
    //     .catch((error) => {
    //       history.goBack();
    //       toast.error(error.response.data.message);
    //     });
    // }
    
    useEffect(() => {
      getDataAllGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    async function handleSubmit(e) {
      let response;
      e.preventDefault();
      setLoadSubmit(true);
        response = await addData(
            {
            ...tempData,
            jenis_customer: "G",
            flag_stat: 1,
            },
            token
        );
      setLoadSubmit(false);
      if (response.data.status === "T") {
        setLoadingKonfirm(false)
      setKonfirmAdd(false)
        getDataAllGroup();
        toast.success(response.data.message);
        setTempData({});
        setTempId("");
        onOpenChange(false);
      } else {
        setKonfirmAdd(false)
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
    // function clickBtnDetail(data) {
    //     setTempId(data.id);
    //     getDataRiwayatTrxByCustomer(data.id);
    //     setOpenDetail(true);
    //   }
    function handleKonfirmAdd(e){
      e.preventDefault();
      setLoadingKonfirm(false);
      setKonfirmAdd(true);
    }
  
    const renderCell = useCallback((data, columnKey) => {
      switch (columnKey) {
        case "nama_customer":
          return (
            <User
            avatarProps={{radius: "full", src: "https://i0.wp.com/www.howtomob.com/wp-content/uploads/2022/07/whatsapp-dp-for-boys-.jpg?ssl=1&resize=512%2C512"}}
            description={data.email}
            name={data.nama_customer}
          >
            {data.nama_customer}
          </User>
          );
        case "nama_institusi":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{data.nama_institusi}</p>
            </div>
          );
        case "jenis_identitas":
          return (
            <div className="flex flex-col">
                <p className="text-bold text-sm">{data.jenis_identitas}</p>
            </div>
          );
        case "no_identitas":
          return (
            <div className="flex flex-col">
                <p className="text-bold text-sm">{data.no_identitas}</p>
            </div>
          );
        case "no_telp":
          return (
            <div className="flex flex-col">
                <p className="text-bold text-sm">{data.no_telp}</p>
            </div>
          );
        case "alamat":
          return (
            <div className="flex flex-col">
                <p className="text-bold text-sm">{data.alamat}</p>
            </div>
          );
        case "tgl_daftar":
          return (
            <div className="flex flex-col">
                <p className="text-bold text-sm">{data?.created_at && FormatDate(new Date(data?.created_at))}</p>
            </div>
          );
        case "aksi":
          return (
            <div className="relative flex items-center gap-2">
              <span className="text-lg text-secondary cursor-pointer active:opacity-50" onClick={() => {}}>
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="light"
                    className="!p-0 !m-0 !w-5 min-w-0 hover:bg-none"
                    color="default"
                  >
                    <PiDotsThreeOutlineVerticalDuotone/>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu variant="flat" aria-label="Dropdown menu with shortcut">
                  <DropdownItem key="new" startContent={<BiLayerPlus/>} onClick={() => navigation(`/admin/customer/reservasi/${data?.id}/new`)}>
                    <p className="font-bold">Buat Reservasi</p>
                  </DropdownItem>
                  <DropdownItem key="read" startContent={<LuCalendarCheck2/>} onClick={() => navigation(`/admin/customer/riwayat/${data?.id}`)}>
                    <p className="font-bold">Riwayat Reservasi</p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              </span>
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
        CUSTOMER GROUP
      </p>
      <div className="flex justify-between items-center gap-5 my-5">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1 h-12 border-default-500 bg-white",
          }}
          placeholder="Cari berdasarkan Nama Customer, Nama Institusi, Email"
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
          Total {dataCustomer.length} customer group
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
        aria-label="Tabel Customer"
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
            {tempId ? "Ubah" : "Tambah"} Customer Group
          </ModalHeader>
          <ModalBody>
            <div>
              <form
                onSubmit={(e) => {
                  {
                    handleKonfirmAdd(e);
                  }
                }}
                className="grid gap-3"
              >
                <div className="flex gap-3">
                  <Input
                    type="text"
                    variant="bordered"
                    label="Nama Pemimpin Group"
                    placeholder="Masukkan Nama Pemimpin Group"
                    value={tempData.nama_customer}
                    isInvalid={validation.nama_customer ? true : false}
                    errorMessage={validation.nama_customer}
                    onChange={(e) => {
                      setTempData({
                        ...tempData,
                        nama_customer: e.target.value,
                      });
                      validation.nama_customer = null;
                    }}
                  />
                  <Input
                    type="text"
                    variant="bordered"
                    label="Nama Institusi"
                    placeholder="Masukkan Nama Institusi"
                    value={tempData.nama_institusi}
                    isInvalid={validation.nama_institusi ? true : false}
                    errorMessage={validation.nama_institusi}
                    onChange={(e) => {
                      setTempData({ ...tempData, nama_institusi: e.target.value });
                      validation.nama_institusi = null;
                    }}
                  />
                </div>
                  <Input
                    type="email"
                    variant="bordered"
                    label="Email"
                    placeholder="Masukkan Email"
                    value={tempData.email}
                    isInvalid={validation.email ? true : false}
                    errorMessage={validation.email}
                    onChange={(e) => {
                      setTempData({ ...tempData, email: e.target.value });
                      validation.email = null;
                    }}
                  />
                  <div className="flex gap-3">

                    <Select
                        variant="bordered"
                        label="Jenis Identitas"
                        placeholder="Pilih Jenis Identitas"
                        selectedKeys={
                        tempData?.jenis_identitas
                            ? [tempData?.jenis_identitas.toString()]
                            : []
                        }
                        isInvalid={validation.jenis_identitas ? true : false}
                        errorMessage={validation.jenis_identitas}
                        onChange={(e) => {
                        setTempData({
                            ...tempData,
                            jenis_identitas: e.target.value,
                        });
                        validation.jenis_identitas = null;
                        }}
                        // className="bg-white rounded-xl"
                        isOpen={selectJenisIdentitas}
                        onClick={() => setSelectJenisIdentitas(!selectJenisIdentitas)}
                    >
                        {[
                        { select: "KTP" },
                        { select: "SIM" },
                        { select: "KK" },
                        ].map((item) => (
                        <SelectItem
                            key={item.select}
                            value={item.select}
                            onClick={() => setSelectJenisIdentitas(!selectJenisIdentitas)}
                        >
                            {item.select}
                        </SelectItem>
                        ))}
                    </Select>
                    <Input
                        type="text"
                        variant="bordered"
                        label="Nomor Identitas"
                        placeholder="Masukkan Nomor Identitas"
                        value={tempData.no_identitas}
                        isInvalid={validation.no_identitas ? true : false}
                        errorMessage={validation.no_identitas}
                        onChange={(e) => {
                        setTempData({ ...tempData, no_identitas: e.target.value });
                        validation.no_identitas = null;
                        }}
                    />
                  </div>
                  <Input
                    type="text"
                    variant="bordered"
                    label="Nomor Telepon"
                    placeholder="Masukkan Nomor Telepon"
                    value={tempData.no_telp}
                    isInvalid={validation.no_telp ? true : false}
                    errorMessage={validation.no_telp}
                    onChange={(e) => {
                      setTempData({ ...tempData, no_telp: e.target.value });
                      validation.no_telp = null;
                    }}
                  />
                  <Textarea
                  key="bordered"
                  variant="bordered"
                  label="Alamat"
                  labelPlacement="inside"
                  placeholder="Masukkan Alamat"
                  value={tempData.alamat}
                  isInvalid={validation.alamat ? true : false}
                  errorMessage={validation.alamat}
                  onChange={(e) => {
                    setTempData({ ...tempData, alamat: e.target.value });
                    validation.alamat = null;
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
      <ModalKonfYesNo openKonfirm={konfirmAdd} setOpenKonfirm={setKonfirmAdd} onClickNo={() => setKonfirmAdd(false)} onClickYes={(e) => {handleSubmit(e, "add"); setLoadingKonfirm(true)}} isLoading={loadingKonfirm} />
    </>
  )
}

export default CustomerSM