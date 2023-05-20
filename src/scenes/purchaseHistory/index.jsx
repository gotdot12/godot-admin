import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const PurchaseHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    getUsers();
    return () => { };
  }, []);

  const getUsers = async () => {
    const getUser = await fetch("https://godot-main-server.vercel.app/getAllPurchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const result = await getUser.json();
    setUserDetails(result.user)
    console.log(result);
  };

  const columns = [
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "plan",
      headerName: "Plan",
      flex: 1,
    },
    {
      field: "wallet",
      headerName: "Wallet",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
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
        {userDetails.length == 0 ? <>No Data / Lodaing Data....</> :
          <DataGrid
            rows={userDetails}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
          />}
      </Box>
    </Box>
  );
};

export default PurchaseHistory;
