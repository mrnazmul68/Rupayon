import { useMemo, useState } from "react";
import {
  FaTableCells,
  FaList,
  FaEye,
  FaFilter,
  FaXmark,
} from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { getProductsWithFallback } from "../services/storefrontApi.js";
import { ShopSkeleton } from "../components/Skeletons.jsx";
import { VirtualGrid } from "../components/VirtualList.jsx";

const Shop = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // FILTER STATES
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [price, setPrice] = useState(50000);
  const [sortBy, setSortBy] = useState("newest");

  // 🔍 SEARCH STATE
  const [searchTerm, setSearchTerm] = useState("");
  const { data: catalogProducts = [], isLoading } = useQuery({
    queryKey: ["storefront-products"],
    queryFn: getProductsWithFallback,
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const colors = ["Black", "Golden", "Sea Green", "Olive", "Off-White"];
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          catalogProducts.map((product) => product.collection).filter(Boolean),
        ),
      ),
    ],
    [catalogProducts],
  );

  // FILTER + SORT + SEARCH
  const filteredProducts = useMemo(() => {
    let result = [...catalogProducts];

    result = result.filter((p) => {
      const matchCategory =
        selectedCategory === "All" || p.collection === selectedCategory;

      const matchSize =
        !selectedSize || (p.sizes && p.sizes.includes(selectedSize));

      const matchColor =
        !selectedColor || (p.colors && p.colors.includes(selectedColor));

      const matchPrice = p.price <= price;

      // 🔍 SEARCH LOGIC
      const matchSearch = `${p.title} ${p.collection}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return (
        matchCategory && matchSize && matchColor && matchPrice && matchSearch
      );
    });

    if (sortBy === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popular") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [
    selectedCategory,
    selectedSize,
    selectedColor,
    price,
    sortBy,
    searchTerm,
    catalogProducts,
  ]);

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (isLoading) {
    return <ShopSkeleton />;
  }

  return (
    <div className="bg-navbg pt-16 min-h-screen text-slate-900">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-2 border-b border-slate-100">
        <p className="text-[30px] uppercase tracking-[0.3em] text-slate-400">
          Collections
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-12">
        {/* SIDEBAR */}
        <aside className="hidden lg:block w-64 sticky top-20 h-fit space-y-10">
          {/* CATEGORY */}
          <div>
            <h3 className="font-bold text-xs uppercase mb-4 border-b pb-2">
              Category
            </h3>
            {categories.map((cat) => (
              <p
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer ${
                  selectedCategory === cat
                    ? "font-bold text-black"
                    : "text-slate-500"
                }`}
              >
                {cat}
              </p>
            ))}
          </div>

          {/* SIZE */}
          <div>
            <h3 className="font-bold text-xs uppercase mb-4 border-b pb-2">
              Size
            </h3>
            <div className="flex gap-2 flex-wrap">
              {["50", "52", "54", "56"].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size === selectedSize ? null : size);
                    setCurrentPage(1);
                  }}
                  className={`w-10 h-10 border text-xs ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "border-slate-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* COLOR */}
          <div>
            <h3 className="font-bold text-xs uppercase mb-4 border-b pb-2">
              Color
            </h3>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(selectedColor === color ? null : color);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 border text-xs ${
                    selectedColor === color
                      ? "bg-black text-white"
                      : "border-slate-200"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div>
            <h3 className="font-bold text-xs uppercase mb-4 border-b pb-2">
              Price
            </h3>

            <input
              type="range"
              min="0"
              max="50000"
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-black"
            />

            <div className="text-xs mt-2 text-slate-500">
              ৳{price.toLocaleString()}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1">
          {/* CONTROLS */}
          <div className="flex justify-between items-center mb-8 border-b pb-6 gap-4 flex-wrap">
            {/* 🔍 SEARCH */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-1 text-sm w-60"
            />

            <p className="text-sm text-slate-500">
              Showing {filteredProducts.length} products
            </p>

            <div className="flex gap-4 items-center">
              <button
                className="lg:hidden border p-2"
                onClick={() => setMobileFilterOpen(true)}
              >
                <FaFilter />
              </button>

              <select
                className="text-sm border px-2 py-1"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
                <option value="popular">Popular</option>
              </select>

              <FaTableCells
                onClick={() => setViewMode("grid")}
                className={`cursor-pointer ${
                  viewMode === "grid" ? "text-black" : "text-gray-400"
                }`}
              />
              <FaList
                onClick={() => setViewMode("list")}
                className={`cursor-pointer ${
                  viewMode === "list" ? "text-black" : "text-gray-400"
                }`}
              />
            </div>
          </div>

          {/* PRODUCTS */}
          {viewMode === "grid" ? (
            <VirtualGrid
              items={paginatedProducts}
              itemHeight={typeof window !== "undefined" && window.innerWidth < 768 ? 320 : 450}
              containerHeight={1400}
              columns={typeof window !== "undefined" && window.innerWidth < 768 ? 2 : 3}
              renderItem={(product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <div className="group h-full">
                    <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <button className="bg-white px-5 py-2 text-xs flex gap-2">
                          <FaEye /> Quick View
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm mt-2">{product.title}</h3>
                    <p className="font-bold">৳{product.price}</p>
                  </div>
                </Link>
              )}
            />
          ) : (
            <div className="space-y-4">
              {paginatedProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <div className="group flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="w-32 h-32 overflow-hidden bg-slate-100 rounded-lg">
                      <img
                        src={product.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{product.title}</h3>
                      <p className="font-bold mt-1">৳{product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border text-sm ${
                  currentPage === i + 1
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* MOBILE FILTER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="w-80 bg-white h-full p-6 overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h2 className="font-bold">Filters</h2>
              <FaXmark
                className="cursor-pointer"
                onClick={() => setMobileFilterOpen(false)}
              />
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-xs uppercase mb-4 border-b pb-2">
                Category
              </h3>
              {categories.map((cat) => (
                <p
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="py-1 cursor-pointer"
                >
                  {cat}
                </p>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-xs uppercase mb-4 border-b pb-2">
                Size
              </h3>

              <div className="flex flex-wrap gap-2">
                {["50", "52", "54", "56"].map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(size === selectedSize ? null : size)
                    }
                    className="w-10 h-10 border text-xs"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-xs uppercase mb-4 border-b pb-2">
                Color
              </h3>

              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      setSelectedColor(selectedColor === color ? null : color)
                    }
                    className="px-3 py-1 border text-xs"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs uppercase mb-4 border-b pb-2">
                Price
              </h3>

              <input
                type="range"
                min="0"
                max="50000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-black"
              />

              <div className="text-xs mt-2 text-slate-500">
                ৳{price.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
