import React, { useState } from "react";
import "./LoginForm.css";
import picture from "../Assets/5.png";

import { IoLogIn } from "react-icons/io5";
// import { MdOutgoingMail } from "react-icons/md";
// import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = ({ setLoginUser }) => {
  const navigate = useNavigate();
  const [userLog, setLog] = useState({
    email: "",
    password: "",
  });
  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setLog({
      ...userLog,
      [name]: value,
    });
  };
  const login = () => {
    const { email, password } = userLog;
    if (email && password) {
      axios.post("http://localhost:9002/login", userLog).then((res) => {
        alert(res.data.message);
        if (typeof res.data.user === "object") {
          // console.log(res.data.user);
          setLoginUser(res.data.user);
          navigate("/tracking");
        } else {
          console.log("No Values");
        }
      });
    } else {
      alert("You Entered Something Wrong ❌");
    }
  };
  return (
    <div className="login-logo-wrapper">
      <div className="login-logo">
        <div className="logo">
          <img src={picture} alt="" />
        </div>
      </div>
      <div className="login-wrapper">
        <div className="title">LOG IN</div>
        <div className="email">
          <input
            type="email"
            name="email"
            id="email"
            value={userLog.email}
            onChange={handleLogChange}
            placeholder="📧 Email"
          />
        </div>
        <div className="password">
          <input
            type="password"
            name="password"
            id="password"
            value={userLog.password}
            onChange={handleLogChange}
            placeholder="🔑 Password"
          />
        </div>
        <div className="login-label">
          <label>Forgot Password?</label>
        </div>
        <div className="submit-button" onClick={login}>
          <button>
            Log In
            <IoLogIn className="icon" />
          </button>
        </div>
        <div className="login-label login-label-align">
          <label onClick={() => navigate("/signup")}>
            Don't have an account? <u>Create Account</u>
          </label>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
