/* eslint-disable react/prop-types */
import { Button, Select, SelectItem } from "@nextui-org/react";
import { Link } from "react-router-dom";
import InputDateComp from "./InputDateComp";
import { useContext } from "react";
import { BsPerson } from "react-icons/bs";
import { MdOutlineChildCare } from "react-icons/md";
import { LuBedDouble } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { KamarContex } from "../contex/KamarContex";
import ConvertTo24HourFormat from "../utils/ConvertTo24HourFormat";

function CekKetersediaanComp({
  handleCari,
  tempCheckIn,
  tempCheckOut,
  setTempCheckIn,
  setTempCheckOut,
  setTempJumlahAnak,
  setTempJumlahDewasa,
  setTempJumlahKamar,
}) {
  const { jumlahAnak, jumlahDewasa, jumlahKamar } = useContext(KamarContex);
  const maxJumlahDewasa = 10;
  const maxJumlahAnak = 10;
  const maxJumlahKamar = 10;

  const GenerateAngka = (maxJumlah) => {
    return Array.from({ length: maxJumlah }, (_, index) => ({
      label: (index + 1).toString(),
      value: (index + 1).toString(),
    }));
  };

  return (
    <div className="h-max">
      <form onSubmit={(e) => handleCari(e)}>
        <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-6 mb-6 md:mb-0 gap-4 items-center">
          check in : {tempCheckIn.toLocaleDateString()}
          <InputDateComp
            label="Check In"
            value={tempCheckIn}
            setValue={setTempCheckIn}
          />
          {/* check out : {FormatDate(checkOut)} */}
          <InputDateComp
            label="Check Out"
            value={tempCheckOut}
            setValue={setTempCheckOut}
          />
          <Select
            key="dewasa"
            radius="sm"
            startContent={<BsPerson />}
            variant="bordered"
            color="primary"
            label="Jumlah Dewasa"
            placeholder="Pilih Jumlah Dewasa"
            defaultSelectedKeys={jumlahDewasa !== "" ? jumlahDewasa : undefined}
            // defaultSelectedKeys={jumlahDewasa !== "" ? jumlahDewasa : undefined}
            onChange={(e) => setTempJumlahDewasa(e.target.value)}
            required
          >
            {GenerateAngka(maxJumlahDewasa).map(
              (jumlah) =>
                jumlah.value !== "" && (
                  <SelectItem key={jumlah.value} value={jumlah.value}>
                    {jumlah.label + " Dewasa"}
                  </SelectItem>
                )
            )}
          </Select>
          <Select
            key="anak"
            radius="sm"
            startContent={<MdOutlineChildCare />}
            variant="bordered"
            color="primary"
            label="Jumlah Anak"
            defaultSelectedKeys={jumlahAnak !== "" ? jumlahAnak : undefined}
            placeholder="Pilih Jumlah Anak"
            onChange={(e) => setTempJumlahAnak(e.target.value)}
          >
            {GenerateAngka(maxJumlahAnak).map((jumlah) => (
              <SelectItem key={jumlah.value} value={jumlah.value}>
                {jumlah.label + " Anak"}
              </SelectItem>
            ))}
          </Select>
          <Select
            key="kamar"
            radius="sm"
            startContent={<LuBedDouble />}
            variant="bordered"
            color="primary"
            label="Jumlah Kamar"
            defaultSelectedKeys={jumlahKamar !== "" ? jumlahKamar : undefined}
            placeholder="Pilih Jumlah Kamar"
            onChange={(e) => setTempJumlahKamar(e.target.value)}
          >
            {GenerateAngka(maxJumlahKamar).map((jumlah) => (
              <SelectItem key={jumlah.value} value={jumlah.value}>
                {jumlah.label + " Kamar"}
              </SelectItem>
            ))}
          </Select>
          <Button
            className="bg-primary hover:bg-secondary text-slate-100 font-medium w-full h-12"
            radius="sm"
            type="submit"
          >
            <FiSearch />
            Cari
          </Button>
        </div>
      </form>
      <p className="text-center mt-7 italic">
        Ingin memesan kamar lebih dari 10?
        <Link to="/kamar">
          <span className="not-italic font-medium"> Hubungi Kami</span>
        </Link>
      </p>
      jumlah Dewasa : {jumlahDewasa}
      jumlahAnak : {jumlahAnak}
      jumlahKamar : {jumlahKamar}
    </div>
  );
}

export default CekKetersediaanComp;
