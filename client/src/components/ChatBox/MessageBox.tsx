import React from "react";
import { Stack, Box, Typography, IconButton, Input } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const MessageBox = () => {
  return (
    <Stack
      direction="row"
      sx={{
        bgcolor: "grey.300",
        borderRadius: 20,
        padding: "8px",
        mb: "20px",
      }}
    >
      <IconButton sx={{ width: "50px", height: "50px" }}>
        <AttachFileIcon />
      </IconButton>

      <Input
        disableUnderline
        placeholder="Type your message.."
        sx={{
          py: "10px",
          flex: 1,
          ml: "10px",
          color: "grey.800",
          fontWeight: "500",
        }}
      />

      <IconButton sx={{ width: "50px", height: "50px" }}>
        <TagFacesIcon />
      </IconButton>

      <IconButton sx={{ width: "50px", height: "50px" }}>
        <SendIcon />
      </IconButton>
    </Stack>
  );
};

export default MessageBox;
