import React, { useEffect, useState } from "react";
import "./SettingsPage.css";
import { IoLogIn } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = ({ setLoginUser, user }) => {
  const navigate = useNavigate();
  const [updatedUser, setUser] = useState({
    id: user._id,
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
      .then((userFound) => {
        if (typeof userFound.data.user === "object") {
          console.log(userFound.data.user);
          setUser({
            ...updatedUser,
            full_name: userFound.data.user.full_name,
            reg_id: userFound.data.user.reg_id,
            phone: userFound.data.user.phone,
            field: userFound.data.user.field,
            address: userFound.data.user.address,
            email: userFound.data.user.email,
            password: userFound.data.user.password,
          });
        } else {
          console.log("No Values");
          console.log(typeof userFound.data.user);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...updatedUser,
      [name]: value,
    });
  };
  const update = () => {
    console.log(updatedUser);
    const { id, full_name, reg_id, phone, field, address, email, password } =
      updatedUser;
    if (full_name && phone && email && password) {
      axios
        .post("http://localhost:9002/updateUser", updatedUser)
        .then((res) => {
          console.log(res.data.message);
        });
    } else {
      alert("You Entered Something Wrong ❌");
    }
  };
  return (
    <div className="signup-logo-wrapper">
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
                value={updatedUser.full_name}
                onChange={handleChange}
              />
            </div>
            <div className="email">
              <input
                type="text"
                name="reg_id"
                id="reg_id"
                placeholder="Enter Registration / Workplace ID"
                value={updatedUser.reg_id === "-" ? "" : updatedUser.reg_id}
                onChange={handleChange}
              />
            </div>
            <div className="email">
              <input
                type="text"
                name="field"
                id="field"
                placeholder="Enter Field / Department / Domain"
                value={updatedUser.field === "-" ? "" : updatedUser.field}
                onChange={handleChange}
              />
            </div>
            <div className="email">
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                value={updatedUser.address === "-" ? "" : updatedUser.address}
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
                value={updatedUser.phone}
                onChange={handleChange}
              />
            </div>
            <div className="email">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email ( OTP will be sent to verify )"
                value={updatedUser.email}
                onChange={handleChange}
              />
            </div>
            <div className="password">
              <input
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder=" Reset Password"
                value={updatedUser.password}
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
