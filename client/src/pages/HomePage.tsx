import React from "react";
import { Stack, Box } from "@mui/material";
import Sidebar from "../components/Home/Sidebar";
import { Outlet } from "react-router-dom";
import ChatBox from "../components/Home/ChatBox";

const HomePage = () => {
  return (
    <Stack direction="row" sx={{ height: "100%", flexShrink: 1 }}>
      <Sidebar />
      <Box
        sx={{
          width: "400px",
          boxShadow: "var(--shadow-inner)",
        }}
      >
        <Outlet />
      </Box>
      <ChatBox />
    </Stack>
  );
};

export default HomePage;
