import { useState } from "react";
import "./RegistrationPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/user/register`,
        {
          lastName: lastName,
          firstName: firstName,
          contactNumber: contactNumber,
          gender: selectedGender,
          address: address,
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
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-title">
        <h1>Please enter the student details</h1>
      </div>
      <div className="registration-form">
        <form>
          <div className="registration-input-group">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              placeholder="Enter your Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="registration-input-group">
            <label htmlFor="lastName">First name</label>
            <input
              type="text"
              placeholder="Enter your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="registration-input-group">
            <label htmlFor="password">Contact Number</label>
            <input
              type="text"
              placeholder="Enter your Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
          <div className="registration-input-group">
            <label htmlFor="password">Gender</label>
            <select onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="registration-input-group">
            <label htmlFor="password">Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="registration-button-group">
            <button type="submit" onClick={handleSubmit}>
              Register
            </button>
            <Link
              to="/login"
              className="registration-link"
              style={{ textDecoration: "none" }}
            >
              <button type="button">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
