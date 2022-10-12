import React from "react";
import { Box, Typography, Input } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddFriendCard from "./AddFriendCard";

const AddFriends = () => {
  return (
    <Box>
      <Typography variant="h5" mb="32px">
        Friends
      </Typography>

      <Input
        disableUnderline
        fullWidth
        placeholder="Search for friends..."
        sx={{
          p: "14px 18px 14px 14px",
          bgcolor: "grey.300",
          borderRadius: "0.6rem",
          mb: "15px",
        }}
        startAdornment={<SearchIcon sx={{ mr: "4px" }} />}
      />

      <Box>
        {friends.map((friend, idx) => (
          <AddFriendCard key={idx} friend={friend} />
        ))}
      </Box>
    </Box>
  );
};

export default AddFriends;

const friends = [
  {
    username: "Jone Doe",
    status: "online",
  },
  {
    username: "Jane Doe",
    status: "busy",
  },
  {
    username: "Ahmed Ibrahim",
    status: "online",
  },
];
