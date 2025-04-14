import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
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
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import axios from 'axios';
import BASE_URL from '../../config';

interface Customer {
  id: number;
  customer_id: number;
  name: string;
  Proccess:string;
  mobile: string;
  created_at?: string;
}

interface Agent {
  user_id: number;
  username: string;
}

const UserExcelList: React.FC = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<GridRowSelectionModel>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [loading, setLoading] = useState({
    customers: true,
    agents: true,
  });
  const [error, setError] = useState({
    customers: false,
    agents: false,
  });

  const [filterText, setFilterText] = useState('');
  const [filterMobile, setFilterMobile] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [manualCount, setManualCount] = useState<number>(0);
  const [isManualSelection, setIsManualSelection] = useState(false);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/upload/fetchexcel`)
      .then((res) => {
        const data = (res.data?.data || []).map((user: Customer, index: number) => ({
          id: index + 1,
          customer_id: user.customer_id,
          name: user.name || '',
          mobile: user.mobile || '',
          Proccess: user.Proccess ? user.Proccess = "Assined" :"Pending",
          created_at: user.created_at || '',
        }));
        setCustomers(data);
        setFilteredCustomers(data);
      })
      .catch(() => setError(prev => ({ ...prev, customers: true })))
      .finally(() => setLoading(prev => ({ ...prev, customers: false })));

    axios.get(`${BASE_URL}/api/user/agentroles`)
      .then((res) => {
        setAgents(res.data?.data || []);
      })
      .catch(() => setError(prev => ({ ...prev, agents: true })))
      .finally(() => setLoading(prev => ({ ...prev, agents: false })));
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const matchesName = customer.name.toLowerCase().includes(filterText.toLowerCase());
      const matchesMobile = customer.mobile.includes(filterMobile);
      const matchesDate = filterDate ? customer.created_at?.startsWith(filterDate) : true;
      return matchesName && matchesMobile && matchesDate;
    });
    setFilteredCustomers(filtered);
    
    if (manualCount > filtered.length) {
      setManualCount(filtered.length);
      setIsManualSelection(false);
    }
  }, [filterText, filterMobile, filterDate, customers]);

  useEffect(() => {
    if (!isManualSelection && manualCount > 0) {
      const ids = filteredCustomers.slice(0, manualCount).map((customer) => customer.id);
      setSelectedCustomerIds(ids);
    }
  }, [manualCount, filteredCustomers, isManualSelection]);

  const handleAgentChange = (event: SelectChangeEvent) => {
    setSelectedAgent(event.target.value);
  };

  const handleManualCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), filteredCustomers.length);
    setManualCount(value);
    setIsManualSelection(false);
  };

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedCustomerIds(newSelection);
    setManualCount(newSelection.length);
    setIsManualSelection(true);
  };

  const handleSubmit = () => {
    const selectedCustomers = filteredCustomers.filter((customer) =>
      selectedCustomerIds.includes(customer.customer_id)
    );
    console.log('Selected Customers:', selectedCustomers);
    console.log('Selected Agent ID:', selectedAgent);
    
    selectedCustomers.forEach(customer => {
        axios.post(`${BASE_URL}/api/assign/assigncustomer`, {
          customer_id: customer.customer_id,
          user_id: selectedAgent,
          name: customer.name,
          mobile: customer.mobile
        });
      });
      
    };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Sr. No', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'Proccess', headerName: 'Assign Status', flex: 1, minWidth: 90 },
    { field: 'mobile', headerName: 'Mobile', flex: 1, minWidth: 120 },
    { 
      field: 'created_at', 
      headerName: 'Created Date', 
      flex: 1,
      minWidth: 150,
      // Hide on small screens
      hide: isSmallScreen,
    } as GridColDef,
   
  ];

  if (loading.customers || loading.agents) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error.customers || error.agents) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error loading data. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Stack 
        spacing={2} 
        direction={isSmallScreen ? 'column' : 'row'} 
        sx={{ mb: 2 }}
        alignItems={isSmallScreen ? 'stretch' : 'flex-start'}
      >
        <TextField
          label="Filter by Name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
        />
        <TextField
          label="Filter by Mobile"
          value={filterMobile}
          onChange={(e) => setFilterMobile(e.target.value)}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
        />
        <TextField
          label="Filter by Date"
          placeholder="YYYY-MM-DD"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
        />
        <TextField
          label="Select Count"
          type="number"
          value={manualCount}
          onChange={handleManualCountChange}
          inputProps={{ 
            min: 0,
            max: filteredCustomers.length
          }}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
        />
        <FormControl sx={{ minWidth: isSmallScreen ? '100%' : 200 }} size={isSmallScreen ? 'small' : 'medium'}>
          <InputLabel>Select Agent</InputLabel>
          <Select
            value={selectedAgent}
            onChange={handleAgentChange}
            label="Select Agent"
            fullWidth={isSmallScreen}
          >
            {agents.map((agent) => (
              <MenuItem key={agent.user_id} value={agent.user_id.toString()}>
                {agent.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={!selectedAgent || selectedCustomerIds.length === 0}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
          sx={{ 
            height: isSmallScreen ? '40px' : 'auto',
            mt: isSmallScreen ? 1 : 0
          }}
        >
          Submit
        </Button>
      </Stack>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Selected: {selectedCustomerIds.length} of {filteredCustomers.length}
      </Typography>
      
      <Box sx={{ 
        height: isSmallScreen ? 400 : isMediumScreen ? 500 : 600,
        width: '100%'
      }}>
        <Stack alignItems="center" justifyContent="center" >
        <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={filteredCustomers}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedCustomerIds}
          initialState={{
            pagination: {
              paginationModel: { 
                pageSize: isSmallScreen ? 5 : isMediumScreen ? 10 : 20,
                page: 0 
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          density={isSmallScreen ? 'compact' : 'standard'}
        />

        </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserExcelList;