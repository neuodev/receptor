import React from "react";
import { IFriend } from "../../state/friends/reducer";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Avatar, { avatarProps } from "../common/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
const FriendCard: React.FC<{ friend: IFriend }> = ({ friend }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Stack
      direction="row"
      alignItems="center"
      mb="16px"
      sx={{
        p: "20px 24px",
        bgcolor: "common.white",
        borderRadius: "var(--common-br)",
        ":hover": {
          bgcolor: "grey.300",
        },
      }}
    >
      <Box>
        <Avatar {...avatarProps(friend)} />
      </Box>
      <Stack sx={{ ml: "12px" }}>
        <Typography variant="body1" color="grey.900" fontWeight={500}>
          {friend.username}
        </Typography>
        <Typography variant="body2" color="grey.700">
          {friend.isActive
            ? friend.email
            : "Last seen " + moment(friend.updatedAt).fromNow()}
        </Typography>
      </Stack>

      <IconButton
        onClick={handleClick}
        sx={{ width: "40px", height: "40px", ml: "auto" }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "actions-button",
        }}
      >
        <MenuItem onClick={handleClose}>Remove</MenuItem>
      </Menu>
    </Stack>
  );
};

export default FriendCard;
