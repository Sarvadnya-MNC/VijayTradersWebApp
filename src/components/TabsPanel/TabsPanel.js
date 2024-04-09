import * as React from "react";
import PropTypes from "prop-types";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import TabList from "@mui/lab/TabList";
import Dashboard from "../Dashboard/Dashboard";
import Transaction from "../Transactions/Transaction";
import { useParams } from "react-router-dom";
const CentralTabsPanel = () => {
  const [value, setValue] = React.useState("0");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const params = useParams();

  React.useEffect(() => {
    if (params?.tabId) {
      setValue(params?.tabId.toString());
    }
  }, []);

  return (
    <Box sx={{ width: "100%", p: "8px" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            sx={{
              marginLeft: 1,
              [`& .${tabsClasses.indicator}`]: {
                height: 3,
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px",
                // backgroundColor:'#ff0000'
              },
            }}
            aria-label="basic tabs example"
          >
            <Tab label="Dashboard" value="0" />
            <Tab label="Unsettled accounts" value="1" />
            <Tab label="Item Three" value="2" />
          </TabList>
        </Box>
        <TabPanel sx={{ p: "10px" }} value="0">
          <Dashboard />
        </TabPanel>
        <TabPanel sx={{ p: "10px" }} value="1">
          <Transaction />
        </TabPanel>
        <TabPanel sx={{ p: "10px" }} value="2">
          Item Three
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default CentralTabsPanel;
