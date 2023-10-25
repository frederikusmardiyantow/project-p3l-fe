import assets from "../../assets";
import NavbarComp from "../../components/NavbarComp";

function DetailKamar() {
  return (
    <div>
        <NavbarComp/>
        <img src={assets.KAMAR1} alt="kamar" />
    </div>
  )
}

export default DetailKamar