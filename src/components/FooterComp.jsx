import assets from "../assets";

function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1"></div>
          <div className="col-span-1 flex justify-center">
            <img
              src={assets.LOGOGAH}
              alt="Grand Atma Hotel Logo"
              className="h-52 text-center"
            />
          </div>
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold">Grand Atma Hotel</h2>
            <p>Jl. Contoh No. 123, Kota Contoh</p>
            <p>Telepon: (123) 456-7890</p>
            <p>Email: info@grandatmahotel.com</p>
            <p>Ikuti kami di media sosial:</p>
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
      <div className="mt-4 bg-blue-900 p-5">Copyright &copy; 2023</div>
    </footer>
  );
}

export default Footer;
