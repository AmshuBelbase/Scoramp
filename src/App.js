import "./App.css";
import Home from "./Components/Home/Home";
import NavBar from "./Components/NavBar/NavBar";
import LoginForm from "./Components/LoginForm/LoginForm";
import SignUpForm from "./Components/SignUpForm/SignUpForm";

// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginForm />} />
      </Routes>
      <Routes>
        <Route exact path="/signup" element={<SignUpForm />} />
      </Routes>
      <Routes>
        <Route
          exact
          path="/tracking"
          element={
            <>
              <NavBar />
              <Home />
            </>
          }
        />
      </Routes>
      {/* <div className="home-wrap">
        <NavBar />
        <Routes>
          <Route exact path="/tracking" element={<Home />} />
        </Routes>
      </div> */}
    </Router>
  );
}

export default App;
