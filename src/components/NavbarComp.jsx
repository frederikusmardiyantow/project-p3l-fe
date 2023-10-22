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
} from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function NavbarComp({ kelas, setBg }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logo, setLogo] = useState("GAH-horizontal.png");
  const [bgNavbar, setBgNavbar] = useState(false);

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

  useEffect(function () {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 50 && setBg === "true") {
        setBgNavbar(true);
        setLogo("GAH-horizontal-white.png");
      } else {
        setBgNavbar(false);
        setLogo("GAH-horizontal.png");
      }
    });
  }, [setBg]);


  return (
    <Navbar
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
            <img src={logo} alt="logo" className="h-12 max-w-none" />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-5 uppercase" justify="center">
        <NavbarItem>
          <NavLink
            className={`${bgNavbar ? "text-gray-300" : "text-primary"} hover:text-secondary`}
            to="/"
          >
            Beranda
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            className={`${bgNavbar ? "text-gray-300" : "text-primary"} hover:text-secondary`}
            to="/kamar"
          >
            Kamar
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            className={`${bgNavbar ? "text-gray-300" : "text-primary"} hover:text-secondary`}
            to="/harga"
          >
            Harga
          </NavLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link to="/login">
            <Button className={` ${bgNavbar ? "bg-gray-300 text-primary" : "bg-primary text-slate-200"} font-semibold hover:bg-secondary`} variant="flat">
              Masuk
            </Button>
          </Link>
        </NavbarItem>
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
