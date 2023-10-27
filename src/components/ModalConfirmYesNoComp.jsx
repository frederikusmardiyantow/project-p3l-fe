// import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// function ModalConfirmYesNoComp(isOpen, onOpenChange, namaData, idHapus, token) {
    
//     const deleteData = async (id) => {

//         await axios
//           .delete(`/kamar/${id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((response) => {
//             toast.success(response.data.message);
//           })
//           .catch((error) => {
//             toast.error(error.response.data.message);
//           });
//       };

//   return (
//     <Modal
//         backdrop="opaque"
//         isOpen="true"
//         onOpenChange={onOpenChange}
//         placement="center"
//         isDismissable={false}
//         radius="2xl"
//         classNames={{
//           body: "py-6",
//           backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
//           //   base: "border-[#292f46] ",
//           header: "bg-red-600 text-white",
//           //   footer: "border-t-[1px] border-[#292f46]",
//           closeButton: "hover:bg-white/5 active:bg-white/10",
//         }}
//       >
//         <ModalContent>
//           <ModalHeader className="flex flex-col gap-1 "></ModalHeader>
//           <ModalBody>
//             <p>
//               Apakah yakin ingin menghapus data {namaData} ini?
//             </p>
//           </ModalBody>
//           <ModalFooter>
//           <Button color="secondary" variant="light" onClick={!isOpen}>
//                   Tidak
//                 </Button>
//             <Button
//               className="bg-red-500 text-white font-medium shadow-lg shadow-indigo-500/20"
//               onClick={() => {() => deleteData(idHapus)
//               }}
//             >
//               Ya
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//   )
// }

// export default ModalConfirmYesNoComp