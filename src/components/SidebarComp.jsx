import { useEffect, useState } from "react";
import {
  MdMeetingRoom,
  MdOutlineClose,
  MdOutlineDashboard,
} from "react-icons/md";
import { GiMoneyStack, GiTakeMyMoney } from "react-icons/gi";
import { FaCloudversify } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import assets from "../assets";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { BiSolidLogOut } from "react-icons/bi";
import axios from "axios";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiMenu4Line } from "react-icons/ri";

const logOut = async (request, token) => {
  let res = null;

  await axios
    .post("/logout", request, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      res = response;
    })
    .catch((error) => {
      res = error.response;
    });

  return res;
};

// eslint-disable-next-line react/prop-types
function SidebarComp() {
  const [open, setOpen] = useState(true);
  let apiKey = localStorage.getItem("apiKey");
  const [dataLogin, setDataLogin] = useState({});

  const navigate = useNavigate();

  const Menus = [
    {
      index: 0,
      title: "Dashboard",
      src: <MdOutlineDashboard />,
      link: "/admin/dashboard",
      role: "All",
    },
    {
      index: 1,
      title: "Season",
      src: <GiTakeMyMoney />,
      gap: true,
      link: "/admin/season",
      role: "Sales & Marketing",
    },
    {
      index: 2,
      title: "Tarif",
      src: <GiMoneyStack />,
      link: "/admin/tarif",
      role: "Sales & Marketing",
    },
    {
      index: 3,
      title: "Kamar",
      src: <MdMeetingRoom />,
      link: "/admin/kamar",
      role: "Admin",
    },
    {
      index: 4,
      title: "Fasilitas Berbayar ",
      src: <FaCloudversify />,
      link: "/admin/fasilitas",
      role: "Sales & Marketing",
    },
    {
      index: 5,
      title: "Customer",
      src: <FaUsersGear />,
      link: "/admin/customer",
      role: "Sales & Marketing",
    },
  ];

  async function fetchData() {
    await axios
      .get(`/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        // res = response;
        const { data } = response.data;
        if (!data.id_role) {
          navigate("/");
        }
        setDataLogin(data);
        toast.success(response.data.message);
      })
      .catch((error) => {
        localStorage.removeItem("apiKey");
        navigate("/loginAdm");
        toast.error(error.response.data.message);
      });
  }

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, apiKey]);

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
    <div className="flex">
      <div
        className={` sidebar ${
          open ? "w-72" : "w-20 "
        } bg-gray-900 min-h-screen p-5 pt-8 fixed top-0 left-0 duration-300 z-50`}
      >
        {open ? (
          <MdOutlineClose
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
             border-2 rounded-full  ${
               !open && "rotate-180"
             } bg-primary text-white h-10 w-10`}
            onClick={() => setOpen(!open)}
          />
        ) : (
          <RiMenu4Line
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
             border-2 rounded-full  ${
               !open && "rotate-180"
             } bg-primary text-white h-10 w-10`}
            onClick={() => setOpen(!open)}
          />
        )}
        <div className="flex gap-x-4 items-center">
          <img
            src={assets.LOGOGAH}
            className={`cursor-pointer duration-500 border-b-2 border-solid border-gray-200 pb-5 ${
              open && ""
            }`}
          />
          {/* <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Designer
          </h1> */}
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <div key={index}>
              {(dataLogin?.role?.nama_role === Menu.role ||
                Menu.role === "All") && (
                <NavLink to={Menu.link}>
                  <li
                    className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-md items-center gap-x-5 h-12 ${
                      !open && "justify-center"
                    }
                    ${Menu.gap ? "mt-9" : "mt-2"} ${
                      index === Menu.index &&
                      "hover:bg-secondary bg-opacity-80 hover:bg-opacity-30 text-gray-100 font-medium"
                    } `}
                  >
                    {Menu.src}
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      {Menu.title}
                    </span>
                  </li>
                </NavLink>
              )}
            </div>
          ))}
        </ul>
        <Button className="bg-primary text-white w-full rounded-md mt-5">
          <BiSolidLogOut />
          <span className={`${!open && "hidden"} origin-left duration-200`}>
            Keluar
          </span>
        </Button>
      </div>
      <div
        className={`flex-1 ${open ? "ms-20 md:ms-72" : "ms-20"} duration-300`}
      >
        <div className="ring-2 ring-black h-16 w-full items-center flex p-5 uppercase font-medium tracking-normal justify-between">
          <p>
            Selamat Datang, anda masuk sebagai{" "}
            <span className="font-bold">
              {dataLogin?.role?.nama_role && dataLogin.role.nama_role}
            </span>
          </p>
          <div>
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: "https://i.pravatar.cc/150?u=a04258114e29026302d",
                  }}
                  className="transition-transform text-secondary font-medium"
                  description={
                    dataLogin?.role?.nama_role && dataLogin.role.nama_role
                  }
                  name={
                    dataLogin?.nama_pegawai &&
                    dataLogin?.nama_pegawai.split(" ")[0]
                  }
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">{dataLogin.nama_pegawai}</p>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  description="Keluar dari akun dengan aman"
                  startContent={<BiSolidLogOut />}
                  onClick={handleLogOut}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="p-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SidebarComp;
