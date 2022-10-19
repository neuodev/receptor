import React from "react";
import { Badge, styled, Avatar as MuiAvatar } from "@mui/material";
import { stringAvatar } from "../../utils/colors";
import { IUser } from "../../state/user/reducer";
import { IFriend } from "../../state/friends/reducer";
import { IChat } from "../../hooks/ui/chat";

const Avatar: React.FC<{ name: string; isActive: boolean }> = ({
  name,
  isActive,
}) => {
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isActive ? "#44b700" : theme.palette.warning.main,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        content: '""',
      },
    },
  }));

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      <MuiAvatar {...stringAvatar(name)} />
    </StyledBadge>
  );
};

export default Avatar;

export function avatarProps(chat: IChat | IUser | IFriend | null | undefined) {
  let name =
    chat && "isGroup" in chat && chat.isGroup === true
      ? chat.name
      : chat && "username" in chat
      ? chat.username
      : "";
  return {
    name,
    isActive: chat?.isActive === true,
  };
}
