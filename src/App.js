import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './scss/common.scss'; 
import SideNavbar from "./components/SideNavbar/Sidebar";
import AddVoucher from "./components/AddVoucher/AddVoucher";


function App() {
  return (
    <div className="App">
      <AddVoucher/>
      {/* <SideNavbar/> */}
    </div>
  );
}

export default App;
