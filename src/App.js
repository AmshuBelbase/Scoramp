import "./App.css";
import Home from "./Components/Home/Home";
import NavBar from "./Components/NavBar/NavBar";
import LoginForm from "./Components/LoginForm/LoginForm";
import SignUpForm from "./Components/SignUpForm/SignUpForm";
import Settings from "./Components/Settings/Settings";
import { useState } from "react";

// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
                <NavBar setLoginUser={setLoginUser} />
                <Home setLoginUser={setLoginUser} />
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
              <NavBar setLoginUser={setLoginUser} />
              <Settings setLoginUser={setLoginUser} />
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
              <NavBar setLoginUser={setLoginUser} />
              <Home setLoginUser={setLoginUser} />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
