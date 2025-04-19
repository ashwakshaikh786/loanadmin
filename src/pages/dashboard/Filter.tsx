import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Paper,
  Typography,
  useMediaQuery,
  Theme,
  Button,
  Alert,
  Snackbar,
  AlertColor
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import axios from 'axios';
import BASE_URL from '../../config';

interface Customer {
  user_id: number;
  id: number;
  customer_id: number;
  name: string;
  Proccess: string;
  loanamount: string;
  city: string;
  pincode: string;
  mobile: string;
  created_at?: string;
}

interface Agent {
  user_id: number;
  username: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const Filter: React.FC = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));

  // State management
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [loading, setLoading] = useState({ customers: true, agents: true });
  const [error, setError] = useState({ customers: false, agents: false });
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filterMobile, setFilterMobile] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [manualCount, setManualCount] = useState<number>(0);
  const [isManualSelection, setIsManualSelection] = useState(false);

  // Memoized filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const lowerSearch = searchText.toLowerCase();
      
      const matchesSearch = searchText
        ? customer.name.toLowerCase().includes(lowerSearch) ||
          customer.mobile.includes(lowerSearch) ||
          customer.city.toLowerCase().includes(lowerSearch) ||
          customer.Proccess.toLowerCase().includes(lowerSearch) ||
          customer.loanamount.toString().includes(lowerSearch) ||
          customer.pincode.toString().includes(lowerSearch) ||
          (customer.created_at && customer.created_at.toLowerCase().includes(lowerSearch))
        : true;

      const matchesName = filterText ? customer.name.toLowerCase().includes(filterText.toLowerCase()) : true;
      const matchesMobile = filterMobile ? customer.mobile.includes(filterMobile) : true;
      const matchesDate = filterDate ? customer.created_at?.startsWith(filterDate) : true;
      const matchesAgent = selectedAgent ? customer.user_id?.toString() === selectedAgent : true;

      return matchesSearch && matchesName && matchesMobile && matchesDate && matchesAgent;
    });
  }, [customers, searchText, filterText, filterMobile, filterDate, selectedAgent]);

  // Fetch data functions
  const fetchCustomers = useCallback(async () => {
    setLoading(prev => ({ ...prev, customers: true }));
    try {
      const res = await axios.get(`${BASE_URL}/api/telecaller/telefilter`);
      
      const data = (res.data?.data || []).map((user: Customer, index: number) => ({
        id: index + 1,
        customer_id: user.customer_id,
        user_id: user.user_id,
        name: user.name || '--',
        mobile: user.mobile || '--',
        Proccess: user.Proccess ? "Assigned" : "Pending",
        created_at: user.created_at
          ? new Date(user.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).replace(/\//g, '-')
          : '--',
        loanamount: user.loanamount || '--',
        city: user.city || '--',
        pincode: user.pincode || '--',
      }));
      
      setCustomers(data);
      setError(prev => ({ ...prev, customers: false }));
    } catch (error) {
      setError(prev => ({ ...prev, customers: true }));
      setSnackbar({ open: true, message: 'Failed to load customers', severity: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  }, []);

  const fetchAgents = useCallback(async () => {
    setLoading(prev => ({ ...prev, agents: true }));
    try {
      const res = await axios.get(`${BASE_URL}/api/user/agentroles`);
      setAgents(res.data?.data || []);
      setError(prev => ({ ...prev, agents: false }));
    } catch (error) {
      setError(prev => ({ ...prev, agents: true }));
      setSnackbar({ open: true, message: 'Failed to load agents', severity: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, agents: false }));
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCustomers();
    fetchAgents();
  }, [fetchCustomers, fetchAgents]);

  // Handle manual count changes
  useEffect(() => {
    if (!isManualSelection && manualCount > 0) {
      const ids = filteredCustomers.slice(0, manualCount).map((customer) => customer.id);
      setSelectedCustomerIds(ids);
    }
  }, [manualCount, filteredCustomers, isManualSelection]);

  // Event handlers
  const handleAgentChange = (event: SelectChangeEvent) => {
    setSelectedAgent(event.target.value);
  };

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedCustomerIds(newSelection as number[]);
    setManualCount(newSelection.length);
    setIsManualSelection(true);
  };

  const clearFilters = () => {
    setSearchText('');
    setFilterText('');
    setFilterMobile('');
    setFilterDate('');
    setSelectedAgent('');
    setManualCount(0);
    setSelectedCustomerIds([]);
    setIsManualSelection(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Columns configuration
  const columns: GridColDef[] = useMemo(() => [
    { field: 'id', headerName: 'Sr. No', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 90 },
    { field: 'Proccess', headerName: 'Assign Status', flex: 1, minWidth: 90 },
    { 
      field: 'mobile', 
      headerName: 'Mobile', 
      flex: 1, 
      minWidth: 90,
      renderCell: (params) => params.value || '--'
    },
    { 
      field: 'loanamount', 
      headerName: 'Loan amount (Previous)', 
      flex: 1, 
      minWidth: 200,
      renderCell: (params) => params.value || '--'
    },
    { 
      field: 'city', 
      headerName: 'City', 
      flex: 1, 
      minWidth: 90,
      renderCell: (params) => params.value || '--'
    },
    { 
      field: 'pincode', 
      headerName: 'Pincode', 
      flex: 1, 
      minWidth: 90,
      renderCell: (params) => params.value || '--'
    },
    {
      field: 'created_at',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => params.value || '--'
    },
  ], []);

  // Loading state
  if (loading.customers || loading.agents) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error.customers || error.agents) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Error loading data. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (

    <Box sx={{ p: { xs: 1, sm: 2 }, pb: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant={isSmallScreen ? 'h6' : 'h5'}>Assigned Customers</Typography>
              
            </Box>
      <Stack
        spacing={2}
        direction={isSmallScreen ? 'column' : 'row'}
        sx={{ mb: 2 }}
        alignItems={isSmallScreen ? 'stretch' : 'flex-start'}
        flexWrap="wrap"
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
          placeholder="Search across all fields"
        />
        <TextField
          label="Filter by Name"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
        />
        <TextField
          label="Filter by Mobile"
          variant="outlined"
          value={filterMobile}
          onChange={(e) => setFilterMobile(e.target.value)}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
          inputProps={{ maxLength: 10 }}
        />
        <TextField
          label="Filter by Date"
          variant="outlined"
          placeholder="DD-MM-YYYY"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
        />
        <FormControl
          fullWidth={isSmallScreen}
          size={isSmallScreen ? 'small' : 'medium'}
          variant="outlined"
          sx={{ minWidth: isSmallScreen ? '100%' : 200 }}
        >
          <InputLabel id="select-agent-label">Select Agent</InputLabel>
          <Select
            labelId="select-agent-label"
            id="select-agent"
            value={selectedAgent}
            onChange={handleAgentChange}
            label="Select Agent"
            sx={{ '& .MuiSelect-select': { py: 1.25 } }}
          >
            <MenuItem value="">
              <em>All Agents</em>
            </MenuItem>
            {agents.map((agent) => (
              <MenuItem key={agent.user_id} value={agent.user_id.toString()}>
                {agent.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={clearFilters}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
          sx={{ borderRadius: 1 }}
        >
          Clear 
        </Button>
      </Stack>

      {/* Selection info */}
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Selected: {selectedCustomerIds.length} of {filteredCustomers.length}
      </Typography>

      {/* Data grid */}
      <Box sx={{ height: isSmallScreen ? 400 : isMediumScreen ? 500 : 600, width: '100%' }}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <DataGrid
            rows={filteredCustomers}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={selectedCustomerIds}
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
            disableRowSelectionOnClick
            autoHeight={false}
            loading={loading.customers}
          />
        </Paper>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Filter;