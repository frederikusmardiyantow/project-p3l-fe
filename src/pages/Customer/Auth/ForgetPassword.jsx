import { Link, useNavigate } from "react-router-dom";
import InputComp from "../../../components/InputComp";
import { BsArrowLeftShort, BsFillPersonFill } from "react-icons/bs";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const requestEmail = async (credentials) => {
  let res = null;

  await axios
    .post("/forget/request", credentials, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      res = response;
    })
    .catch((error) => {
      res = error.response;
    });

  return res;
};

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [load, setLoad] = useState(false);
  const [validation, setValidation] = useState([]);
  const [isOpen, onOpenChange] = useState(false);

  const navigation = useNavigate();

  function handleEmailInput(e) {
    setEmail(e.target.value);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setLoad(true);
    const response = await requestEmail({
      email,
      role: "customer",
    });
    setLoad(false);
    if (response.data.status === "T") {
      //   toast.success(response.data.message);
      onOpenChange(true);
      //   navigation("/");
    } else {
      setValidation(response.data.message);
      toast.error(response.data.message);
      // refreshPage();
    }
  }

  return (
    <>
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
        <div className="flex justify-end md:me-10 md:mt-10">
          <div className="bg-[rgba(0,76,189,.8)] p-4 rounded-lg shadow-inner w-full md:w-2/6 border-2 border-solid border-slate-200 hover:border-2 hover:border-solid hover:border-white">
            <div className="bg-[rgba(0,76,100,.1)] rounded-3xl">
              <Link to="/login">
                <div className="flex items-center text-white bg-blue-500 rounded-xl w-max px-2">
                  <BsArrowLeftShort className=" w-8 h-8 " />
                </div>
              </Link>
              <p className="my-3 text-center text-slate-300">
                masukkan email anda untuk mereset password.
              </p>
              <form className="flex flex-col px-3 pt-3">
                <InputComp
                  id="email"
                  name="Email"
                  placeholder="Masukkan Email"
                  value={email}
                  onChange={handleEmailInput}
                  validation={validation.email && validation.email[0]}
                >
                  <BsFillPersonFill className="absolute h-8 w-8 z-10 mx-3 border-1 border-solid border-primary text-primary rounded-full p-1" />
                </InputComp>
                <Button
                  color="secondary"
                  isLoading={load}
                  onClick={handleSubmit}
                  className="text-primary font-semibold hover:text-white my-4"
                >
                  Kirim Email
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        isDismissable={false}
        radius="2xl"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          //   base: "border-[#292f46] ",
          header: "bg-[#168900] text-white",
          //   footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 ">Berhasil..</ModalHeader>
          <ModalBody>
            <p>
              Permintaan reset password telah dikirim ke email{" "}
              <span className=" italic font-medium">{email}</span>.
              <br />
              Silakan cek email dan segera klik link yang tertera!
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-red-500 text-white font-medium shadow-lg shadow-indigo-500/20"
              onClick={() => {
                navigation("/");
              }}
            >
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ForgetPassword;
