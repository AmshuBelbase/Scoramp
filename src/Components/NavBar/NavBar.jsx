import { useState, useEffect } from "react";
import "./NavBar.css";
import picture from "../Assets/1.png";
// import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { MdLeaderboard } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { RiTeamFill } from "react-icons/ri";
import { HiBarsArrowDown, HiMiniBarsArrowUp } from "react-icons/hi2";
const SignUpForm = () => {
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

  const [noShow, setShow] = useState(false);
  const showMenu = () => {
    setShow(!noShow);
  };
  return (
    <div className="left-nav">
      <div className="project-details">
        <img src={picture} alt="Scoramp" />
      </div>
      {(noShow || windowSize.width > 770) && (
        <div
          className={windowSize.width > 770 ? "menu-items" : "menu-items-small"}
        >
          <div className="menu">
            <MdLeaderboard className="icon" />
            <h2>Leaderboard</h2>
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
            <h2>Extra</h2>
          </div>
        </div>
      )}
      {windowSize.width <= 770 && (
        <div className="menu lastmenu" onClick={showMenu}>
          {!noShow && <HiBarsArrowDown className="icon" />}
          {noShow && <HiMiniBarsArrowUp className="icon" />}
        </div>
      )}
    </div>
  );
};
export default SignUpForm;
