import "./Checkout.css";
import { useCartStore } from "../../zustand/CartStore";
// import { IndeterminateCheckBox, AddBox } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import ProductRating from "../rating/ProductRating";
import { AddBox, IndeterminateCheckBox } from "@mui/icons-material";

const Checkout = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const total = useCartStore((state) => state.total);

  const [openRating, setOpenRating] = useState<boolean>(false);
  const [rfidNumber, setRfidNumber] = useState<string>("");

  const itemsToString = JSON.stringify(items);

  const handlePlaceOrder = async () => {
    const orderData = {
      products: items.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
      })),
      // email: user,
      // userFullName: data?.name,
      totalPrice: total,
      orderList: itemsToString,
      status: "Pending",
      rfid: rfidNumber,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/order/create`,
        orderData
      );
      window.localStorage.removeItem("cart-storage");
      toast("Successfully ordered!", {
        type: "success",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        setOpenRating(true);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const closeRatingModal = () => {
    setOpenRating(false);
    window.location.reload();
  };

  return (
    <div className="checkout">
      <label style={{ fontSize: "20px" }}>
        You need to tap your RFID to checkout your items.
        <input
          type="text"
          value={rfidNumber}
          className="userinfo-input"
          style={{
            border: "1px solid black",
            height: "40px",
            fontSize: "18px",
            paddingLeft: "10px",
          }}
          onChange={(e) => setRfidNumber(e.target.value)}
        />
      </label>

      <h1>Check Out</h1>
      <div className="checkout-container">
        <div>
          <h2>Here's what you're getting!</h2>
        </div>
        <hr
          style={{
            border: "3px solid gray",
            marginBottom: "20px",
          }}
        />
        {items?.map((item) => (
          <section className="checkout-product" key={item.id}>
            <div className="checkout-product-container">
              <img
                className="checkout-image"
                src={item.productImage}
                alt={item.productName}
              />
            </div>
            <label>
              Product Name: <b>{item.productName}</b>
            </label>
            <label>
              Product Price: <b>{item.price}</b>
            </label>
            <div className="checkout-quantity-btn-container">
              <label>Quantity:</label>
              <div className="checkout-quantity-btn">
                {item.quantity >= 2 ? (
                  <IndeterminateCheckBox
                    onClick={() => decreaseItem(item.id)}
                    style={{ cursor: "pointer", fontSize: "20px" }}
                  />
                ) : (
                  <></>
                )}

                <span>{item.quantity}</span>
                <AddBox
                  onClick={() => increaseItem(item.id)}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                />
              </div>
            </div>
            <label>
              Price: <b>{item.price * item.quantity}</b>
            </label>
            <button
              className="checkout-cancelbtn"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </section>
        ))}
      </div>
      <h1>
        TOTAL PRICE: <b>{total}</b>
      </h1>
      <button
        disabled={total === 0 || !rfidNumber}
        className="checkout-btn"
        onClick={handlePlaceOrder}
        style={{
          padding: "20px 40px",
          border: "none",
          backgroundColor: "#98BF64",
          borderRadius: "10px",
          color: "#ffffff",
          fontSize: "18px",
        }}
      >
        Checkout
      </button>
      <Dialog open={openRating} onClose={closeRatingModal}>
        <DialogContent>
          <ProductRating closeRatingModal={closeRatingModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
