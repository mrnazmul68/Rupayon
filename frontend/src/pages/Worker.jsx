import img from "../assets/Images/working (1).jpeg";
import { FaChessKing, FaChessQueen, FaChessPawn } from "react-icons/fa";

const Worker = () => {
  return (
    <div className="pt-20 px-4 bg-herobg grid md:grid-cols-2 md:px-16 py-20 gap-10 grid-cols-1">
      {/* IMAGE SECTION */}
      <div className="md:h-[76vh] h-[36vh] w-[80vw] md:w-[40vw] relative rounded-2xl">
        <img
          className="h-full w-full object-cover object-center"
          src={img}
          alt=""
        />

        <div className="h-42 p-3 flex flex-col gap-2 w-58 border border-gray-800 rounded-2xl backdrop-blur-2xl absolute -bottom-10 -right-10">
          <h1 className="opacity-80">The Craft of Elegance</h1>

          <p className="text-[12px] opacity-76">
            Master tailors shaping premium borka designs — where tradition meets
            modern fashion
          </p>

          <div className="flex justify-between items-center">
            <div className="flex gap-1 items-center">
              <h1>Borka Analysis</h1>
            </div>

            <h1 className="font-bold text-[red] text-[12px]">
              LIVE 
            </h1>
          </div>
        </div>
      </div>

      {/* TEXT SECTION */}
      <div className="flex pt-10 md:pt-0 flex-col gap-3">
        <div className="relative inline-block px-2 w-fit md:px-6 py-1.5">
          <div
            className="absolute inset-0 bg-primary z-0"
            style={{
              clipPath:
                "polygon(2% 15%, 0% 50%, 3% 85%, 15% 95%, 50% 90%, 85% 95%, 98% 80%, 100% 50%, 97% 20%, 85% 5%, 50% 10%, 15% 5%)",
            }}
          ></div>

          <h1 className="relative z-10 text-black md:text-1xl text-[10px] font-black tracking-[1px] uppercase font-sans">
            Wear Modesty
          </h1>
        </div>

        <h1 className="text-4xl opacity-90 py-4">
          Rupayon – Where Modesty Becomes Style
        </h1>

        <p className="opacity-75">
          Discover premium borka collections crafted with elegance and care.
          Designed for women who value modest fashion with modern beauty.
        </p>

        <p className="opacity-75">
          Every borka reflects fine tailoring, soft fabrics, and graceful design
          — inspired by timeless modesty and luxury fashion trends.
        </p>

        <p className="opacity-75">
          Step into confidence with designs that blend tradition, comfort, and
          sophistication in every stitch.
        </p>

        {/* ICON SECTION */}
        <div className="text-4xl text-primary grid grid-cols-3 place-items-center pt-10">
          <div className="w-full flex justify-center border-r border-amber-700">
            <FaChessKing />
          </div>

          <div className="w-full flex justify-center border-r border-amber-700">
            <FaChessQueen />
          </div>

          <div className="w-full flex justify-center">
            <FaChessPawn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Worker;
