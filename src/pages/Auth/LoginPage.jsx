import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputComp from "../../components/InputComp";
import { BiSolidLockAlt } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { toast } from "react-toastify";

const loginUser = async (credentials) => {
    let res = null;

    await axios.post('/login', credentials, {
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

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [validation, setValidation] = useState([]);

  const navigation = useNavigate()

  // function refreshPage() {
  //   window.location.reload(false);
  // }

  function handleUsernameInput(e) {
    setEmail(e.target.value);
  }
  function handlePasswordInput(e) {
    setPassword(e.target.value);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setLoad(true);
    const response = await loginUser({
      email,
      password,
    });
    setLoad(false);
    if (response.data.status === "T") {
      toast.success(response.data.message);
      localStorage.setItem('apiKey', response.data.data.authorization.token);
      navigation('/');
    } else {
      setValidation(response.data.message);
      toast.error(response.data.message);
      // refreshPage();
    }
  }

  return (
    <div className="bg-login-bg h-screen bg-no-repeat bg-cover p-10 flex flex-col gap-10">
      <div className="">
        <Link to="/">
          <img
            src="GAH-horizontal-white.png"
            alt="logo"
            className="w-72 drop-shadow-logo-shadow"
          />
        </Link>
      </div>
      <div className="flex justify-end md:me-3">
        <div className="bg-[rgba(0,76,189,.8)] p-4 rounded-lg shadow-inner w-full md:w-2/5 border-2 border-solid border-slate-200 hover:border-2 hover:border-solid hover:border-white">
          <div className="bg-[rgba(0,76,100,.1)] rounded-lg">
            <p className="text-4xl font-bold text-slate-50 text-center py-4 border-b-2">
              LOGIN
            </p>
            <p className="my-3 text-center text-slate-300">
              silakan melakukan login dengan akun yang terverifikasi.
            </p>
            <form
              className="flex flex-col px-3 pt-3"
            >
              <InputComp
                id="email"
                name="Email"
                placeholder="Masukkan Email"
                value={email}
                onChange={handleUsernameInput}
                validation={validation.email && validation.email[0] }
              >
                <BsFillPersonFill className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <InputComp
                type="password"
                id="password"
                name="Password"
                placeholder="Masukkan Password"
                autoComplete="off"
                className="mt-3"
                value={password}
                onChange={handlePasswordInput}
                validation={validation.password && validation.password[0] }
              >
                <BiSolidLockAlt className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
              <p className="text-end text-slate-300 mb-3 "><Link to="/forgetPassword">Lupa Password?</Link></p>
              <Button color="secondary" isLoading={load} onClick={handleSubmit} className="text-primary font-semibold hover:text-white">
                Login
              </Button>
            </form>
            <p className="text-center pt-3 pb-1 text-slate-300">
              Belum memiliki akun? <Link to="/register" className="hover:font-semibold">Daftar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
