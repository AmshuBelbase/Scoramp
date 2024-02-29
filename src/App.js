import "./App.css";
import Home from "./Components/Home/Home";
import NavBar from "./Components/NavBar/NavBar";
import LoginForm from "./Components/LoginForm/LoginForm";

// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <LoginForm />
      {/* <div className="home-wrap">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
      </div> */}
    </Router>
  );
}

export default App;
