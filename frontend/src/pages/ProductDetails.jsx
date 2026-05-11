import { useMemo, useState, useRef } from "react";
// Importing specific icons from Feather and Ionicons sets
import {
  FiTruck,
  FiRotateCcw,
  FiLock,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { IoMdStar } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../context/useCart.js";
import { useAuth } from "../context/useAuth.js";
import {
  getLiveProduct,
  getProductsWithFallback,
} from "../services/storefrontApi.js";
import { reviewsApi } from "../services/api.js";

const fetchProducts = getProductsWithFallback;

const colorMap = {
  Black: "#1C1C1C",
  White: "#F8F5ED",
  Beige: "#D8C6A3",
  Olive: "#59633B",
};

const fetchProductById = async (id) => {
  const product = await getLiveProduct(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, dbUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const productColors = useMemo(() => {
    if (!product?.colors?.length) {
      return [{ name: "Obsidian Black", hex: "#1C1C1C" }];
    }

    return product.colors.map((color) => ({
      name: color,
      hex: colorMap[color] || "#1C1C1C",
    }));
  }, [product]);

  const images = useMemo(() => {
    if (!product?.image && !product?.images?.length) {
      return [];
    }

    const allImages = [];
    if (product.image) {
      allImages.push(product.image);
    }
    if (product.images?.length) {
      product.images.forEach((img) => {
        if (img.url && !allImages.includes(img.url)) {
          allImages.push(img.url);
        }
      });
    }
    return allImages.length > 0 ? allImages : [product.image];
  }, [product]);

  const suggestedProducts = useMemo(() => {
    if (!product || !Array.isArray(allProducts)) {
      return [];
    }

    return allProducts
      .filter(
        (item) =>
          item.id !== product.id && item.collection === product.collection,
      )
      .slice(0, 4);
  }, [allProducts, product]);

  const displayColor = productColors.some((color) => color.name === selectedColor)
    ? selectedColor
    : productColors[0].name;

  const displaySize = product?.sizes?.includes(selectedSize)
    ? selectedSize
    : product?.sizes?.[0] || "S";

  const handleAddToCart = () => {
    addToCart({
      product,
      color: displayColor,
      size: displaySize,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const accordions = [
    {
      title: "Description",
      content: product
        ? `${product.title} is designed for everyday modest elegance with a graceful, comfortable silhouette.`
        : "",
    },
    {
      title: "Material & Care",
      content:
        "Premium modest wear fabric. Dry clean recommended. Store folded in a cool, dry place.",
    },
    {
      title: "Shipping & Returns",
      content:
        "Complimentary delivery within Bangladesh (3-5 business days). International shipping available.",
    },
  ];

  const createReviewMutation = useMutation({
    mutationFn: (data) => reviewsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setReviewForm({
        rating: 5,
        comment: "",
      });
    },
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    createReviewMutation.mutate({
      productId: product.id,
      userId: dbUser?._id || user.uid,
      ...reviewForm,
    });
  };

  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <IoMdStar
            key={star}
            size={size}
            className={star <= rating ? "text-[#9A7B3A]" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  const reviewsScrollRef = useRef(null);

  const scrollReviews = (direction) => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 300;
      if (direction === "left") {
        reviewsScrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        reviewsScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#F5F0E8] min-h-screen font-['Jost'] text-[#1C1C1C] flex items-center justify-center">
        <p className="text-[0.78rem] tracking-[0.22em] uppercase text-[#7A7269]">
          Loading product...
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-[#F5F0E8] min-h-screen font-['Jost'] text-[#1C1C1C] flex flex-col items-center justify-center gap-4">
        <p className="text-[0.78rem] tracking-[0.22em] uppercase text-[#7A7269]">
          Product not found
        </p>
        <Link
          to="/products"
          className="bg-[#9A7B3A] text-white px-6 py-3 rounded text-[0.75rem] tracking-[0.18em] uppercase"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F0E8] pt-14 min-h-screen font-['Jost'] text-[#1C1C1C]">
      {/* Navigation */}
     

      {/* Main Content */}
      <div className="px-6 md:px-15 py-4 text-[0.72rem] tracking-widest uppercase text-[#7A7269]">
        Home <span className="mx-2 opacity-50">/</span> {product.collection}{" "}
        <span className="mx-2 opacity-50">/</span> {product.title}
      </div>

      <section className="max-w-350 mx-auto px-6 md:px-15 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2.5">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveThumb(idx)}
                className={`w-[72px] h-[90px] rounded bg-[#EDE7D9] overflow-hidden cursor-pointer border-2 transition-all ${
                  activeThumb === idx
                    ? "border-[#9A7B3A]"
                    : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="relative flex-1 bg-[#EDE7D9] rounded-md overflow-hidden min-h-[580px]">
            <span className="absolute top-5 left-5 bg-[#9A7B3A] text-white text-[0.65rem] tracking-[0.15em] uppercase px-3 py-1 rounded-[2px] z-10">
              {product.collection}
            </span>
            <img
              src={images[activeThumb]}
              alt={product.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Details */}
        <div className="lg:pl-14 pt-8 lg:pt-2">
          <p className="text-[0.68rem] tracking-[0.2em] uppercase text-[#9A7B3A] font-bold mb-3">
            {product.collection}
          </p>
          <h1 className="font-['Cormorant_Garamond'] text-[2.8rem] leading-[1.18] mb-5">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-2">
            <div className="font-['Cormorant_Garamond'] text-[1.9rem] font-medium">
              BDT {product.price.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[#9A7B3A]">
              <IoMdStar size={16} />
              <IoMdStar size={16} />
              <IoMdStar size={16} />
              <IoMdStar size={16} />
              <IoMdStar size={16} />
              <span className="text-[0.78rem] text-[#7A7269] ml-1">
                ({product.rating} Rating)
              </span>
            </div>
          </div>

          <p className="font-['Cormorant_Garamond'] italic text-[1.05rem] text-[#7A7269] leading-relaxed mb-8 border-l-2 border-[#C4A55A] pl-4">
            A masterpiece of modest fashion from the {product.collection}{" "}
            collection.
          </p>

          {/* Selection Logic */}
          <div className="mb-7">
            <p className="text-[0.7rem] tracking-[0.18em] uppercase text-[#7A7269] font-semibold mb-3">
              Color: {displayColor}
            </p>
            <div className="flex gap-3">
              {productColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-8 h-8 rounded-full border-2 transition-all outline-offset-4 ${
                    displayColor === c.name
                      ? "border-[#9A7B3A] outline outline-[1.5px] outline-[#9A7B3A]"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3 max-w-[250px]">
              <p className="text-[0.7rem] tracking-[0.18em] uppercase text-[#7A7269] font-semibold">
                Select Size
              </p>
              <span className="text-[0.72rem] text-[#9A7B3A] underline cursor-pointer uppercase tracking-widest">
                Size Guide
              </span>
            </div>
            <div className="flex gap-2">
              {(product.sizes || ["50", "52", "54", "56"]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-[46px] h-[46px] rounded border-[1.5px] text-[0.8rem] transition-all ${
                    displaySize === s
                      ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                      : "border-[#D6CCBA]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="bg-[#9A7B3A] text-white py-4 rounded font-semibold text-[0.78rem] tracking-[0.22em] uppercase hover:bg-[#7D6230] transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="border-[1.5px] border-[#1C1C1C] py-4 rounded font-semibold text-[0.78rem] tracking-[0.22em] uppercase hover:bg-[#1C1C1C] hover:text-white transition-all"
            >
              Buy Now
            </button>
          </div>

          {/* Perks with React Icons */}
          <div className="flex gap-5 mb-7 text-[0.72rem] text-[#7A7269] tracking-wider uppercase font-medium">
            <div className="flex items-center gap-2">
              <FiTruck className="text-[#9A7B3A]" size={14} /> Free Delivery
            </div>
            <div className="flex items-center gap-2">
              <FiRotateCcw className="text-[#9A7B3A]" size={14} /> Easy Returns
            </div>
            <div className="flex items-center gap-2">
              <FiLock className="text-[#9A7B3A]" size={14} /> Secure Payment
            </div>
          </div>

          {/* Accordion */}
          <div className="border-t border-[#D6CCBA]">
            {accordions.map((acc, i) => (
              <div key={i} className="border-b border-[#D6CCBA]">
                <button
                  onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                  className="w-full flex justify-between items-center py-4 text-[0.75rem] tracking-[0.18em] uppercase font-bold text-[#1C1C1C]"
                >
                  {acc.title}
                  <FiChevronDown
                    className={`transition-transform duration-300 text-[#9A7B3A] ${
                      openAccordion === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openAccordion === i ? "max-h-40 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-[0.88rem] text-[#7A7269] leading-relaxed">
                    {acc.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-[60px] pb-20">
        <div className="border-t border-[#D6CCBA] pt-10">
          {/* Review List */}
          <div className="relative mb-10">
            {product?.reviews?.length > 0 ? (
              <>
                <button
                  onClick={() => scrollReviews("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#D6CCBA] p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <FiChevronLeft size={20} className="text-[#1C1C1C]" />
                </button>

                <div
                  ref={reviewsScrollRef}
                  className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="min-w-[280px] max-w-[280px] bg-white p-5 rounded-xl shadow-sm border border-[#D6CCBA]"
                    >
                      {renderStars(review.rating, 16)}
                      <p className="text-[#7A7269] mt-3">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollReviews("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#D6CCBA] p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <FiChevronRight size={20} className="text-[#1C1C1C]" />
                </button>
              </>
            ) : (
              <div className="text-center py-12 text-[#7A7269]">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
          
          {/* Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-xl shadow-sm border border-[#D6CCBA]">
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#7A7269] mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <IoMdStar
                        size={32}
                        className={star <= reviewForm.rating ? "text-[#9A7B3A]" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#7A7269] mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D6CCBA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9A7B3A]"
                  rows={4}
                  placeholder="Write your review..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={createReviewMutation.isPending}
                className="bg-[#9A7B3A] text-white px-6 py-3 rounded font-semibold text-[0.78rem] tracking-[0.22em] uppercase hover:bg-[#7D6230] transition-colors disabled:opacity-50"
              >
                {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </section>

      {suggestedProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-[60px] pb-20">
          <div className="border-t border-[#D6CCBA] pt-10">
            <h2 className="font-['Cormorant_Garamond'] text-[2rem] leading-tight mb-6">
              You may like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group"
                >
                  <div className="aspect-3/4 overflow-hidden bg-[#EDE7D9] rounded-md">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  </div>
                  <p className="text-[0.68rem] tracking-[0.18em] uppercase text-[#9A7B3A] font-bold mt-3">
                    {item.collection}
                  </p>
                  <h3 className="text-sm mt-1">{item.title}</h3>
                  <p className="font-bold mt-1">
                    BDT {item.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
