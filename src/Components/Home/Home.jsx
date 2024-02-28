import "./Home.css";
import picture from "../Assets/1.png";
import avatar from "../Assets/icon.png";
import { BiSolidDashboard, BiSolidNotification } from "react-icons/bi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { TbProgress } from "react-icons/tb";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  IoMdAddCircle,
  IoIosNotifications,
  IoMdSettings,
} from "react-icons/io";
import { RiTeamFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="right-wrap">
      <div className="top-nav">
        <div className="menu menu1">
          <AiOutlineFundProjectionScreen className="icon" />
          <h2>Tracking</h2>
        </div>
        <div className="menu" onClick={() => navigate("/newtask")}>
          <IoMdAddCircle className="icon" />
          <h2>New Task</h2>
        </div>
        <div className="menu-icon">
          <FaSearch className="icon" />
        </div>
        <div className="menu-icon">
          <IoIosNotifications className="icon" />
        </div>
        <div className="menu-icon">
          <img src={avatar} alt="avatar" className="avatar" />
        </div>
      </div>
      <div className="container">
        <div className="left-container">
          <div className="taskstatus-container">
            <div className="task-status">
              <div className="first">
                <label>New</label>
                <BiSolidNotification className="icon" />
              </div>
              <div className="second">5</div>
              <div className="third">+5 from yesterday</div>
            </div>
            <div className="task-status">
              <div className="first">
                <label>In progress</label>
                <TbProgress className="icon" />
              </div>
              <div className="second">5</div>
              <div className="third">+5 from yesterday</div>
            </div>
            <div className="task-status">
              <div className="first">
                <label>Completed</label>
                <IoCheckmarkDoneCircle className="icon" />
              </div>
              <div className="second">5</div>
              <div className="third">+5 from yesterday</div>
            </div>
          </div>
          <div className="table-top">
            <div className="head">Task Tracking</div>
            <div className="taskstat-container">
              <div className="task-stat">New</div>
              <div className="task-stat">In progress</div>
              <div className="task-stat">Completed</div>
            </div>
            <div className="dropdown">
              <button className="dropbtn">
                Sort By <IoIosArrowDown className="icon" />
              </button>
              <div className="dropdown-content">
                <label>Date</label>
                <label>Alphabet</label>
              </div>
            </div>
          </div>
          <div className="task-table">
            <div className="task-table-list">
              <div className="title">Title</div>
              <div className="given-to">Given To</div>
              <div className="given-date">Given At</div>
              <div className="deadline">Deadline</div>
              <div className="complete-percent">Finish</div>
            </div>
            <div className="task-table-list">
              <div className="title">This is a Title</div>
              <div className="given-to">This is a Given To</div>
              <div className="given-date">13/02/2023</div>
              <div className="deadline">13/02/2023</div>
              <div className="complete-percent">75%</div>
            </div>
            <div className="task-table-list">
              <div className="title">This is a Title</div>
              <div className="given-to">This is a Given To</div>
              <div className="given-date">13/02/2023</div>
              <div className="deadline">13/02/2023</div>
              <div className="complete-percent">75%</div>
            </div>
            <div className="task-table-list">
              <div className="title">This is a Title</div>
              <div className="given-to">This is a Given To</div>
              <div className="given-date">13/02/2023</div>
              <div className="deadline">13/02/2023</div>
              <div className="complete-percent">75%</div>
            </div>
            <div className="task-table-list">
              <div className="title">This is a Title</div>
              <div className="given-to">This is a Given To</div>
              <div className="given-date">13/02/2023</div>
              <div className="deadline">13/02/2023</div>
              <div className="complete-percent">75%</div>
            </div>
          </div>
        </div>
        <div className="right-container">
          <div className="top-right">
            <div className="top-right-up">
              <div>Online</div>
              <div>See All</div>
            </div>
            <div className="top-right-down">
              <div className="menu-icon">
                <img src={avatar} alt="avatar" className="avatar" />
                <div className="member-name">MemberMemberMember</div>
              </div>
              <div className="menu-icon">
                <img src={avatar} alt="avatar" className="avatar" />
                <div className="member-name">Member 2</div>
              </div>
              <div className="menu-icon">
                <img src={avatar} alt="avatar" className="avatar" />
                <div className="member-name">Member 3</div>
              </div>
              <div className="menu-icon">
                <img src={avatar} alt="avatar" className="avatar" />
                <div className="member-name">Member 4</div>
              </div>
              <div className="menu-icon">
                <img src={avatar} alt="avatar" className="avatar" />
                <div className="member-name">Member 5</div>
              </div>
              <div className="menu-icon">
                <img src={avatar} alt="avatar" className="avatar" />
                <div className="member-name">Member 6</div>
              </div>
              <div className="menu-icon">
                <img src={avatar} alt="avatar" className="avatar" />
                <div className="member-name">Member 7</div>
              </div>
              <div className="menu-icon">
                <img src={avatar} alt="avatar" className="avatar" />
                <div className="member-name">Member 8</div>
              </div>
            </div>
          </div>
          <div className="bottom-right">
            <div className="bottom-right-up">
              <div>Recent activities</div>
              <div>See All</div>
            </div>
          </div>
        </div>
      </div>
      <div className="popup-container"></div>
    </div>
  );
};
export default Home;
