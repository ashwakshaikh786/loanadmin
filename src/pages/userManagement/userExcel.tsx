import { useState } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Stack, 
  TextField,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import UserListTable from './userExcelList';
import Register from './userExcelForm';
import BulkRegister from './userExcelBulkForm';

const UserManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [searchText, setSearchText] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [showSearch, setShowSearch] = useState(false);

  const handleShowForm = (bulk = false) => {
    setIsBulk(bulk);
    setShowForm(true);
  };

  const handleShowList = () => {
    setShowForm(false);
    setIsBulk(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchText('');
    }
  };

  return (
    <Box p={isSmallScreen ? 1 : 2}>
      {!showForm ? (
        <>
          <Stack 
            direction={isSmallScreen ? "column" : "row"} 
            justifyContent="space-between" 
            alignItems={isSmallScreen ? "flex-start" : "center"} 
            spacing={isSmallScreen ? 1 : 0}
            mb={2}
          >
            <Typography variant="h5" sx={{ mb: isSmallScreen ? 1 : 0 }}>Customer List</Typography>
            
            <Stack 
              direction="row" 
              spacing={1}
              width={isSmallScreen ? "100%" : "auto"}
              alignItems="center"
            >
              {isSmallScreen ? (
                <>
                  <IconButton onClick={toggleSearch}>
                    <SearchIcon />
                  </IconButton>
                  {showSearch && (
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search users..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      autoFocus
                      sx={{ flex: 1 }}
                    />
                  )}
                </>
              ) : (
                <TextField
                  size="small"
                  placeholder="Search users..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ width: isMediumScreen ? 180 : 250 }}
                />
              )}

              {isSmallScreen ? (
                <>
                  
                  <Button 
              variant="contained" 
              sx={{
                borderRadius: 2,
                order: isSmallScreen ? 1 : 0,  // Move to top on small screens
                width: isSmallScreen ? '100%' : 'auto',
                ml: isSmallScreen ? 0 : 'auto'  // Auto margin left on larger screens
              }}
              onClick={() => handleShowForm(false)}
              startIcon={<PersonAddIcon />}
              fullWidth={isSmallScreen}
            >  {isSmallScreen ? 'Add Single' : 'Add Single'}
                     </Button>
                    
           
                     <Button 
              variant="contained" 
              sx={{
                borderRadius: 2,
                order: isSmallScreen ? 1 : 0,  // Move to top on small screens
                width: isSmallScreen ? '100%' : 'auto',
                ml: isSmallScreen ? 0 : 'auto'  // Auto margin left on larger screens
              }}
              onClick={() => handleShowForm(false)}
              startIcon={<GroupAddIcon />}
              fullWidth={isSmallScreen}
            >  {isSmallScreen ? 'Add Single' : 'Add Single'}
                     </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
                    onClick={() => handleShowForm(false)}
                    startIcon={<PersonAddIcon />}
                    size={isMediumScreen ? "small" : "medium"}
                  >
                    {isMediumScreen ? 'Single' : 'Add Single'}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
                    onClick={() => handleShowForm(true)}
                    startIcon={<GroupAddIcon />}
                    size={isMediumScreen ? "small" : "medium"}
                  >
                    {isMediumScreen ? 'Bulk' : 'Add Bulk'}
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
          <Box sx={{ overflowX: 'auto' }}>
            <UserListTable />
          </Box>
        </>
      ) : (
        <Box sx={{ 
          maxWidth: '100%', 
          overflow: 'hidden',
          p: isSmallScreen ? 0 : 2
        }}>
          {isBulk ? (
            <BulkRegister onBackToList={handleShowList} />
          ) : (
            <Register onBackToList={handleShowList} />
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserManager;