
import axios from 'axios';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import BASE_URL from '../../config';
import {
  IconButton,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
   useMediaQuery, 
    useTheme,
  Button,
  TextField,Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
interface CurrentUpdate {
  id: number;
  currentupdate_id: number;
  currentupdatename: string;
}

const Master = () => {
  const apiRef = useGridApiRef();
  const [updates, setUpdates] = useState<CurrentUpdate[]>([]);
  const [selectedItem, setSelectedItem] = useState<CurrentUpdate | null>(null);
  const [editItem, setEditItem] = useState<CurrentUpdate | null>(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');

    const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));  // < 600px

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/telecaller/assign/currentupdate`);
        const fetchedUpdates = res.data.data.map((update: CurrentUpdate) => ({
          ...update,
          id: update.currentupdate_id,
        }));
        setUpdates(fetchedUpdates);
        setError('');
      } catch (err) {
        setError('Failed to fetch current updates');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  const handleView = (item: CurrentUpdate) => {
    setSelectedItem(item);
  };

  const handleEditClick = (item: CurrentUpdate) => {
    setEditItem(item);
    setEditName(item.currentupdatename);
  };

  const handleEditSave = async () => {
    if (!editItem) return;

    try {
      setLoading(true);
      await axios.put(
        `${BASE_URL}/api/telecaller/assign/currentupdate/update/${editItem.id}`,
        { currentupdatename: editName }
      );
      setUpdates(prev =>
        prev.map(item =>
          item.id === editItem.id ? { ...item, currentupdatename: editName } : item
        )
      );
      setEditItem(null);
      setError('');
    } catch (err) {
      setError('Failed to update item');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axios.delete(`${BASE_URL}/api/telecaller/assign/currentupdate/delete/${id}`);
        setUpdates(prev => prev.filter(item => item.id !== id));
        setError('');
  
        // Optional: show success message
        Swal.fire('Deleted!', 'The item has been deleted.', 'success');
      } catch (err) {
        setError('Failed to delete item');
        console.error('Error:', err);
  
        Swal.fire('Error', 'Something went wrong!', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/telecaller/assign/currentupdate/create`, {
        currentupdatename: newName,
      });
      const newItem = {
        ...response.data.data,
        id: response.data.data.currentupdate_id,
      };
      setUpdates(prev => [...prev, newItem]);
      setCreateOpen(false);
      setNewName('');
      setError('');
    } catch (err) {
      setError('Failed to create new item');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef<CurrentUpdate>[] = [
    { field: 'id', headerName: 'Sr. No' ,flex:1 },
    { field: 'currentupdatename', headerName: 'Disposition Name' ,flex:1},
    {
      field: 'action',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      flex:1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleView(params.row)} color="primary">
            <VisibilityIcon sx={{ color: 'info' }} />
          </IconButton>
          <IconButton onClick={() => handleEditClick(params.row)} color="secondary">
            <EditIcon sx={{ color: 'green' }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon sx={{ color: 'red' }} />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant={isSmallScreen ? 'h6' : 'h5'}>Disposition Name</Typography>
        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            width: isSmallScreen ? '100%' : 'auto',
          }}
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)} 
        >
          {isSmallScreen ? 'Add' : 'Add New'}
        </Button>
      </Box>

     
      <Paper sx={{ width: '100%', overflow: 'hidden',display:"flex",justifyContent:"space-evenly" }}>
        <DataGrid
          apiRef={apiRef}
          loading={loading}
          rows={updates}
          columns={columns}
          rowHeight={52}
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20, 50]}
          autoHeight
        />
      </Paper>

      {/* View Dialog */}
      <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)}>
        <DialogTitle>Update Disposition</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <DialogContentText>
              <strong>Name:</strong> {selectedItem.currentupdatename}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItem(null)}  sx={{
        borderRadius: 2,
        width: isSmallScreen ? '100%' : 'auto',
      }}
      variant="contained"
      >Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)}>
        <DialogTitle>Edit Disposition</DialogTitle>
        <DialogContent> 
  <TextField
    autoFocus
    color="primary"
    
    label="Edit Disposition"
    type="text"
    fullWidth
    variant="standard"
    value={editName}
    onChange={(e) => setEditName(e.target.value)}
    InputProps={{
      sx: {
        backgroundColor: '#e0f7fa', 
        borderRadius: 1,
    
      },
    }}
  />
</DialogContent>

<DialogActions sx={{ px: 3, pb: 2 }}>
  <Button onClick={() => setEditItem(null)} variant="contained" sx={{
        borderRadius: 2,
        width: isSmallScreen ? '100%' : 'auto',
      
      }}>
    Cancel
  </Button>
  <Button
    onClick={handleEditSave}
    sx={{
      borderRadius: 2,
      width: isSmallScreen ? '100%' : 'auto',
    }}
    disabled={loading}
    startIcon={loading ? <CircularProgress size={20} /> : null}
    variant="contained"
  >
    Save
  </Button>
</DialogActions>
      </Dialog>

    
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Create New Disposition</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Add Disposition"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}
          variant="contained"  sx={{
        borderRadius: 2,
        width: isSmallScreen ? '100%' : 'auto',
      }}>Close</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            sx={{
              borderRadius: 2,
              width: isSmallScreen ? '100%' : 'auto',
            }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {isSmallScreen ? 'Save' : 'Add New'}
          </Button>
        </DialogActions>

      </Dialog>
    </Box>
  );
};

export default Master;
