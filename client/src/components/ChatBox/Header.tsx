import {
  Stack,
  Box,
  Typography,
  AvatarGroup,
  Tooltip,
  IconButton,
  Avatar as MuiAvatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "../../theme";
import { useAppSelector } from "../../store";
import { useRoom } from "../../state/messages/hooks";
import Avatar, { avatarProps } from "../common/Avatar";
import { useChat } from "../../hooks/ui/chat";
import { stringAvatar } from "../../utils/colors";
import moment from "moment";

const Header = () => {
  const { setCurrentRoom } = useRoom();
  const user = useAppSelector((state) => state.user.info);
  const { currChat } = useChat();

  if (!currChat) return null;

  const friend =
    currChat.isGroup === false
      ? currChat.participants.find((p) => p.id !== user?.id)
      : null;

  // const currRoom = useAppSelector((state) => state.messages.currRoom);
  // const friends = useAppSelector((state) => state.friends.list);
  // const user = useAppSelector((state) => state.user.info);
  // const friend = friends.find((f) => f.roomId === currRoom);
  // const friendAvatarProps = avatarProps(friend);
  // const avatarGroup = [friendAvatarProps, avatarProps(user)];

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
          {currChat.isGroup ? (
            <MuiAvatar {...stringAvatar(currChat.name)} />
          ) : (
            <Avatar {...avatarProps(friend)} />
          )}
        </Box>
        <Box sx={{ ml: "12px" }}>
          <Typography variant="body1" mb="-4px">
            {currChat.name}
          </Typography>
          <Typography variant="caption" color="grey.600">
            {currChat.email ||
              "Created " + moment(currChat.updatedAt).fromNow()}
          </Typography>
        </Box>
        <AvatarGroup sx={{ ml: "auto" }}>
          {currChat.participants.map((p) => (
            <Tooltip
              key={p.username}
              arrow
              followCursor
              title={<Typography>{p.username}</Typography>}
            >
              <span>
                <Avatar {...avatarProps(p)} />
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
