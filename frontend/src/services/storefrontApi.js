const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const normalizeProduct = (product) => {
  const image = product.image || product.imageUrl || product.images?.[0]?.url || null;

  return {
    ...product,
    id: product._id || product.id,
    title: product.title || product.name || "Untitled product",
    image,
    collection: product.collection || product.category || "Uncategorized",
    sizes: Array.isArray(product.sizes)
      ? product.sizes
      : String(product.size || "S")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    colors: Array.isArray(product.colors)
      ? product.colors
      : String(product.color || "Black")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    rating: Number(product.rating || 0),
    isNew: Boolean(product.isNew || product.isNewArrival),
    isBestSeller: Boolean(product.isBestSeller),
    isCurated: Boolean(product.isCurated),
    reviews: product.reviews || [],
  };
};

const request = async (path) => {
  const response = await fetch(`${API_ROOT}${path}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const getLiveProducts = async () => {
  const data = await request("/products");
  return (data.products || []).map(normalizeProduct);
};

export const getLiveProduct = async (id) => {
  const data = await request(`/products/${id}`);
  return normalizeProduct(data.product);
};

export const getProductsWithFallback = async () => {
  try {
    return await getLiveProducts();
  } catch {
    return [];
  }
};
