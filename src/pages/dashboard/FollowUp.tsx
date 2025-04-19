import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Paper,
  Typography,
  useMediaQuery,
  Theme,
  Button,
  Grid,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import { Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import BASE_URL from '../../config';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
  const [agentOptions, setAgentOptions] = useState<string[]>([]);
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [filteredFollowUps, setFilteredFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [selectedRow, setSelectedRow] = useState<FollowUp | null>(null);
  const [modalOpen, setModalOpen] = useState(false);



  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/telecaller/assign/getfollowup`);
      const data: FollowUp[] = res.data?.data || []; // Add type annotation here
      
      // Extract unique agents with proper typing
      const agents = Array.from(
        new Set(
          data
            .map((item: FollowUp) => item.agent_username)
            .filter(Boolean)
        )
      ) as string[];
      agents.sort();
      
      setAgentOptions(agents);
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
    const filtered = followUps.filter(item => {
      const nameMatch = !nameFilter || 
        (item.customer_name?.toLowerCase().includes(nameFilter.toLowerCase()) ?? false);
      const mobileMatch = !mobileFilter || 
        (item.customer_mobile?.includes(mobileFilter) ?? false);
      const cityMatch = !cityFilter || 
        (item.customer_city?.toLowerCase().includes(cityFilter.toLowerCase()) ?? false);
      const agentMatch = !agentFilter || 
        (item.agent_username?.toLowerCase().includes(agentFilter.toLowerCase()) ?? false);

      return nameMatch && mobileMatch && cityMatch && agentMatch;
    });
    setFilteredFollowUps(filtered);
  }, [nameFilter, mobileFilter, cityFilter, agentFilter, followUps]);

  const clearFilters = () => {
    setNameFilter('');
    setMobileFilter('');
    setCityFilter('');
    setAgentFilter('');
  };

  const handleView = (row: FollowUp) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const downloadCSV = (data: FollowUp[]) => {
    if (!data.length) {
      alert("No data to download");
      return;
    }
    const headers: (keyof FollowUp)[] = [
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
      headers.join(','),
      ...data.map(row =>
        headers.map(fieldName => {
          let value = String(row[fieldName] ?? '')
            .replace(/\n/g, ' ')
            .replace(/"/g, '""');
          if (fieldName === 'customer_mobile') {
            value = `="${value}"`;
          }
          return `"${value}"`;
        }).join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'followup_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70, 
      headerClassName: 'dataGridHeader',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'customer_name',
      headerName: 'Customer Name',
      flex: 1,
      minWidth: 150,
      headerClassName: 'dataGridHeader',
    },
    {
      field: 'agent_username',
      headerName: 'Agent Username',
      flex: 1,
      minWidth: 150,
      headerClassName: 'dataGridHeader',
    },
    {
      field: 'customer_mobile',
      headerName: 'Mobile',
      flex: 1,
      minWidth: 150,
      headerClassName: 'dataGridHeader',
    },
    {
      field: 'customer_city',
      headerName: 'City',
      flex: 1,
      minWidth: 150,
      headerClassName: 'dataGridHeader',
    },
    {
      field: 'nextfollowup_dt',
      headerName: 'Follow‑up Date',
      flex: 1,
      minWidth: 130,
      valueGetter: (params: { value: string }) => dayjs(params.value).format('DD‑MM‑YYYY'),
      headerClassName: 'dataGridHeader',
    },
    {
      field: 'nextfollowup_at',
      headerName: 'Follow‑up Time',
      flex: 1,
      minWidth: 130,
      headerClassName: 'dataGridHeader',
    },
    {
      field: 'note',
      headerName: 'Note',
      flex: 2,
      minWidth: 200,
      renderCell: params => (
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '0.9rem' }}
        >
          {params.value}
        </Typography>
      ),
      headerClassName: 'dataGridHeader',
    },
    {
      field: 'status_name',
      headerName: 'Status',
      flex: 1,
      minWidth: 150,
      headerClassName: 'dataGridHeader',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => (
        <Button onClick={() => handleView(params.row)} size="small">
          <VisibilityIcon sx={{ color: 'success.light' }} />
        </Button>
      ),
      headerClassName: 'dataGridHeader',
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
      <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      mb: 2, 
      flexDirection: { xs: 'column', sm: 'row' } 
    }}>
      <Typography variant={isSmallScreen ? 'h6' : 'h5'} sx={{ mb: { xs: 2, sm: 0 } }}>
        Follow Ups
      </Typography>
      </Box>
        <Stack spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Filter by Name"
                variant="outlined"
                value={nameFilter}
                onChange={e => setNameFilter(e.target.value)}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Filter by Mobile"
                variant="outlined"
                value={mobileFilter}
                onChange={e => setMobileFilter(e.target.value)}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Filter by City"
                variant="outlined"
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
  <FormControl fullWidth size="small">
    <InputLabel>Filter by Agent</InputLabel>
    <Select
      value={agentFilter}
      onChange={(e) => setAgentFilter(e.target.value as string)}
      label="Filter by Agent"
    >
      <MenuItem value="">
        <em>All Agents</em>
      </MenuItem>
      {agentOptions.map(agent => (
        <MenuItem key={agent} value={agent}>
          {agent}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>
          </Grid>
 
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={clearFilters}
              size="small"
              sx={{ borderRadius: 1 }}
            >
              Clear Filters
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => downloadCSV([...filteredFollowUps])}
              size="small"
              sx={{ borderRadius: 1 }}
            >
              Download CSV
            </Button>
          </Box>
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
          sx={{
            '& .MuiDataGrid-columnHeaders div[role="row"]': {
              backgroundColor: 'primary.main',
              borderRadius: "12px"
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

      <Dialog
        open={modalOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
            width: { xs: '90%', sm: 500 },
            maxWidth: '95vw',
            mx: 'auto',
            my: { xs: 2, sm: 4 },
            overflowX: 'hidden',
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
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
        }}>
          <PersonIcon fontSize="small" />
          <Typography variant="h6" component="div" sx={{ fontSize: 'inherit' }}>
            Follow‑up Details
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: { xs: 2, sm: 3 }, overflowX: 'hidden' }}>
          {selectedRow && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon fontSize="small" />
                    <strong>Schedule</strong>
                  </Typography>
                  <Stack spacing={1} mt={1}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', whiteSpace: 'nowrap' }}>
                      <CalendarTodayIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                        <strong>Date:</strong> {dayjs(selectedRow.nextfollowup_dt).format('DD-MM-YYYY')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Time:</strong> {selectedRow.nextfollowup_at}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon fontSize="small" />
                    <strong>Note</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {selectedRow.note}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBoxIcon fontSize="small" />
                    <strong>Customer</strong>
                  </Typography>
                  <Stack spacing={1} mt={1}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <AccountBoxIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Name:</strong> {selectedRow.customer_name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Mobile:</strong> {selectedRow.customer_mobile}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <HomeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>City:</strong> {selectedRow.customer_city}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" />
                    <strong>Status</strong>
                  </Typography>
                  <Chip
                    label={selectedRow.status_name}
                    size="small"
                    sx={{ mt: 1 }}
                    color={selectedRow.status_name === 'Inactive' ? 'error' : 'success'}
                  />
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            size="small"
            startIcon={<CloseIcon fontSize="small" />}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backgroundColor: 'primary.main',
              '&:hover': { backgroundColor: 'primary.dark' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FollowUp;

