import { Link } from "react-router-dom";
import heroBg from "../assets/images/hero.jpg";

const Hero = () => {
  return (
    <section className="relative top-12 w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="h-screen w-full absolute inset-0 bg-cover bg-top opacity-90">
        <img
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover object-[70%_50%] md:object-top"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-6 md:px-16">
        <div className="max-w-xl md:pl-30 text-left text-white">
          <h1 className="text-sm tracking-[0.3em] uppercase text-navtext font-bold mb-3">
            Heritage Collection
          </h1>

          <h2 className="text-3xl text-black md:text-5xl font-serif font-semibold mb-4">
            Elegance in Every Stitch
          </h2>

          <p className="text-sm md:text-base text-black mb-6">
            Experience the fusion of cultural reverence and contemporary
            minimalism with our curated collection of modest wear.
          </p>

          <button className="px-6 py-3 bg-black text-white hover:bg-navtext hover:text-black transition duration-300 rounded-md font-medium">
           <Link to={'/products'}>Shop Now</Link> 
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
