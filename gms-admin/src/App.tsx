import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/navbar/Navbar";
import useAuthStore from "./zustand/AuthStore";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import User from "./pages/user/User";
import Product from "./pages/product/Product";
import Order from "./pages/order/Order";
import Category from "./pages/category/Category";
import Attendance from "./pages/attendance/Attendance";
import OTP from "./components/otp/OTP";
import Sales from "./pages/sales/Sales";

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="app">
      {user ? <Navbar /> : <></>}
      <div className="app-body">
        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/users"
            element={user ? <User /> : <Navigate to="/login" />}
          />
          <Route
            path="/products"
            element={user ? <Product /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={user ? <Order /> : <Navigate to="/login" />}
          />
          <Route
            path="/categories"
            element={user ? <Category /> : <Navigate to="/login" />}
          />
          <Route
            path="/attendance"
            element={user ? <Attendance /> : <Navigate to="/login" />}
          />
          <Route path="/otp/:email" element={<OTP />} />
          <Route
            path="/sales"
            element={user ? <Sales /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
