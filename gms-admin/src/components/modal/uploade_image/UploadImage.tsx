import { Check } from "@mui/icons-material";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const UploadImage = () => {
  const [imageFiles, setImageFiles] = useState<Array<File>>([]);

  console.log("images: ", imageFiles);

  const handleSubmit = async () => {
    if (imageFiles.length === 0) {
      return alert("Please upload images.");
    }

    try {
      const list = await Promise.all(
        Object.values(imageFiles).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "upload");
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/alialcantara/image/upload",
            data
          );
          const { url } = uploadRes.data;
          return url;
        })
      );

      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/screensaver/update`,
        {
          imageUrl: list,
        }
      );
      toast.success("Sucessfully update the screensaver!", {
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

  const fileTypeChecking = () => {
    var fileInput = document.getElementById("file-upload") as HTMLInputElement;
    var newImageFiles = Array.from(fileInput.files || []);

    if (newImageFiles.length === 0) {
      alert("Please select at least one image.");
      fileInput.value = "";
      return;
    }

    // Allowing file types
    var allowedExtensions = /\.(png|jpg|jpeg)$/i;
    for (const file of newImageFiles) {
      if (!allowedExtensions.test(file.name)) {
        alert("Invalid file type");
        fileInput.value = "";
        return;
      }
    }

    setImageFiles(newImageFiles);
  };

  return (
    <div style={{ width: "360px", height: "360px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div className="upload-image-container">
          {imageFiles.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(
                new Blob([file], { type: "image/jpeg" })
              )}
              alt={`Selected Image ${index + 1}`}
              className="addcategory-img"
            />
          ))}

          <label htmlFor="file-upload" className="receipt-input-image">
            Upload the image of screensaver here..
            <input
              type="file"
              id="file-upload"
              onChange={fileTypeChecking}
              multiple
              style={{ display: "none" }}
            />
          </label>
        </div>
        <button
          className="addproduct-btn"
          style={{ backgroundColor: "black" }}
          onClick={handleSubmit}
        >
          <Check /> Submit
        </button>
      </div>
    </div>
  );
};

export default UploadImage;
