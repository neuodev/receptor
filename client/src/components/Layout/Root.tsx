import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/system";
import AddFriendModal from "../Friends/AddFriendModal";
import { useServerEvents } from "../../wss/appSocket";

const Root = () => {
  // Init all event listeners
  useServerEvents();

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
