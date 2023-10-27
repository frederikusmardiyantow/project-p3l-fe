import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const requestEmail = async (req) => {
    let res = null;
  
    await axios
      .post("/forget/request", req, {
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

function ForgetPassAdmin() {
  const [email, setEmail] = useState("");
  const [load, setLoad] = useState(false);
  const [isOpen, onOpenChange] = useState(false);
  const navigation = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoad(true);
    const response = await requestEmail({
      email,
      role: "pegawai",
    });
    setLoad(false);
    if (response.data.status === "T") {
      //   toast.success(response.data.message);
      onOpenChange(true);
      //   navigation("/");
    } else {
      toast.error(response.data.message);
      // refreshPage();
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-4">
              Lupa Password
            </h2>
            <p className="text-center text-gray-500">
              Masukkan Email untuk mereset password!
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {load? "Tunggu Sebentar..." : "Kirim Email"}
              </button>
            </div>
          </form>
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

export default ForgetPassAdmin;
