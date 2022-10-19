import React from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  AvatarGroup,
} from "@mui/material";
import { stringAvatar } from "../../utils/colors";
import { useAppSelector } from "../../store";
import { useRoom } from "../../state/messages/hooks";
import moment from "moment";
import { IChat } from "../../hooks/ui/chat";

const GroupChat: React.FC<{ chat: IChat }> = ({ chat }) => {
  const { id, name, participants, createdAt } = chat;
  const currRoomId = useAppSelector((state) => state.messages.currRoom);
  const { setCurrentRoom, getRoomMessages } = useRoom();

  return (
    <Button
      onClick={() => {
        setCurrentRoom(id);
        getRoomMessages(id);
      }}
      variant="outlined"
      color={currRoomId === id ? "primary" : "secondary"}
      sx={{
        display: "flex",
        width: "100%",
        bgcolor: "common.white",
        ":hover": {
          bgcolor: currRoomId !== id ? "grey.300" : "current",
        },
        borderRadius: "0.6rem",
        p: "20px 24px",
        mb: "8px",
      }}
    >
      <Box sx={{ mr: "8px" }}>
        <Avatar {...stringAvatar(name)} />
      </Box>

      <Stack
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        flexGrow={1}
        sx={{ ml: "8px" }}
      >
        <Stack alignItems="flex-start">
          <Typography
            sx={{
              "::first-letter": {
                textTransform: "uppercase",
              },
            }}
            color="grey.700"
          >
            {name}
          </Typography>
          <Typography color="grey.700" variant="caption">
            Created {moment(createdAt).fromNow()}
          </Typography>
        </Stack>
        <AvatarGroup max={3}>
          {participants.map((p) => (
            <Avatar {...stringAvatar(p.username)} />
          ))}
        </AvatarGroup>
      </Stack>
    </Button>
  );
};

export default GroupChat;
