import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function StakeHistory({ connectedAccount }) {
  console.log(
    "connected Address in stake history-----------",
    connectedAccount
  );

  const [value, setValue] = useState(0);
  const [stakeHistory, setStakeHistory] = useState([]);
  const [unstakeHistory, setUnstakeHistory] = useState([]);
  const [stakePage, setStakePage] = useState(0);
  const [stakeRowsPerPage, setStakeRowsPerPage] = useState(10);
  const [unstakePage, setUnstakePage] = useState(0);
  const [unstakeRowsPerPage, setUnstakeRowsPerPage] = useState(10);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeStakePage = (event, newPage) => {
    setStakePage(newPage);
  };

  const handleChangeStakeRowsPerPage = (event) => {
    setStakeRowsPerPage(parseInt(event.target.value, 10));
    setStakePage(0);
  };

  const handleChangeUnStakePage = (event, newPage) => {
    setUnstakePage(newPage);
  };

  const handleChangeUnStakeRowsPerPage = (event) => {
    setUnstakeRowsPerPage(parseInt(event.target.value, 10));
    setUnstakePage(0);
  };

  useEffect(() => {
    // stake Details

    const apiUrlStakeDetail = "http://localhost:3000/stakeDetail";
    const data = {
      Address: connectedAccount,
    };

    axios
      .post(apiUrlStakeDetail, data)
      .then((response) => {
        if (response.data && Array.isArray(response.data.Data)) {
          setStakeHistory(response.data.Data);
        } else {
          console.error("Invalid data format received from the API");
        }
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
      });

    //   Unstake Details

    const apiUrlUnStakeDetail = "http://localhost:3000/unstakeDetail";
    const unstakedata = {
      Address: connectedAccount,
    };

    axios
      .post(apiUrlUnStakeDetail, unstakedata)
      .then((response) => {
        if (response.data && Array.isArray(response.data.Data)) {
          setUnstakeHistory(response.data.Data);
        } else {
          console.error("Invalid data format received from the API");
        }
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
      });
  }, [connectedAccount]);
  return (
    <>
      <div className="App">
        <h1>Staking History</h1>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              //   textColor="warning"
              //   indicatorColor="warning"
              aria-label="basic tabs example"
            >
              <Tab label="Stake" {...a11yProps(0)} />
              <Tab label="Unstake" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount (ETH)</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Duartion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stakeHistory
                    .slice(
                      stakePage * stakeRowsPerPage,
                      stakePage * stakeRowsPerPage + stakeRowsPerPage
                    )
                    .map((stake, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{stake.amount} ETH</TableCell>
                          <TableCell>{stake.timestamp}</TableCell>
                          <TableCell>{stake.lockPeriodInDay}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={100}
                page={stakePage}
                onPageChange={handleChangeStakePage}
                rowsPerPage={stakeRowsPerPage}
                onRowsPerPageChange={handleChangeStakeRowsPerPage}
              />
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount (ETH)</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Duartion</TableCell>
                    <TableCell>Reward</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unstakeHistory
                    .slice(
                      unstakePage * unstakeRowsPerPage,
                      unstakePage * unstakeRowsPerPage + unstakeRowsPerPage
                    )
                    .map((unstake, index) => (
                      <TableRow key={index}>
                        <TableCell>{unstake.amount} ETH</TableCell>
                        <TableCell>{unstake.timestamp}</TableCell>
                        <TableCell>{unstake.lockPeriodInDay}</TableCell>
                        <TableCell>
                          {unstake.rewardAmount}
                          ETH
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={100}
                page={unstakePage}
                onPageChange={handleChangeUnStakePage}
                rowsPerPage={unstakeRowsPerPage}
                onRowsPerPageChange={handleChangeUnStakeRowsPerPage}
              />
            </TableContainer>
          </CustomTabPanel>
        </Box>
      </div>
    </>
  );
}
