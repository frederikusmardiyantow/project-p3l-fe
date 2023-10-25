import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/LoginPage";
import Register from "./pages/Auth/RegisterPage";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Admin/Dashboard";
import axios from "axios";
// import Homepage from "./pages/Homepage";
import KamarPage from "./pages/Customer/KamarPage";
import ScrollToTop from "./ScrollToTop";
import Home from "./pages/Home";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProfilPage from "./pages/Customer/ProfilPage";
import RiwayatReservasi from "./pages/Customer/RiwayatReservasi";
import DetailKamar from "./pages/Customer/DetailKamar";

axios.defaults.baseURL = "http://127.0.0.1:8000/api";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="forgetPassword" element={<ForgetPassword />} />
        <Route path="resetPassword/:token" element={<ResetPassword/>} />
        <Route path="register" element={<Register />} />
        <Route path="kamar" element={<KamarPage />} />
        <Route path="kamar/:id" element={<DetailKamar />} />
        <Route path="profil" element={<ProfilPage />} />
        <Route path="riwayatReservasi" element={<RiwayatReservasi />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="dashboard" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
