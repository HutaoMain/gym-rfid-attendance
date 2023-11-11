import { useState } from "react";
import "./AddUser.css";
import axios from "axios";
import { toast } from "react-toastify";

interface Prop {
  toggleIsOpen: () => void;
}

const AddUser = ({ toggleIsOpen }: Prop) => {
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("male");
  const [address, setAddress] = useState<string>("");
  const [rfid, setRfid] = useState<string>("");

  const [ImageFile, setImageFile] = useState<string>("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (
      rfid === "" ||
      lastName === "" ||
      firstName === "" ||
      contactNumber === "" ||
      address === ""
    ) {
      return alert("Please complete the form before you submit.");
    }

    const data = new FormData();
    data.append("file", ImageFile);
    data.append("upload_preset", "upload");
    const uploadRes = await axios.post(
      "https://api.cloudinary.com/v1_1/alialcantara/image/upload",
      data
    );
    const { url } = uploadRes.data;

    console.log(url);

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/user/register`,
        {
          imageUrl: url,
          lastName: lastName,
          firstName: firstName,
          contactNumber: contactNumber,
          gender: selectedGender,
          address: address,
          rfid: rfid,
        }
      );
      toast("Successful Registration!", {
        type: "success",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
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
    <div className="container">
      <h2 className="heading">Add User</h2>

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
          Upload the image of customer here..
          <input
            type="file"
            id="file-upload"
            onChange={fileTypeChecking}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="lastName">RFID</label>
        <input
          type="text"
          placeholder="Enter RFID Number"
          onChange={(e) => setRfid(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          placeholder="Enter your Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">First name</label>
        <input
          type="text"
          placeholder="Enter your First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contact Number</label>
        <input
          type="text"
          placeholder="Enter your Contact Number"
          onChange={(e) => setContactNumber(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Gender</label>
        <select
          style={{ width: "342px" }}
          onChange={(e) => setSelectedGender(e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="password">Address</label>
        <input
          type="text"
          placeholder="Enter your address"
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="btn-container">
        <button className="btn" onClick={handleSubmit}>
          Submit
        </button>
        <button
          className="btn"
          style={{ backgroundColor: "red" }}
          onClick={toggleIsOpen}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddUser;
