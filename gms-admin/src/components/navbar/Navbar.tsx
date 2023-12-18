import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import useAuthStore from "../../zustand/AuthStore";
import { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import UploadImage from "../modal/uploade_image/UploadImage";

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const clearUser = useAuthStore((state) => state.clearUser);

  const toggleClose = () => {
    setOpen(false);
  };

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
          <Link to="/sales" style={{ textDecoration: "none" }}>
            <span className="navbar-links">SALES </span>
          </Link>

          <span className="navbar-links" onClick={() => setOpen(true)}>
            SCREEN SAVER
          </span>
        </div>
        <button className="navbar-logout" onClick={clearUser}>
          Logout
        </button>
      </div>
      <Dialog open={open} onClose={toggleClose}>
        <DialogContent>
          <UploadImage />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;
