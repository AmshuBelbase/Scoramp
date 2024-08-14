import "./App.css";
import Home from "./Components/Home/Home";
import NavBar from "./Components/NavBar/NavBar";
import LoginForm from "./Components/LoginForm/LoginForm";
import SignUpForm from "./Components/SignUpForm/SignUpForm";
import SettingsPage from "./Components/SettingsPage/SettingsPage";
import Teams from "./Components/Teams/Teams";

import { useState } from "react";

// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LeaderBoard from "./Components/LeaderBoard/LeaderBoard";
function App() {
  const [user, setLoginUser] = useState({
    username: "",
    register: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            user && user._id ? (
              <>
                <NavBar setLoginUser={setLoginUser} user={user} />
                <Home setLoginUser={setLoginUser} user={user} />
              </>
            ) : (
              <LoginForm setLoginUser={setLoginUser} />
            )
          }
        />
      </Routes>
      <Routes>
        <Route exact path="/signup" element={<SignUpForm />} />
      </Routes>
      <Routes>
        <Route
          exact
          path="/settings"
          element={
            <>
              <NavBar setLoginUser={setLoginUser} user={user} />
              <SettingsPage setLoginUser={setLoginUser} user={user} />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route
          exact
          path="/leaderboard"
          element={
            <>
              <NavBar setLoginUser={setLoginUser} user={user} />
              <LeaderBoard setLoginUser={setLoginUser} user={user} />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route
          exact
          path="/tracking"
          element={
            <>
              <NavBar setLoginUser={setLoginUser} user={user} />
              <Home setLoginUser={setLoginUser} user={user} />
            </>
          }
        />
      </Routes>
      <Routes>
        <Route
          exact
          path="/teams"
          element={
            <>
              <NavBar setLoginUser={setLoginUser} user={user} />
              <Teams setLoginUser={setLoginUser} user={user} />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
