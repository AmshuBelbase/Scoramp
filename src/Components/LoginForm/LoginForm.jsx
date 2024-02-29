import React, { useState } from "react";
import "./LoginForm.css";
import { IoLogIn } from "react-icons/io5";
import { MdOutgoingMail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
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
  return (
    <div className="wrapper">
      <h1>Log In</h1>
      <div className="input-box">
        <input
          type="email"
          name="email"
          value={userLog.email}
          onChange={handleLogChange}
          placeholder="Email"
          required
        />
        <MdOutgoingMail className="icon" />
      </div>
      <div className="input-box">
        <input
          type="password"
          name="password"
          value={userLog.password}
          onChange={handleLogChange}
          placeholder="Password"
          required
        />
        <FaLock className="icon" />
      </div>
      <div className="remember-forgot">
        <label>
          <input type="checkbox" />
          Remember Me
        </label>
        <label className="myLabel">Lost Password ?</label>
      </div>
      <button type="submit" onClick={login}>
        Log In <IoLogIn className="icon" />
      </button>
      <div className="register-link">
        <p>
          Don't have an account ?{" "}
          <label onClick={() => navigate("/create")}>Sign Up</label>
        </p>
      </div>
    </div>
  );
};
export default LoginForm;
