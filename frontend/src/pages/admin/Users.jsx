import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../services/api.js";
import { FaSearch, FaEdit, FaTrash, FaUser, FaSyncAlt } from "react-icons/fa";
import { UsersPageSkeleton } from "../../components/Skeletons.jsx";
import { VirtualList } from "../../components/VirtualList.jsx";
import { useToast } from "../../context/useToast.js";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activityCleared, setActivityCleared] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    isActive: true,
  });

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: usersData, isLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["users", roleFilter],
    queryFn: () => usersApi.getAll({ role: roleFilter }),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchUsers();
    setIsRefreshing(false);
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      showToast({ type: "success", message: "User updated successfully!" });
    },
    onError: (error) => {
      showToast({ type: "error", message: error.message || "Failed to update user" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showToast({ type: "success", message: "User deleted successfully!" });
    },
    onError: (error) => {
      showToast({ type: "error", message: error.message || "Failed to delete user" });
    },
  });

  const markActivitySeenMutation = useMutation({
    mutationFn: usersApi.markActivitySeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const users = usersData?.users || [];
  const newActivityCount = users.filter((user) => user.hasNewActivity).length;

  useEffect(() => {
    if (!isLoading && newActivityCount > 0 && !activityCleared) {
      setActivityCleared(true);
      markActivitySeenMutation.mutate();
    }
  }, [activityCleared, isLoading, markActivitySeenMutation, newActivityCount]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: editingUser._id, data: formData });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const adminUsers = users.filter(u => u.role === "admin").length;
  const customerUsers = users.filter(u => u.role === "customer").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <FaSyncAlt className={isRefreshing ? "refresh-spin" : ""} />
          Refresh
        </button>
      </div>

      {isLoading || isRefreshing ? (
        <UsersPageSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Admins</p>
                  <p className="text-3xl font-bold text-purple-600">{adminUsers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Customers</p>
                  <p className="text-3xl font-bold text-indigo-600">{customerUsers}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4 flex-wrap">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="bg-gray-50 px-6 py-3">
                <div className="grid grid-cols-6 gap-4">
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </div>
                  <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </div>
                </div>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No users found
                </div>
              ) : (
                <VirtualList
                  items={filteredUsers}
                  itemHeight={80}
                  containerHeight={600}
                  renderItem={(user) => (
                    <div className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 border-b border-gray-200 items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0">
                          {user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {user.hasNewActivity && (
                            <div className="mt-1 flex items-center gap-2">
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                                New
                              </span>
                              {user.activityMessage && (
                                <span className="text-xs text-red-600">{user.activityMessage}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.phone || "-"}
                      </div>
                      <div>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
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
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 shrink-0">
                      {user.avatar ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={user.avatar}
                          alt=""
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="text-gray-400" size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                      {user.hasNewActivity && (
                        <span className="mt-1 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                          {user.activityMessage || "New activity"}
                        </span>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      {user.phone && (
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-none font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-none font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(user)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <FaEdit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
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
        </div>
      )}

      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
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
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
