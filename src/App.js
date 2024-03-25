import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./scss/common.scss";
import SideNavbar from "./components/SideNavbar/Sidebar";
import AddVoucher from "./components/AddVoucher/AddVoucher";
import Home from "./components/Home/Home";

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
