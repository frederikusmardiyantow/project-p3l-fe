import { createContext, useState } from "react";

export const KamarContex = createContext();

// eslint-disable-next-line react/prop-types
function KamarProvider({children}) {
  const [jumlahDewasa, setJumlahDewasa] = useState("");
  const [jumlahAnak, setJumlahAnak] = useState("");
  const [jumlahKamar, setJumlahKamar] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(new Date(new Date()).setDate(checkIn.getDate() + 1)));
  const [totalHargaPesanan, setTotalHargaPesanan] = useState([]);

  // const addTotalHargaList = (hargaTotal, pesanan) => {
  //   // Temukan indeks di dalam array totalHargaPesanan berdasarkan id
  //   const index = totalHargaPesanan.findIndex((tampungan) => tampungan.id === pesanan.jenis_kamars.id);
    
  //   if (index !== -1) {
  //       // Jika id sudah ada, lakukan pembaruan pada array totalHargaPesanan
  //       const updatedTotalHargaPesanan = [...totalHargaPesanan];
  //       updatedTotalHargaPesanan[index].hargaTotal = hargaTotal;
  //       setTotalHargaPesanan(updatedTotalHargaPesanan);
  //   } else {
  //       // Jika id belum ada, tambahkan data baru ke array totalHargaPesanan
  //       console.log('masuk else');
  //       setTotalHargaPesanan([...totalHargaPesanan, {
  //         id: pesanan.jenis_kamars.id,
  //         hargaTotal: hargaTotal,
  //       }]);
  //   }
  // }
  
  return (
    <KamarContex.Provider
      value={{
        jumlahDewasa,
        setJumlahDewasa,
        jumlahAnak,
        setJumlahAnak,
        jumlahKamar,
        setJumlahKamar,
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
        totalHargaPesanan,
        setTotalHargaPesanan
      }}
    >
        {children}
    </KamarContex.Provider>
  );
}

export default KamarProvider;
