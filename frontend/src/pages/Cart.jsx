import {
  FaTrashAlt,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaArrowRight,
  FaTicketAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart.js";

const Cart = () => {
  const {
    cartItems,
    itemCount,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeItem,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] pt-16 flex flex-col items-center justify-center text-center p-4">
        <FaShoppingBag size={64} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-gray-800">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven't added any modest wear yet.
        </p>
        <Link
          to="/products"
          className="mt-6 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white pt-24 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-10 flex items-center gap-3">
          Your Shopping Bag
          <span className="text-lg font-sans font-normal text-gray-400">
            ({itemCount} items)
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 1. Item List */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-gray-100 pb-8 group"
              >
                <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Color: {item.color} | Size: {item.size}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 gap-4">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-gray-400 hover:text-black"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-gray-400 hover:text-black"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    BDT {(item.price * item.quantity).toLocaleString()}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400">
                      BDT {item.price.toLocaleString()} each
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 2. Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <FaTicketAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Promo Code"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-black">
                  Apply
                </button>
              </div>

              <div className="space-y-4 border-b border-gray-200 pb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    BDT {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-gray-900 font-medium">
                    BDT {shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- BDT 0</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  BDT {total.toLocaleString()}
                </span>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl shadow-gray-200 uppercase tracking-widest text-sm"
              >
                Proceed to Checkout <FaArrowRight />
              </Link>

              <div className="mt-8">
                <p className="text-xs text-center text-gray-400">
                  Secure Payment via bKash, Nagad, or Cash on Delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
