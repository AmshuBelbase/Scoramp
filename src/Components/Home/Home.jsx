import "./Home.css";
import picture from "../Assets/1.png";
import avatar from "../Assets/icon.png";
import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import {
  IoMdAddCircle,
  IoIosNotifications,
  IoMdSettings,
} from "react-icons/io";
import { RiTeamFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
const Home = () => {
  return (
    <div className="home-wrap">
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
          <h2>Project Tracking</h2>
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
      <div className="right-wrap">
        <div className="top-nav">
          <div className="menu menu1">
            <AiOutlineFundProjectionScreen className="icon" />
            <h2>Project Tracking</h2>
          </div>
          <div className="menu">
            <IoMdAddCircle className="icon" />
            <h2>New Project</h2>
          </div>
          <div className="menu-icon">
            <FaSearch className="icon" />
          </div>
          <div className="menu-icon">
            <IoIosNotifications className="icon" />
          </div>
          <div className="menu-icon">
            <img src={avatar} className="avatar" />
          </div>
        </div>
        <div className="container">
          <div className="left-container">
            <div className="taskstatus-container">
              <div className="task-status">New</div>
              <div className="task-status">In Progress</div>
              <div className="task-status">Completed</div>
            </div>
          </div>
          <div className="right-container"></div>
        </div>
      </div>
    </div>
  );
};
export default Home;
