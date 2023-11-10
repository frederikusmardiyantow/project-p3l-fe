import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

// eslint-disable-next-line react/prop-types
function ModalKonfYesNo({ openKonfirm, setOpenKonfirm, onClickNo, onClickYes, isLoading, pesan = "Apakah data-data sudah yakin benar?" }) {
  return (
    <Modal
      backdrop="opaque"
      isOpen={openKonfirm}
      onOpenChange={setOpenKonfirm}
      placement="top"
      isDismissable={false}
      radius="2xl"
      classNames={{
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        //   base: "border-[#292f46] ",
        header: "bg-blue-600 text-white",
        //   footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
      
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 "></ModalHeader>
        <ModalBody>
          <p>{pesan}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" variant="light" onClick={onClickNo}>
            Tidak
          </Button>
          <Button
            className="bg-red-500 text-white font-medium shadow-lg shadow-indigo-500/20"
            onClick={onClickYes} isLoading={isLoading}
          >
            Ya
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalKonfYesNo;
