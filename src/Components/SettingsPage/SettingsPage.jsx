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
    // Call navigate() inside useEffect
    if (!user || !user._id) {
      // Navigate to the desired route
      navigate("/");
    }
  }, [user]);
  useEffect(() => {
    axios
      .post("http://localhost:9002/getUser", updatedUser)
      .then((userFound) => {
        if (typeof userFound.data.user === "object") {
          // console.log(userFound.data.user);
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
          setLoginUser(userFound.data.user);
        } else {
          // console.log("No Values");
          // console.log(typeof userFound.data.user);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...updatedUser,
      [name]: value,
    });
  };
  const update = () => {
    // console.log(updatedUser);
    const { id, full_name, reg_id, phone, field, address, email, password } =
      updatedUser;
    if (
      full_name &&
      phone &&
      email &&
      password &&
      email.includes("gmail.com") &&
      phone.toString().length == 10
    ) {
      axios
        .post("http://localhost:9002/updateUser", updatedUser)
        .then((res) => {
          alert(res.data.message);
          setLoginUser(res.data.userUpdated);
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
              <label>Full Name</label>
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
              <label>Registration / Workplace ID</label>
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
              <label>Field / Department / Domain</label>
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
              <label>Address</label>

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
              <label>Phone Number</label>

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
              <label>Email</label>

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
              <label>Reset Password</label>

              <input
                type="password"
                name="password"
                id="password"
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
      </div>
    </div>
  );
};
export default Settings;
