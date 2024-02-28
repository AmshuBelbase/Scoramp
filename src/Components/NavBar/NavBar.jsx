import React, { useState } from "react";
import "./NavBar.css";

import picture from "../Assets/1.png";
import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { RiTeamFill } from "react-icons/ri";
const SignUpForm = () => {
  const navigate = useNavigate();
  return (
    <div className="left-nav">
      <div className="project-details">
        <img src={picture} alt="Scoramp" />
      </div>
      <div className="menu">
        <BiSolidDashboard className="icon" />
        <h2>Dashboard</h2>
      </div>
      <div className="menu">
        <AiOutlineFundProjectionScreen className="icon" />
        <h2>Tracking</h2>
      </div>
      <div className="menu">
        <RiTeamFill className="icon" />
        <h2>Teams</h2>
      </div>
      <div className="menu">
        <IoMdSettings className="icon" />
        <h2>Settings</h2>
      </div>
      <div className="menu">
        <RiTeamFill className="icon" />
        <h2>Extra - 2</h2>
      </div>
    </div>
  );
};
export default SignUpForm;
