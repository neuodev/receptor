import React from "react";
import { Stack, Tooltip, Box, Typography } from "@mui/material";
import { useAppSelector } from "../../store";
import moment from "moment";
import { GroupedMessage } from "../../utils/messages";
import Avatar, { avatarProps } from "../common/Avatar";
import { IUser } from "../../state/user/reducer";

const Message: React.FC<{
  message: GroupedMessage;
}> = ({ message }) => {
  const user = useAppSelector((state) => state.user.info);
  const fromUser = message.user.id === user?.id;

  return (
    <Stack
      direction={fromUser ? "row-reverse" : "row"}
      alignItems="flex-end"
      sx={{ maxWidth: "50%", ml: fromUser ? "auto" : "0px", mt: "24px" }}
    >
      <Box>
        <Tooltip arrow title={<Typography>{message.user.email}</Typography>}>
          <Avatar {...avatarProps(message.user as IUser)} />
        </Tooltip>
      </Box>
      <Stack
        alignItems={fromUser ? "flex-end" : "flex-start"}
        sx={{ px: "16px" }}
      >
        {message.content.map((msg, idx) => {
          const isLast = idx === message.content.length - 1;
          return (
            <Stack
              key={msg.id}
              sx={{
                bgcolor: fromUser ? "primary.main" : "grey.300",
                p: "4px 12px",
                borderRadius: "1rem",
                borderBottomRightRadius: !isLast || !fromUser ? "1rem" : "0rem",
                borderBottomLeftRadius: !isLast || fromUser ? "1rem" : "0rem",
                mb: "4px",
              }}
            >
              <Typography
                variant="body1"
                color={fromUser ? "common.white" : "grey.600"}
              >
                {msg.body}
              </Typography>
              <Typography
                sx={{
                  display: "block",
                  textAlign: fromUser ? "right" : "left",
                }}
                fontSize="10px"
                variant="caption"
                display="inline-block"
                color={fromUser ? "common.white" : "grey.600"}
              >
                {moment(message.createdAt).format("LT")}
              </Typography>
            </Stack>
          );
        })}
        <Typography variant="caption" color="grey.500">
          {moment(message.createdAt).fromNow()}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Message;
