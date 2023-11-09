import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Pegawai/Admin/Dashboard";
import axios from "axios";
import KamarPage from "./pages/Customer/KamarPage";
import ScrollToTop from "./ScrollToTop";
import Home from "./pages/Home";
import ProfilPage from "./pages/Customer/ProfilPage";
import RiwayatReservasi from "./pages/Customer/RiwayatReservasi";
import DetailKamar from "./pages/Customer/DetailKamar";
import SidebarComp from "./components/SidebarComp";
import ForgetPassAdmin from "./pages/Pegawai/Auth/ForgetPassAdmin";
import LoginPage from "./pages/Customer/Auth/LoginPage";
import ForgetPassword from "./pages/Customer/Auth/ForgetPassword";
import Register from "./pages/Customer/Auth/RegisterPage";
import ResetPassword from "./pages/Customer/Auth/ResetPassword";
import LoginAdminPage from "./pages/Pegawai/Auth/LoginAdminPage";
import KamarAdmin from "./pages/Pegawai/Admin/KamarAdmin";
import SeasonSM from "./pages/Pegawai/SM/SeasonSM";
import TarifSM from "./pages/Pegawai/SM/TarifSM";
import FasilitasBerbayarSM from "./pages/Pegawai/SM/FasilitasBerbayarSM";
import CustomerSM from "./pages/Pegawai/SM/CustomerSM";
import RiwayatTrxCustomer from "./pages/Pegawai/SM/RiwayatTrxCustomer";
import KetersediaanKamar from "./pages/Customer/KetersediaanKamar";

axios.defaults.baseURL = "https://project-p3l-be.frederikus.com/api";

function App() {
  
// useEffect(() => {
//   localStorage.getItem('apiKey');
// }, []);

  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="loginAdm" element={<LoginAdminPage />} />
        <Route path="forgetPassword" element={<ForgetPassword />} />
        <Route path="resetPassword/:token" element={<ResetPassword/>} />
        <Route path="register" element={<Register />} />
        <Route path="kamar" element={<KamarPage />} />
        <Route path="ketersediaan/kamar" element={<KetersediaanKamar />} />
        <Route path="kamar/:id" element={<DetailKamar />} />
        <Route path="profil" element={<ProfilPage />} />
        <Route path="riwayatReservasi" element={<RiwayatReservasi />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="admin/lupaPassword" element={<ForgetPassAdmin/>}/>
        <Route path="admin/" element={<SidebarComp/>}>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="kamar" element={<KamarAdmin/>}/>
          <Route path="season" element={<SeasonSM/>}/>
          <Route path="tarif" element={<TarifSM/>}/>
          <Route path="fasilitas" element={<FasilitasBerbayarSM/>}/>
          <Route path="customer" element={<CustomerSM/>}/>
          <Route path="customer/riwayat/:idCust" element={<RiwayatTrxCustomer/>}/>
        </Route>
        {/* <Route path="admin/*" element={
          <SidebarComp>
              <Routes>
                <Route path="dashboard" element={<Dashboard/>}/>
              </Routes>
              <Routes>
                <Route path="kamar" element={<KamarAdmin/>}/>
              </Routes>
          </SidebarComp>
        }/> */}
        {/* <Route path="dashboard" element={<Dashboard />}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
