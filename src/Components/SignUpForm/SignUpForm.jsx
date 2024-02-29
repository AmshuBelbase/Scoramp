import React, { useState } from "react";
import "./SignUpForm.css";
import picture from "../Assets/5.png";
import { IoLogIn } from "react-icons/io5";
import { MdOutgoingMail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = ({ setLoginUser }) => {
  const navigate = useNavigate();
  return (
    <div className="login-wrapper">
      <div className="logo">
        <img src={picture} alt="" />
      </div>
      <div className="title">SIGN UP</div>
      <div className="email">
        <input type="text" name="" id="" placeholder="Full Name" />
      </div>
      <div className="email">
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter Registration / Workplace ID"
        />
      </div>
      <div className="email">
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter Field / Department / Domain"
        />
      </div>
      <div className="email">
        <input type="text" name="" id="" placeholder="Address" />
      </div>
      <div className="email">
        <input type="email" name="" id="" placeholder="Email" />
      </div>
      <div className="password">
        <input type="password" name="" id="" placeholder="Create Password" />
      </div>
      <div className="password">
        <input type="password" name="" id="" placeholder="Confirm Password" />
      </div>
      {/* <div className="login-label">
        <label>Forgot Password ?</label>
      </div> */}
      <div className="submit-button">
        <button>Sign Up</button>
      </div>
      <div className="login-label login-label-align">
        <label onClick={() => navigate("/")}>
          ALready have an account? <u>Log In</u>
        </label>
      </div>
    </div>
  );
};
export default SignUpForm;
