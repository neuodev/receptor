import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Input,
  Stack,
  CircularProgress,
  Alert,
  AlertTitle,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ManageFriendsCard from "./ManageFriendsCard";
import { useAppSelector } from "../../store";
import Center from "../common/Center";
import { useUsers } from "../../state/users/hooks";
import CloseIcon from "@mui/icons-material/Close";

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

      <Input
        disableUnderline
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for friends..."
        sx={{
          p: "14px 18px 14px 14px",
          bgcolor: "grey.300",
          borderRadius: "0.6rem",
          mb: "20px",
        }}
        startAdornment={<SearchIcon sx={{ mr: "4px" }} />}
        endAdornment={
          <IconButton
            disabled={!search}
            sx={{
              width: "30px",
              height: "30px",
            }}
            onClick={() => setSearch("")}
          >
            <CloseIcon />
          </IconButton>
        }
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
