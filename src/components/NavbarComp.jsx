/* eslint-disable react/prop-types */
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ImUserTie } from "react-icons/im";
import { LuHistory } from "react-icons/lu";
import { BiSolidHelpCircle, BiSolidLogOut } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "axios";
import assets from "../assets";

const logOut = async (request, token) => {
  let res = null;

  await axios.post('/logout', request, {
    headers: { 
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${token}`
    },
  })
  .then(response => {
    res = response;
  })
  .catch(error => {
    res = error.response;
  })
  
  return res;
};

function NavbarComp({ kelas, setBg }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logo, setLogo] = useState("GAH-horizontal.png");
  const [bgNavbar, setBgNavbar] = useState(false);
  const apiKey = localStorage.getItem("apiKey");
  const [data, setData] = useState({});

  const navigate = useNavigate();

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  useEffect(() => {
    localStorage.getItem("apiKey")
    async function fetchData() {
      await axios
        .get(`/profile`, {
            headers: { 
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${apiKey}`
            },
            
          })
          .then((response) => {
            // res = response;
            const {data} = response.data;
            // const {nama_customer, email, jenis_identitas, no_identitas, no_telp, alamat, created_at, updated_at} = data;
            setData({
              data
              // nama_customer,
              // email,
              // jenis_identitas,
              // no_identitas, 
              // no_telp,
              // alamat,
              // created_at,
              // updated_at
            });
            toast.success(response.data.message);
          })
          .catch((error) => {
            localStorage.removeItem('apiKey');
            navigate('/');
            toast.error(error.response.data.message);
          });
        }
        document.addEventListener("scroll", () => {
          if (window.scrollY > 50 && setBg === "true") {
            setBgNavbar(true);
            setLogo("GAH-horizontal-white.png");
          } else {
            setBgNavbar(false);
            setLogo("GAH-horizontal.png");
          }
        });

        fetchData();
  }, [navigate, apiKey, setBg]);

  async function handleLogOut() {
    const response = await logOut({}, apiKey);
    if (response.data.status === "T") {
      toast.success(response.data.message);
      navigate("/");
    } else {
      toast.error(response.data.message);
    }
  }

  return (
    <Navbar
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
      className={`inset-x-0 backdrop-blur-none backdrop-saturate-150 py-2 ${
        bgNavbar ? "bg-primary" : "bg-transparent"
      } ${kelas}`}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={`sm:hidden ${
            bgNavbar ? "text-slate-50" : "text-primary"
          } `}
        />
        <NavbarBrand className="w-full">
          <Link to="/">
            <img src={assets.LOGOGAHhWhite} alt="logo" className="h-12 max-w-none" />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-5 uppercase"
        justify="center"
      >
        <NavbarItem>
          <NavLink
            className={`${
              bgNavbar ? "text-gray-300" : "text-primary"
            } hover:text-secondary`}
            to="/"
          >
            Beranda
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            className={`${
              bgNavbar ? "text-gray-300" : "text-primary"
            } hover:text-secondary`}
            to="/kamar"
          >
            Kamar
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            className={`${
              bgNavbar ? "text-gray-300" : "text-primary"
            } hover:text-secondary`}
            to="/harga"
          >
            Harga
          </NavLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {!apiKey ? (
          <NavbarItem>
            <Link to="/login">
              <Button
                className={` ${
                  bgNavbar
                    ? "bg-gray-300 text-primary"
                    : "bg-primary text-slate-200"
                } font-semibold hover:bg-secondary`}
                variant="flat"
              >
                Masuk
              </Button>
            </Link>
          </NavbarItem>
        ) : (
          <NavbarItem>
            {/* <div className=""> */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: "https://i.pravatar.cc/150?u=a04258114e29026302d",
                  }}
                  className="transition-transform text-secondary font-medium"
                  description="Personal"
                  name={data?.nama_customer && data?.nama_customer.split(' ')[0]}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">{data.nama_customer}</p>
                </DropdownItem>
                <DropdownItem onClick={()=> navigate('/profil')} key="profil" description="Atur data profilmu" startContent={<ImUserTie/>}>Profil</DropdownItem>
                <DropdownItem onClick={()=> navigate('/riwayatReservasi')} key="riwayat" description="Cek riwayat pemesanan Anda" startContent={<LuHistory/>}>Riwayat Pesanan</DropdownItem>
                <DropdownItem key="bantuan" description="Kami siap membantu Anda" startContent={<BiSolidHelpCircle/>}>Bantuan</DropdownItem>
                <DropdownItem key="logout" color="danger" description="Keluar dari akun dengan aman" startContent={<BiSolidLogOut/>} onClick={handleLogOut}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* </div> */}
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default NavbarComp;
