import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const WithdrawalPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [userDetails, setUserDetails] = useState([]);

    useEffect(() => {
        getUsers();
        return () => { };
    }, []);

    const getUsers = async () => {
        const getUser = await fetch("http://localhost:8002/getWithdrawalList", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const result = await getUser.json();
        setUserDetails(result.user)
        console.log(result);
    };

    const handleSubmit = async (elem) => {
        const resp = window.confirm("Are you sure you want to approve the transaction?");

        if (resp) {
            const email = elem.email;
            const name = elem.name;
            const plan = elem.plan;
            const wallet = elem.wallet;
            const amount = elem.amount;

            const getUserH = await fetch("http://localhost:8002/approveWithdrawalRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, plan, wallet, name, amount
                })
            })

            const result = await getUserH.json();
            if (result.status == 200) {
                alert("Transaction Approved...");
                window.location.reload();
            }
        }
    };

    const handleDelete = async (elem) => {
        const respp = window.confirm("Are you sure you want to decline the transaction??")

        if (respp) {
            const email = elem.email;

            const getUserD = await fetch("http://localhost:8002/wdecline", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email
                })
            })

            const result = await getUserD.json();
            if (result.status == 200) {
                alert("Transaction Declined...");
                window.location.reload();
            }
        }
    };


    return (
        <Box m="20px">
            <Header title="Order" subtitle="List of Pending Order" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <div class="container">
                    <ul class="responsive-table">
                        <li class="table-header">
                            <div class="col col-3">Date and Time</div>
                            <div class="col col-3">Name</div>
                            <div class="col col-3">Email</div>
                            <div class="col col-1">Plan</div>
                            <div class="col col-2">Wallet</div>
                            <div class="col col-1">Amount</div>
                            <div class="col col-4">Approve/Decline</div>
                        </li>
                        {userDetails.map((elem, index) => {
                            let dateAndTime = elem.createdAt;
                            let date = dateAndTime.split("T");
                            let time = date[1].split(".");
                            return (
                                <li class="table-row" key={index} style={{ color: "black" }}>
                                    <div class="col col-3" data-label="Job Id">{date[0]} {time[0]}</div>
                                    <div class="col col-3" data-label="Job Id">{elem.name}</div>
                                    <div class="col col-3" data-label="Job Id">{elem.email}</div>
                                    <div class="col col-1" data-label="Customer Name">{elem.plan}</div>
                                    <div class="col col-2" data-label="Amount" style={{cursor: "pointer"}} onClick={() => { navigator.clipboard.writeText(elem.wallet) }}>{elem.wallet}</div>
                                    <div class="col col-1" data-label="Amount">{elem.amount / 0.000004}</div>
                                    <div class="col col-4" data-label="Payment Status"><span style={{ paddingRight: "2rem", cursor: "pointer" }} onClick={() => { handleSubmit(elem) }} >✅</span> <span style={{ cursor: "pointer" }} onClick={() => { handleDelete(elem) }} >❌</span></div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </Box>
        </Box>
    );
};

export default WithdrawalPage;
