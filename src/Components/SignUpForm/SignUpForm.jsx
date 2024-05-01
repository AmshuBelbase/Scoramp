import React, { useState } from "react";
import "./SignUpForm.css";
import picture from "../Assets/5.png";
import { IoLogIn } from "react-icons/io5";
// import { MdOutgoingMail } from "react-icons/md";
// import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = ({ setLoginUser }) => {
  const navigate = useNavigate();
  const [userSign, setUser] = useState({
    full_name: "",
    reg_id: "",
    phone: "",
    field: "",
    address: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...userSign,
      [name]: value,
    });
  };
  const register = () => {
    const {
      full_name,
      reg_id,
      phone,
      field,
      address,
      email,
      password,
      cpassword,
    } = userSign;
    if (full_name && phone && email && password && password === cpassword) {
      axios.post("http://localhost:9002/register", userSign).then((res) => {
        alert(res.data.message);
        navigate("/");
      });
    } else {
      alert("You Entered Something Wrong ❌");
    }
  };
  return (
    <div className="signup-logo-wrapper">
      {/* {console.log(userSign)} */}
      <div className="login-logo">
        <div className="logo">
          <img src={picture} alt="" />
        </div>
      </div>
      <div className="login-wrapper">
        <div className="title">
          Create Account
          {/* <br />
          <p style={{ fontSize: "1vw" }}>It's easy and quick.</p> */}
        </div>
        <div className="email">
          <input
            type="text"
            name="full_name"
            id="full_name"
            placeholder="Full Name"
            value={userSign.full_name}
            onChange={handleChange}
          />
        </div>
        {/* <div className="email">
          <input
            type="text"
            name="reg_id"
            id="reg_id"
            placeholder="Enter Registration / Workplace ID"
            value={userSign.reg_id}
            onChange={handleChange}
          />
        </div> */}
        {/* <div className="email">
          <input
            type="text"
            name="field"
            id="field"
            placeholder="Enter Field / Department / Domain"
            value={userSign.field}
            onChange={handleChange}
          />
        </div> */}
        {/* <div className="email">
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Address"
            value={userSign.address}
            onChange={handleChange}
          />
        </div> */}
        <div className="email">
          <input
            type="number"
            name="phone"
            id="phone"
            placeholder="Phone Number"
            value={userSign.phone}
            onChange={handleChange}
          />
        </div>
        <div className="email">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email ( OTP will be sent to verify )"
            value={userSign.email}
            onChange={handleChange}
          />
        </div>
        <div className="password">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Create Password"
            value={userSign.password}
            onChange={handleChange}
          />
        </div>
        <div className="password">
          <input
            type="password"
            name="cpassword"
            id="cpassword"
            placeholder=" Confirm Password"
            value={userSign.cpassword}
            onChange={handleChange}
          />
        </div>
        <div className="submit-button">
          <button onClick={register}>
            Sign Up <IoLogIn className="icon" />
          </button>
        </div>
        <div className="login-label login-label-align">
          <label onClick={() => navigate("/")}>
            ALready have an account? <u>Log In</u>
          </label>
        </div>
      </div>
    </div>
  );
};
export default SignUpForm;
