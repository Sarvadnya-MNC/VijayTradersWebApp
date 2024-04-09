import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainNavbar from "../MainNavbar/MainNavbar";
import { Card, Box } from "@mui/material";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  Inject,
  Edit,
  CommandColumn,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { db } from "../../database-config";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  Timestamp,
  updateDoc,
  deleteDoc,
} from "@firebase/firestore";
import "./TransactionDetails.css";

const TransactionDetails = () => {
  const [userData, setUserData] = useState({});
  const [transaction, setTransaction] = useState([]);
  const [totalDebited, setTotalDebited] = useState(0);
  const [totalCredited, setTotalCredited] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  //console.log('Location state', location);
  const userId = location?.state?.userID;

  useEffect(() => {
    getDocument();
  }, []);

  const getDocument = async () => {
    const userCollectionRef = await doc(db, "vijay_user", userId);
    const docSnap = await getDoc(userCollectionRef);
    setUserData({ ...docSnap.data(), id: docSnap.id });

    const q = query(
      collection(db, "vijay_transaction"),
      where("user_id", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    let validIndex = 0;
    const transactions = querySnapshot.docs.map((doc) => {
      const currentIndex = validIndex++;
      return {
        "S/r": currentIndex + 1,
        Remark: doc.data().remark,
        Date: new Timestamp(
          doc.data().date.seconds,
          doc.data().date.nanoseconds
        ).toDate(),
        Debited:
          doc.data().transaction_type === "DEBITE/नावे"
            ? doc.data().amount
            : "",
        Credited:
          doc.data().transaction_type === "CREDITE/जमा"
            ? doc.data().amount
            : "",
        id: doc.id,
        amount: doc.data().amount,
        allowCreditEdit:
          doc.data().transaction_type === "CREDITE/जमा" ? true : false,
        allowDebitEdit:
          doc.data().transaction_type === "DEBITE/नावे" ? true : false,
        userId: doc.data().user_id,
        transactionType: doc.data().transaction_type,
      };
    });

    let totalDebit = transactions.reduce(
      (acc, curr) => acc + parseFloat(curr.Debited || 0),
      0
    );
    let totalCredit = transactions.reduce(
      (acc, curr) => acc + parseFloat(curr.Credited || 0),
      0
    );
    setTotalDebited(totalDebit);
    setTotalCredited(totalCredit);
    const totalRow = {
      "S/r": "",
      Remark: "Total",
      Date: "",
      Debited: totalDebit,
      Credited: totalCredit,
    };

    setTransaction([...transactions, totalRow]);
  };

  const debitedTemplate = (props) => {
    //console.log( 'props.Debited value=  ',props.Debited);
    return (
      <div style={{ color: props.Debited > 0 ? "red" : "inherit" }}>
        {props.Debited}
      </div>
    );
  };

  const creditedTemplate = (props) => {
    //console.log( 'props.credit value=  ',props.Credited);
    return (
      <div style={{ color: props.Credited > 0 ? "green" : "inherit" }}>
        {props.Credited}
      </div>
    );
  };

  const queryCellInfoHandler = (args) => {
    // console.log('in query',args);
    if (args.data["S/r"] === "") {
      args.cell.classList.add("make-bold");
    }
  };

  const handleActionComplete = async (args) => {
    // console.log('In update outside', args);
    if (args.requestType === "save") {
      // console.log('In update inside');
      await updateDocumentInFirebase(args.data);
    }
  };

  const handleActionBegin = async (args) => {
    // console.log('In delete outside',args);
    if (args.requestType === "delete") {
      // console.log('In delete inside');
      if (args.data[0].Remark !== "Total") {
        await deleteDocumentFromFirebase(args.data[0].id, args.data[0].userId);
      }
    }
  };

  const updateDocumentInFirebase = async (updatedData) => {
    // console.log('In updateDocumentInFirebase',updatedData);
    if (updatedData.Remark !== "Total") {
      // console.log('In updateDocumentInFirebase -----');
      const docRef = doc(db, "vijay_transaction", updatedData.id);
      let data = {
        amount:
          updatedData.Debited > 0 ? updatedData.Debited : updatedData.Credited,
        date: updatedData.Date,
        remark: updatedData.Remark,
      };
      await updateDoc(docRef, data);
      //console.log('After update doc');
      let amount =
        updatedData.Debited > 0
          ? parseFloat(updatedData.Debited)
          : parseFloat(updatedData.Credited);
      //console.log('amount',amount);
      let Isdebited = updatedData.Debited > 0 ? true : false;
      // console.log('updatedData',updatedData);
      const docRef1 = doc(db, "vijay_user", userId);
      await updateClosingBalance(docRef1);
    }
  };

  const deleteDocumentFromFirebase = async (documentId, userId) => {
    const docRef = doc(db, "vijay_user", userId);
    await deleteDoc(doc(db, "vijay_transaction", documentId));
    await updateClosingBalance(docRef);
  };

  const toolbarClick = (args) => {
    if (args.item.id === "Grid_Refresh") {
      // console.log('In refresh -> in if');
      getDocument();
    }
  };

  const updateClosingBalance = async (docRef) => {
    const docSnap = await getDoc(docRef);
    const q = query(
      collection(db, "vijay_transaction"),
      where("user_id", "==", docSnap.data().user_id)
    );
    const querySnapshot = await getDocs(q);
    const transactions = querySnapshot.docs.map((doc) => {
      return {
        Debited:
          doc.data().transaction_type === "DEBITE/नावे"
            ? doc.data().amount
            : "",
        Credited:
          doc.data().transaction_type === "CREDITE/जमा"
            ? doc.data().amount
            : "",
      };
    });

    let totalDebit = transactions.reduce(
      (acc, curr) => acc + parseFloat(curr.Debited || 0),
      0
    );
    let totalCredit = transactions.reduce(
      (acc, curr) => acc + parseFloat(curr.Credited || 0),
      0
    );

    let updatedCLosingbalance = totalCredit - totalDebit;
    //console.log('updatedCLosingbalance',updatedCLosingbalance);
    let userData = {
      closing_balance: updatedCLosingbalance,
    };
    await updateDoc(docRef, userData);
  };

  return (
    <div>
      <MainNavbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignContent: "center",
            margin: "8px",
            flexWrap: "wrap",
            cursor: "pointer",
          }}
        >
          <KeyboardBackspaceIcon
            style={{
              margin: 2,
              padding: 2,
              textAlign: "left",
              boxShadow: 4,
              bgcolor: "grey.200",
            }}
            onClick={() => navigate("/1")}
          />
        </div>
        <Card
          sx={{
            width: 350,
            margin: 2,
            padding: 2,
            textAlign: "left",
            boxShadow: 4,
            bgcolor: "grey.200",
          }}
        >
          <div>
            <b>नाव</b> :{" "}
            {`${userData.last_name} ${userData.first_name} ${
              userData.middle_name ? userData.middle_name + " " : ""
            }`}
          </div>
          <div>
            <b>पत्ता</b> : {userData.address}
          </div>
        </Card>
        <Card
          sx={{
            width: 350,
            margin: 2,
            padding: 2,
            textAlign: "left",
            boxShadow: 4,
            bgcolor: "grey.200",
          }}
        >
          <div>
            <b>मोबाइल</b> : {userData.mobile}
          </div>
          <div>
            <b>ईमेल</b> : {userData.email}
          </div>
        </Card>
        <Card
          sx={{
            width: 350,
            margin: 2,
            padding: 2,
            textAlign: "left",
            boxShadow: 4,
            bgcolor: "grey.200",
          }}
        >
          <div>
            <b>Closing Balance</b> :{" "}
            <span
              style={{ color: userData.closing_balance < 0 ? "red" : "green" }}
            >
              {userData.closing_balance}
            </span>
          </div>
        </Card>
      </Box>
      <GridComponent
        dataSource={transaction}
        id="Grid"
        allowSorting={true}
        toolbar={["Edit", "Delete", "Update", "Cancel", "Refresh"]}
        editSettings={{ allowEditing: true, allowDeleting: true }}
        queryCellInfo={queryCellInfoHandler}
        cssClass="custom-grid"
        actionComplete={handleActionComplete}
        actionBegin={handleActionBegin}
        toolbarClick={toolbarClick}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="S/r"
            headerText="क्रमांक"
            width="150"
            textAlign="Center"
            isPrimaryKey={true}
          />
          <ColumnDirective field="Remark" headerText="तपशील" width="200" />
          <ColumnDirective
            field="Date"
            headerText="दिनांक"
            width="150"
            format="dd/MM/yyyy"
            type="date"
            editType="datepickeredit"
          />
          <ColumnDirective
            field="Debited"
            headerText="नावे"
            width="150"
            template={debitedTemplate}
            allowEditing={(props) => props.Debited}
          />
          <ColumnDirective
            field="Credited"
            headerText="जमा"
            width="120"
            format="0.00"
            template={creditedTemplate}
            allowEditing={(props) => props.Credited}
          />
        </ColumnsDirective>

        <Inject services={[Sort, Edit, CommandColumn, Toolbar]}></Inject>
      </GridComponent>
      <div class="grid-container">
        <div class="grid-item">
          <b>Balance :</b>
        </div>
        <div class="grid-item">
          <b style={{ color: totalCredited > 0 ? "green" : "red" }}>
            {totalCredited - totalDebited}
          </b>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
