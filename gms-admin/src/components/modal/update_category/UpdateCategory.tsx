import React, { useState, useEffect } from "react";
import { Close, Check } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { CategoryInterface } from "../../../Types";

interface Prop {
  toggleModal: () => void;
  productId: string;
}

const UpdateCategory: React.FC<Prop> = ({ toggleModal, productId }) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryData, setCategoryData] = useState<CategoryInterface>();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/category/list/${productId}`
      );
      setCategoryData(res.data);
    };

    fetch();
  }, [productId]);

  const handleUpdate = async () => {
    if (categoryName === "") {
      return alert("Please input category name before you submit");
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/category/update/${productId}`,
        {
          categoryName:
            categoryName !== "" ? categoryName : categoryData?.categoryName,
        }
      );
      toast.success("Sucessfully updated category!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
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

  console.log("productID ito: ", productId);
  console.log("categoryData ", categoryData);

  return (
    <div className="add-category">
      <div style={{ padding: "10px 0", fontSize: "20px" }}>Update Category</div>
      <hr style={{ marginBottom: "20px" }} />
      <section className="addcategory-item-section" style={{ width: "100%" }}>
        <label>Category Name</label>
        <input
          className="addcategory-input"
          style={{ width: "95%" }}
          type="text"
          defaultValue={categoryData?.categoryName}
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
          onClick={handleUpdate}
        >
          <Check /> Submit
        </button>
      </div>
    </div>
  );
};

export default UpdateCategory;
