import { useState } from "react";
import CategorySidebar from "../../components/category_sidebar/CategorySidebar";
import FilterSlider from "../../components/filter_slider/FilterSlider";
import Products from "../../components/products/Products";
import "./Shop.css";

const Shop = () => {
  const [category, setCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);

  console.log(category);
  return (
    <div className="shop">
      <div className="shop-container">
        <div className="shop-left">
          <CategorySidebar setCategory={setCategory} />
          <FilterSlider priceRange={priceRange} setPriceRange={setPriceRange} />
        </div>
        <Products category={category} priceRange={priceRange} />
      </div>
    </div>
  );
};

export default Shop;
