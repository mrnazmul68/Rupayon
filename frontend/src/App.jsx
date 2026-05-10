import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductDetails";
import ScrollToTop from "./pages/ScrollToTop";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import UserOrders from "./pages/UserOrders";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import SkeletonLoader from "./components/SkeletonLoader";
import { useAuth } from "./context/useAuth";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div>
      <ScrollToTop/>
      <Routes>
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/*" element={
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/sign-up" element={<Signup/>} />
              <Route path="/cart" element={<Cart/>} />
              <Route path="/products" element={<Shop/>} />
              <Route path="/product/:id" element={<ProductDetails/>} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout/>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile/>
                </ProtectedRoute>
              } />
              <Route path="/profile/orders" element={
                <ProtectedRoute>
                  <UserOrders/>
                </ProtectedRoute>
              } />
            </Routes>
            <Footer/>
          </div>
        } />
      </Routes>
    </div>
  );
};

export default App;
