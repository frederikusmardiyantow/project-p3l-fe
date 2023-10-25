import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputComp from "../../components/InputComp";
import { BiSolidLockAlt } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FaIdCard, FaPhoneSquareAlt } from "react-icons/fa";
import { BsFillPersonFill, BsFillPersonVcardFill } from "react-icons/bs";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { toast } from "react-toastify";

function RegisterPage() {
  const [nama_customer, setNama] = useState("");
  const [no_identitas, setNoIdentitas] = useState("");
  const [jenis_identitas, setJenisIdentitas] = useState("");
  const [no_telp, setNoTelp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setKonfPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [validation, setValidation] = useState([]);

  const navigation = useNavigate()


  // function refreshPage() {
  //   window.location.reload(false);
  // }

  function handleNamaInput(e) {
    setNama(e.target.value);
  }
  function handleEmailInput(e) {
    setEmail(e.target.value);
  }
  function handleJenisIdenInput(e) {
    setJenisIdentitas(e.target.value);
  }
  function handleNoIdenInput(e) {
    setNoIdentitas(e.target.value);
  }
  function handleNoTelpInput(e) {
    setNoTelp(e.target.value);
  }
  function handleAlamatInput(e) {
    setAlamat(e.target.value);
  }
  function handlePasswordInput(e) {
    setPassword(e.target.value);
  }
  function handleKonfPasswordInput(e) {
    setKonfPassword(e.target.value);
  }
  const registerUser = async (credentials) => {
    let res = null;

    await axios.post('/register', credentials, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      res = response;
    })
    .catch(error => {
      res = error.response;
    })
    
    return res;
  };
  async function handleSubmit(e) {
    
    e.preventDefault();
    setLoad(true);
    const response = await registerUser({
      jenis_customer: 'P',
      nama_customer,
      no_identitas,
      jenis_identitas,
      no_telp,
      alamat,
      email,
      password,
      password_confirmation,
      flag_stat: 1
    });
    setLoad(false);
    if (response.data.status === "T") {
      toast.success(response.data.message);
      navigation('/login');
    } else {
      setValidation(response.data.message);
      toast.error(response.data.message);
      // refreshPage();
    }
  }

  return (
    <div className="bg-login-bg bg-no-repeat bg-cover bg-fixed p-10 flex flex-col gap-10">
      <div className="flex justify-center">
        <Link to="/">
          <img
            src="GAH-horizontal-white.png"
            alt="logo"
            className="w-72 drop-shadow-logo-shadow"
          />
        </Link>
      </div>
      <div className="flex justify-center">
        <div className="bg-[rgba(0,76,189,.8)] p-4 rounded-lg shadow-inner w-full md:w-2/5 border-2 border-solid border-slate-200 hover:border-2 hover:border-solid hover:border-white">
          <div className="bg-[rgba(0,76,100,.1)] rounded-lg">
            <p className="text-4xl font-bold text-slate-50 text-center py-4 border-b-2 uppercase">
              Daftar
            </p>
            <p className="my-3 text-center text-slate-300">
              silakan mendaftar akun untuk menjadi member kami.
            </p>
            <form
              className="flex flex-col gap-5 px-3 pt-3"
            >
              <InputComp
                id="nama"
                name="Nama Lengkap"
                placeholder="Masukkan Nama"
                value={nama_customer}
                onChange={handleNamaInput}
                validation={validation.nama_customer && validation.nama_customer[0] }
              >
                <BsFillPersonFill className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <InputComp
                id="email"
                name="Email"
                placeholder="Masukkan Email"
                value={email}
                onChange={handleEmailInput}
                validation={validation.email && validation.email[0] }
              >
                <MdEmail className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <InputComp
                id="jenisIden"
                name="Jenis Identitas"
                placeholder="Masukkan Identitas"
                value={jenis_identitas}
                onChange={handleJenisIdenInput}
                validation={validation.jenis_identitas && validation.jenis_identitas[0] }
              >
                <BsFillPersonVcardFill className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <InputComp
                id="noIden"
                name="Nomor Identitas"
                placeholder="Masukkan Nomor Identitas"
                value={no_identitas}
                onChange={handleNoIdenInput}
                validation={validation.no_identitas && validation.no_identitas[0] }
              >
                <FaIdCard className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <InputComp
                id="noTelp"
                name="No Telp"
                placeholder="Masukkan No Telp"
                value={no_telp}
                onChange={handleNoTelpInput}
                validation={validation.no_telp && validation.no_telp[0] }
              >
                <FaPhoneSquareAlt className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <InputComp
                id="alamat"
                name="Alamat"
                placeholder="Masukkan Alamat"
                value={alamat}
                onChange={handleAlamatInput}
                validation={validation.alamat && validation.alamat[0] }
              >
                <FaPhoneSquareAlt className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <InputComp
                type="password"
                id="password"
                name="Password"
                placeholder="Masukkan Password"
                autoComplete="off"
                value={password}
                onChange={handlePasswordInput}
                validation={validation.password && validation.password[0] }
              >
                <BiSolidLockAlt className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <InputComp
                type="password"
                id="konfPassword"
                name="Konfirmasi Password"
                placeholder="Masukkan Konfirmasi Password"
                autoComplete="off"
                value={password_confirmation}
                onChange={handleKonfPasswordInput}
                validation={validation.password_confirmation && validation.password_confirmation[0] }
              >
                <BiSolidLockAlt className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <Button color="secondary" isLoading={load} onClick={handleSubmit} className="text-primary font-semibold hover:text-white">
                Daftar
              </Button>
            </form>
            <p className="text-center pt-3 pb-1 text-slate-300">
              Sudah memiliki akun? <Link to="/register" className="hover:font-semibold">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage