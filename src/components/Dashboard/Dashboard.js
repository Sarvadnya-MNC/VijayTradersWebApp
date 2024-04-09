import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import OutboundIcon from "@mui/icons-material/Outbound";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import "./dashboard.css";
import AddVoucher from "../AddVoucher/AddVoucher";
import AddUser from "../AddUser/AddUser";
import {
  collection,
  getDocs,
  Timestamp,
  onSnapshot,
} from "@firebase/firestore";
import { db } from "../../database-config";

const Dashboard = () => {
  const valueFormatter = (value) => `${value} Rs`;
  const [isAddVoucherOpen, setIsAddVoucherOpen] = React.useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);
  const [totalAmounts, setTotalAmounts] = useState({
    credit: 0,
    debit: 0,
  });
  const [datasets, setDatasets] = useState([]);

  // function for closing add voucher dialoag
  const handleAddVoucherClickOpen = () => {
    setIsAddVoucherOpen(true);
  };

  // function for opening add user dialoag
  const handleAddUserClickOpen = () => {
    setIsAddUserOpen(true);
  };

  // function for closing add voucher dialoag
  const handleAddVoucherClose = () => {
    setIsAddVoucherOpen(false);
  };

  // function for closing add user dialoag
  const handleAddUserClose = () => {
    setIsAddUserOpen(false);
  };

  const setGraphData = (baseArray) => {
    const dateMap = baseArray
      .map((i) => ({
        ...i,
        date: new Timestamp(i.date.seconds, i.date.nanoseconds).toDate(),
      }))
      .reduce((resMap, obj) => {
        const date = new Date(obj.date).toLocaleString().split(",")[0];
        // just creatong map
        if (resMap[date] !== undefined)
          if (obj.transaction_type == "CREDITE/जमा") {
            resMap[date] = {
              ...resMap[date],
              credit: resMap[date]?.credit + Number(obj.amount),
            };
          } else {
            resMap[date] = {
              ...resMap[date],
              debit: resMap[date]?.debit + Number(obj.amount),
            };
          }
        // if it is not present in map craete a key and record
        else if (obj.transaction_type == "CREDITE/जमा") {
          resMap[date] = {
            ...resMap[date],
            credit: Number(obj.amount),
            debit: 0,
            date: obj.date,
            day: obj.date.toLocaleDateString("en", {
              month: "short",
              day: "numeric",
            }),
          };
        } else {
          resMap[date] = {
            ...resMap[date],
            debit: Number(obj.amount),
            credit: 0,
            date: obj.date,
            day: obj.date.toLocaleDateString("en", {
              month: "short",
              day: "numeric",
            }),
          };
        }

        return resMap;
      }, {});
    // set the graph data for only last 30 days
    setDatasets(
      Object.values(dateMap)
        .sort((a1, a2) => a1.date - a2.date)
        .slice(-30)
    );
  };

  const setAmountsData = (usersArray) => {
    // setting total for cedit and debit
    setTotalAmounts({
      credit: usersArray
        .filter((si) => Number(si.closing_balance) >= 0)
        .map((a) => a.closing_balance)
        ?.reduce((currSum, ele) => Number(currSum) + Number(ele), 0),
      debit: usersArray
        .filter((si) => Number(si.closing_balance) < 0)
        .map((a) => Math.abs(Number(a.closing_balance)))
        ?.reduce((currSum, ele) => currSum + ele, 0),
    });
  };

  useEffect(() => {
    const unsubscribeTransactions = onSnapshot(
      collection(db, "vijay_transaction"),
      (snapshot) => {
        // Respond to data
        // ...
        const baseArray = [];
        snapshot.docs.map((doc) =>
          baseArray.push({ ...doc.data(), id: doc.id })
        );
        // set the data
        setGraphData(baseArray);
      }
    );

    const unsubscribeUsers = onSnapshot(
      collection(db, "vijay_user"),
      (snapshot) => {
        // Respond to data
        // ...
        const baseArray2 = [];
        snapshot.docs.map((doc) =>
          baseArray2.push({ ...doc.data(), id: doc.id })
        );
        // set the data
        setAmountsData(baseArray2);
      }
    );
    // get all data for dashboard
    return () => {
      unsubscribeTransactions();
      unsubscribeUsers();
    };
  }, []);

  const chartSetting = {
    // yAxis: [
    //   {
    //     label: 'Amount (Rs)',
    //   },
    // ],
    // sx: {
    //   [`.${axisClasses.left} .${axisClasses.label}`]: {
    //     transform: 'translate(-20px, 0)',
    //   },
    // },
  };

  // dummy dataset
  // const dataset = [
  //   {
  //     credit: 1400,
  //     debit: 900,
  //     day: "12 April",
  //   },
  //   {
  //     credit: 6754,
  //     debit: 2895,
  //     day: "22 April",
  //   },
  //   {
  //     credit: 4600,
  //     debit: 1200,
  //     day: "5 May",
  //   },
  //   {
  //     credit: 2334,
  //     debit: 1876,
  //     day: "7 May",
  //   },
  //   {
  //     credit: 2000,
  //     debit: 1000,
  //     day: "20 May",
  //   },
  //   {
  //     credit: 1000,
  //     debit: 4000,
  //     day: "24 May",
  //   },
  //   {
  //     credit: 4000,
  //     debit: 1000,
  //     day: "21 May",
  //   },
  //   {
  //     credit: 3300,
  //     debit: 5000,
  //     day: "29 May",
  //   },
  // ];

  return (
    <>
      <Box sx={{ display: "flex", flexGrow: 1, p: 0 }}>
        <Box component={"main"} sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Stack spacing={2} direction={"row"}>
                {/* first card */}
                <Card sx={{ width: 100 + "%" }} className="credit-gardient">
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 48, display: "flex" }}
                        color="white"
                        gutterBottom
                      >
                        {totalAmounts.credit}
                      </Typography>
                      <CreditCardIcon sx={{ fontSize: 35, color: "white" }} />
                    </div>
                    <Typography color="white" variant="h6">
                      Total Credit
                    </Typography>
                  </CardContent>
                </Card>
                {/* Second card */}
                <Card sx={{ width: 100 + "%" }} className="debit-gradient">
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 48, display: "flex" }}
                        color="white"
                        gutterBottom
                      >
                        {totalAmounts.debit}
                      </Typography>
                      <OutboundIcon sx={{ fontSize: 35, color: "white" }} />
                    </div>
                    <Typography color="white" variant="h6">
                      Total Debit
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            {/* Second grid */}
            <Grid item xs={4}>
              <Stack spacing={2}>
                {/* first card */}
                <Card
                  sx={{ minWidth: 100 + "%", cursor: "pointer" }}
                  onClick={() => {
                    handleAddUserClickOpen();
                  }}
                >
                  <CardContent
                    sx={{
                      backgroundColor: "black",
                      display: "flex",
                      alignItems: "center",
                      p: "10px",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      <Typography
                        sx={{ fontSize: 24 }}
                        color="white"
                        gutterBottom
                      >
                        Add User
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
                {/* Second card */}
                <Card
                  sx={{ minWidth: 100 + "%", cursor: "pointer" }}
                  onClick={() => {
                    handleAddVoucherClickOpen();
                  }}
                >
                  <CardContent
                    sx={{
                      backgroundColor: "black",
                      display: "flex",
                      alignItems: "center",
                      p: "10px",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      <Typography
                        sx={{ fontSize: 24 }}
                        color="white"
                        gutterBottom
                      >
                        Add Voucher
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Box height={70} />
            <Grid item xs={8}>
              <Card sx={{ height: 60 + "vh" }}>
                {/* <CardContent> */}
                {datasets.length > 0 && (
                  <BarChart
                    dataset={datasets}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "day",
                        tickPlacement: "middle",
                      },
                    ]}
                    series={[
                      {
                        dataKey: "credit",
                        label: "Credit",
                        valueFormatter,
                        color: "#002A69",
                      },
                      {
                        dataKey: "debit",
                        label: "Debit",
                        valueFormatter,
                        color: "#ff0000",
                      },
                    ]}
                    {...chartSetting}
                  />
                )}
                {!datasets?.length && (
                  <div
                    className="center-align"
                    style={{ alignItems: "center", height: "100%" }}
                  >
                    No Data Available
                  </div>
                )}
                {/* </CardContent> */}
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ minWidth: 200, height: 60 + "vh" }}>
                <CardContent></CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* Voucher Drawer Dialog */}
      {isAddVoucherOpen && (
        <AddVoucher
          isAddVoucherOpen={isAddVoucherOpen}
          handleAddVoucherClose={handleAddVoucherClose}
        />
      )}
      {/* Add User Dialog */}
      {isAddUserOpen && (
        <AddUser
          isAddUserOpen={isAddUserOpen}
          handleAddUserClose={handleAddUserClose}
        />
      )}
    </>
  );
};

export default Dashboard;
