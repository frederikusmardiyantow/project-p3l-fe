// import { useRouteError } from "react-router-dom";

import { Link } from "react-router-dom";
import baseUrl from "../config";
import NavbarComp from "../components/NavbarComp";
import assets from "../assets";
import { FaArrowLeftLong } from "react-icons/fa6";

function ErrorPage() {
//   const error = useRouteError();
//   console.error(error);

  return (
    <div id="error-page">
      <NavbarComp kelas="absolute" setBg="false" />
      <div className="h-[100vh] text-center">
        <div>
          <Link to="/">
            <img src={assets.NOTFOUND} alt="404" className="max-w-[100vw] mx-auto"/>
          </Link>
          <p className="font-light lg:-mt-44 md:-mt-36 -mt-32 md:text-xl text-lg tracking-wider">Maaf, Link yang dituju tidak ditemukan :(</p>
          <p className="w-max mx-auto my-4 text-blue-600 hover:text-blue-500">
            <Link to="/" className="flex items-center gap-2">
              <FaArrowLeftLong/> Kembali ke Beranda
            </Link>
          </p>
          
        </div>
      </div>
      {/* <p>
        <i>{error.statusText || error.message}</i>
      </p> */}
    </div>
  );
}

export default ErrorPage
