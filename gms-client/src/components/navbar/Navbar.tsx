import "./Navbar.css";
import { Badge, Dialog, DialogContent } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useCartStore } from "../../zustand/CartStore";
import { Drawer } from "antd";
import { useState } from "react";
import Checkout from "../checkout/Checkout";

import logo from "../../../assets/logo.png";
import UserInfo from "../userInfo/UserInfo";

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAttendance, setOpenAttendance] = useState<boolean>(false);

  const cart = useCartStore((state) => state.items);

  const showDrawer = () => {
    setOpen(true);
  };

  const onCloseDrawer = () => {
    setOpen(false);
  };

  const toggleLogInAttendance = () => {
    setOpenAttendance(true);
  };

  const toggleCloseAttendance = () => {
    setOpenAttendance(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-black-container">
        <div className="navbar-content-container">
          <img src={logo} alt="logo" className="nav-logo" />
          <div className="navbar-black-content">
            <Badge
              badgeContent={cart.length}
              sx={{ color: "black" }}
              color="error"
              onClick={showDrawer}
            >
              <ShoppingCart sx={{ color: "black" }} />
            </Badge>
            <button onClick={toggleLogInAttendance}>Time in</button>
          </div>
        </div>
      </div>

      <Drawer placement="right" onClose={onCloseDrawer} open={open}>
        <Checkout />
      </Drawer>

      <Dialog open={openAttendance}>
        <DialogContent>
          <UserInfo
            openAttendance={openAttendance}
            toggleCloseAttendance={toggleCloseAttendance}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;
