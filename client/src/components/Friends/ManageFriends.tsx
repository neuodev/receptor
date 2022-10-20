import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Input,
  Stack,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import ManageFriendsCard from "./ManageFriendsCard";
import { useAppSelector } from "../../store";
import Center from "../common/Center";
import { useUsers } from "../../state/users/hooks";
import SearchInput from "../common/SearchInput";

const ManageFriends = () => {
  const [search, setSearch] = useState<string>("");
  const { getUsersHandler } = useUsers();
  const { list, loading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    getUsersHandler(search);
  }, [search]);

  return (
    <Box>
      <Typography variant="h5" mb="16px">
        Manage Friends
      </Typography>

      <SearchInput
        value={search}
        setValue={setSearch}
        placeholder="Search for friends..."
      />

      <Box sx={{ minHeight: "400px" }}>
        {loading ? (
          <Box sx={{ height: "370px" }}>
            <Center>
              <CircularProgress />
            </Center>
          </Box>
        ) : error ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        ) : (
          <Stack spacing={2}>
            {list.map((user) => (
              <ManageFriendsCard key={user.id} user={user} />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ManageFriends;
