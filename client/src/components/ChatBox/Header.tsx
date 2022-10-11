import React from "react";
import { Stack, Box, Avatar, Typography, AvatarGroup } from "@mui/material";
import { stringAvatar } from "../../utils/colors";
import { theme } from "../../theme";

const Header = () => {
  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          borderBottom: `1px solid ${theme.palette.grey["300"]}`,
          p: "24px 0px",
        }}
      >
        <Box>
          <Avatar {...stringAvatar("Ahmed Ibrhaim")}>AI</Avatar>
        </Box>
        <Box sx={{ ml: "12px" }}>
          <Typography variant="body1" mb="-4px">
            Ahmed Ibrhaim
          </Typography>
          <Typography variant="caption" color="grey.600">
            Is typing...
          </Typography>
        </Box>
        <AvatarGroup sx={{ ml: "auto" }}>
          <Avatar {...stringAvatar("Ahmed Ibrhaim")}>AI</Avatar>
          <Avatar {...stringAvatar("Jone Doe")}>AI</Avatar>
        </AvatarGroup>
      </Stack>
    </Box>
  );
};

export default Header;
