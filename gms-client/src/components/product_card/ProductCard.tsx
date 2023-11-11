import "./ProductCard.css";
import { ProductInterface } from "../../Types";
import { ShoppingCart } from "@mui/icons-material";
import { useCartStore } from "../../zustand/CartStore";
import { useState, useEffect } from "react";

interface ProductProps {
  product: ProductInterface;
}

const ProductCard = ({ product }: ProductProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addItem(product, quantity);
    } else {
      alert("Quantity is 0");
    }
  };

  useEffect(() => {
    if (product.quantity === 0) {
      setQuantity(0);
    }
  }, [product.quantity]);

  return (
    <div className="product-card">
      <img
        className="product-card-image"
        src={product.productImage}
        alt={product.productName}
      />
      <div className="product-card-shopping-icon" onClick={handleAddToCart}>
        <ShoppingCart
          sx={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
            transform: "rotate(75deg)",
          }}
        />
      </div>
      <h3>{product.productName}</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <span>Price: ₱{product.price}</span>
        <span>QTY: {product.quantity}</span>
      </div>
    </div>
  );
};

export default ProductCard;
