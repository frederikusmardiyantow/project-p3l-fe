import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify";

const columns = [
    { name: "NO", uid: "no", width: "80px" },
    { name: "BULAN", uid: "bulan", width: "110px" },
    { name: "JUMLAH", uid: "jumlah", width: "250px" },
  ];


function CustBaruPerBulan() {
    const [tahunLaporan, setTahunLaporan] = useState(new Date().getFullYear());
    const [loadData, setLoadData] = useState(false);
    const [dataLaporan, setDataLaporan] = useState([]);
    const [totalCustomer, setTotalCustomer] = useState(0);
    const token = localStorage.getItem("apiKeyAdmin");

    async function laporanCustomerBaru() {
        setLoadData(true);
        await axios
          .get(`/laporan/customer-baru/${tahunLaporan}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const {data} = response.data;
            setTotalCustomer(data.total_customer);
            setDataLaporan(data.laporan);
          })
          .catch((error) => {
            toast.error(error.response.data);
          });
          setLoadData(false);
    }

    useEffect(() => {
        laporanCustomerBaru();
    }, [tahunLaporan, token]);

    const renderCell = useCallback((data, columnKey) => {
        switch (columnKey) {
          case "no":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.no}</p>
              </div>
            );
          case "bulan":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.bulan}</p>
              </div>
            );
          case "jumlah":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.jumlah_customer}</p>
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
            Laporan Customer Baru
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
        aria-label="Tabel Customer Baru"
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
            <TableRow key={item.no}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
          
        </TableBody>
      </Table>
      <p className="text-center text-xl">Total : {totalCustomer}</p>
      <p className="text-sm italic text-end me-14 mt-20">dicetak pada tanggal {new Date().toLocaleDateString()}</p>
        </div>
    </div>
  )
}

export default CustBaruPerBulan