import { FaFacebookSquare } from "react-icons/fa";
import assets from "../assets";
import { FaSquareInstagram, FaSquareXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-primary text-white">
        <div className="bg-secondary w-full h-2"></div>
      <div className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 flex justify-center">
            <img
              src={assets.LOGOGAH}
              alt="Grand Atma Hotel Logo"
              className="h-52 text-center drop-shadow-xl"
            />
          </div>
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold mb-2">Grand Atma Hotel</h2>
            <div className="font-light">
              <p className="mb-1">Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281</p>
              <p>Telepon: (0274) 487711</p>
              <p className="mb-1">Email: info@grandatmahotel.com</p>
              <p>Ikuti kami di media sosial:</p>
              <div className="flex gap-4 items-center mt-2">
                <a
                  href="https://www.facebook.com/grandatmahotel"
                  className="text-blue-300 hover:text-blue-500"
                >
                  <FaFacebookSquare className="w-5 h-full"/>
                </a>
                <a
                  href="https://twitter.com/grandatmahotel"
                  className="text-blue-300 hover:text-blue-500"
                >
                  <FaSquareXTwitter className="w-5 h-full"/>
                </a>
                <a
                  href="https://www.instagram.com/grandatmahotel"
                  className="text-blue-300 hover:text-blue-500"
                >
                  <FaSquareInstagram className="w-5 h-full"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-blue-900 p-5 text-center text-gray-200">Copyright &copy; 2023 - GAH </div>
    </footer>
  );
}

export default Footer;
