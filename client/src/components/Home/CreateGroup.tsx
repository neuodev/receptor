import React from "react";
import { Stack, Typography, Input, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const CreateGroup = () => {
  return (
    <Stack
      sx={{
        height: "100%",
        overflowY: "scroll",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography variant="h5" mb="32px">
        Create Group
      </Typography>

      <Input
        disableUnderline
        fullWidth
        placeholder="Search for friends"
        sx={{
          p: "14px 18px 14px 14px",
          bgcolor: "grey.300",
          borderRadius: "0.6rem",
          mb: "15px",
        }}
        startAdornment={<SearchIcon sx={{ mr: "4px" }} />}
      />

      <TextField label="Group name" />
    </Stack>
  );
};

export default CreateGroup;
