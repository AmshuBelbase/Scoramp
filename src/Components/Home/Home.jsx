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

  const [myTeams, setMyTeams] = useState([]);
  useEffect(() => {
    axios
      .post("http://localhost:9002/getMyTeams", user)
      .then((teamFound) => {
        setMyTeams(teamFound.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setLoginUser, user]);

  const [myTeamsDetails, setMyTeamsDetails] = useState([]);
  useEffect(() => {
    myTeams.forEach((team) => {
      axios
        .post("http://localhost:9002/getTeamDetails", team)
        .then((teamFound) => {
          setMyTeamsDetails((prevDetails) => ({
            ...prevDetails,
            [team.team_code]: teamFound.data.team, // Assuming team_code is unique
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [myTeams]); // This will run every time `myTeams` changes

  useEffect(() => {
    console.log("All teams I am in: ");
    Object.values(myTeamsDetails).forEach((each) => {
      console.log(each.team_code);
    });
  }, [myTeamsDetails]);

  const [myTasks, setMyTasks] = useState([]);
  useEffect(() => {
    axios
      .post("http://localhost:9002/getMyTasks", myTeamsDetails)
      .then((taskFound) => {
        setMyTasks(taskFound.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setLoginUser, user, myTeamsDetails]);

  const [count, setCount] = useState({
    newCount: 0,
    nearingCount: 0,
    lastDayCount: 0,
    completedCount: 0,
  });
  useEffect(() => {
    let newCount = 0;
    let nearingCount = 0;

    myTasks.forEach((task) => {
      if (task.email != user.email) {
        newCount = newCount + 1;
        const dateString = task.deadline;
        const targetDate = new Date(dateString);
        const currentDate = new Date();
        const targetYear = targetDate.getFullYear();
        const targetMonth = targetDate.getMonth();
        const targetDay = targetDate.getDate();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        // Calculate the difference in days
        const differenceInDays = Math.ceil(
          (Date.UTC(targetYear, targetMonth, targetDay) -
            Date.UTC(currentYear, currentMonth, currentDay)) /
            (1000 * 60 * 60 * 24)
        );
        if (differenceInDays <= 5) {
          nearingCount += 1;
        }
      }
    });
    // setCount(newCount);
    setCount({
      ...count,
      newCount: newCount,
      nearingCount: nearingCount,
    });
  }, [myTasks, user]);

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
              <div className="second">{count.newCount}</div>
              <div className="third">
                {count.newCount == 0 ? "No New Task" : "New tasks to be done"}
              </div>
            </div>
            <div className="task-status">
              <div className="first">
                <label>Nearing Deadline</label>
                <TbProgress className="icon" />
              </div>
              <div className="second">{count.nearingCount}</div>
              <div className="third">
                {count.nearingCount == 0
                  ? "No Nearing Deadline"
                  : "Need to be completed in 5 days"}
              </div>
            </div>
            <div className="task-status">
              <div className="first">
                <label>Completed</label>
                <IoCheckmarkDoneCircle className="icon" />
              </div>
              <div className="second">{count.completedCount}</div>
              <div className="third">
                {count.nearingCount == 0
                  ? "No Tasks Approved Yet"
                  : "Tasks Approved Till Now"}
              </div>
            </div>
          </div>

          <div className="table-top">
            <div className="head">Remaining Tasks</div>
            {/* <div className="taskstat-container">
              <div className="task-stat">New</div>
              <div className="task-stat">Nearing Deadline</div>
              <div className="task-stat">Completed</div>
            </div> */}
            {/* <div className="dropdown">
              <button className="dropbtn">
                Sort By <IoIosArrowDown className="icon" />
              </button>
              <div className="dropdown-content">
                <label>Date</label>
                <label>Alphabet</label>
              </div>
            </div> */}
          </div>
          <div className="task-table">
            {myTasks.map((task) => {
              if (task.email != user.email) {
                console.log("Details");
                console.log(myTeamsDetails);
                return (
                  <div className="task-table-package">
                    <div className="task-table-icon">
                      <GiNotebook className="icon" />
                    </div>
                    <div className="task-table-list">
                      <div className="title">{task.task_title}</div>
                      <div className="task-table-list-container">
                        {task.description}
                      </div>
                      <div className="task-table-list-container">
                        <div className="given-to">
                          {myTeamsDetails[task.team_code].team_name}
                        </div>
                        <div className="given-date">
                          Full Marks : {task.full_marks}
                        </div>
                        <div className="given-date">
                          Given : {task.given_date} | Deadline: {task.deadline}
                        </div>
                        <div className="complete-percent">
                          Given By: {task.email}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
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
