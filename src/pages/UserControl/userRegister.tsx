import { useState } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Stack, 
  useMediaQuery, 
  useTheme,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserListTable from './UserListTable';
import Register from './Register';

const UserManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const theme = useTheme();
  
  // Screen size breakpoints
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));  // < 600px

  const handleShowForm = () => setShowForm(true);
  const handleShowList = () => setShowForm(false);

  return (
    <Box p={isSmallScreen ? 1 : 2}>
      {!showForm ? (
        <>
        <Stack
  direction={isSmallScreen ? 'column' : 'row'}
  justifyContent="space-between"
  alignItems={isSmallScreen ? 'flex-start' : 'center'}
  spacing={2}
  mb={2}
  width="100%"
>
  <Typography variant={isSmallScreen ? 'h6' : 'h5'}>User List</Typography>

  {/* Right Side: Search + Add Button */}
  <Stack
    direction={isSmallScreen ? 'column' : 'row'}
    spacing={isSmallScreen ? 1 : 2}
    width={isSmallScreen ? '100%' : 'auto'}
    alignItems="center"
  >
    <TextField
      size="small"
      placeholder="Search users..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      sx={{ width: isSmallScreen ? '100%' : 250 }}
      fullWidth={isSmallScreen}
    />

    <Button 
      variant="contained"
      sx={{
        borderRadius: 2,
        width: isSmallScreen ? '100%' : 'auto',
      }}
      onClick={handleShowForm}
      startIcon={<AddIcon />}
      fullWidth={isSmallScreen}
    >
      {isSmallScreen ? 'Add' : 'Add User'}
    </Button>
  </Stack>
</Stack>

          
          <UserListTable searchText={searchText} /> 
        </>
      ) : (
        <Register onBackToList={handleShowList} />
      )}
    </Box>
  );
};

export default UserManager;