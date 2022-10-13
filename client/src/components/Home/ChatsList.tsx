import React from "react";
import { Stack, Typography, Input, Box, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAppSelector } from "../../store";
import Center from "../common/Center";

const ChatsList = () => {
  const friends = useAppSelector((state) => state.friends);

  return (
    <Stack>
      <Typography variant="h5" mb="32px">
        Chat
      </Typography>

      <Input
        disableUnderline
        fullWidth
        placeholder="Search messages or friends"
        sx={{
          p: "14px 18px 14px 14px",
          bgcolor: "grey.300",
          borderRadius: "0.6rem",
          mb: "15px",
        }}
        startAdornment={<SearchIcon sx={{ mr: "4px" }} />}
      />

      <Box sx={{ flexGrow: 1 }}>
        {friends.loading ? (
          <Center>
            <CircularProgress />
          </Center>
        ) : friends.error ? (
          <Center>
            <Typography color="error">{friends.error}</Typography>
          </Center>
        ) : (
          <Box>{}</Box>
        )}
      </Box>
    </Stack>
  );
};

export default ChatsList;
