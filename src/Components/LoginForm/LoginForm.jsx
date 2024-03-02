import React, { useState } from "react";
import "./LoginForm.css";
import picture from "../Assets/5.png";

import { IoLogIn } from "react-icons/io5";
import { MdOutgoingMail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = ({ setLoginUser }) => {
  const navigate = useNavigate();
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
          <input type="email" name="" id="" placeholder="📧 Email" />
        </div>
        <div className="password">
          <input type="password" name="" id="" placeholder="🔑 Password" />
        </div>
        <div className="login-label">
          <label onClick={() => navigate("/tracking")}>Forgot Password ?</label>
        </div>
        <div className="submit-button">
          <button>
            Log In
            <IoLogIn className="icon" />
          </button>
        </div>
        <div className="login-label login-label-align">
          <label onClick={() => navigate("/signup")}>
            Don't have an account? <u>Sign Up</u>
          </label>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
