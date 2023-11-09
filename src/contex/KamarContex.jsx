import { createContext, useState } from "react";

export const KamarContex = createContext();

// eslint-disable-next-line react/prop-types
function KamarProvider({children}) {
  const [jumlahDewasa, setJumlahDewasa] = useState("");
  const [jumlahAnak, setJumlahAnak] = useState("");
  const [jumlahKamar, setJumlahKamar] = useState("");
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(new Date(new Date()).setDate(checkIn.getDate() + 1)));
  
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
        setCheckOut
      }}
    >
        {children}
    </KamarContex.Provider>
  );
}

export default KamarProvider;
