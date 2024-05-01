import "./Teams.css";
import { useState, useEffect } from "react";
import { BiSolidNotification } from "react-icons/bi";
import { TbProgress } from "react-icons/tb";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
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
            </div> */}
            <div className="bottom-right">
              <div className="bottom-right-up">
                <div>Search</div>
                <div className="email">
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    placeholder="Full Name"
                    // value={userSign.full_name}
                    // onChange={handleChange}
                  />
                </div>
                {/* <div>See All</div> */}
              </div>
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
              <form name="form">
                <div className="form_item">
                  <input type="number" placeholder="Team Code" />
                </div>
                <div className="btn">
                  <input type="submit" value="Join Team" />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Teams;
