// import axios from 'axios';
// import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
// import BASE_URL from '../../config';
// import { 
//   IconButton, 
//   Paper, 
//   Stack, 
//   Dialog, 
//   DialogTitle, 
//   DialogContent, 
//   DialogContentText, 
//   DialogActions, 
//   Button,
//   TextField,
//   Alert,
//   CircularProgress
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import EditIcon from '@mui/icons-material/Edit';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import DeleteIcon from '@mui/icons-material/Delete';

// interface CurrentUpdate {
//   id: number;
//   currentupdate_id: number;
//   currentupdatename: string;
// }

// const Master = () => {
//   const apiRef = useGridApiRef();
//   const [updates, setUpdates] = useState<CurrentUpdate[]>([]);
//   const [selectedItem, setSelectedItem] = useState<CurrentUpdate | null>(null);
//   const [editItem, setEditItem] = useState<CurrentUpdate | null>(null);
//   const [editName, setEditName] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch data
//   useEffect(() => {
//     const fetchUpdates = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/telecaller/assign/currentupdate`);
//         const fetchedUpdates = res.data.data.map((update: CurrentUpdate) => ({
          
//           ...update,
//           id: update.currentupdate_id,
//         }));
//         setUpdates(fetchedUpdates);
//         setError('');
//       } catch (err) {
//         setError('Failed to fetch current updates');
//         console.error('Error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUpdates();
//   }, []);

//   // View Handler
//   const handleView = (item: CurrentUpdate) => {
//     setSelectedItem(item);
//   };

//   // Edit Handlers
//   const handleEditClick = (item: CurrentUpdate) => {
//     setEditItem(item);
//     setEditName(item.currentupdatename);
//   };

//   const handleEditSave = async () => {
//     if (!editItem) return;

//     try {
//       setLoading(true);
//       const response = await axios.put(
//         `${BASE_URL}/api/telecaller/assign/currentupdate/update/${editItem.id}`,
//         { currentupdatename: editName }
//       );
//       console.log(response.data);
      
//       setUpdates(prev =>
//         prev.map(item => 
//           item.id === editItem.id ? { ...item, currentupdatename: editName } : item
//         )
//       );
//       setEditItem(null);
//       setError('');
//     } catch (err) {
//       setError('Failed to update item');
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete Handler
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this item?')) {
//       try {
//         setLoading(true);
//         await axios.delete(`${BASE_URL}/api/telecaller/assign/currentupdate/delete/${id}`);
//         setUpdates(prev => prev.filter(item => item.id !== id));
//         setError('');
//       } catch (err) {
//         setError('Failed to delete item');
//         console.error('Error:', err);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Columns Configuration
//   const columns: GridColDef<CurrentUpdate>[] = [
//     { field: 'id', headerName: 'Sr. No', width: 100 },
//     { field: 'currentupdatename', headerName: 'Update Name', flex: 2, minWidth: 200 },
//     {
//       field: 'action',
//       headerName: 'Actions',
//       headerAlign: 'center',
//       align: 'center',
//       flex: 1,
//       minWidth: 180,
//       sortable: false,
//       renderCell: (params) => (
//         <>
//           <IconButton onClick={() => handleView(params.row)} color="primary">
//             <VisibilityIcon sx={{ color: 'blue' }} />
//           </IconButton>
//           <IconButton onClick={() => handleEditClick(params.row)} color="secondary">
//             <EditIcon  sx={{ color: 'green' }}/>
//           </IconButton>
//           <IconButton 
//             onClick={() => handleDelete(params.row.id)} 
//             color="error"
//           >
//             <DeleteIcon sx={{ color: 'red' }}/>
//           </IconButton>
//         </>
//       ),
//     },
//   ];

//   return (
//     <Stack spacing={3} alignItems="center" sx={{ p: 3 }}>
//       {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         <DataGrid
//           apiRef={apiRef}
//           loading={loading}
//           rows={updates}
//           columns={columns}
//           rowHeight={52}
//           disableColumnMenu
//           disableColumnSelector
//           disableRowSelectionOnClick
//           pageSizeOptions={[5, 10, 20, 50]}
//           autoHeight
//         />
//       </Paper>

//       {/* View Dialog */}
//       <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)}>
//         <DialogTitle>Update Details</DialogTitle>
//         <DialogContent>
//           {selectedItem && (
//             <>
                
//               <DialogContentText>
//                 <strong>Name:</strong> {selectedItem.currentupdatename}
//               </DialogContentText>
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSelectedItem(null)}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={!!editItem} onClose={() => setEditItem(null)}>
//         <DialogTitle>Edit Update</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Update Name"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={editName}
//             onChange={(e) => setEditName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditItem(null)}>Cancel</Button>
//           <Button 
//             onClick={handleEditSave}
//             disabled={loading}
//             startIcon={loading ? <CircularProgress size={20} /> : null}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Stack>
//   );
// };

// export default Master;


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
  Button,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setLoading(true);
        await axios.delete(`${BASE_URL}/api/telecaller/assign/currentupdate/delete/${id}`);
        setUpdates(prev => prev.filter(item => item.id !== id));
        setError('');
      } catch (err) {
        setError('Failed to delete item');
        console.error('Error:', err);
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
    { field: 'id', headerName: 'Sr. No', width: 100 },
    { field: 'currentupdatename', headerName: 'Update Name', flex: 2, minWidth: 200 },
    {
      field: 'action',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleView(params.row)} color="primary">
            <VisibilityIcon sx={{ color: 'blue' }} />
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

      {/* Right-aligned Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create
        </Button>
      </Box>

      {/* DataGrid */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
        <DialogTitle>Update Details</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <DialogContentText>
              <strong>Name:</strong> {selectedItem.currentupdatename}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)}>
        <DialogTitle>Edit Update</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f5f5f5' }}> {/* Light grey background */}
  <TextField
    autoFocus
    color="primary"
    margin="dense"
    label="Update Name"
    type="text"
    fullWidth
    variant="standard"
    value={editName}
    onChange={(e) => setEditName(e.target.value)}
    InputProps={{
      sx: {
        backgroundColor: '#e0f7fa', // Light teal background
        borderRadius: 1,
        px: 1,
      },
    }}
  />
</DialogContent>

<DialogActions sx={{ px: 3, pb: 2 }}>
  <Button onClick={() => setEditItem(null)} color="error" variant="outlined">
    Cancel
  </Button>
  <Button
    onClick={handleEditSave}
    disabled={loading}
    startIcon={loading ? <CircularProgress size={20} /> : null}
    color="success"
    variant="contained"
  >
    Save
  </Button>
</DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Create New Update</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Update Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Create
          </Button>
        </DialogActions>

      </Dialog>
    </Box>
  );
};

export default Master;
