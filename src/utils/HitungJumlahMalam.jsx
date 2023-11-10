import { differenceInCalendarDays } from "date-fns";

// format tanggalAkhir dan tanggal Awal harus yyyy-mm-dd dan format date 
// contoh: tanggalAkhir = new Date('2023-11-01')
function HitungJumlahMalam(tanggalAkhir, tanggalAwal) {
  const selisihHari = differenceInCalendarDays(tanggalAkhir, tanggalAwal);
  return selisihHari;
}

export default HitungJumlahMalam;
