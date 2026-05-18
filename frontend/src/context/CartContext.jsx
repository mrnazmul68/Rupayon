import { useCallback, useMemo, useState } from "react";
import { CartContext } from "./cartContext.js";
const CART_STORAGE_KEY = "rupayon_cart";
const SHIPPING_FEE = 80;

const getStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const createCartItem = ({ product, color, size, quantity = 1 }) => ({
  id: `${product.id}-${color || "default"}-${size || "default"}`,
  productId: product.id,
  name: product.title,
  color: color || product.colors?.[0] || "Default",
  size: size || product.sizes?.[0] || "Default",
  price: product.price,
  quantity,
  image: product.image,
  collection: product.collection,
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getStoredCart);

  const updateCart = useCallback((updater) => {
    setCartItems((currentItems) => {
      const nextItems = updater(currentItems);
      saveCart(nextItems);
      return nextItems;
    });
  }, []);

  const addToCart = useCallback(({ product, color, size, quantity = 1 }) => {
    const nextItem = createCartItem({ product, color, size, quantity });

    updateCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === nextItem.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === nextItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...currentItems, nextItem];
    });
  }, [updateCart]);

  const updateQuantity = useCallback((id, delta) => {
    updateCart((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item,
      ),
    );
  }, [updateCart]);

  const removeItem = useCallback((id) => {
    updateCart((currentItems) => currentItems.filter((item) => item.id !== id));
  }, [updateCart]);

  const clearCart = useCallback(() => {
    updateCart(() => []);
  }, [updateCart]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = cartItems.length > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  const value = useMemo(
    () => ({
      cartItems,
      itemCount,
      subtotal,
      shipping,
      total,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      addToCart,
      cartItems,
      clearCart,
      itemCount,
      removeItem,
      shipping,
      subtotal,
      total,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
