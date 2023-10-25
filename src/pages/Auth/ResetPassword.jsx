import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import InputComp from "../../components/InputComp";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { BiSolidLockAlt } from "react-icons/bi";

// const checkToken = async (request) => {
//   let res = null;

//   await axios
//   .get(`/password/reset/${request}`, {
//       headers: { "Content-Type": "application/json" },
//     })
//     .then((response) => {
//       res = response;
//     })
//     .catch((error) => {
//       res = error.response;
//     });
//     console.log(res);

//   return res;
// };
const ubahPassword = async (request, token) => {
  let res = null;

  await axios.post(`/forget/updatePassword/${token}`, request, {
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

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [password_confirmation, setPassConf] = useState("");
    const [load, setLoad] = useState(false);
    const [validation, setValidation] = useState([]);
    const {token} = useParams();
  
    const navigation = useNavigate();
  
    function handlePasswordInput(e) {
      setPassword(e.target.value);
    }
    function handleKonfPasswordInput(e) {
      setPassConf(e.target.value);
    }
    async function handleSubmit(e) {
      e.preventDefault();
      setLoad(true);
      // const response = await checkToken(token);
      const response = await ubahPassword({
        password,
        password_confirmation
      }, token);
      setLoad(false);
      if (response.data.status === "T") {
        toast.success(response.data.message);
        navigation("/login");
      } else {
        setValidation(response.data.message);
        toast.error(response.data.message);
        // refreshPage();
      }
    }

    useEffect(() => {
      async function fetchData() {
      await axios
        .get(`/password/reset/${token}`, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            // res = response;
            toast.success(response.data.message);
          })
          .catch((error) => {
            navigation("/");
            console.log('errorrr');
            toast.error(error.response);
          });
      // if (response.data.status === "T") {
      //   toast.success(response.data.message);
      // } else {
      //   toast.error(response.data.message);
      //   navigation("/");
      // }
    }
    fetchData()
  }, [navigation, token]);
  
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
        <div className="flex justify-center md:mt-10">
          <div className="bg-[rgba(0,76,189,.8)] p-4 rounded-lg shadow-inner w-full md:w-2/6 border-2 border-solid border-slate-200 hover:border-2 hover:border-solid hover:border-white">
            <div className="bg-[rgba(0,76,100,.1)] rounded-3xl">
              {/* <Link to="/login">
                <div className="flex items-center text-white bg-blue-500 rounded-xl w-max px-2">
                  <BsArrowLeftShort className=" w-8 h-8 " />
                </div>
              </Link> */}
              <p className="my-3 text-center text-slate-300">
                {/* masukkan email anda untuk mereset password.  */}
                {token} 
              </p>
              <form className="flex flex-col gap-3 px-3 pt-3">
              <InputComp
                type="password"
                id="password"
                name="Password"
                placeholder="Password Baru"
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
                placeholder="Konfirmasi Password"
                autoComplete="off"
                value={password_confirmation}
                onChange={handleKonfPasswordInput}
                validation={validation.password_confirmation && validation.password_confirmation[0] }
              >
                <BiSolidLockAlt className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
              </InputComp>
                <Button
                  color="secondary"
                  isLoading={load}
                  onClick={handleSubmit}
                  className="text-primary font-semibold hover:text-white my-4"
                >
                  Setel Ulang Password
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ResetPassword