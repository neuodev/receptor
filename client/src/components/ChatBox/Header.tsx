import {
  Stack,
  Box,
  Typography,
  AvatarGroup,
  Tooltip,
  IconButton,
  Avatar as MuiAvatar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "../../theme";
import { useAppSelector } from "../../store";
import { useRoom } from "../../state/messages/hooks";
import Avatar, { avatarProps } from "../common/Avatar";
import { stringAvatar } from "../../utils/colors";
import moment from "moment";
import { useGroups } from "../../state/groups/hooks";
import { Role } from "../../state/groups/reducer";

const Header = () => {
  const { setCurrentRoom, currRoom } = useRoom();
  const { leaveGroup, deleteGroup } = useGroups();
  const user = useAppSelector((state) => state.user.info);
  const groups = useAppSelector((state) => state.groups);
  if (!currRoom || !user) return null;
  const { isGroup, participants, name, email, updatedAt, id } = currRoom;
  const friend =
    isGroup === false ? participants.find((p) => p.id !== user?.id) : null;

  const isGroupOwner =
    participants.find((p) => p.id === user?.id && p.role === Role.Owner) !==
    undefined;

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
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

        {isGroup && (
          <LoadingButton
            variant="outlined"
            loading={
              groups[isGroupOwner ? "delete" : "leave"].loading[id] === true
            }
            size="small"
            color="error"
            sx={{ mx: "8px" }}
            onClick={() => (isGroupOwner ? deleteGroup(id) : leaveGroup(id))}
          >
            {isGroupOwner ? "Delete" : "Leave"}
          </LoadingButton>
        )}

        <IconButton
          onClick={() => setCurrentRoom(null)}
          sx={{ width: "30px", height: "30px" }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Header;
