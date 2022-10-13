import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/system";
import AddFriendModal from "../Friends/AddFriendModal";
import { useServerEvents } from "../../wss/appSocket";
import { useFriends } from "../../state/friends/hooks";

const Root = () => {
  // Init all event listeners
  useServerEvents();
  // Fetch all friends
  useFriends();

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
