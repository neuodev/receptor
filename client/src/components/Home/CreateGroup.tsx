import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Input,
  TextField,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAppSelector } from "../../store";
import Center from "../common/Center";
import NoFriends from "../Friends/NoFriends";
import FriendOption from "../Groups/FriendOption";
import { IFriend } from "../../state/friends/reducer";
import { clone } from "../../utils";
import { searchBy } from "../../utils/user";
import { LoadingButton } from "@mui/lab";
import { useGroups } from "../../state/groups/hooks";
import Snackbar from "../common/Snackbar";

const CreateGroup = () => {
  const friends = useAppSelector((state) => state.friends);
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<IFriend[]>(clone<IFriend[]>(friends.list));
  const [groupName, setGroupName] = useState<string>("");
  const [members, setMembers] = useState<Set<number>>(new Set());
  const createGroup = useAppSelector((state) => state.groups.create);
  const groupsHandler = useGroups();

  const isMember = (id: number) => members.has(id);
  const addMember = (id: number) => setMembers(new Set(members).add(id));
  const removeMember = (id: number) => {
    const newMembers = new Set(members);
    newMembers.delete(id);
    setMembers(newMembers);
  };

  useEffect(() => {
    setList(searchBy(keyword, friends.list, ["username", "email"]));
  }, [keyword, friends]);

  return (
    <Stack
      sx={{
        height: "100%",
        overflowY: "scroll",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography variant="h5" mb="32px">
        Create Group
      </Typography>

      <TextField
        label="Group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        sx={{ mb: "32px" }}
      />

      <Input
        disableUnderline
        fullWidth
        placeholder="Search for friends"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        sx={{
          p: "14px 18px 14px 14px",
          bgcolor: "grey.300",
          borderRadius: "0.6rem",
          mb: "15px",
        }}
        startAdornment={<SearchIcon sx={{ mr: "4px" }} />}
      />

      <Box sx={{ flexGrow: 1 }}>
        {friends.loading ? (
          <Center>
            <CircularProgress />
          </Center>
        ) : friends.error ? (
          <Center>
            <Typography color="error">{friends.error}</Typography>
          </Center>
        ) : friends.list.length === 0 ? (
          <Box sx={{ mt: "-20px", height: "100%" }}>
            <NoFriends />
          </Box>
        ) : list.length === 0 ? (
          <Box sx={{ mt: "20px" }}>
            <Typography textAlign="center">No friend found</Typography>
          </Box>
        ) : (
          <Box>
            {list.slice(0, 5).map((friend) => (
              <FriendOption
                friend={friend}
                key={friend.id}
                isMember={isMember}
                onSelect={(id) => {
                  if (isMember(id)) removeMember(id);
                  else addMember(id);
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <LoadingButton
        variant="contained"
        loading={createGroup.loading}
        onClick={async () => {
          if (!groupName || members.size === 0) return;
          groupsHandler.createGroup(groupName, Array.from(members));
          setMembers(new Set());
          setGroupName("");
        }}
        disabled={!groupName || members.size === 0}
        sx={{ flexShrink: 0, height: "50px" }}
      >
        {members.size === 0
          ? "Create group"
          : `Create group with ${members.size} member(s)`}
      </LoadingButton>

      <Snackbar
        open={createGroup.error !== null}
        onClose={() => {}}
        message={createGroup.error}
        severity="error"
      />

      <Snackbar
        open={createGroup.success}
        onClose={() => {}}
        message="Group created successfully"
        severity="success"
      />
    </Stack>
  );
};

export default CreateGroup;
