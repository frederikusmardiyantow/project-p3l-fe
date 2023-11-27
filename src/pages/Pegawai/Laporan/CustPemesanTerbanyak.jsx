import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify";
import FormatCurrency from "../../../utils/FormatCurrency";

const columns = [
    { name: "NAMA CUSTOMER", uid: "nama_customer", width: "120px" },
    { name: "JUMLAH RESERVASI", uid: "jumlah_reservasi", width: "80px" },
    { name: "TOTAL PEMBAYARAN", uid: "total_pembayaran", width: "250px" },
];

function CustPemesanTerbanyak() {
    const [tahunLaporan, setTahunLaporan] = useState(new Date().getFullYear());
    const [loadData, setLoadData] = useState(false);
    const [dataLaporan, setDataLaporan] = useState([]);
    const token = localStorage.getItem("apiKeyAdmin");

    async function laporanPemesanTerbanyak() {
        setLoadData(true);
        await axios
          .get(`/laporan/customer/reservasi-terbanyak/${tahunLaporan}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const {data} = response.data;
            setDataLaporan(data);
          })
          .catch((error) => {
            toast.error(error.response.data);
          });
          setLoadData(false);
    }

    useEffect(() => {
        laporanPemesanTerbanyak();
    }, [tahunLaporan, token]);

    const renderCell = useCallback((data, columnKey) => {
        switch (columnKey) {
          case "nama_customer":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.nama_customer}</p>
              </div>
            );
          case "jumlah_reservasi":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.jumlah_reservasi}</p>
              </div>
            );
          case "total_pembayaran":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.total_harga && FormatCurrency(data.total_harga)}</p>
              </div>
            );
          default:
            return null;
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

  return (
    <div>
        <p className="text-4xl font-medium pb-4 !mb-7 border-b-1 border-gray-400 uppercase text-center">
            Laporan 5 Customer Reservasi Terbanyak
        </p>
        <label className="flex items-center text-default-800 text-lg">
          Periode Tahun :
          <select
            className="bg-transparent outline-none"
            onChange={(e) => setTahunLaporan(e.target.value)}
            defaultChecked={tahunLaporan}
          >
            {Array.from({ length: new Date().getFullYear() - 2019 }, (_, index) => new Date().getFullYear() - index).map((tahun) => (
                <option key={tahun}>
                    {tahun}
                </option>
            ))}
          </select>
        </label>
        <div>
        <Table
        aria-label="Tabel Pemesan Terbanyak"
        removeWrapper
        color="default"
        selectionMode="single"
        classNames={{
          th: [
            "bg-transparent",
            "text-default-500",
            "border-b",
            "border-divider",
            "text-center"
          ],
          table: [
            "border-1"
          ]
        }}
        className="bg-white py-3 px-2 my-2 shadow-md rounded-sm w-max mx-auto"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              width={column.width || "auto"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={dataLaporan}
          isLoading={loadData}
          emptyContent={!loadData ? "Tidak ada Laporan untuk ditampilkan" : "  "}
          loadingContent={<Spinner />}
          loadingState={loadData}
        >
          {(item) => (
            <TableRow key={item.id_customer}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
          
        </TableBody>
      </Table>
      <p className="text-sm italic text-end me-14 mt-20">dicetak pada tanggal {new Date().toLocaleDateString()}</p>
        </div>
    </div>
  )
}

export default CustPemesanTerbanyak