export const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 animate-pulse">
    <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-20"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

export const ProductSkeleton = ({ isGrid = true }) => {
  return isGrid ? (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-3/4 bg-gray-200 rounded-xl"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  ) : (
    <div className="flex items-center gap-4 py-2 border-b border-gray-100 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
  </tr>
);

export const ShopSkeleton = () => (
  <div className="bg-navbg pt-16 min-h-screen text-slate-900">
    <header className="max-w-7xl mx-auto px-6 py-2 border-b border-slate-100">
      <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
    </header>
    <div className="max-w-7xl mx-auto px-6 py-10 flex gap-12">
      <aside className="hidden lg:block w-64 space-y-10">
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-4 border-b pb-2"></div>
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded w-20"></div>
            ))}
          </div>
        </div>
      </aside>
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8 border-b pb-6 gap-4 flex-wrap">
          <div className="h-10 bg-gray-200 rounded w-60"></div>
          <div className="flex gap-4 items-center">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-36 mb-4"></div>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <ProductSkeleton key={i} isGrid={false} />)}
        </div>
      </div>
    </div>
  </div>
);

export const ProductsTableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[1,2,3,4,5].map(i => <TableRowSkeleton key={i} />)}
      </tbody>
    </table>
  </div>
);

export const UsersPageSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
    <UsersTableSkeleton />
  </div>
);

export const OrdersTableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[1,2,3,4,5].map(i => (
          <tr key={i} className="animate-pulse">
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="px-6 py-4"><div className="space-y-1"><div className="h-4 bg-gray-200 rounded w-28"></div><div className="h-3 bg-gray-200 rounded w-32"></div></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CategoriesSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1,2,3,4,5].map(i => (
            <tr key={i} className="animate-pulse">
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
              <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const UsersTableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[1,2,3,4,5].map(i => (
          <tr key={i} className="animate-pulse">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
            </td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-36"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const FooterSkeleton = () => (
  <footer className="bg-white border-t border-gray-200 pt-16 pb-8 text-gray-800 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      
      {/* Brand Section */}
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex space-x-5">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-28 border-b pb-2"></div>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded mt-1"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded mt-1"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-28"></div>
            </div>
          </li>
        </ul>
      </div>

      {/* Contact & Services */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-16 border-b pb-2"></div>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </li>
          <li className="h-4 bg-gray-200 rounded w-24"></li>
          <li className="h-4 bg-gray-200 rounded w-20"></li>
          <li className="h-4 bg-gray-200 rounded w-32"></li>
        </ul>
      </div>

      {/* Subscribe Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-40 mt-3"></div>
      </div>

    </div>

    {/* Copyright */}
    <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
      <div className="h-3 bg-gray-200 rounded w-64"></div>
      <div className="flex items-center gap-4">
        <div className="h-3 bg-gray-200 rounded w-12"></div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </footer>
);
