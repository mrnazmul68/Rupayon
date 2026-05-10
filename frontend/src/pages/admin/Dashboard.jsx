import { useQuery } from "@tanstack/react-query";
import { ordersApi, productsApi, usersApi } from "../../services/api.js";
import { useToast } from "../../context/useToast.js";
import { useEffect, useRef, useState } from "react";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaMoneyBillWave,
  FaSyncAlt,
} from "react-icons/fa";
import { DashboardSkeleton } from "../../components/Skeletons.jsx";

const Dashboard = () => {
  const { showToast } = useToast();
  const previousOrdersCountRef = useRef(0);
  const previousPendingCountRef = useRef(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: ordersApi.getStats,
    refetchInterval: 5000,
  });

  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getAll,
  });

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
  });

  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.getAll,
    refetchInterval: 5000,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchStats(), refetchProducts(), refetchUsers(), refetchOrders()]);
    setIsRefreshing(false);
  };

  const isLoading = statsLoading || productsLoading || usersLoading || ordersLoading;

  const stats = statsData?.stats || {};
  const products = productsData?.products || [];
  const users = usersData?.users || [];
  const orders = ordersData?.orders || [];

  useEffect(() => {
    if (orders.length > previousOrdersCountRef.current && previousOrdersCountRef.current > 0) {
      const newOrder = orders[0];
      showToast({
        type: "info",
        message: `New order received! Order #${newOrder.orderNumber} from ${newOrder.customerName}`,
        duration: 8000,
      });
    }
    previousOrdersCountRef.current = orders.length;

    if (stats.pendingOrders > previousPendingCountRef.current && previousPendingCountRef.current > 0) {
      showToast({
        type: "info",
        message: `You have ${stats.pendingOrders} pending orders to review!`,
        duration: 8000,
      });
    }
    previousPendingCountRef.current = stats.pendingOrders || 0;
  }, [orders, stats.pendingOrders, showToast]);

  const statCards = [
    {
      title: "Total Products",
      value: products.length,
      icon: FaBox,
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders || 0,
      icon: FaShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: FaUsers,
      color: "bg-purple-500",
    },
    {
      title: "Total Revenue",
      value: `৳${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: FaMoneyBillWave,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <FaSyncAlt className={isRefreshing ? "refresh-spin" : ""} />
          Refresh
        </button>
      </div>

      {isLoading || isRefreshing ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4"
            >
              <div className={`${card.color} p-4 rounded-lg text-white`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Products</h3>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div key={product._id} className="flex items-center gap-4 py-2 border-b border-gray-100">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <FaBox className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">৳{product.price}</p>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-center py-4">No products yet</p>
            )}
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
