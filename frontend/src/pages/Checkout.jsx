import { useEffect, useState } from "react";
import {
  MdLock,
  MdLocalShipping,
  MdPayment,
  MdVerifiedUser,
  MdArrowForwardIos,
  MdCreditCard,
  MdInfoOutline,
} from "react-icons/md";
import { SiVisa, SiMastercard, SiApplepay } from "react-icons/si";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart.js";
import { useAuth } from "../context/useAuth.js";
import { ordersApi } from "../services/api.js";

const Checkout = () => {
  const { cartItems, subtotal, shipping, total, clearCart } = useCart();
  const { user, dbUser, refreshDbUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    const savedName = dbUser?.name || user?.displayName || "";
    const [firstName = "", ...lastNameParts] = savedName.split(" ");

    setFormData({
      firstName,
      lastName: lastNameParts.join(" "),
      address: dbUser?.address?.street || "",
      city: dbUser?.address?.city || "",
      postalCode: dbUser?.address?.postalCode || "",
      phone: dbUser?.phone || user?.phoneNumber || "",
    });
  }, [dbUser, user]);

  const handlePlaceOrder = async () => {
    try {
      if (!user) return;
      const requiredFields = ["firstName", "address", "city", "postalCode", "phone"];
      const hasMissingDetails = requiredFields.some((field) => !formData[field].trim());

      if (hasMissingDetails) {
        setError("Please complete your shipping details before placing the order.");
        return;
      }

      setLoading(true);
      setError("");
      
      const orderData = {
        userId: dbUser?._id || user.uid || user.id,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: user.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: "",
          postalCode: formData.postalCode,
          country: "Bangladesh",
        },
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image || item.imageUrl,
        })),
        subtotal,
        tax: 0,
        shipping,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        status: "pending",
      };

      await ordersApi.create(orderData);
      await refreshDbUser?.();
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      setError(error.message || "Could not place the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-14 bg-[#f8f9fa] text-[#333] font-sans flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <MdVerifiedUser className="text-green-600 mx-auto mb-4" size={44} />
          <h1 className="text-2xl font-bold text-gray-900">Order confirmed</h1>
          <p className="text-gray-500 mt-2">
            Thank you. Your order has been placed with{" "}
            {paymentMethod === "cod" ? "Cash on Delivery" : "card payment"}.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-[#f8f9fa] text-[#333] font-sans text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/products" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900">
          Browse Products <MdArrowForwardIos />
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] text-[#333] font-sans pt-14">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <Link to="/cart" className="hover:text-black">Cart</Link>
          <MdArrowForwardIos size={14} />
          <span className="text-black">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Shipping details</h2>
              {dbUser?.phone || dbUser?.address?.street ? (
                <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3 mb-4">
                  We filled this from your saved profile. Update anything here and it will be saved for next time.
                </p>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name (optional)</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                    placeholder="Doe"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                    placeholder="123 Street Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                    placeholder="Dhaka"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                    placeholder="1200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                    placeholder="+880 1XXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Payment method</h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-black"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <MdLocalShipping size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive</p>
                    </div>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === "card"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-black"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <MdCreditCard size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Card</p>
                      <div className="flex items-center gap-2 mt-1">
                        <SiVisa className="text-blue-700" size={24} />
                        <SiMastercard className="text-orange-600" size={24} />
                        <SiApplepay size={24} />
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              {paymentMethod === "card" && (
                <div className="mt-6 space-y-4 border-t pt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={item._id || index} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img
                        src={item.image || item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.size} • {item.color} • Qty: {item.quantity}
                      </p>
                      <p className="font-bold mt-1">BDT {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t pt-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>BDT {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `BDT ${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span>BDT {total.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdLock /> {loading ? "Placing Order..." : "Place Order"}
              </button>
              {error && (
                <p className="text-sm text-red-600 text-center mt-3">{error}</p>
              )}
              <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                <MdInfoOutline /> Your payment information is secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
