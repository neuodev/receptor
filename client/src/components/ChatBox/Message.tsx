import React from "react";
import { Stack, IconButton, Box, Avatar, Typography } from "@mui/material";
import { stringAvatar } from "../../utils/colors";

const Message: React.FC<{
  message: {
    user: string;
    message: string;
  };
}> = ({ message }) => {
  const fromUser = message.user.startsWith("Jone");
  return (
    <Stack
      direction={fromUser ? "row-reverse" : "row"}
      alignItems="flex-end"
      sx={{ maxWidth: "50%", ml: fromUser ? "auto" : "0px", mt: "24px" }}
    >
      <Box>
        <Avatar {...stringAvatar(message.user)}>JS</Avatar>
      </Box>
      <Stack
        alignItems={fromUser ? "flex-end" : "flex-start"}
        sx={{ px: "16px" }}
      >
        <Typography
          sx={{
            bgcolor: "primary.main",
            p: "16px 20px",
            borderRadius: "0.6rem",
            mb: "4px",
          }}
          variant="body1"
          color="common.white"
        >
          {message.message}
        </Typography>
        <Typography variant="caption" color="grey.500">
          5min ago
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Message;
