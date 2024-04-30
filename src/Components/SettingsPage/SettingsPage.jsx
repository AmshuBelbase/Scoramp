import React, { useEffect, useState } from "react";
import "./SettingsPage.css";
import picture from "../Assets/5.png";
import { IoLogIn } from "react-icons/io5";
// import { MdOutgoingMail } from "react-icons/md";
// import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = ({ setLoginUser, user }) => {
  const navigate = useNavigate();
  const [updatedUser, setUser] = useState({
    full_name: "",
    reg_id: "",
    phone: "",
    field: "",
    address: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    axios
      .post("http://localhost:9002/getUser", updatedUser)
      .then((user) => console.log(user.data))
      .catch((err) => console.log(err));
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...updatedUser,
      [name]: value,
    });
  };
  const update = () => {};
  return (
    <div className="signup-logo-wrapper">
      {console.log(user)}

      <div className="login-wrapper">
        <div className="title">
          Update Account
          {/* <br />
          <p style={{ fontSize: "1vw" }}>It's easy and quick.</p> */}
        </div>
        <div className="login-wrapper-wrap">
          <div className="login-wrapper-first">
            <div className="email">
              <input
                type="text"
                name="full_name"
                id="full_name"
                placeholder="Full Name"
                value={user.full_name}
                onChange={handleChange}
              />
            </div>
            <div className="email">
              <input
                type="text"
                name="reg_id"
                id="reg_id"
                placeholder="Enter Registration / Workplace ID"
                value={user.reg_id === "-" ? "" : user.reg_id}
                onChange={handleChange}
              />
            </div>
            <div className="email">
              <input
                type="text"
                name="field"
                id="field"
                placeholder="Enter Field / Department / Domain"
                value={user.field === "-" ? "" : user.field}
                onChange={handleChange}
              />
            </div>
            <div className="email">
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                value={user.address === "-" ? "" : user.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="login-wrapper-second">
            <div className="email">
              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="Phone Number"
                value={user.phone}
                onChange={handleChange}
              />
            </div>
            <div className="email">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email ( OTP will be sent to verify )"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="password">
              <input
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder=" Reset Password"
                value={user.password}
                onChange={handleChange}
              />
            </div>
            <div className="submit-button">
              <button onClick={update}>
                Update <IoLogIn className="icon" />
              </button>
            </div>
          </div>
        </div>
        {/* <div className="login-label login-label-align">
          <label onClick={() => navigate("/")}>
            ALready have an account? <u>Log In</u>
          </label>
        </div> */}
      </div>
    </div>
  );
};
export default Settings;
