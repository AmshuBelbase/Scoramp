import "./App.css";
import Home from "./Components/Home/Home";
import NewTask from "./Components/NewTask/NewTask";
// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/newtask" element={<NewTask />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
