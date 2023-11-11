import axios from "axios";
import "./AddProduct.css";
import { Close, Check } from "@mui/icons-material";
import { useQuery } from "react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { CategoryInterface } from "../../../Types";

interface props {
  toggleProductModal: () => void;
}

const AddProduct = ({ toggleProductModal }: props) => {
  const { data } = useQuery<CategoryInterface[]>({
    queryKey: ["addProduct"],
    queryFn: async () =>
      await axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/category/list`)
        .then((res) => res.data),
  });

  const [ImageFile, setImageFile] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [category, setCategory] = useState<string>("");

  const handleSubmit = async () => {
    if (
      productName === "" ||
      ImageFile === "" ||
      description === "" ||
      category === "" ||
      quantity === 0 ||
      price === 0
    ) {
      return alert("Please complete the form before you submit");
    }

    try {
      const data = new FormData();
      data.append("file", ImageFile);
      data.append("upload_preset", "upload");
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/alialcantara/image/upload",
        data
      );
      const { url } = uploadRes.data;

      console.log(url);

      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/product/create`,
        {
          productName: productName,
          productImage: url,
          description: description,
          price: price,
          quantity: quantity,
          category: category,
        }
      );
      toast.success("Sucessfully added product!", {
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

  const fileTypeChecking = (e: any) => {
    var fileInput = document.getElementById("file-upload") as HTMLInputElement;
    var filePath = fileInput.value;

    // Allowing file type
    var allowedExtensions = /(\.png|\.jpg|\.jpeg)$/i;
    // |\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd

    if (!allowedExtensions.exec(filePath)) {
      alert("Invalid file type");
      fileInput.value = "";
      return false;
    }

    setImageFile(e.target.files[0]);
  };

  return (
    <div className="addproduct">
      <div style={{ padding: "10px 0", fontSize: "20px" }}>Add Product</div>
      <hr style={{ marginBottom: "20px" }} />
      <div className="upload-image-container">
        <img
          src={
            ImageFile
              ? URL.createObjectURL(
                  new Blob([ImageFile], { type: "image/jpeg" })
                )
              : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
          }
          alt="AddImage"
          className="addcategory-img"
        />
        <label htmlFor="file-upload" className="receipt-input-image">
          Upload the image of category here..
          <input
            type="file"
            id="file-upload"
            onChange={fileTypeChecking}
            style={{ display: "none" }}
          />
        </label>
      </div>
      <section className="addproduct-item-section" style={{ width: "100%" }}>
        <div className="addproduct-item-list" style={{ width: "50%" }}>
          <label>
            Product Name
            <input
              className="addproduct-input"
              style={{ width: "95%" }}
              type="text"
              name="productName"
              onChange={(e) => setProductName(e.target.value)}
            />
          </label>
        </div>
        <div className="addproduct-item-list" style={{ width: "50%" }}>
          <label>
            Category
            <select
              className="addproduct-input"
              style={{ height: "53px", width: "95%", fontSize: "16px" }}
              name="categoryId"
              defaultValue={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">please select category</option>
              {data?.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.categoryName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="addproduct-item-list" style={{ width: "100%" }}>
        <label
          style={{ display: "flex", flexDirection: "column", height: "63px" }}
        >
          Description
          <input
            className="addproduct-input"
            style={{ width: "94%" }}
            type="text"
            name="description"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </section>

      <section className="addproduct-item-section" style={{ width: "100%" }}>
        <div className="addproduct-item-list" style={{ width: "50%" }}>
          <label>
            Qty
            <input
              className="addproduct-input addproduct-input-number"
              type="number"
              style={{ width: "95%" }}
              name="quantity"
              defaultValue={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </label>
        </div>
        <div className="addproduct-item-list" style={{ width: "50%" }}>
          <label>
            Price
            <input
              className="addproduct-input addproduct-input-number"
              type="number"
              style={{ width: "95%" }}
              name="price"
              defaultValue={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
            />
          </label>
        </div>
      </section>
      <hr style={{ marginTop: "20px" }} />
      <div className="addproduct-btn-container">
        <button className="addproduct-btn close" onClick={toggleProductModal}>
          <Close /> Close
        </button>
        <button className="addproduct-btn submit" onClick={handleSubmit}>
          <Check /> Submit
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
