import React from 'react';

import "./Home.css";
import { useState, useEffect } from "react";
import avatar from "../Assets/icon.png";
import { BiSolidNotification } from "react-icons/bi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { TbProgress } from "react-icons/tb";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { HiBarsArrowDown, HiMiniBarsArrowUp } from "react-icons/hi2";
import axios from "axios";

// localhost:9002 - > https://scoramp-api.vercel.app/

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
  const [isTaskTabActive, setTaskTabActive] = useState(false);
  const [isTaskApproveTabActive, setTaskApproveTabActive] = useState(false);

  const [openTask, setOpenTask] = useState("");
  const [subTask, setSubTask] = useState({
    email: user.email,
    task_id: "",
    team_code: "",
    full_marks: "",
    subDate: "",
    submissionMessage: "",
    fscore: -1,
    tscore: -1,
  });
  const handleSubTaskChange = (e) => {
    const { name, value } = e.target;
    setSubTask({
      ...subTask,
      [name]: value,
    });
  };

  const [apTask, setApTask] = useState([]);
  const handleApTaskChange = (e) => {
    const { name, value } = e.target;
    setApTask({
      ...apTask,
      [name]: value,
    });
  };

  const declineTask = () => {
    const { _id } = apTask;
    if (_id) {
      axios.post("http://localhost:9002/declineTask", apTask).then((res) => {
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
        setSubTask({
          ...subTask,
          email: user.email,
          task_id: "",
          team_code: "",
          full_marks: "",
          subDate: "",
          submissionMessage: "",
          fscore: -1,
          tscore: -1,
        });
        setApTask([]);
        toggleTaskApproveTabActiveClass();
      });
    } else {
      alert("You entered something wrong ❌");
    }
  };

  const acceptTask = () => {
    const { _id, fscore } = apTask;
    if (_id && fscore) {
      axios.post("http://localhost:9002/acceptTask", apTask).then((res) => {
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
        setSubTask({
          ...subTask,
          email: user.email,
          task_id: "",
          team_code: "",
          full_marks: "",
          subDate: "",
          submissionMessage: "",
          fscore: -1,
          tscore: -1,
        });
        setApTask([]);
        toggleTaskApproveTabActiveClass();
      });
    } else {
      alert("You entered something wrong ❌");
    }
  };

  const submitTask = () => {
    const {
      email,
      task_id,
      team_code,
      full_marks,
      submissionMessage,
      fscore,
      tscore,
    } = subTask;
    if (
      email &&
      task_id &&
      team_code &&
      full_marks &&
      submissionMessage &&
      tscore &&
      fscore
    ) {
      axios.post("http://localhost:9002/submitTask", subTask).then((res) => {
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
        setSubTask({
          ...subTask,
          email: user.email,
          task_id: "",
          team_code: "",
          full_marks: "",
          subDate: "",
          submissionMessage: "",
          fscore: -1,
          tscore: -1,
        });
        toggleTaskTabActiveClass();
      });
    } else {
      alert("You entered something wrong ❌");
    }
  };

  const toggleTaskTab = (e) => {
    myTasks.map((task) => {
      if (task._id == e) {
        const currentDateTime = new Date();
        const targetDateTime = new Date(task.deadline);
        const obInMillis = targetDateTime - currentDateTime;
        const obInMinutes = Math.floor(obInMillis / (1000 * 60));

        const givenDateTime = new Date(task.given_date);
        const FullInMillis = targetDateTime - givenDateTime;
        const FullInMinutes = Math.floor(FullInMillis / (1000 * 60));

        let obTime = ((obInMinutes * task.full_marks) / FullInMinutes).toFixed(
          2
        );
        obTime =
          obTime > (80 * task.full_marks) / 100 ? task.full_marks : obTime;
        setSubTask({
          ...subTask,
          task_id: task._id,
          team_code: task.team_code,
          full_marks: task.full_marks,
          tscore: obTime,
        });
      }
    });
    setOpenTask(e);
    toggleTaskTabActiveClass();
  };

  const toggleTaskTabActiveClass = () => {
    setTaskTabActive(!isTaskTabActive);
  };

  const [openSubTask, setOpenSubTask] = useState({});
  const toggleTaskApproveTabActiveClass = () => {
    setTaskApproveTabActive(!isTaskApproveTabActive);
  };
  const setAndOpenSubTask = (e) => {
    const sub_id = e.target.getAttribute("data_name");
    const t_id = e.target.getAttribute("data_code");
    setOpenSubTask({
      ...openSubTask,
      sub_id: sub_id,
      t_id: t_id,
    });
    setApTask({
      ...apTask,
      _id: sub_id,
    });
    toggleTaskApproveTabActiveClass();
  };

  // useEffect(() => {
  //   console.log(apTask);
  // }, [apTask]);

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
  }, [user]);

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
  }, [user]);

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
  }, [user, myTeamsDetails]);

  const [myTaskSubmissions, setMyTaskSubmissions] = useState([]);
  useEffect(() => {
    axios
      .post("http://localhost:9002/getMyTaskSubmissions", myTeamsDetails)
      .then((taskFound) => {
        setMyTaskSubmissions(taskFound.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user, myTeamsDetails, subTask]);

  const [count, setCount] = useState({
    newCount: 0,
    nearingCount: 0,
    lastDayCount: 0,
    completedCount: 0,
    facultyCheckWaitCount: 0,
  });
  useEffect(() => {
    let newCount = 0;
    let nearingCount = 0;
    let completedCount = 0;
    let facultyCheckWaitCount = 0;

    // console.log(myTasks);
    // console.log(myTaskSubmissions);
    // console.log(myTeams);
    // console.log(myTeamsDetails);

    myTasks.forEach((task) => {
      // console.log("Bools");
      const approvedIdExists = myTeams.some(
        (sub_team) =>
          sub_team.team_code === task.team_code && sub_team.approval == "yes"
      );
      const isMySubmission = myTaskSubmissions.some(
        (sub_task) =>
          sub_task.task_id == task._id && sub_task.email === user.email
      );
      const givenByMe = !(task.email != user.email);
      const facultyChecked = myTaskSubmissions.some(
        (sub_task) => sub_task.task_id == task._id && sub_task.fscore != -1
      );
      // console.log("I am on class : " + approvedIdExists);
      if (approvedIdExists) {
        // console.log("Given By Me : " + givenByMe);
        if (!givenByMe) {
          // console.log("Submitted By Me : " + isMySubmission);
          if (isMySubmission) {
            completedCount++;
            // console.log("faculty Checked : " + facultyChecked);
            if (!facultyChecked) {
              facultyCheckWaitCount++;
            }
          } else {
            newCount++;
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
            if (differenceInDays <= 2) {
              nearingCount += 1;
            }
          }
        }
      }
    });
    // console.log(newCount);
    // console.log(nearingCount);
    // console.log(completedCount);
    // console.log(facultyCheckWaitCount);

    setCount({
      ...count,
      newCount: newCount,
      nearingCount: nearingCount,
      completedCount: completedCount,
      facultyCheckWaitCount: facultyCheckWaitCount,
    });
  }, [myTasks, myTaskSubmissions, user]);

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

  const [myTaskApprovalsDetails, setMyTaskApprovalsDetails] = useState([]);
  useEffect(() => {
    myTaskSubmissions.forEach((my_approval) => {
      axios
        .post("http://localhost:9002/getUserDetails", my_approval)
        .then((userFound) => {
          setMyTaskApprovalsDetails((prevDetails) => ({
            ...prevDetails,
            [my_approval.email]: userFound.data.user,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [myTaskSubmissions]);

  // const [myOwnTeamsDetails, setMyOwnTeamsDetails] = useState([]);
  // useEffect(() => {
  //   myOwnTeams.forEach((team) => {
  //     axios
  //       .post("https://scoramp-server.vercel.app/getTeamDetails", team)
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
      <div
        className={
          isActive || isTaskTabActive || isTaskApproveTabActive
            ? "top-nav passive"
            : "top-nav"
        }
      >
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

      <div
        className={
          isActive || isTaskTabActive || isTaskApproveTabActive
            ? "container passive"
            : "container"
        }
      >
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
                  : "Deadline within 2 days"}
              </div>
            </div>
            <div className="task-status">
              <div className="first">
                <label>Completed</label>
                <IoCheckmarkDoneCircle className="icon" />
              </div>
              <div className="second">{count.completedCount}</div>
              <div className="third">
                {count.facultyCheckWaitCount == 0
                  ? "All Tasks are Approved"
                  : count.facultyCheckWaitCount == 1
                  ? count.facultyCheckWaitCount + " Task to be Approved"
                  : count.facultyCheckWaitCount + " Tasks to be Approved"}
              </div>
            </div>
          </div>

          <div className="table-top">
            <div className="head">Assignments</div>
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
              const approvedIdExists = myTeams.some(
                (sub_team) =>
                  sub_team.team_code === task.team_code &&
                  sub_team.approval == "yes"
              );
              const isMySubmission = myTaskSubmissions.some(
                (sub_task) =>
                  sub_task.task_id == task._id && sub_task.email === user.email
              );
              const givenByMe = !(task.email != user.email);
              const facultyChecked = myTaskSubmissions.some(
                (sub_task) =>
                  sub_task.task_id == task._id && sub_task.fscore != -1
              );
              if (approvedIdExists && !givenByMe && !isMySubmission) {
                const currentDateTime = new Date();
                const targetDateTime = new Date(task.deadline);
                const obInMillis = targetDateTime - currentDateTime;
                const obInMinutes = Math.floor(obInMillis / (1000 * 60));
                const days = Math.floor(obInMinutes / (60 * 24));
                const remainingHours = Math.floor(
                  (obInMinutes % (60 * 24)) / 60
                );
                const remainingMinutes = obInMinutes % 60;
                return (
                  myTeamsDetails.hasOwnProperty(task.team_code) &&
                  myTeamsDetails[task.team_code].hasOwnProperty(
                    "team_name"
                  ) && (
                    <div
                      className="task-table-package"
                      onClick={(e) => toggleTaskTab(task._id)}
                    >
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
                            {task.full_marks} points
                          </div>
                          <div className="given-date">
                            Given : {new Date(task.given_date).toLocaleString()}
                          </div>
                          <div className="given-date">
                            Deadline: {new Date(task.deadline).toLocaleString()}
                          </div>
                          <div className="complete-percent">
                            Remaining Time:{" "}
                            {days == 0
                              ? ""
                              : days == 1
                              ? days + " day "
                              : days + " days "}
                            {remainingHours == 0
                              ? ""
                              : remainingHours == 1
                              ? remainingHours + " hr "
                              : remainingHours + " hrs "}
                            {remainingMinutes == 0
                              ? ""
                              : remainingMinutes == 1
                              ? remainingMinutes + " min "
                              : remainingMinutes + " mins "}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
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
                <div>Approve Assignments</div>
              </div>
              {myTaskSubmissions.map((myApproval) => {
                return (
                  Object.keys(myTaskSubmissions).length != 0 &&
                  myApproval.email != user.email &&
                  myApproval.fscore < 0 &&
                  myTaskApprovalsDetails.hasOwnProperty(myApproval.email) &&
                  myTaskApprovalsDetails[myApproval.email].hasOwnProperty(
                    "full_name"
                  ) &&
                  myTeamsDetails.hasOwnProperty(myApproval.team_code) &&
                  myTeamsDetails[myApproval.team_code].hasOwnProperty(
                    "team_name"
                  ) && (
                    <div className="bottom-right-up">
                      <div>
                        {myTaskApprovalsDetails[myApproval.email]?.full_name} -{" "}
                        {myTeamsDetails[myApproval.team_code]?.team_name}
                      </div>
                      <div className="email">
                        <input
                          type="button"
                          data_name={myApproval._id}
                          data_code={myApproval.task_id}
                          value="View"
                          class="view"
                          onClick={setAndOpenSubTask}
                        />
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        )}
      </div>
      {isTaskApproveTabActive &&
        myTaskSubmissions.map((task) => {
          if (
            openSubTask.sub_id !== "undefined" &&
            task._id == openSubTask.sub_id
          ) {
            const taskMain = myTasks.find(
              (taskM) => taskM._id === openSubTask.t_id
            );
            return (
              myTeamsDetails.hasOwnProperty(taskMain.team_code) &&
              myTeamsDetails[taskMain.team_code].hasOwnProperty(
                "team_name"
              ) && (
                <div className="popup-container">
                  <div className="head-wrap">
                    <div className="head-title">{taskMain.task_title}</div>
                    <div
                      className="head-close"
                      onClick={toggleTaskApproveTabActiveClass}
                    >
                      <IoIosCloseCircle />
                    </div>
                  </div>
                  <div className="popup-body">
                    <div className="form_container">
                      <div className="form_wrap form_grp">
                        <div className="form_item">
                          <input
                            type="text"
                            placeholder={
                              myTeamsDetails[taskMain.team_code].team_name
                            }
                            disabled
                          />
                        </div>
                        <div className="form_item">
                          <input
                            type="text"
                            placeholder={"Full Marks : " + taskMain.full_marks}
                            disabled
                          />
                        </div>
                        <div className="form_item">
                          <input
                            type="text"
                            name="tscore"
                            id="tscore"
                            placeholder={"Time Score : " + task.tscore}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form_item">
                        <input
                          type="text"
                          placeholder={task.submissionMessage}
                          disabled
                        />
                      </div>

                      <div className="form_wrap form_grp">
                        <div className="form_item">Submitted Date: </div>
                        <div className="form_item">
                          <input
                            type="text"
                            placeholder={new Date(
                              task.subDate
                            ).toLocaleString()}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form_item">
                        <input
                          type="number"
                          placeholder={
                            "Enter Marks out of " + taskMain.full_marks + " ..."
                          }
                          name="fscore"
                          onChange={handleApTaskChange}
                          value={apTask.fscore}
                        />
                        <div className="error" id="phone"></div>
                      </div>
                      <div className="btn approve">
                        <input
                          type="button"
                          value="Approve ✅"
                          onClick={acceptTask}
                        />
                      </div>
                      <div className="btn reject">
                        <input
                          type="button"
                          value="Reject ❌"
                          onClick={declineTask}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            );
          }
        })}

      {isTaskTabActive &&
        myTasks.map((task) => {
          if (task._id == openTask) {
            return (
              myTeamsDetails.hasOwnProperty(task.team_code) &&
              myTeamsDetails[task.team_code].hasOwnProperty("team_name") && (
                <div className="popup-container">
                  <div className="head-wrap">
                    <div className="head-title">{task.task_title}</div>
                    <div
                      className="head-close"
                      onClick={toggleTaskTabActiveClass}
                    >
                      <IoIosCloseCircle />
                    </div>
                  </div>
                  <div className="popup-body">
                    <div className="form_container">
                      <div className="form_wrap form_grp">
                        <div className="form_item">
                          <input
                            type="text"
                            placeholder={
                              myTeamsDetails[task.team_code].team_name
                            }
                            disabled
                          />
                        </div>
                        <div className="form_item">
                          <input
                            type="text"
                            placeholder={"Full Marks : " + task.full_marks}
                            disabled
                          />
                        </div>
                        <div className="form_item">
                          <input
                            type="text"
                            name="tscore"
                            id="tscore"
                            placeholder={
                              "Current Time Score : " + subTask.tscore
                            }
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form_item">
                        <input
                          type="text"
                          placeholder={task.description}
                          disabled
                        />
                      </div>

                      <div className="form_wrap form_grp">
                        <div className="form_item">Given Date: </div>
                        <div className="form_item">
                          <input
                            type="text"
                            placeholder={new Date(
                              task.given_date
                            ).toLocaleString()}
                            disabled
                          />
                        </div>
                        <div className="form_item">Last Date : </div>
                        <div className="form_item">
                          <input
                            type="text"
                            placeholder={new Date(
                              task.deadline
                            ).toLocaleString()}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form_item">
                        <textarea
                          className="adjustable-textbox"
                          name="submissionMessage"
                          placeholder={"Enter any Submission Details"}
                          value={subTask.submissionMessage}
                          onChange={handleSubTaskChange}
                        ></textarea>
                        <div className="error" id="phone"></div>
                      </div>
                      {/* <div className="form_item">
                  <input type="file" />
                  <div className="error" id="phone"></div>
                </div> */}
                      <div className="btn">
                        <input
                          type="button"
                          value="Submit Task"
                          onClick={submitTask}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            );
          }
        })}
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
                    placeholder="Full Marks"
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
                    type="datetime-local"
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
