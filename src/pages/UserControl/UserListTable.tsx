import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chip,
  IconButton,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  AccountBox as AccountBoxIcon,
  AlternateEmail as AlternateEmailIcon,
  Cake as CakeIcon,
  ContactMail as ContactMailIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Security as SecurityIcon,
  Workspaces as WorkspacesIcon,
  ToggleOn as ToggleOnIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import BASE_URL from '../../config';
import Swal from 'sweetalert2';


export interface User {
  _id: number | string;
  user_id: number | string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  address?: string;
  username: string;
  role_id?: number | string;
  role_name?: string;
  dob?: string;
  is_active?: boolean;
}

interface UserListTableProps {
  searchText: string;
  onEditUser: (user: User) => void;
}


const UserListTable = ({ searchText, onEditUser }: UserListTableProps) => {

  const apiRef = useGridApiRef<GridApi>();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const userId = sessionStorage.getItem('user_id');
  const columns: GridColDef<User>[] = [
    {
      field: 'id',
      headerName: 'Sr. No',
      headerAlign: 'center',
      align: 'center',
      width: 100,
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      flex: 1.5,
      minWidth: 140,
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      flex: 1.5,
      minWidth: 140,
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      flex: 1.5,
      minWidth: 140,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 1.5,
      minWidth: 140,
    },
    {
      field: 'role_name',
      headerName: 'Role',
      flex: 1.5,
      minWidth: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText', 
          }}
        />
      ),
    },
    {
      field: 'dob',
      headerName: 'DOB',
      flex: 1.5,
      minWidth: 140,
    },
    {
      field: 'action',
      headerAlign: 'center',
      headerName: 'Action',
      align: 'center',
      flex: 1,
      minWidth: 180, 
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleView(params.row)}
            color="info"
            size="small"
          >
            <ViewIcon  sx={{ color: 'success.light' }} />
          </IconButton>
          <IconButton
            onClick={() => onEditUser(params.row)}
            color="primary"
            size="small"
          >
            <EditIcon sx={{ color: 'primary.light' }} />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteClick(params.row)}
            color="error"
            size="small"
          >
            <DeleteIcon  sx={{ color: 'red' }}/>
          </IconButton>
        </>
      ),
    },

  ];

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await axios.post(`${BASE_URL}/api/user/userdeactivate`, {
        selectuserid: selectedUser.user_id,
        active: 0,
        deleteid: userId
      });

      Swal.fire('Success!', 'User deactivated successfully', 'success');
      // Refresh user list
      const res = await axios.get(`${BASE_URL}/api/user/userfetch`);
      const fetchedUsers = res.data.data.map((user: User, index: number) => ({
        id: index + 1,
        ...user,
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      Swal.fire('Error', 'Failed to deactivate user', 'error');
      console.error('Delete error:', error);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/userfetch`);
        const fetchedUsers = res.data.data.map((user: User, index: number) => ({
          id: index + 1,
          ...user,
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    apiRef.current.setQuickFilterValues(
      searchText.split(/\b\W+\b/).filter((word) => word !== '')
    );
  }, [searchText]);

  return (
    <>
      <Stack alignItems="center" justifyContent="center" >
        <Paper sx={{ width: '100%' }}>
        <DataGrid
  apiRef={apiRef}
  density="standard"
  columns={columns}
  rows={users}
  rowHeight={52}
  disableColumnMenu
  disableColumnSelector
  disableRowSelectionOnClick
  pageSizeOptions={[5, 10, 20, 50]}
  autoHeight
  sx={{
    '& .MuiDataGrid-columnHeaders div[role="row"]': {
      backgroundColor: 'primary.main',
      borderRadius:"12px"
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      color: 'info.light',
      fontWeight: 'bold',
    },
    '& .MuiDataGrid-iconButtonContainer': {
      color: 'white',
    },
    '& .MuiDataGrid-sortIcon': {
      color: 'info.light',
      fontWeight: 'bold',
    },
  }}
/>

        </Paper>
      </Stack>

      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
            width: { xs: '90%', sm: 400, md: 500 }, 
            maxWidth: '95vw',
            mx: 'auto',
            my: { xs: 2, sm: 4 } 
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 2,
          fontSize: { xs: '1.1rem', sm: '1.25rem' } // Responsive font size
        }}>
          <PersonIcon fontSize="small" />
          <Typography variant="h6" component="div" sx={{ fontSize: 'inherit' }}>
            User Details
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          {selectedUser && (
            <Stack spacing={2} direction="column" width="100%">
              {/* Personal Information Section */}
              <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                  <BadgeIcon fontSize="small" />
                  <strong>Personal Information</strong>
                </Typography>

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <AccountBoxIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <AlternateEmailIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      <strong>Username:</strong> {selectedUser.username}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CakeIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                    <Typography variant="body2">
                      <strong>Date of Birth:</strong> {selectedUser.dob || 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Contact Information Section - Improved layout */}
              <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                  <ContactMailIcon fontSize="small" />
                  <strong>Contact Information</strong>
                </Typography>

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <EmailIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        <strong>Email:</strong> {selectedUser.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      <strong>Mobile:</strong> {selectedUser.mobile}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <HomeIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                    <Box sx={{ overflow: 'hidden', flex: 1 }}>
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        <strong>Address:</strong> {selectedUser.address || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              {/* Account Information Section */}
              <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                  <SecurityIcon fontSize="small" />
                  <strong>Account Information</strong>
                </Typography>

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <WorkspacesIcon fontSize="small" color="action" />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2">
                        <strong>Role:</strong>
                      </Typography>
                      <Chip
                        label={selectedUser.role_name}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <ToggleOnIcon fontSize="small" color="action" />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2">
                        <strong>Status:</strong>
                      </Typography>
                      <Chip
                        label={selectedUser.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        color={selectedUser.is_active ? 'success' : 'error'}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Button
            onClick={() => setViewModalOpen(false)}
            variant="contained"
            size="small"
            startIcon={<CloseIcon fontSize="small" />}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate {selectedUser?.first_name} {selectedUser?.last_name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </>

  );
};

export default UserListTable;
