import NavbarComp from "../../components/NavbarComp"

function KamarPage() {
  return (
    <div>
        <NavbarComp kelas="fixed" setBg="true"/>
        <div className={`bg-kamar-bg h-128 bg-cover bg-bottom bg-fixed transition-all relative`}>
          <div className="flex justify-center text-center items-center h-full font-bold text-5xl text-white"><span className="w-52 border-b-5 border-gray-200 p-5">Kamar</span></div>
        </div>
        <div className="" style={{ height: '200vh' }}>

        </div>
    </div>
  )
}

export default KamarPage