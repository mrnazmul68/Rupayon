import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsWithFallback } from "../services/storefrontApi.js";

const Curated = () => {
  const { data: catalogProducts = [] } = useQuery({
    queryKey: ["storefront-products"],
    queryFn: getProductsWithFallback,
  });

  const curatedProducts = catalogProducts.filter((product) => product.isCurated);
  const first = curatedProducts[0];
  const second = curatedProducts[1];
  const third = curatedProducts[2];

  return (
    <section className="w-full py-16 md:py-25 md:px-16 bg-herobg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-2xl md:text-4xl pt-8 md:pt-12 font-serif text-center mb-8 md:mb-10 text-black">
          Curated Collection
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:h-120">
          {/* LEFT BIG CARD */}
          <Link
            to={first ? `/product/${first.id}` : "/products"}
            className="relative h-72 md:h-110 overflow-hidden rounded-xl group"
          >
            <img
              src={first?.image }
              alt={first?.title || "Left Collection"}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="absolute bottom-4 left-4 text-white text-lg font-medium">
              {first?.title || "Heritage Abayas"}
            </div>
          </Link>

          {/* RIGHT SIDE GRID */}
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {/* TOP RIGHT LEFT CARD */}
            <Link
              to={second ? `/product/${second.id}` : "/products"}
              className="relative h-72 md:h-110 overflow-hidden rounded group min-w-0"
            >
              <img
                src={second?.image}
                alt={second?.title || "Top Right"}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-black/30"></div>

              <div className="absolute bottom-4 left-4 text-white text-lg font-medium">
                {second?.title || "Minimal Elegance"}
              </div>
            </Link>

            {/* RIGHT COLUMN */}
            <div className="grid grid-rows-2 h-72 md:h-110 gap-5 min-w-0">
              <Link
                to={third ? `/product/${third.id}` : "/products"}
                className="rounded overflow-hidden"
              >
                <img
                  src={third?.image}
                  alt={third?.title || ""}
                  className="hover:scale-105 transition duration-500 h-full w-full object-cover"
                />
              </Link>

              {/* BOTTOM CARD */ }
              <Link to={'/products'}>
              <div className="relative md:h-52 h-33 overflow-hidden rounded bg-[#8B7355] flex items-center justify-between px-4 md:px-6">
                <div>
                  <p className="text-white text-xs md:text-sm tracking-widest uppercase">
                    New Arrival
                  </p>
                  <h3 className="text-white text-sm md:text-2xl font-serif mt-2">
                    Explore Latest Drop
                  </h3>
                </div>
                <div className="bg-white text-[#8B7355] p-2 md:p-3 rounded-full">
                  <FiArrowRight size={18} />
                </div>
              </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Curated;
