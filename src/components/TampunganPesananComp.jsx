/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
// import assets from "../assets";
import FormatCurrency from "../utils/FormatCurrency";
import ModalKonfYesNo from "./ModalKonfYesNo";
// import { KamarContex } from "../contex/KamarContex";

// eslint-disable-next-line react/prop-types
function TampunganPesananComp({pesanan, tampunganPesanan, setTampunganPesanan, jumlahMalam, totalHargaList, setTotalHargaList}) {
    // const {addTotalHargaList} = useContext(KamarContex);
    const [jumlahPesanan, setJumlahPesanan] = useState(1);
    const [konfirmBatalAmbil, setKonfirmBatalAmbil] = useState(false);
    const [tempKeyPesanan, setTempKeyPesanan] = useState({}); //untuk menampung key sebagai bantuan untuk hapus dari keranjang (untuk menghapus dari array tampunganPesanan)
    const [loadingKonfirm, setLoadingKonfirm] = useState(false);
    const hargaTotal = pesanan.harga_saat_ini * jumlahPesanan * jumlahMalam;

    function handleKurangJmlPesanan(pesanan) {
        if(jumlahPesanan != 1){
          setJumlahPesanan(jumlahPesanan - 1)
        }else{
          setTempKeyPesanan(pesanan);
          setKonfirmBatalAmbil(true);
        }
    }
    function handleTambahJmlPesanan(pesanan) {
        if(pesanan.jumlah_kamar != jumlahPesanan) {
            setJumlahPesanan(jumlahPesanan + 1);
        }
    }
    function handleBatalAmbil(e) {
        e.preventDefault();
        setLoadingKonfirm(true);
        setTampunganPesanan(tampunganPesanan.filter(fil => fil.jenis_kamar !== tempKeyPesanan.jenis_kamar))
        setTotalHargaList(totalHargaList.filter(fil => fil.id !== tempKeyPesanan.jenis_kamars.id))
        setLoadingKonfirm(false);
        setTempKeyPesanan({}); //reset tempKeyPesanannya lg
        setKonfirmBatalAmbil(false);
    }

    const addTotalHargaList = (hargaTotal, jumlahPesanan, pesanan) => {
        const index = totalHargaList.findIndex(
        (list) => list.id === pesanan.jenis_kamars.id
        );
    
        if (index !== -1) {
            const updatedHargaTotal = [...totalHargaList];
            updatedHargaTotal[index].hargaTotal = hargaTotal;
            updatedHargaTotal[index].jumlahPesanan = jumlahPesanan;
            setTotalHargaList(updatedHargaTotal);
        } else {
        setTotalHargaList([
            ...totalHargaList,
            {
            id: pesanan.jenis_kamars?.id,
            jumlahPesanan: jumlahPesanan,
            hargaTotal: hargaTotal,
            hargaPerMalam: pesanan.harga_saat_ini,
            },
        ]);
        }
    };

    useEffect(() => {
        addTotalHargaList(hargaTotal, jumlahPesanan, pesanan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hargaTotal]);

    // const tempTotal = tampunganPesanan?.reduce((total, pesanan) => {
    //     const hargaPesanan = pesanan.harga_saat_ini * jumlahPesanan * jumlahMalam;
    //     return total + hargaPesanan;
    // }, 0);

    // addTotalHargaList(hargaTotal, pesanan);
      
    // setTotalHargaPesanan(totalHargaPesanan + (pesanan.harga_saat_ini * jumlahPesanan * jumlahMalam));

  return (
        <div
        className="grid grid-cols-[max-content_minmax(30px,_1fr)_max-content] gap-3 border-b-2 p-2 mb-2"
        // key={key}
        >
        <div className="">
            <img src={pesanan.jenis_kamars.gambar} alt="kamar" className="w-24 rounded-xl" />
        </div>
        <div>
            <p className="font-medium text-[18px]">{pesanan.jenis_kamar}</p>
            <p className="text-sm">{jumlahMalam} malam</p>
            <div className="flex gap-2 w-max rounded-md items-center my-1 border-1">
            <button
                className="w-8 h-8 bg-gray-200 rounded-s-md font-bold"
                onClick={() => {
                handleKurangJmlPesanan(pesanan);
                }}
            >
                -
            </button>
            <p className="w-8 text-center ">{jumlahPesanan} x</p>
            <button
                className="w-8 h-8 bg-gray-200 rounded-e-md font-bold"
                onClick={() => {handleTambahJmlPesanan(pesanan)}}
            >
                +
            </button>
            </div>
        </div>
        <div className="text-end items-center h-full flex ">
            <p className="font-medium text-[19px]">
            {FormatCurrency(hargaTotal)}
            </p>
        </div>
        <ModalKonfYesNo openKonfirm={konfirmBatalAmbil} setOpenKonfirm={setKonfirmBatalAmbil} onClickNo={() => setKonfirmBatalAmbil(false)} onClickYes={(e) => {handleBatalAmbil(e)}} isLoading={loadingKonfirm} pesan="Yakin membatalkan kamar ini?"/>
        </div>
    
  );
}

export default TampunganPesananComp;
