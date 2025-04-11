
import { useState } from 'react';
import { Button, Typography, Box, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserListTable from './userExcelList';
import Register from './userExcelForm';
import TextField from '@mui/material/TextField';

const UserManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const handleShowForm = () => setShowForm(true);
 const handleShowList = () => setShowForm(false);

  return (
    <Box p={2}>
      {!showForm ? (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">User List</Typography>
            <TextField
          size="small"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: 250 }}
        />
            <Button 
              variant="contained" 
              onClick={handleShowForm}
              startIcon={<AddIcon />}
            >
              Add User
            </Button>
          </Stack>
          <UserListTable searchText={searchText} /> 
        </>
      ) : (
        <Register  onBackToList={handleShowList} />
      )}
    </Box>
  );
};

export default UserManager;