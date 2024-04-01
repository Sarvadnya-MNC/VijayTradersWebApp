import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./scss/common.scss";
import SideNavbar from "./components/SideNavbar/Sidebar";
import AddVoucher from "./components/AddVoucher/AddVoucher";
import Transaction from "./components/Transactions/Transaction";
import { registerLicense } from '@syncfusion/ej2-base';
import Home from "./components/Home/Home";
import { Route, Routes  } from "react-router-dom";
import ProtectedRoute from "./helpers/ProtectedRoute";
import Login from "./components/Login/Login";
import AuthProvider from "./helpers/AuthProvider";
import TransactionDetails from "./components/TransactionDetails/TransactionDetails";

function App() {
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxcdXVUR2BfWUxyWEM=');
  return (
    <>
    <AuthProvider>
    <Routes>
        <Route path="/" element={ <ProtectedRoute><Home/></ProtectedRoute> } />
        <Route path="transaction-records" element={ <ProtectedRoute><TransactionDetails/></ProtectedRoute> } />
        <Route path="login" element={ <Login /> } />
      </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
