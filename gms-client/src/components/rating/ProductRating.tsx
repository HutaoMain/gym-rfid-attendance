import { Rating } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

interface Prop {
  closeRatingModal: () => void;
}

const ProductRating = ({ closeRatingModal }: Prop) => {
  const [rating, setRating] = useState<number>(0);

  const handleProductRating = async (rating: number) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/productRating/rate`,
        {
          rating: rating,
        }
      );
      toast("Thanks for your patronage!", {
        type: "success",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "500px",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        Would you like to rate our service with you?
      </h1>
      <Rating
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          console.log(event);
          setRating(newValue || 0);
          handleProductRating(newValue || 0);
        }}
        size="large"
        sx={{
          fontSize: "4rem",
        }}
      />
      <button
        onClick={closeRatingModal}
        style={{
          border: "none",
          padding: "10px",
          width: "100px",
          marginTop: "20px",
          backgroundColor: "#FFBD44",
          fontWeight: "bold",
          borderRadius: "10px",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default ProductRating;
