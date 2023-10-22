import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/LoginPage";
import Register from "./pages/Auth/RegisterPage";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Admin/Dashboard";
import axios from "axios";
import Homepage from "./pages/Homepage";
import KamarPage from "./pages/Customer/KamarPage";
import ScrollToTop from "./ScrollToTop";

axios.defaults.baseURL = "http://127.0.0.1:8000/api";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="kamar" element={<KamarPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="dashboard" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
