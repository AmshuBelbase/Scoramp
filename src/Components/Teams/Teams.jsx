import "./Teams.css";
import { useState, useEffect } from "react";
import { MdGroups } from "react-icons/md";
import { MdConnectWithoutContact } from "react-icons/md";
import { HiBarsArrowDown, HiMiniBarsArrowUp } from "react-icons/hi2";
import { IoMdAddCircle, IoIosCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Teams = ({ setLoginUser, user }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !user._id) {
      navigate("/");
    }
  }, [user]);
  const [newTeam, setNewTeam] = useState({
    email: user.email,
    team_name: "",
    description: "",
    type: "",
    team_code: "",
  });
  const [joinTeam, setJoinTeam] = useState({
    email: user.email,
    team_code: "",
  });
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
  }, [user, newTeam]);
  const [myTeamsDetails, setMyTeamsDetails] = useState([]);
  useEffect(() => {
    console.log("All teams : ");
    console.log(myTeams);
    myTeams.forEach((team) => {
      axios
        .post("http://localhost:9002/getTeamDetails", team)
        .then((teamFound) => {
          console.log("This Team Detail : ");
          console.log(teamFound.data);
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

  //   useEffect(() => {
  //     console.log("Combined : ");
  //     console.log(myTeamsDetails);
  //   }, [myTeamsDetails]);

  const [myApprovals, setMyApprovals] = useState([]);
  useEffect(() => {
    axios
      .post("http://localhost:9002/getApproveRequests", user)
      .then((res) => {
        console.log(res.data.message);
        setMyApprovals(res.data.approvals);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user, newTeam]);

  const [myApprovalsDetails, setMyApprovalsDetails] = useState([]);
  useEffect(() => {
    console.log("All approvals : ");
    console.log(myApprovals);
    myApprovals.forEach((my_approval) => {
      axios
        .post("http://localhost:9002/getUserDetails", my_approval)
        .then((userFound) => {
          console.log("This User Detail : ");
          console.log(userFound.data.user);
          setMyApprovalsDetails((prevDetails) => ({
            ...prevDetails,
            [my_approval.email]: userFound.data.user, // Assuming team_code is unique
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [myApprovals]); // This will run every time `myTeams` changes

  useEffect(() => {
    console.log(myApprovalsDetails);
  }, [myApprovalsDetails]);

  const handleJoinTeamChange = (e) => {
    const { name, value } = e.target;
    setJoinTeam({
      ...joinTeam,
      [name]: value,
    });
  };

  const handlenewTeamChange = (e) => {
    const { name, value } = e.target;
    if (name == "type" && value != "") {
      let timestamp = Date.now().toString(36); // Convert timestamp to base 36 string
      let randomString = Math.random().toString(36).substring(2, 5); // Generate random string
      let code = timestamp + randomString;
      console.log(code);
      setNewTeam({
        ...newTeam,
        team_code: code,
        type: value,
      });
    } else if (name == "type" && value == "") {
      setNewTeam({
        ...newTeam,
        team_code: "",
        type: value,
      });
    } else {
      setNewTeam({
        ...newTeam,
        [name]: value,
      });
    }
  };

  const approveBtn = (e) => {
    const data_name = e.target.getAttribute("data_name");
    const data_code = e.target.getAttribute("data_code");
    if (data_name && data_code) {
      axios
        .post("http://localhost:9002/approveBtn", {
          data_name: data_name,
          data_code: data_code,
        })
        .then((res) => {
          alert(res.data.message);
          setNewTeam({
            ...newTeam,
            email: user.email,
            team_name: "",
            description: "",
            type: "",
            team_code: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    console.log(data_name);
  };
  const declineBtn = (e) => {
    const data_name = e.target.getAttribute("data_name");
    const data_code = e.target.getAttribute("data_code");
    if (data_name && data_code) {
      axios
        .post("http://localhost:9002/declineBtn", {
          data_name: data_name,
          data_code: data_code,
        })
        .then((res) => {
          alert(res.data.message);
          setNewTeam({
            ...newTeam,
            email: user.email,
            team_name: "",
            description: "",
            type: "",
            team_code: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const createTeam = () => {
    const { email, team_name, description, type, team_code } = newTeam;
    if (team_name && description && email && type && team_code) {
      axios.post("http://localhost:9002/createTeam", newTeam).then((res) => {
        alert(res.data.message);
        setNewTeam({
          ...newTeam,
          email: user.email,
          team_name: "",
          description: "",
          type: "",
          team_code: "",
        });
        if (res.data.stat == "true") {
          toggleClass();
        }
      });
    } else {
      alert("You Entered Something Wrong ❌");
    }
  };

  const joinNewTeam = () => {
    const { email, team_code } = joinTeam;
    if (email && team_code) {
      axios.post("http://localhost:9002/joinNewTeam", joinTeam).then((res) => {
        alert(res.data.message);
        setJoinTeam({
          ...joinTeam,
          email: user.email,
          team_code: "",
        });
        if (res.data.stat == "true") {
          toggleJoinClass();
        }
      });
    } else {
      alert("You Entered Something Wrong ❌");
    }
  };

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

  const [isJoinActive, setJoinIsActive] = useState(false);
  const toggleJoinClass = () => {
    setJoinIsActive(!isJoinActive);
  };

  const [leftpull, setLeftPull] = useState(false);
  const leftPull = () => {
    setLeftPull(!leftpull);
  };

  return (
    <div className="right-wrap">
      <div className={isActive || isJoinActive ? "top-nav passive" : "top-nav"}>
        <div className="menu menu1">
          <MdGroups className="icon" />
          <h2>Teams - {user.full_name}</h2>
        </div>
        <div className="menu" onClick={toggleClass}>
          <IoMdAddCircle className="icon" />
          <h2>New Team</h2>
        </div>
        <div className="menu" onClick={toggleJoinClass}>
          <MdConnectWithoutContact className="icon" />
          <h2>Join Team</h2>
        </div>
        {windowSize.width <= 708 && (
          <div className="menu-icon" onClick={leftPull}>
            {!leftpull && <HiBarsArrowDown className="icon" />}
            {leftpull && <HiMiniBarsArrowUp className="icon" />}
          </div>
        )}
      </div>

      <div
        className={isActive || isJoinActive ? "container passive" : "container"}
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
            {myTeams.map((team) => {
              return (
                team.approval == "yes" && (
                  <div className="task-status">
                    <div className="first">
                      <label>
                        Created By: {myTeamsDetails[team.team_code]?.email}
                      </label>
                      {/* <IoCheckmarkDoneCircle className="icon" /> */}
                    </div>
                    <div className="second">
                      {myTeamsDetails[team.team_code]?.team_name}
                    </div>
                    <div className="third">Team Code : {team.team_code}</div>
                  </div>
                )
              );
            })}
          </div>
        </div>
        {(windowSize.width > 708 || leftpull) &&
          Object.keys(myApprovals).length != 0 &&
          Object.keys(myApprovalsDetails).length != 0 && (
            <div
              className={
                windowSize.width > 708
                  ? "right-container"
                  : "right-container right-container-small"
              }
            >
              <div className="bottom-rgt">
                {myApprovals.map((myApproval) => {
                  console.log("approval length");
                  console.log(Object.keys(myApprovalsDetails).length);
                  return (
                    Object.keys(myApprovals).length != 0 &&
                    Object.keys(myApprovalsDetails).length != 0 && (
                      <div className="bottom-right-up">
                        <div>
                          {myApprovalsDetails[myApproval.email].full_name} -{" "}
                          {myTeamsDetails[myApproval.team_code]?.team_name}
                        </div>
                        <div className="email">
                          <input
                            type="button"
                            data_name={myApproval.email}
                            data_code={myApproval.team_code}
                            value="Approve"
                            class="approve"
                            onClick={approveBtn}
                          />
                        </div>
                        <div className="email">
                          <input
                            type="button"
                            data_name={myApproval.email}
                            data_code={myApproval.team_code}
                            value="Decline"
                            class="decline"
                            onClick={declineBtn}
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

      {isActive && (
        <div className="popup-container">
          <div className="head-wrap">
            <IoMdAddCircle className="icon" />
            <div className="head-title">New Team</div>
            <div className="head-close" onClick={toggleClass}>
              <IoIosCloseCircle />
            </div>
          </div>
          <div className="popup-body">
            <div className="form_container">
              <div className="form_item">
                <input
                  type="text"
                  placeholder="Team Name"
                  name="team_name"
                  id="team_name"
                  value={newTeam.team_name}
                  onChange={handlenewTeamChange}
                />
              </div>
              <div className="form_item">
                <textarea
                  className="adjustable-textbox"
                  placeholder="Description"
                  name="description"
                  id="description"
                  value={newTeam.description}
                  onChange={handlenewTeamChange}
                ></textarea>
                <div className="error" id="phone"></div>
              </div>
              <div className="form_wrap form_grp">
                <div className="form_item">
                  <select
                    name="type"
                    id="type"
                    value={newTeam.type}
                    onChange={handlenewTeamChange}
                  >
                    <option value=""> -- Class Type --</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="form_item">
                  <input
                    type="text"
                    placeholder="Team Code will be Displayed"
                    name="team_code"
                    id="team_code"
                    value={newTeam.team_code}
                    onChange={handlenewTeamChange}
                    disabled
                  />
                </div>
              </div>

              <div className="btn">
                <input type="button" value="Create Team" onClick={createTeam} />
              </div>
            </div>
          </div>
        </div>
      )}
      {isJoinActive && (
        <div className="popup-container">
          <div className="head-wrap">
            <MdConnectWithoutContact className="icon" />
            <div className="head-title">Join Team</div>
            <div className="head-close" onClick={toggleJoinClass}>
              <IoIosCloseCircle />
            </div>
          </div>
          <div className="popup-body">
            <div className="form_container">
              <div className="form_item">
                <input
                  type="text"
                  placeholder="Team Code"
                  name="team_code"
                  id="team_code"
                  value={joinTeam.team_code}
                  onChange={handleJoinTeamChange}
                />
              </div>
              <div className="btn">
                <input type="button" value="Join Team" onClick={joinNewTeam} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Teams;
