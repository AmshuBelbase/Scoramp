import React, { useState } from "react";
import "./LoginForm.css";
import { IoLogIn } from "react-icons/io5";
import { MdOutgoingMail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = ({ setLoginUser }) => {
  const navigate = useNavigate();
  return (
    <div className="login-wrapper">
      <div className="logo"></div>
      <div className="title">LOG IN</div>
      <div className="email">
        <input type="email" name="" id="" placeholder="Enter Email" />
      </div>
      <div className="password">
        <input type="password" name="" id="" placeholder="Enter Password" />
      </div>
      <div className="login-label">
        <label>Forgot Password ?</label>
      </div>
      <div className="submit-button">
        <button>Submit</button>
      </div>
      <div className="login-label login-label-align">
        <label>
          Don't have an account? <u>Sign Up</u>
        </label>
      </div>
    </div>
  );
};
export default LoginForm;
