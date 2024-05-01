import "./Home.css";
import { useState, useEffect } from "react";
import avatar from "../Assets/icon.png";
import { BiSolidNotification } from "react-icons/bi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { TbProgress } from "react-icons/tb";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { HiBarsArrowDown, HiMiniBarsArrowUp } from "react-icons/hi2";
import axios from "axios";

import {
  IoIosArrowDown,
  IoMdAddCircle,
  IoIosCloseCircle,
} from "react-icons/io";
import { GiNotebook } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const Home = ({ setLoginUser, user }) => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    if (!user || !user._id) {
      navigate("/");
    }
  }, [user]);
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

  const [newTask, setNewTask] = useState({
    email: user.email,
    task_title: "",
    team_code: "",
    full_marks: "",
    deadline: "",
    description: "",
  });
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  const [myOwnTeams, setMyOwnTeams] = useState([]);
  useEffect(() => {
    axios
      .post("http://localhost:9002/getMyOwnTeams", user)
      .then((teamFound) => {
        setMyOwnTeams(teamFound.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setLoginUser, user]);

  const assignTask = () => {
    const { email, task_title, team_code, full_marks, deadline, description } =
      newTask;
    if (
      description &&
      email &&
      task_title &&
      team_code &&
      full_marks &&
      deadline
    ) {
      axios.post("http://localhost:9002/assignTask", newTask).then((res) => {
        alert(res.data.message);
        setNewTask({
          ...newTask,
          email: user.email,
          task_title: "",
          team_code: "",
          full_marks: "",
          deadline: "",
          description: "",
        });
        if (res.data.stat == "true") {
          toggleClass();
        }
      });
    } else {
      alert("You Entered Something Wrong ❌");
    }
  };

  // const [myOwnTeamsDetails, setMyOwnTeamsDetails] = useState([]);
  // useEffect(() => {
  //   myOwnTeams.forEach((team) => {
  //     axios
  //       .post("http://localhost:9002/getTeamDetails", team)
  //       .then((teamFound) => {
  //         // console.log("This Team Detail : ");
  //         // console.log(teamFound.data);
  //         setMyOwnTeamsDetails((prevDetails) => ({
  //           ...prevDetails,
  //           [team.team_code]: teamFound.data.team, // Assuming team_code is unique
  //         }));
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   });
  // }, [myOwnTeams]); // This will run every time `myTeams` changes

  useEffect(() => {
    console.log(newTask);
  }, [newTask]);

  return (
    <div className="right-wrap">
      <div className={isActive ? "top-nav passive" : "top-nav"}>
        <div className="menu menu1">
          <AiOutlineFundProjectionScreen className="icon" />
          <h2>Tracking - {user.full_name}</h2>
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
              <div className="first" onClick={() => navigate("/")}>
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
            {/* <div className="top-right">
              <div className="top-right-up">
                <div>Online</div>
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
            </div> */}
            <div className="bottom-right">
              <div className="bottom-right-up">
                <div>Recent activities</div>
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
              <div className="form_item">
                <input
                  type="text"
                  placeholder="Task Title"
                  name="task_title"
                  id="task_title"
                  value={newTask.task_title}
                  onChange={handleNewTaskChange}
                />
              </div>
              <div className="form_item">
                <textarea
                  className="adjustable-textbox"
                  placeholder="Description"
                  name="description"
                  id="description"
                  value={newTask.description}
                  onChange={handleNewTaskChange}
                ></textarea>
                <div className="error" id="phone"></div>
              </div>
              <div className="form_wrap form_grp">
                <div className="form_item">
                  <select
                    name="team_code"
                    id="team_code"
                    value={newTask.team_code}
                    onChange={handleNewTaskChange}
                  >
                    <option value="">-- Task For --</option>
                    {myOwnTeams.map((team) => {
                      return (
                        <option value={team.team_code}>{team.team_name}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="form_item">
                  <input
                    type="number"
                    placeholder="Marks"
                    name="full_marks"
                    id="full_marks"
                    value={newTask.full_marks}
                    onChange={handleNewTaskChange}
                  />
                </div>
              </div>
              <div className="form_wrap form_grp">
                <div className="form_item">Last Date : </div>
                <div className="form_item">
                  <input
                    type="date"
                    placeholder="Deadline"
                    name="deadline"
                    id="deadline"
                    value={newTask.deadline}
                    onChange={handleNewTaskChange}
                  />
                </div>
              </div>
              {/* <div className="form_item">
                  <input type="file" />
                  <div className="error" id="phone"></div>
                </div> */}
              <div className="btn">
                <input type="button" value="Assign" onClick={assignTask} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
