import React, { useState } from "react";
import "./AddCategory.css";
import { Close, Check } from "@mui/icons-material";
import axios from "axios";

interface Prop {
  toggleModal: () => void;
}

const AddCategory: React.FC<Prop> = ({ toggleModal }) => {
  const [categoryName, setCategoryName] = useState<string>("");

  const handleAddCategory = async () => {
    if (categoryName === "") {
      return alert("Please input category name before you submit");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/category/create`,
        {
          categoryName: categoryName,
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add-category">
      <div style={{ padding: "10px 0", fontSize: "20px" }}>Add Category</div>
      <hr style={{ marginBottom: "20px" }} />
      <section className="addcategory-item-section" style={{ width: "100%" }}>
        <label>Category Name</label>
        <input
          className="addcategory-input"
          style={{ width: "95%" }}
          type="text"
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </section>
      <div className="addcategory-btn-container">
        <button
          className="addproduct-btn"
          style={{ backgroundColor: "red" }}
          onClick={toggleModal}
        >
          <Close /> Close
        </button>
        <button
          className="addproduct-btn"
          style={{ backgroundColor: "green" }}
          onClick={handleAddCategory}
        >
          <Check /> Submit
        </button>
      </div>
    </div>
  );
};

export default AddCategory;
