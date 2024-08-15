import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://scoramp.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// const corsOption = {
//   origin: ["http://localhost:3000"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };
// app.use(cors(corsOption));

// mongoose
//   .connect("mongodb://localhost:27017/Scoramp")
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

mongoose
  .connect(
    "mongodb+srv://ab0667:m3dbYVKnF5ICvgf7@scoramp.7zvnt.mongodb.net/Scoramp?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const userSchema = new mongoose.Schema({
  full_name: String,
  reg_id: String,
  phone: Number,
  field: String,
  address: String,
  email: String,
  password: String,
  cpassword: String,
});
const User = new mongoose.model("User", userSchema);

const teamSchema = new mongoose.Schema({
  email: String,
  team_name: String,
  description: String,
  type: String,
  team_code: String,
});
const Team = new mongoose.model("Team", teamSchema);

const teamListSchema = new mongoose.Schema({
  email: String,
  team_code: String,
  approval: String,
});
const TeamMembers = new mongoose.model("TeamList", teamListSchema);

const taskSchema = new mongoose.Schema({
  email: String,
  task_title: String,
  team_code: String,
  full_marks: Number,
  given_date: String,
  deadline: String,
  description: String,
});
const Task = new mongoose.model("Task", taskSchema);

const taskSubmissionSchema = new mongoose.Schema({
  email: String,
  team_code: String,
  full_marks: Number,
  subDate: String,
  submissionMessage: String,
  task_id: String,
  fscore: Number,
  tscore: Number,
});
const subTask = new mongoose.model("SubTask", taskSubmissionSchema);

app.get("/", (req, res) => {
  res.json("Hello");
});

app.get("/getlogin", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (password === user.password) {
          res.send({ message: "Login Successful ✅", user: user });
        } else {
          res.send({ message: "Email & Password didn't match ❌" });
        }
      } else {
        res.send({ message: "User not Found ❌" });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (password === user.password) {
          res.send({ message: "Login Successful ✅", user: user });
        } else {
          res.send({ message: "Email & Password didn't match ❌" });
        }
      } else {
        res.send({ message: "User not Found ❌" });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/joinNewTeam", (req, res) => {
  let { email, team_code } = req.body;
  Team.findOne({ team_code: team_code })
    .then((team) => {
      if (team) {
        TeamMembers.findOne({ team_code: team_code, email: email })
          .then((teamlist) => {
            if (teamlist) {
              res.send({ message: "Already in Team 🙄", stat: "false" });
            } else {
              const teamMember = new TeamMembers({
                email: email,
                team_code: team_code,
                approval: "no",
              });
              teamMember
                .save()
                .then(() => {
                  res.send({
                    message: "Team Joined Successfully ✅ Wait for Approval !",
                    stat: "true",
                  });
                })
                .catch((err) => {
                  res.send({ message: err, stat: "false" });
                });
            }
          })
          .catch((err) => {
            console.error("Error connecting to MongoDB:", err);
          });
      } else {
        res.send({ message: "Team Doesn't Exists ❌", stat: "false" });
      }
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
});

app.post("/createTeam", (req, res) => {
  let { email, team_name, description, type, team_code } = req.body;
  Team.findOne({ team_code: team_code })
    .then((user) => {
      if (user) {
        res.send({ message: "Team Already Exists ❌", stat: "false" });
      } else {
        const team = new Team({
          email,
          team_name,
          description,
          type,
          team_code,
        });
        team
          .save()
          .then(() => {
            // Team is saved successfully, now save the team member
            const teamMember = new TeamMembers({
              email: email,
              team_code: team_code,
              approval: "yes",
            });
            return teamMember.save(); // Return the promise to continue chaining
          })
          .then(() => {
            res.send({ message: "Team Created Successfully ✅", stat: "true" });
          })
          .catch((err) => {
            res.send({ message: err, stat: "false" });
          });
      }
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
});

app.post("/submitTask", (req, res) => {
  const {
    email,
    task_id,
    team_code,
    full_marks,
    submissionMessage,
    fscore,
    tscore,
  } = req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Add 1 to month since it's zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");

  const subDate = `${year}-${month}-${day}T${hours}:${minutes}`;

  Team.findOne({ team_code: team_code })
    .then((user) => {
      if (user) {
        const sub_task = new subTask({
          email,
          task_id,
          team_code,
          full_marks,
          subDate,
          submissionMessage,
          fscore,
          tscore,
        });
        sub_task
          .save()
          .then(() => {
            res.send({
              message: "Task Submitted Successfully ✅",
              stat: "true",
            });
          })
          .catch((err) => {
            res.send({ message: err, stat: "false" });
          });
      } else {
        res.send({ message: "Team Doesn't Exists ❌", stat: "false" });
      }
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
});

app.post("/assignTask", (req, res) => {
  let { email, task_title, team_code, full_marks, deadline, description } =
    req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Add 1 to month since it's zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");

  const given_date = `${year}-${month}-${day}T${hours}:${minutes}`;

  Team.findOne({ team_code: team_code })
    .then((user) => {
      if (user) {
        const task = new Task({
          email,
          task_title,
          team_code,
          full_marks,
          given_date,
          deadline,
          description,
        });
        task
          .save()
          .then(() => {
            res.send({
              message: "Task Assigned Successfully ✅",
              stat: "true",
            });
          })
          .catch((err) => {
            res.send({ message: err, stat: "false" });
          });
      } else {
        res.send({ message: "Team Doesn't Exists ❌", stat: "false" });
      }
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
});

app.post("/register", (req, res) => {
  let { full_name, reg_id, phone, field, address, email, password, cpassword } =
    req.body;

  reg_id = reg_id == "" ? "-" : reg_id;
  field = field == "" ? "-" : field;
  address = address == "" ? "-" : address;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.send({ message: "User Already Registered ❌" });
      } else {
        const user = new User({
          full_name,
          reg_id,
          phone,
          field,
          address,
          email,
          password,
        });
        user
          .save()
          .then(() => {
            res.send({ message: "Registration Successful ✅" });
          })
          .catch((err) => {
            res.send(err);
          });
      }
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
});

app.post("/updateUser", (req, res) => {
  let { id, full_name, reg_id, phone, field, address, email, password } =
    req.body;

  reg_id = reg_id == "" ? "-" : reg_id;
  field = field == "" ? "-" : field;
  address = address == "" ? "-" : address;
  const update = {
    $set: {
      full_name,
      reg_id,
      phone,
      field,
      address,
      email,
      password,
    },
  };

  User.findByIdAndUpdate(id, update)
    .then(() => {
      // Perform another query to retrieve the updated document
      return User.findById(id);
    })
    .then((userUpdated) => {
      // console.log(userUpdated);
      res.send({ message: "Update Successful ✅", userUpdated: userUpdated });
    })
    .catch((err) => {
      console.error("Error Updating MongoDB:", err);
    });
});

app.post("/getUser", (req, res) => {
  let { id, full_name, reg_id, phone, field, address, email, password } =
    req.body;
  User.findOne({ _id: id })
    .then((user) => {
      res.send({ user: user });
    })
    .catch((err) => res.json(err));
});

app.post("/getUserDetails", (req, res) => {
  let { email } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      res.send({ user: user });
    })
    .catch((err) => res.json(err));
});

app.post("/getMyTeams", (req, res) => {
  let { id, full_name, reg_id, phone, field, address, email, password } =
    req.body;
  TeamMembers.find({ email: email })
    .then((teams) => {
      res.json(teams);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/getMyTasks", (req, res) => {
  const teamCodes = Object.values(req.body).map((each) => each.team_code);
  Task.find({ team_code: { $in: teamCodes } })
    .then((teams) => {
      res.json(teams);
    })
    .catch((err) => {
      res.json(err);
    });
});
app.post("/getMyTaskSubmissions", (req, res) => {
  const teamCodes = Object.values(req.body).map((each) => each.team_code);
  subTask
    .find({ team_code: { $in: teamCodes } })
    .then((teams) => {
      res.json(teams);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/getMyOwnTeams", (req, res) => {
  let { id, full_name, reg_id, phone, field, address, email, password } =
    req.body;
  Team.find({ email: email })
    .then((teams) => {
      res.json(teams);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/getTeamDetails", (req, res) => {
  let { email, team_code } = req.body;
  Team.findOne({ team_code: team_code })
    .then((tFound) => {
      res.send({ team: tFound });
    })
    .catch((err) => res.json(err));
});

app.post("/acceptTask", (req, res) => {
  let { _id, fscore } = req.body;
  const updateApproval = {
    $set: {
      fscore,
    },
  };
  subTask
    .findOneAndUpdate({ _id: _id }, updateApproval)
    .then((tFound) => {
      if (tFound) {
        res.send({ message: "Marks Updated ✅" });
      } else {
        res.send({ message: "Marks Not Updated ❌" });
      }
    })
    .catch((err) => res.json(err));
});

app.post("/declineTask", (req, res) => {
  let { _id, fscore } = req.body;
  subTask
    .findOneAndDelete({ _id: _id })
    .then((tFound) => {
      if (tFound) {
        res.send({ message: "Submission Removed ✅" });
      } else {
        res.send({ message: "Submission Not Removed ❌" });
      }
    })
    .catch((err) => res.json(err));
});

app.post("/approveBtn", (req, res) => {
  let { data_name, data_code } = req.body;
  let approval = "yes";
  const updateApproval = {
    $set: {
      approval,
    },
  };
  TeamMembers.findOneAndUpdate(
    { email: data_name, team_code: data_code },
    updateApproval
  )
    .then((tFound) => {
      if (tFound) {
        res.send({ message: "User Approved ✅" });
      } else {
        res.send({ message: "User Not Approved ❌" });
      }
    })
    .catch((err) => res.json(err));
});
app.post("/declineBtn", (req, res) => {
  let { data_name, data_code } = req.body;
  TeamMembers.findOneAndDelete({ email: data_name, team_code: data_code })
    .then((tFound) => {
      if (tFound) {
        res.send({ message: "User Removed ✅" });
      } else {
        res.send({ message: "User Not Removed ❌" });
      }
    })
    .catch((err) => res.json(err));
});

app.post("/getApproveRequests", (req, res) => {
  let { email } = req.body;
  Team.find({ email: email })
    .then((tFound) => {
      if (tFound) {
        const teamCodes = tFound.map((team) => team.team_code);
        TeamMembers.find({ team_code: { $in: teamCodes }, approval: "no" })
          .then((approvals) => {
            if (approvals) {
              res.send({
                message: "found",
                approvals: approvals,
              });
            }
          })
          .catch((error) => {
            res.json(err);
          });
      } else {
      }
    })
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log("Be started at port 3001");
});
