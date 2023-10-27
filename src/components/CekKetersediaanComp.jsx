import { Button, Select, SelectItem } from "@nextui-org/react";
import { Link } from "react-router-dom";
import InputDateComp from "./InputDateComp";
import { useEffect, useState } from "react";

const jumlahs = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
];

function CekKetersediaanComp() {
  const [selectOpenDewasa, setSelectOpenDewasa] = useState(false);
  const [selectOpenAnak, setSelectOpenAnak] = useState(false);
  const [selectOpenKamar, setSelectOpenKamar] = useState(false);
  const [jumlahDewasa, setJumlahDewasa] = useState("");

  useEffect(function () {
    window.addEventListener("scroll", () => {
      setSelectOpenAnak(false);
      setSelectOpenDewasa(false);
      setSelectOpenKamar(false);
    });
  }, []);

  return (
    <div className="h-max bg-blue-50 px-10 py-16">
      <p className="text-3xl text-center uppercase tracking-wide font-normal mb-9">
        Cek Ketersediaan Kamar {jumlahDewasa}
      </p>
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 items-center">
        <InputDateComp label="Check In" />
        <InputDateComp label="Check Out" />
        <Select
          variant="bordered"
          label="Jumlah Dewasa"
          placeholder="Pilih Jumlah Dewasa"
          onChange={(e) => setJumlahDewasa(e.target.value)}
          className="bg-white rounded-xl"
          isOpen={selectOpenDewasa}
          onClick={() => setSelectOpenDewasa(!selectOpenDewasa)}
        >
          {jumlahs.map((jumlah) => (
            <SelectItem
              key={jumlah.value}
              value={jumlah.value}
              onClick={() => setSelectOpenDewasa(!selectOpenDewasa)}
            >
              {jumlah.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          variant="bordered"
          label="Jumlah Anak"
          placeholder="Pilih Jumlah Anak"
          className="bg-white rounded-xl"
          isOpen={selectOpenAnak}
          onClick={() => setSelectOpenAnak(!selectOpenAnak)}
        >
          {jumlahs.map((jumlah) => (
            <SelectItem
              key={jumlah.value}
              value={jumlah.value}
              onClick={() => setSelectOpenAnak(!selectOpenAnak)}
            >
              {jumlah.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          variant="bordered"
          label="Jumlah Kamar"
          placeholder="Pilih Jumlah Kamar"
          className="bg-white rounded-xl"
          isOpen={selectOpenKamar}
          onClick={() => setSelectOpenKamar(!selectOpenKamar)}
        >
          {jumlahs.map((jumlah) => (
            <SelectItem
              key={jumlah.value}
              value={jumlah.value}
              onClick={() => setSelectOpenKamar(!selectOpenKamar)}
            >
              {jumlah.label}
            </SelectItem>
          ))}
        </Select>
        <Button className="bg-primary hover:bg-secondary text-slate-100 font-medium">
          Cari
        </Button>
        {/* <Calendar onChange={onChange} value={value}/> */}
      </div>
      <p className="text-center mt-7 italic">
        Ingin memesan kamar lebih dari 10?
        <Link to="/kamar">
          <span className="not-italic font-medium"> Hubungi Kami</span>
        </Link>
      </p>
    </div>
  );
}

export default CekKetersediaanComp;
