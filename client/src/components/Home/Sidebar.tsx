import React from "react";
import { Stack, Box } from "@mui/material";
import Logo from "../common/Logo";
import { theme } from "../../theme";
import Link from "../common/Link";
import { ROUTES } from "../../constants/routes";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const TABS = [
  {
    title: "New group",
    icon: <DriveFileRenameOutlineIcon />,
    route: ROUTES.CREATE_GROUP,
  },
  {
    title: "Friends",
    icon: <PeopleOutlineIcon />,
    route: ROUTES.FRIENDS,
  },
  {
    title: "Chat",
    icon: <ChatBubbleOutlineIcon />,
    route: ROUTES.CHATS_LIST,
  },
  {
    title: "Other pages",
    icon: <BackupTableIcon />,
    route: ROUTES.PAGES,
  },
];

const Sidebar = () => {
  return (
    <Stack sx={{ width: "100px", bgcolor: "common.white", height: "100%" }}>
      <Box>
        <Link to={ROUTES.ROOT}>
          <Logo width="50px" height="50px" fill={theme.palette.primary.main} />
        </Link>
      </Box>
    </Stack>
  );
};

export default Sidebar;
