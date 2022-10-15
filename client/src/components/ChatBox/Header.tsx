import {
  Stack,
  Box,
  Typography,
  AvatarGroup,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "../../theme";
import { useAppSelector } from "../../store";
import { useRoom } from "../../state/messages/hooks";
import Avatar, { avatarProps } from "../common/Avatar";

const Header = () => {
  const { setCurrentRoom } = useRoom();
  const currRoom = useAppSelector((state) => state.messages.currRoom);
  const friends = useAppSelector((state) => state.friends.list);
  const user = useAppSelector((state) => state.user.info);
  const friend = friends.find((f) => f.roomId === currRoom);
  const friendAvatarProps = avatarProps(friend?.user);
  const avatarGroup = [friendAvatarProps, avatarProps(user)];

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
          <Avatar {...friendAvatarProps} />
        </Box>
        <Box sx={{ ml: "12px" }}>
          <Typography variant="body1" mb="-4px">
            {friend?.user.username}
          </Typography>
          <Typography variant="caption" color="grey.600">
            {friend?.user.email}
          </Typography>
        </Box>
        <AvatarGroup sx={{ ml: "auto" }}>
          {avatarGroup.map((avatar) => (
            <Tooltip
              key={avatar.name}
              arrow
              followCursor
              title={<Typography>{avatar.name}</Typography>}
            >
              <span>
                <Avatar {...avatar} />
              </span>
            </Tooltip>
          ))}
        </AvatarGroup>

        <IconButton
          onClick={() => setCurrentRoom(null)}
          sx={{ width: "44px", height: "44px", ml: "8px" }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Header;
