import { useState } from 'react';
import { Button, Typography, Box, Stack } from '@mui/material';

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UserListTable from './userExcelList';
import Register from './userExcelForm';
import BulkRegister from './userExcelBulkForm';
import TextField from '@mui/material/TextField';

const UserManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleShowForm = (bulk = false) => {
    setIsBulk(bulk);
    setShowForm(true);
  };

  const handleShowList = () => {
    setShowForm(false);
    setIsBulk(false);
  };

  return (
    <Box p={2}>
      {!showForm ? (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Customer List</Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Search users..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ width: 250 }}
              />
              <Button
                variant="contained"
                sx={{borderRadius:2}}
                onClick={() => handleShowForm(false)}
                startIcon={<PersonAddIcon />}
              >
                Add Single
              </Button>
              <Button
                variant="contained"
              sx={{borderRadius:2}}
                onClick={() => handleShowForm(true)}
                startIcon={<GroupAddIcon />}
              >
                Add Bulk
              </Button>
            </Stack>
          </Stack>
          <UserListTable searchText={searchText} />
        </>
      ) : (
        isBulk ? (
          <BulkRegister onBackToList={handleShowList} />
        ) : (
          <Register onBackToList={handleShowList} />
        )
      )}
    </Box>
  );
};

export default UserManager;
