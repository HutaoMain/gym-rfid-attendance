import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import useAuthStore from "../../zustand/AuthStore";

const Navbar = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  return (
    <div className="navbar">
      <div className="navbar-container">
        <img src={logo} alt="logo" className="nav-logo" />
        <div className="navbar-links-container">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="navbar-links">DASHBOARD</span>
          </Link>
          <Link to="/categories" style={{ textDecoration: "none" }}>
            <span className="navbar-links">CATEGORY</span>
          </Link>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <span className="navbar-links">PRODUCT </span>
          </Link>
          <Link to="/orders" style={{ textDecoration: "none" }}>
            <span className="navbar-links">ORDER </span>
          </Link>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <span className="navbar-links">USER </span>
          </Link>
          <Link to="/attendance" style={{ textDecoration: "none" }}>
            <span className="navbar-links">ATTENDANCE </span>
          </Link>
        </div>
        <button className="navbar-logout" onClick={clearUser}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
