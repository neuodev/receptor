import React from "react";
import { Stack, Box, Typography, Button } from "@mui/material";
import moment from "moment";
import { IRoom, useRoom } from "../../state/messages/hooks";
import Avatar from "../common/Avatar";

const FriendRoom: React.FC<{
  friend: IRoom;
}> = ({ friend }) => {
  const { id, name, isActive, email, updatedAt } = friend;
  const { setCurrentRoom, getRoomMessages, isCurrentRoom } = useRoom();
  const isCurr = isCurrentRoom(id);

  return (
    <Button
      onClick={() => {
        setCurrentRoom(id);
        getRoomMessages(id);
      }}
      variant="outlined"
      color={isCurr ? "primary" : "secondary"}
      sx={{
        display: "flex",
        width: "100%",
        bgcolor: "common.white",
        ":hover": {
          bgcolor: !isCurr ? "grey.300" : "current",
        },
        borderRadius: "0.6rem",
        p: "20px 24px",
        mb: "8px",
      }}
    >
      <Box sx={{ mr: "8px" }}>
        <Avatar name={name} isActive={isActive} />
      </Box>

      <Stack flexGrow={1} sx={{ ml: "8px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="grey.700">{name}</Typography>
          <Typography fontSize="10px" color="grey.500">
            {moment(updatedAt).format("LT")}
          </Typography>
        </Stack>
        <Typography
          textAlign="left"
          fontSize="12px"
          color="grey.500"
          textTransform="lowercase"
        >
          {email}
        </Typography>
      </Stack>
    </Button>
  );
};

export default FriendRoom;
