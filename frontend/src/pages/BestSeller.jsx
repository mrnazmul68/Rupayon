import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductsWithFallback } from "../services/storefrontApi.js";

const BestSeller = () => {
  const { data: catalogProducts = [] } = useQuery({
    queryKey: ["storefront-products"],
    queryFn: getProductsWithFallback,
  });

  const bestSellers = catalogProducts.filter((product) => product.isBestSeller);

  return (
    <section className="w-full md:px-16 font-Inter py-16 bg-bestsallerbg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
          <p className="text-gray-500 mt-2">
            Our most loved products this season
          </p>
        </div>

        {/* Horizontal Scroll */}

        <div className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::webkit-scrollbar]:hidden">
          {bestSellers.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="min-w-55 sm:min-w-6 rounded-2xl shrink-0">
                {/* Image */}
                <div className="aspect-3/4 relative h-90 w-full overflow-hidden rounded border border-border">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <div className="absolute uppercase text-[0.7rem] top-2 right-2 bg-bestsallerbg px-2 text-navtext font-bold">
                    <h1 className=" tracking-wide">bestseller</h1>
                  </div>
                </div>

                {/* Info */}
                <div className="pt-3 font-Noto Serif">
                  <h3 className="text-sm text-navtext mt-1">{product.title}</h3>
                  <p className="text-navtext  mt-2">{product.price} ৳</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
