import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const columns = [
    { name: "NO", uid: "no", width: "70px" },
    { name: "JENIS KAMAR", uid: "jenis_kamar", width: "150px" },
    { name: "GROUP", uid: "group", width: "80px" },
    { name: "PERSONAL", uid: "personal", width: "80px" },
    { name: "TOTAL", uid: "total", width: "100px" },
];

function JumlahTamu() {
    const [tahunLaporan, setTahunLaporan] = useState(new Date().getFullYear());
    const [bulanLaporan, setBulanLaporan] = useState(new Date().getMonth() + 1);
    const [loadData, setLoadData] = useState(false);
    const [dataLaporan, setDataLaporan] = useState([]);
    const token = localStorage.getItem("apiKeyAdmin");
    const [totalJumlahSemua, setTotalJumlahSemua] = useState(0);

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Grafik Jumlah Tamu',
          },
        },
      };
    const labels = dataLaporan.map((laporan) => (laporan.jenis_kamar));
    const dataGrafik = {
        labels,
        datasets: [
          {
            label: 'Personal',
            data: dataLaporan.map((laporan) => (laporan.P)),
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
          },
          {
            label: 'Group',
            data: dataLaporan.map((laporan) => (laporan.G)),
            backgroundColor: 'rgba(53, 162, 235, 0.8)',
          },
          {
            label: 'TOTAL',
            data: dataLaporan.map((laporan) => (laporan.jumlah)),
            backgroundColor: 'rgba(0, 171, 184, 0.8)',
          },
        ],
      };


    async function laporanPemesanTerbanyak() {
        setLoadData(true);
        await axios
          .get(`/laporan/jumlahTamu/${tahunLaporan}/${bulanLaporan}`, {
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
    }, [tahunLaporan, bulanLaporan, token]);

    useEffect(() => {
        // Calculate total pendapatan semua when dataLaporan changes
        const total = dataLaporan.reduce((acc, laporan) => acc + laporan.jumlah, 0);
        setTotalJumlahSemua(total);
    }, [dataLaporan]);

    const monthsArray = Array.from({ length: 12 }, (_, index) => ({
        value: index + 1,
        label: new Date(2000, index, 1).toLocaleString('default', { month: 'long' }),
      }));

    const renderCell = useCallback((data, columnKey) => {
        switch (columnKey) {
          case "no":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.id_jk}</p>
              </div>
            );
          case "jenis_kamar":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.jenis_kamar}</p>
              </div>
            );
          case "group":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.G}</p>
              </div>
            );
          case "personal":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.P}</p>
              </div>
            );
          case "total":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-sm">{data.jumlah}</p>
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
            Laporan Jumlah Tamu
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
        <label className="flex items-center text-default-800 text-lg">
          Periode Bulan : 
          <select
            className="bg-transparent outline-none"
            onChange={(e) => setBulanLaporan(e.target.value)}
            defaultChecked={tahunLaporan}
            defaultValue={bulanLaporan}
          >
            {monthsArray.map((month) => (
                <option key={month.value} value={month.value}>
                    {month.label}
                </option>
            ))}
          </select>
        </label>
        <div className="text-center h-96 mx-auto justify-center flex mb-5">
            <Bar options={options} data={dataGrafik}></Bar>
        </div>
        <div className="relative w-max mx-auto">
        <Table
        aria-label="Tabel Jumlah Tamu"
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
            <TableRow key={item.id_jk}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
          
        </TableBody>
      </Table>
      <div className="flex gap-3 absolute right-10 -bottom-10 text-xl">
        <p>TOTAL : </p>
        <p className="font-bold">{totalJumlahSemua}</p>
      </div>
      </div>
      <p className="text-sm italic text-end me-14 mt-20">dicetak pada tanggal {new Date().toLocaleDateString()}</p>
    </div>
  )
}

export default JumlahTamu