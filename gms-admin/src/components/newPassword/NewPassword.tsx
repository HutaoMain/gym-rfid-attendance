import axios from "axios";
import "./NewPassword.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Prop {
  email: string;
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const NewPassword = ({ email }: Prop) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNewPasswordChange = (event: any) => {
    setNewPassword(event.target.value);
    validatePassword(event.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
    validatePassword(newPassword, event.target.value);
  };

  const validatePassword = (newPassword: string, confirmPassword: string) => {
    // At least 1 uppercase, 1 lowercase, 1 special character, and minimum 8 characters

    const isValidPassword =
      passwordRegex.test(newPassword) && newPassword === confirmPassword;

    setPasswordMatch(isValidPassword);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (passwordMatch) {
      // Passwords match, you can implement your password change logic here
      try {
        await axios.put(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/user/changePassword/${email}`,
          {
            password: newPassword,
          }
        );
        setLoading(false);
        alert("Password changed successfully!");
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      setLoading(false);
      // Passwords don't match
      alert("Passwords do not match. Please try again.");
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        {!passwordMatch && (
          <p className="error-message">Passwords do not match.</p>
        )}
        {!passwordRegex.test(newPassword) && (
          <p className="error-message">
            Password must have at least 1 uppercase, 1 lowercase, 1 special
            character, and be 8 characters long.
          </p>
        )}
        <button
          disabled={!passwordMatch && !passwordRegex.test(newPassword)}
          className="newpassword-btn"
          onClick={handleSubmit}
        >
          {loading ? "Please wait.." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
