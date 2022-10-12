import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/system";
import AddFriendModal from "../Friends/AddFriendModal";

const Root = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "rgba(var(--bs-light-rgb), 1)",
      }}
    >
      <Outlet />
      <AddFriendModal />
    </Box>
  );
};

export default Root;
