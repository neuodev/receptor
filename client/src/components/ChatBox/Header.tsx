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
import { stringAvatar } from "../../utils/colors";
import moment from "moment";

const Header = () => {
  const { setCurrentRoom, currRoom } = useRoom();
  const user = useAppSelector((state) => state.user.info);

  if (!currRoom) return null;

  const { isGroup, participants, name, email, updatedAt } = currRoom;

  const friend =
    isGroup === false ? participants.find((p) => p.id !== user?.id) : null;

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
          {isGroup ? (
            <MuiAvatar {...stringAvatar(name)} />
          ) : (
            <Avatar {...avatarProps(friend)} />
          )}
        </Box>
        <Box sx={{ ml: "12px" }}>
          <Typography variant="body1" mb="-4px">
            {name}
          </Typography>
          <Typography variant="caption" color="grey.600">
            {email || "Created " + moment(updatedAt).fromNow()}
          </Typography>
        </Box>
        <AvatarGroup sx={{ ml: "auto" }}>
          {participants.map((p) => (
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
