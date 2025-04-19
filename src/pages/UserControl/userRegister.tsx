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
import UserListTable, { User } from './UserListTable';
import Register from './Register';

// In your UserManager component
const UserManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Remove these unused functions:
  // const handleShowList = () => setShowForm(false);
  // const handleBackToList = () => {
  //   setShowForm(false);
  //   setIsEditMode(false);
  // };

  const handleShowForm = () => {
    setCurrentUser(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditMode(true);
    setShowForm(true);
  };

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
          <UserListTable 
            searchText={searchText} 
            onEditUser={handleEditUser} 
          />
        </>
      ) : (
        <Register 
          onBackToList={() => {
            setShowForm(false);
            setIsEditMode(false);
          }}
          userData={currentUser}
          isEditMode={isEditMode}
        />
      )}
    </Box>
  );
};

export default UserManager;