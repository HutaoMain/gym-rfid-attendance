import "./Login.css";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/AuthStore";
import { LoginInterface } from "../../Types";

const Login = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<LoginInterface>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/user/login`,
        credentials
      );
      setLoading(false);
      setUser(credentials.email);
      navigate("/");
    } catch (err) {
      setLoading(false);
      console.log(err);
      setErrors("Incorrect email or password.");
    }
  };

  return (
    <div className="login-container">
      <section className="login-header">
        <h1>Sign in to your Admin Account</h1>
      </section>
      <div className="login-logo">{/* <img src= alt="Logo" /> */}</div>
      <div className="login-title">
        {/* <h1>Welcome to Event Registration System</h1> */}
      </div>
      <div className="login-form">
        <form>
          <div className="login-input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={onChangeHandler}
            />
          </div>
          <div className="login-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={onChangeHandler}
            />
          </div>
          {errors && (
            <div style={{ padding: "5px 0" }}>
              <span style={{ color: "red" }}>{errors}</span>
            </div>
          )}
          <div className="button-group">
            <button type="submit" onClick={handleLogin}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
