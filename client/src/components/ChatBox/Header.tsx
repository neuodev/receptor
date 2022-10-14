import {
  Stack,
  Box,
  Avatar,
  Typography,
  AvatarGroup,
  Tooltip,
} from "@mui/material";
import { stringAvatar } from "../../utils/colors";
import { theme } from "../../theme";
import { useAppSelector } from "../../store";

const Header = () => {
  const currRoom = useAppSelector((state) => state.messages.currRoom);
  const friends = useAppSelector((state) => state.friends.list);
  const user = useAppSelector((state) => state.user.info);
  const friend = friends.find((f) => f.roomId === currRoom);

  const avatarGroup = [friend?.user.username, user?.username];

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
          <Avatar {...stringAvatar(friend?.user.username || "")} />
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
          {avatarGroup.map((avatar) => (
            <Tooltip
              arrow
              followCursor
              title={<Typography>{avatar}</Typography>}
            >
              <Avatar {...stringAvatar(avatar || "")} />
            </Tooltip>
          ))}
        </AvatarGroup>
      </Stack>
    </Box>
  );
};

export default Header;
