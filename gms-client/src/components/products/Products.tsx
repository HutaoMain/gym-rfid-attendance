// import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../product_card/ProductCard";
import { ProductInterface } from "../../Types";
// import { useQuery } from "react-query";
import axios from "axios";
import { useLocation } from "react-router-dom";

type Props = {
  category: string;
  priceRange: number[];
};

const Products = ({ category, priceRange }: Props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");

  const [productData, setProductData] = useState<ProductInterface[]>([]);

  console.log("Products", category);

  useEffect(() => {
    if (category) {
      const fetch = async () => {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/product/list?categoryName=${category.trim()}`
        );
        setProductData(response.data);
      };
      fetch();
    } else {
      const fetch = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/product/list`
        );
        setProductData(response.data);
      };
      fetch();
    }
  }, [category]);

  const [query, setQuery] = useState("");

  const filtered = productData?.filter((item) => {
    return (
      item.productName.toLowerCase().includes(query.toLowerCase()) &&
      (!categoryParam || item.category === categoryParam) &&
      item.price >= priceRange[0] &&
      item.price <= priceRange[1]
    );
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "10px",
        marginTop: "20px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <input
          style={{ height: "35px", width: "300px", paddingLeft: "10px" }}
          type="text"
          placeholder="Search Product Name Here...."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {filtered?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
};

export default Products;
