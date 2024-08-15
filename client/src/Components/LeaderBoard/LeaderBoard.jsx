import "./LeaderBoard.css";
import { useState, useEffect } from "react";
import avatar from "../Assets/icon.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeaderBoard = ({ setLoginUser, user }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !user._id) {
      navigate("/");
    }
  }, [user]);

  const [myTeams, setMyTeams] = useState([]);
  useEffect(() => {
    axios
      .post("https://scoramp-server.vercel.app/getMyTeams", user)
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
        .post("https://scoramp-server.vercel.app/getTeamDetails", team)
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

  const [myOwnTeams, setMyOwnTeams] = useState([]);
  useEffect(() => {
    axios
      .post("https://scoramp-server.vercel.app/getMyOwnTeams", user)
      .then((teamFound) => {
        setMyOwnTeams(teamFound.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  const [myTasks, setMyTasks] = useState([]);
  useEffect(() => {
    axios
      .post("https://scoramp-server.vercel.app/getMyTasks", myTeamsDetails)
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
      .post(
        "https://scoramp-server.vercel.app/getMyTaskSubmissions",
        myTeamsDetails
      )
      .then((taskFound) => {
        setMyTaskSubmissions(taskFound.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user, myTeamsDetails]);

  const [myTaskApprovalsDetails, setMyTaskApprovalsDetails] = useState([]);
  useEffect(() => {
    myTaskSubmissions.forEach((my_approval) => {
      axios
        .post("https://scoramp-server.vercel.app/getUserDetails", my_approval)
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

  return (
    <div class="allTables">
      {myTeams.map((team) => {
        {
          return (
            Object.keys(myTaskSubmissions).length != 0 &&
            Object.keys(myTaskApprovalsDetails).length != 0 &&
            team.approval == "yes" &&
            myTeamsDetails.hasOwnProperty(team.team_code) &&
            myTeamsDetails[team.team_code].hasOwnProperty("team_name") && (
              <div class="tablecontainer">
                <h2>{myTeamsDetails[team.team_code]?.team_name} </h2>
                <ul class="responsive-table">
                  <li class="table-header">
                    <div class="col col-1">Name</div>
                    <div class="col col-2">Task Title</div>
                    <div class="col col-3">Faculty Score</div>
                    <div class="col col-4">Time Score</div>
                  </li>
                  {myTaskSubmissions.map((subs) => {
                    const taskMain = myTasks.find(
                      (taskM) => taskM._id === subs.task_id
                    );
                    return (
                      subs.team_code == team.team_code &&
                      myTaskApprovalsDetails.hasOwnProperty(subs.email) &&
                      myTaskApprovalsDetails[subs.email].hasOwnProperty(
                        "full_name"
                      ) &&
                      subs.fscore != -1 && (
                        <li class="table-row">
                          <div class="col col-1" data-label="Job Id">
                            {myTaskApprovalsDetails[subs.email]?.full_name}
                          </div>
                          <div class="col col-2" data-label="Customer Name">
                            {taskMain.task_title}
                          </div>
                          <div class="col col-3" data-label="Amount">
                            {subs.fscore}
                          </div>
                          <div class="col col-4" data-label="Payment Status">
                            {subs.tscore}
                          </div>
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            )
          );
        }
      })}

      {/* <div class="tablecontainer">
        <h2>
          Responsive Tables Using LI <small>Triggers on 767px</small>
        </h2>
        <ul class="responsive-table">
          <li class="table-header">
            <div class="col col-1">Job Id</div>
            <div class="col col-2">Customer Name</div>
            <div class="col col-3">Amount Due</div>
            <div class="col col-4">Payment Status</div>
          </li>
          <li class="table-row">
            <div class="col col-1" data-label="Job Id">
              42235
            </div>
            <div class="col col-2" data-label="Customer Name">
              John Doe
            </div>
            <div class="col col-3" data-label="Amount">
              $350
            </div>
            <div class="col col-4" data-label="Payment Status">
              Pending
            </div>
          </li>
          <li class="table-row">
            <div class="col col-1" data-label="Job Id">
              42442
            </div>
            <div class="col col-2" data-label="Customer Name">
              Jennifer Smith
            </div>
            <div class="col col-3" data-label="Amount">
              $220
            </div>
            <div class="col col-4" data-label="Payment Status">
              Pending
            </div>
          </li>
          <li class="table-row">
            <div class="col col-1" data-label="Job Id">
              42257
            </div>
            <div class="col col-2" data-label="Customer Name">
              John Smith
            </div>
            <div class="col col-3" data-label="Amount">
              $341
            </div>
            <div class="col col-4" data-label="Payment Status">
              Pending
            </div>
          </li>
          <li class="table-row">
            <div class="col col-1" data-label="Job Id">
              42311
            </div>
            <div class="col col-2" data-label="Customer Name">
              John Carpenter
            </div>
            <div class="col col-3" data-label="Amount">
              $115
            </div>
            <div class="col col-4" data-label="Payment Status">
              Pending
            </div>
          </li>
        </ul>
      </div> */}
    </div>
  );
};
export default LeaderBoard;
