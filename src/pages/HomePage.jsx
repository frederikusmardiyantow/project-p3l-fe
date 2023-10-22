import { useState } from "react"
import NavbarComp from "../components/NavbarComp"
import { useEffect } from "react";
import CardComp from "../components/CardComp";

function Homepage() {
  const [isMenu, setIsMenu] = useState(false);

  useEffect(function() {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 512) {
        setIsMenu(true);
      } else {
        setIsMenu(false);
      }
    });
  }, []);

  return (
    <div>
        <NavbarComp kelas="absolute" setBg="false"/>
        <div className="bg-hero-pattern h-128 bg-cover bg-center bg-fixed transition-all relative">

          <div className="font-bold text-center">
            Selamat Datang di Grand Atma Hotel
          </div>
          {/* <div className="absolute inset-0 flex justify-center items-center uppercase text-xl font-bold">
            <p>Selamat Datang di</p>
            <span className="block">Grand Atma Hotel</span>
          </div> */}
        </div>
        <NavbarComp kelas={isMenu ? "fixed" : "hidden"} setBg="true"/>
        <CardComp/>
        <div className="" style={{ height: '200vh' }}>x</div>
    </div>
  )
}

export default Homepage