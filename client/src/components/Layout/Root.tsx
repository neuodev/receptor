import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/system";

const Root = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "rgba(var(--bs-light-rgb), 1)",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default Root;
