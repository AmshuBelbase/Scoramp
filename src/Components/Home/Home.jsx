import "./Home.css";
import { useState, useEffect } from "react";
import avatar from "../Assets/icon.png";
import { BiSolidNotification } from "react-icons/bi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { TbProgress } from "react-icons/tb";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { HiBarsArrowDown, HiMiniBarsArrowUp } from "react-icons/hi2";
import {
  IoIosArrowDown,
  IoMdAddCircle,
  IoIosCloseCircle,
} from "react-icons/io";
import { GiNotebook } from "react-icons/gi";
const Home = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isActive, setIsActive] = useState(false);
  const toggleClass = () => {
    setIsActive(!isActive);
  };

  const [leftpull, setLeftPull] = useState(false);
  const leftPull = () => {
    setLeftPull(!leftpull);
  };

  return (
    <div className="right-wrap">
      <div className={isActive ? "top-nav passive" : "top-nav"}>
        <div className="menu menu1">
          <AiOutlineFundProjectionScreen className="icon" />
          <h2>Tracking</h2>
        </div>
        <div className="menu" onClick={toggleClass}>
          <IoMdAddCircle className="icon" />
          <h2>New Task</h2>
        </div>
        <div className="menu-icon">
          <img src={avatar} alt="avatar" className="avatar" />
        </div>
        {windowSize.width <= 708 && (
          <div className="menu-icon" onClick={leftPull}>
            {!leftpull && <HiBarsArrowDown className="icon" />}
            {leftpull && <HiMiniBarsArrowUp className="icon" />}
          </div>
        )}
      </div>

      <div className={isActive ? "container passive" : "container"}>
        <div
          className={
            windowSize.width <= 708
              ? leftpull
                ? "left-container left-container-small passive"
                : "left-container left-container-small"
              : "left-container"
          }
        >
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
            <div className="task-table-package">
              <div className="task-table-icon">
                <GiNotebook className="icon" />
              </div>
              <div className="task-table-list">
                <div className="title">
                  This is a title of Assignment Given by the Faculty to a
                  specific section to complete within the deadline.
                </div>
                <div className="task-table-list-container">
                  <div className="given-to">Given to</div>
                  <div className="given-date">Given on - Deadline</div>
                  <div className="complete-percent">{windowSize.width}px</div>
                </div>
              </div>
            </div>
            <div className="task-table-package">
              <div className="task-table-icon">
                <GiNotebook className="icon" />
              </div>
              <div className="task-table-list">
                <div className="title">
                  This is a title of Assignment Given by the Faculty to a
                  specific section to complete in deadline within the deadline.
                </div>
                <div className="task-table-list-container">
                  <div className="given-to">Given to</div>
                  <div className="given-date">Given on - Deadline</div>
                  <div className="complete-percent">{windowSize.height}px</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {(windowSize.width > 708 || leftpull) && (
          <div
            className={
              windowSize.width > 708
                ? "right-container"
                : "right-container right-container-small"
            }
          >
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
        )}
      </div>

      {isActive && (
        <div className="popup-container">
          <div className="head-wrap">
            <div className="head-title">New Task</div>
            <div className="head-close" onClick={toggleClass}>
              <IoIosCloseCircle />
            </div>
          </div>
          <div className="popup-body">
            <div className="form_container">
              <form name="form">
                <div className="form_item">
                  <input type="text" placeholder="Task Title" />
                </div>
                <div className="form_item">
                  <textarea
                    className="adjustable-textbox"
                    placeholder="Description"
                  ></textarea>
                  <div className="error" id="phone"></div>
                </div>
                <div className="form_wrap form_grp">
                  <div className="form_item">
                    <select name="country">
                      <option> -- Task For --</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                  </div>
                  <div className="form_item">
                    <input type="number" placeholder="Marks" />
                  </div>
                </div>
                <div className="form_wrap form_grp">
                  <div className="form_item">Last Date : </div>
                  <div className="form_item">
                    <input type="date" placeholder="Deadline" />
                  </div>
                </div>
                <div className="form_item">
                  <input type="file" />
                  <div className="error" id="phone"></div>
                </div>
                <div className="btn">
                  <input type="submit" value="Assign" />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
