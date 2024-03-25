import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './scss/common.scss'; 
import SideNavbar from "./components/SideNavbar/Sidebar";
import AddVoucher from "./components/AddVoucher/AddVoucher";
import Transaction from "./components/Transactions/Transaction";
import { registerLicense } from '@syncfusion/ej2-base';


function App() {
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxcdXVUR2BfWUxyWEM=');
  return (
    <div className="App">
      {/* <AddVoucher/> */}
      <Transaction/>
      {/* <SideNavbar/> */}
    </div>
  );
}

export default App;
