import React from "react";
import { Box, Input, Typography, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const Friends = () => {
  return (
    <Box>
      <Typography variant="h5" mb="32px">
        Friends
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

      <Button
        disableElevation
        endIcon={<PersonAddAltIcon />}
        variant="contained"
        fullWidth
        sx={{
          mb: "20px",
          height: "50px",
          lineHeight: "1px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography>Find Friends</Typography>
      </Button>
    </Box>
  );
};

export default Friends;
