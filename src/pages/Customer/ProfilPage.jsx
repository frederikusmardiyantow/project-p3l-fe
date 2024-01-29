import { Avatar, Button, Chip, Input, Textarea } from "@nextui-org/react";
import NavbarComp from "../../components/NavbarComp";
import { BsCardHeading, BsPersonVcard, BsStarFill } from "react-icons/bs";
import { BiSolidLock, BiUser } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { PiPhoneDisconnectLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormatDate from "../../utils/FormatDate";
import FormatDateTime from "../../utils/FormatDateTime";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Footer from "../../components/FooterComp";
import ModalKonfYesNo from "../../components/ModalKonfYesNo";

const ubahProfil = async (request, token) => {
  let res = null;

  await axios
    .put("/ubahProfile", request, {
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
const ubahPassword = async (request, token) => {
  let res = null;

  await axios
    .post("/ubahPassword", request, {
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

function ProfilPage() {
  const [password_lama, setPasswordLama] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassConf] = useState("");
  const [data, setData] = useState({});
  const [load, setLoad] = useState(false);
  const [loadUbah, setLoadUbah] = useState(false);
  const [validation, setValidation] = useState([]);
  // let nama = null;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disabelInput, setDisabelInput] = useState(true);
  const [konfirmEdit, setKonfirmEdit] = useState(false);
  const [loadingKonfirm, setLoadingKonfirm] = useState(false);

  const token = localStorage.getItem("apiKey");
  const navigation = useNavigate();

  useEffect(() => {

    async function fetchData() {
      await axios
        .get(`/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // res = response;
          const { data } = response.data;
          const {
            nama_customer,
            email,
            jenis_identitas,
            no_identitas,
            no_telp,
            alamat,
            created_at,
            updated_at,
          } = data;
          setData({
            nama_customer,
            email,
            jenis_identitas,
            no_identitas,
            no_telp,
            alamat,
            created_at,
            updated_at,
          });
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          navigation("/");
        });
    }
    fetchData();
  }, [navigation, token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoad(true);
    const response = await ubahProfil(
      {
        jenis_customer: "P",
        nama_customer: data.nama_customer,
        no_identitas: data.no_identitas,
        jenis_identitas: data.jenis_identitas,
        no_telp: data.no_telp,
        email: data.email,
        alamat: data.alamat,
        flag_stat: 1,
      },
      token
    );
    setLoad(false);
    if (response.data.status === "T") {
      setLoadingKonfirm(false);
      setKonfirmEdit(false);
      toast.success(response.data.message);
    } else {
      setKonfirmEdit(false);
      setValidation(response.data.message);
      toast.error(response.data.message);
      // refreshPage();
    }
  }

  async function handleUbahPassword(e) {
    e.preventDefault();
    setLoadUbah(true);
    const response = await ubahPassword(
      {
        password_lama,
        password,
        password_confirmation,
      },
      token
    );
    setLoadUbah(false);
    if (response.data.status === "T") {
      toast.success(response.data.message);
      onOpenChange(false);
      setPasswordLama("");
      setPassword("");
      setPassConf("");
      setValidation([]);
    } else {
      setValidation(response.data.message);
      toast.error(response.data.message);
      // refreshPage();
    }
  }

  function handleKonfirmEdit(e){
    e.preventDefault();
    setLoadingKonfirm(false);
    setKonfirmEdit(true);
    setDisabelInput(true);
  }

  return (
    <>
      <div className="relative">
        <NavbarComp kelas="absolute" />
        <div className="h-[700px] md:h-[500px] bg-[url('https://project-p3l-fe.vercel.app/bg-profil.jpg')] bg-cover bg-no-repeat bg-fixed"></div>

        <div className="justify-center flex top-40 absolute w-full">
          <div className="flex flex-col md:flex-row w-3/4 gap-5 md:gap-10 ">
            <div className="w-full md:w-[30%] justify-center text-center">
              <Avatar
                isBordered
                radius="lg"
                src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                className="h-[200px] w-3/4 mx-auto"
              />
              <Button
                className="bg-secondary hover:bg-orange-500 text-primary font-medium w-3/4 mt-3"
                size="sm"
                onPress={onOpen}
              >
                Ubah Password
              </Button>
            </div>
            <div className="w-full md:w-[70%] text-white font-bold text-[50px] flex flex-col">
              {data.nama_customer}
              <div className=" mt-5 flex flex-col gap-2">
                <Chip
                  startContent={<BsStarFill />}
                  variant="faded"
                  color="warning"
                  size="lg"
                >
                  Master
                </Chip>
                <Chip
                  color="success"
                  variant="dot"
                  className="text-white font-medium"
                >
                  Bergabung sejak{" "}
                  {data?.created_at && FormatDate(new Date(data?.created_at))}
                </Chip>
                <Chip
                  color="warning"
                  variant="dot"
                  className="text-white font-medium italic"
                >
                  Terakhir diubah{" "}
                  {data?.updated_at &&
                    FormatDateTime(new Date(data?.updated_at))}
                </Chip>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[100vh] relative">
          <div className="h-max bg-slate-50 mx-auto w-[90%] md:w-3/4 absolute inset-x-0 -top-16 rounded-xl p-5 gap-8 flex flex-col shadow-md">
            <div>
              <p className="text-xl font-bold border-b-1 border-solid border-stone-400 pb-3 mb-3">
                Data Diri
              </p>
              <div className="flex flex-wrap md:flex-nowrap gap-5">
                <Input
                  type="text"
                  isDisabled={disabelInput}
                  variant="underlined"
                  label="Nama Lengkap"
                  startContent={
                    <BiUser
                      className={`${
                        validation.nama_customer && "text-red-600"
                      }`}
                    />
                  }
                  placeholder="Masukkan Nama Panjang"
                  isInvalid={validation.nama_customer ? true : false}
                  errorMessage={validation.nama_customer}
                  value={data.nama_customer}
                  onChange={(e) => {
                    setData({ ...data, nama_customer: e.target.value });
                    validation.nama_customer = null;
                  }}
                />
                {/* <Input
                  type="text"
                  variant="underlined"
                  label="Nama Pendek"
                  startContent={<BiUserVoice />}
                  placeholder="Masukkan Nama Pendek"
                /> */}
                <Input
                  type="email"
                  isDisabled={disabelInput}
                  variant="underlined"
                  label="Email"
                  startContent={
                    <MdOutlineEmail
                      className={`${validation.email && "text-red-600"}`}
                    />
                  }
                  placeholder="Masukkan Email"
                  isInvalid={validation.email ? true : false}
                  errorMessage={validation.email}
                  value={data.email}
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                    validation.email = null;
                  }}
                />
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-5">
                <Input
                  type="text"
                  isDisabled={disabelInput}
                  variant="underlined"
                  label="Jenis Identitas"
                  startContent={
                    <BsPersonVcard
                      className={`${
                        validation.jenis_identitas && "text-red-600"
                      }`}
                    />
                  }
                  isInvalid={validation.jenis_identitas ? true : false}
                  errorMessage={validation.jenis_identitas}
                  value={data.jenis_identitas}
                  onChange={(e) => {
                    setData({ ...data, jenis_identitas: e.target.value });
                    validation.jenis_identitas = null;
                  }}
                />
                <Input
                  type="text"
                  isDisabled={disabelInput}
                  variant="underlined"
                  label="Nomor Identitas"
                  startContent={
                    <BsCardHeading
                      className={`${validation.no_identitas && "text-red-600"}`}
                    />
                  }
                  isInvalid={validation.no_identitas ? true : false}
                  errorMessage={validation.no_identitas}
                  value={data.no_identitas}
                  onChange={(e) => {
                    setData({ ...data, no_identitas: e.target.value });
                    validation.no_identitas = null;
                  }}
                />
                <Input
                  type="text"
                  isDisabled={disabelInput}
                  variant="underlined"
                  label="Nomor Telepon"
                  startContent={
                    <PiPhoneDisconnectLight
                      className={`${validation.no_telp && "text-red-600"}`}
                    />
                  }
                  isInvalid={validation.no_telp ? true : false}
                  errorMessage={validation.no_telp}
                  value={data.no_telp}
                  onChange={(e) => {
                    setData({ ...data, no_telp: e.target.value });
                    validation.no_telp = null;
                  }}
                />
              </div>
              <Textarea
                key="underlined"
                isDisabled={disabelInput}
                variant="underlined"
                label="Alamat"
                labelPlacement="inside"
                placeholder="Masukkan Alamat"
                isInvalid={validation.alamat ? true : false}
                errorMessage={validation.alamat}
                value={data.alamat}
                onChange={(e) => {
                  setData({ ...data, alamat: e.target.value });
                  validation.alamat = null;
                }}
                // className="col-span-12 md:col-span-6 mt-3"
              />
            </div>
            <div>
              <p className="text-xl font-bold border-b-1 border-solid border-stone-400 pb-3 mb-3">
                Data Tambahan
              </p>
              <p className="italic text-center">
                saat ini data tambahan belum diperlukan
              </p>
            </div>
            {disabelInput === false ?
            <div className="flex justify-center">
              <Button
                className="w-2/6"
                color="primary"
                onClick={() => setDisabelInput(true)}
                isLoading={load}
              >
                Batal
              </Button>
              <Button
                className="w-2/6"
                color="primary"
                onClick={(e) => handleKonfirmEdit(e)}
                isLoading={load}
              >
                Simpan Data
              </Button>
            </div> :  
            <div className="flex justify-center">
            <Button
              className="w-2/6"
              color="primary"
              onClick={() => setDisabelInput(false)}
              isLoading={load}
            >
              Ubah Data
            </Button>
          </div>
            }
          </div>
        </div>
        <Footer/>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        hideCloseButton="true"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-primary text-white mb-3">
                Ubah Password
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={<BiSolidLock />}
                  isInvalid={validation.password_lama ? true : false}
                  errorMessage={validation.password_lama}
                  label="Password Lama"
                  type="password"
                  value={password_lama}
                  onChange={(e) => {
                    setPasswordLama(e.target.value);
                    validation.password_lama = null;
                  }}
                  placeholder="Masukkan Password Lama"
                  variant="bordered"
                />
                <Input
                  endContent={<BiSolidLock />}
                  isInvalid={validation.password ? true : false}
                  errorMessage={validation.password}
                  label="Password Baru"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validation.password = null;
                  }}
                  placeholder="Masukkan Password Baru"
                  type="password"
                  variant="bordered"
                />
                <Input
                  endContent={<BiSolidLock />}
                  isInvalid={validation.password_confirmation ? true : false}
                  errorMessage={validation.password_confirmation}
                  label="Konfirmasi Password"
                  value={password_confirmation}
                  onChange={(e) => {
                    setPassConf(e.target.value);
                    validation.password_confirmation = null;
                  }}
                  placeholder="Masukkan Password Kembali"
                  type="password"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Tutup
                </Button>
                <Button
                  color="primary"
                  onClick={handleUbahPassword}
                  isLoading={loadUbah}
                >
                  Ubah
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ModalKonfYesNo openKonfirm={konfirmEdit} setOpenKonfirm={setKonfirmEdit} onClickNo={() => setKonfirmEdit(false)} onClickYes={(e) => {handleSubmit(e, "update"); setLoadingKonfirm(true)}} isLoading={loadingKonfirm} />
    </>
  );
}

export default ProfilPage;
