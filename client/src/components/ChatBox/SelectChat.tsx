import { Stack, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const SelectChat = () => {
  return (
    <Stack sx={{ height: "100%" }} alignItems="center" justifyContent="center">
      <ChatBubbleOutlineIcon
        sx={{ color: "grey.500", mb: "20px" }}
        fontSize="medium"
      />
      <Typography color="grey.500" sx={{ maxWidth: "200px" }} fontSize="15px">
        Pick a person from left menu, and start your conversation.
      </Typography>
    </Stack>
  );
};

export default SelectChat;
