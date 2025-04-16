import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Paper,
  Typography,
  useMediaQuery,
  Theme,
  Button,
  Modal,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import BASE_URL from '../../config';

interface FollowUp {
  nextfollowup_id: number;
  tele_id?: number;
  customer_id?: number;
  user_id?: number;
  currentupdate_id?: number;
  nextfollowup_dt: string;
  nextfollowup_at: string;
  max_nextfollowup_dt: string;
  note: string;
  create_dt: string;
  create_at: string;
  customer_name?: string;
  customer_mobile?: string;
  customer_city?: string;
  agent_username?: string;
  status_name?: string;
}

const FollowUp: React.FC = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [filteredFollowUps, setFilteredFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRow, setSelectedRow] = useState<FollowUp | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/telecaller/assign/getfollowup`);
      const data = res.data?.data || [];
      setFollowUps(data);
      setFilteredFollowUps(data);
      setError(false);
    } catch (err) {
      console.error("Error fetching follow-up data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  useEffect(() => {
    const lowerSearch = searchText.toLowerCase();
    const filtered = followUps.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
    setFilteredFollowUps(filtered);
  }, [searchText, followUps]);

  const clearFilters = () => {
    setSearchText('');
    setFilteredFollowUps(followUps);
  };

  // Handler for "View" action – opens the modal with the selected row's details.
  const handleView = (row: FollowUp) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };


  const downloadCSV = (data: FollowUp[]) => {
    console.log("Downloading data: ", data);
    if (!data.length){
      alert("No data to download");
      return
    };
    
  
    // Define which fields you want in the CSV
    const headers: (keyof FollowUp)[] = [
      'nextfollowup_id',
      'nextfollowup_dt',
      'nextfollowup_at',
      'note',
      'create_dt',
      'create_at',
      'customer_name',
      'customer_mobile',
      'customer_city',
      'agent_username',
      'status_name',
    ];
  
    const csvRows = [
      headers.join(','), // header row
      ...data.map((row) =>
        headers
          .map((fieldName) => `"${String(row[fieldName] ?? '').replace(/\n/g, ' ').replace(/"/g, '""')}"`)
          .join(',')
      ),
    ];
  
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'followup_data.csv');
    document.body.appendChild(link);
  
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 0);
  };
  
  

  // Define DataGrid column definitions without Tele ID, Customer ID, User ID, Update ID.
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    
    
   
    // { field: 'create_dt', headerName: 'Created Date', flex: 1, minWidth: 120 },
    // { field: 'create_at', headerName: 'Created Time', flex: 1, minWidth: 120 },
    {
      field: 'customer_name',
      headerName: 'Customer Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'agent_username',
      headerName: 'Agent Username',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'customer_mobile',
      headerName: 'Mobile',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'customer_city',
      headerName: 'City',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'nextfollowup_dt',
      headerName: 'Follow-up Date',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'nextfollowup_at',
      headerName: 'Follow-up Time',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'note',
      headerName: 'Note',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '0.9rem' }}
        >
          {params.value}
        </Typography>
      ),
    },
    
    {
      field: 'status_name',
      headerName: 'Status',
      flex: 1,
      minWidth: 150,
    },
    // Action column with a "View" button.
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleView(params.row)}
          size="small"
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error loading follow-up data.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, pb: 10 }}>

<Stack
  spacing={2}
  direction="row"
  sx={{ mb: 2, justifyContent: 'flex-end' }}
  alignItems="center"
>
  <TextField
    label="Search Follow-ups"
    variant="outlined"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    size={isSmallScreen ? 'small' : 'medium'}
    sx={{ width: isSmallScreen ? '100%' : 300 }}
  />
  <Button
    variant="contained"
    color="primary"
    onClick={clearFilters}
    size={isSmallScreen ? 'small' : 'medium'}
    sx={{ borderRadius: 1 }}
  >
    Clear
  </Button>

  {/* Download CSV Button */}
  <Button
    variant="contained"
    color="success"
    onClick={() => downloadCSV([...filteredFollowUps])}
    size={isSmallScreen ? 'small' : 'medium'}
    sx={{ borderRadius: 1 }}
  >
    Download CSV
  </Button>
</Stack>

      
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Showing {filteredFollowUps.length} Follow-up Records
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={filteredFollowUps.map((f, idx) => ({ ...f, id: idx + 1 }))}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: isSmallScreen ? 5 : isMediumScreen ? 10 : 20,
                page: 0,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          density={isSmallScreen ? 'compact' : 'standard'}
          autoHeight
        />
      </Paper>

      {/* Modal to display full row details */}
      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Follow-up Details
          </Typography>
          {selectedRow && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                <strong>Follow-up Time:</strong> {selectedRow. max_nextfollowup_dt}
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                <strong>Note:</strong> {selectedRow.note}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Created Date:</strong> {selectedRow.create_dt}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Created Time:</strong> {selectedRow.create_at}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Customer Name:</strong> {selectedRow.customer_name}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Agent Username:</strong> {selectedRow.agent_username}
              </Typography>
              
              <Typography sx={{ mt: 1 }}>
                <strong>Customer Mobile:</strong> {selectedRow.customer_mobile}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Customer City:</strong> {selectedRow.customer_city}
              </Typography>
              
              <Typography sx={{ mt: 1 }}>
                <strong>Status:</strong> {selectedRow.status_name}
              </Typography>
            </Box>
          )}
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FollowUp;