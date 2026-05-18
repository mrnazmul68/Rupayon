import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, categoriesApi, uploadApi } from "../../services/api.js";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBox, FaUpload, FaTimes, FaSyncAlt } from "react-icons/fa";
import { ProductsTableSkeleton } from "../../components/Skeletons.jsx";
import { VirtualList } from "../../components/VirtualList.jsx";
import { useToast } from "../../context/useToast.js";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    price: "",
    category: "",
    color: "",
    colors: [],
    size: "",
    sizes: [],
    stock: "",
    image: "",
    images: [],
    rating: 0,
    isNewArrival: false,
    isBestSeller: false,
    isCurated: false,
  });

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getAll,
  });

  const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchProducts(), refetchCategories()]);
    setIsRefreshing(false);
  };

  const isLoading = productsLoading || categoriesLoading;

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
    
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removePreview = (index) => {
    const newPreviews = [...previewImages];
    const newFiles = [...selectedFiles];
    const newImages = [...formData.images];
    
    const isExistingImage = index < formData.images?.length;
    
    if (isExistingImage) {
      newImages.splice(index, 1);
      setFormData({
        ...formData,
        images: newImages,
        image: newImages[0]?.url || "",
      });
    } else {
      const fileIndex = index - (formData.images?.length || 0);
      newFiles.splice(fileIndex, 1);
      setSelectedFiles(newFiles);
    }
    
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor.trim()],
        color: newColor.trim(),
      });
      setNewColor("");
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c !== colorToRemove),
      color: formData.color === colorToRemove ? formData.colors[0] || "" : formData.color,
    });
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize.trim()],
        size: newSize.trim(),
      });
      setNewSize("");
    }
  };

  const removeSize = (sizeToRemove) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((s) => s !== sizeToRemove),
      size: formData.size === sizeToRemove ? formData.sizes[0] || "" : formData.size,
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      let uploadedImages = [];
      if (selectedFiles.length > 0) {
        setUploading(true);
        const base64Images = await Promise.all(selectedFiles.map(fileToBase64));
        const uploadResult = await uploadApi.images(base64Images);
        uploadedImages = uploadResult.images;
        setUploading(false);
      }
      
      const productData = {
        ...data,
        images: [...(data.images || []), ...uploadedImages],
        image: data.image || uploadedImages[0]?.url || "",
      };
      
      return productsApi.create(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      resetForm();
      showToast({ type: "success", message: "Product created successfully!" });
    },
    onError: (error) => {
      showToast({ type: "error", message: error.message || "Failed to create product" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      let uploadedImages = [];
      if (selectedFiles.length > 0) {
        setUploading(true);
        const base64Images = await Promise.all(selectedFiles.map(fileToBase64));
        const uploadResult = await uploadApi.images(base64Images);
        uploadedImages = uploadResult.images;
        setUploading(false);
      }
      
      const productData = {
        ...data,
        images: [...(data.images || []), ...uploadedImages],
        image: data.image || (data.images?.[0]?.url) || uploadedImages[0]?.url || "",
      };
      
      return productsApi.update(id, productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      resetForm();
      showToast({ type: "success", message: "Product updated successfully!" });
    },
    onError: (error) => {
      showToast({ type: "error", message: error.message || "Failed to update product" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast({ type: "success", message: "Product deleted successfully!" });
    },
    onError: (error) => {
      showToast({ type: "error", message: error.message || "Failed to delete product" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      description: "",
      price: "",
      category: "",
      color: "",
      colors: [],
      size: "",
      sizes: [],
      stock: "",
      image: "",
      images: [],
      rating: 0,
      isNewArrival: false,
      isBestSeller: false,
      isCurated: false,
    });
    setSelectedFiles([]);
    setPreviewImages([]);
    setNewColor("");
    setNewSize("");
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      title: product.title || "",
      description: product.description,
      price: product.price,
      category: product.category,
      color: product.color,
      colors: product.colors || [],
      size: product.size,
      sizes: product.sizes || [],
      stock: product.stock,
      image: product.image || "",
      images: product.images || [],
      rating: product.rating || 0,
      isNewArrival: product.isNewArrival || false,
      isBestSeller: product.isBestSeller || false,
      isCurated: product.isCurated || false,
    });
    setPreviewImages(product.images?.map((img) => img.url) || []);
    setSelectedFiles([]);
    setNewColor("");
    setNewSize("");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <FaSyncAlt className={isRefreshing ? "refresh-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Add Product
          </button>
        </div>
      </div>

      {isLoading || isRefreshing ? (
        <ProductsTableSkeleton />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="bg-gray-50 px-6 py-3">
                <div className="grid grid-cols-6 gap-4">
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </div>
                </div>
              </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No products found
              </div>
            ) : (
              <VirtualList
                items={filteredProducts}
                itemHeight={80}
                containerHeight={600}
                renderItem={(product) => (
                  <div className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 border-b border-gray-200 items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 shrink-0">
                        {product.image ? (
                          <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <FaBox className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.category}
                    </div>
                    <div className="text-sm text-gray-900">
                      ৳{product.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.stock}
                    </div>
                    <div>
                      <div className="flex gap-1">
                        {product.isNewArrival && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Best Seller
                          </span>
                        )}
                        {product.isCurated && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Curated
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                No products found
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 shrink-0">
                      {product.image ? (
                        <img className="h-16 w-16 rounded-lg object-cover" src={product.image} alt="" />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                          <FaBox className="text-gray-400" size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">৳{product.price}</p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {product.isNewArrival && (
                      <span className="px-2 py-1 inline-flex text-xs leading-none font-semibold rounded-full bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="px-2 py-1 inline-flex text-xs leading-none font-semibold rounded-full bg-green-100 text-green-800">
                        Best Seller
                      </span>
                    )}
                    {product.isCurated && (
                      <span className="px-2 py-1 inline-flex text-xs leading-none font-semibold rounded-full bg-purple-100 text-purple-800">
                        Curated
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <FaEdit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <FaTrash size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colors
                  </label>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {formData.colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                      placeholder="Add a color (e.g. Black, White, Red)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sizes
                  </label>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {formData.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
                      placeholder="Add a size (e.g. S, M, L, XL, 50, 52)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <FaUpload className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>
                  {uploading && (
                    <div className="mt-3 text-center">
                      <p className="text-sm text-gray-600">Uploading images...</p>
                    </div>
                  )}
                  {previewImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {previewImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePreview(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">New Arrival</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Best Seller</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isCurated}
                    onChange={(e) => setFormData({ ...formData, isCurated: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Curated</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
