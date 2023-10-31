import assets from "../assets";

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
              className="h-52 text-center"
            />
          </div>
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold">Grand Atma Hotel</h2>
            <p>Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281</p>
            <p>Telepon: (0274) 487711</p>
            <p>Email: info@grandatmahotel.com</p>
            <p>Ikuti kami di media sosial:</p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/grandatmahotel"
                className="text-blue-300 hover:text-blue-500"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com/grandatmahotel"
                className="text-blue-300 hover:text-blue-500"
              >
                Twitter
              </a>
              <a
                href="https://www.instagram.com/grandatmahotel"
                className="text-blue-300 hover:text-blue-500"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-blue-900 p-5 text-center text-gray-200">Copyright &copy; 2023 - GAH </div>
    </footer>
  );
}

export default Footer;
