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
import Swal from 'sweetalert2';
interface Customer {
  id: number;
  customer_id: number;
  name: string;
  Proccess: string;
  loanamount:string;
  city:string;
  pincode :string;
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
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([]);
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

  const fetchCustomers = async () => {
    setLoading(prev => ({ ...prev, customers: true }));
    try {
      const res = await axios.get(`${BASE_URL}/api/upload/fetchexcel`);
      const data = (res.data?.data || []).map((user: Customer, index: number) => ({
        id: index + 1,
        customer_id: user.customer_id,
        name: user.name || '--',
        mobile: user.mobile || '--',
        Proccess: user.Proccess ? "Assigned" : "Pending",
        created_at: user.created_at || '--',
        loanamount:user.loanamount || '--',
        city:user.city || '--',
        pincode :user.pincode || '--',
      }));
      setCustomers(data);
      setFilteredCustomers(data);
      setError(prev => ({ ...prev, customers: false }));
    } catch (error) {
      setError(prev => ({ ...prev, customers: true }));
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  const fetchAgents = async () => {
    setLoading(prev => ({ ...prev, agents: true }));
    try {
      const res = await axios.get(`${BASE_URL}/api/user/agentroles`);
      setAgents(res.data?.data || []);
      setError(prev => ({ ...prev, agents: false }));
    } catch (error) {
      setError(prev => ({ ...prev, agents: true }));
    } finally {
      setLoading(prev => ({ ...prev, agents: false }));
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchAgents();
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
    setSelectedCustomerIds(newSelection as number[]);
    setManualCount(newSelection.length);
    setIsManualSelection(true);
  };

  const handleSubmit = async () => {
    if (selectedCustomerIds.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No Customers Selected',
        text: 'Please select at least one customer to assign',
      });
      return;
    }

    if (!selectedAgent) {
      Swal.fire({
        icon: 'error',
        title: 'No Agent Selected',
        text: 'Please select an agent to assign customers to',
      });
      return;
    }

    try {
      const selectedCustomers = filteredCustomers.filter((customer) =>
        selectedCustomerIds.includes(customer.id)
      );

      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to assign ${selectedCustomers.length} customers to the selected agent.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, assign them!'
      });

      if (result.isConfirmed) {
        // Process all assignments
        const assignmentPromises = selectedCustomers.map(customer => 
          axios.post(`${BASE_URL}/api/assign/assigncustomer`, {
            customer_id: customer.customer_id,
            user_id: selectedAgent,
            name: customer.name,
            mobile: customer.mobile,
            loanamount:customer.loanamount || 0,
            city:customer.city || "",
            pincode :customer.pincode || 0
          })
        );

        await Promise.all(assignmentPromises);

        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${selectedCustomers.length} customers have been assigned successfully.`,
        });

        // Refetch the latest data
        await fetchCustomers();

        // Clear selection
        setSelectedCustomerIds([]);
        setManualCount(0);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: 'There was an error assigning customers. Please try again.',
      });
      console.error('Error assigning customers:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Sr. No', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 90 },
    { field: 'Proccess', headerName: 'Assign Status', flex: 1, minWidth: 90 },
    { field: 'mobile', headerName: 'Mobile', flex: 1, minWidth: 90 },
    { field: 'loanamount', headerName: 'Loan amount (Previous)', flex: 1, minWidth: 200 },
    { field: 'city', headerName: 'City', flex: 1, minWidth: 90 },
    { field: 'pincode', headerName: 'Pincode', flex: 1, minWidth: 90 },
    { 
      field: 'created_at', 
      headerName: 'Created Date', 
      flex: 1,
      minWidth: 120,
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
        />
        <TextField
          label="Filter by Date"
           variant="outlined"
          placeholder="YYYY-MM-DD"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          size={isSmallScreen ? 'small' : 'medium'}
          fullWidth={isSmallScreen}
        />
        <TextField
          label="Select Count"
           variant="outlined"
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
 <FormControl
  fullWidth={isSmallScreen}
  size={isSmallScreen ? 'small' : 'medium'}
  variant="outlined"
  sx={{ minWidth: isSmallScreen ? '100%' : 200 }}
>
  <InputLabel id="select-agent-label" sx={{top:"-4px"}}>Select Agent</InputLabel>
  <Select
    labelId="select-agent-label"
    id="select-agent"
    value={selectedAgent}
    onChange={handleAgentChange}
    label="Select Agent"
    sx={{
      // Optional: Adjust vertical padding slightly
      '& .MuiSelect-select': {
        py: 1.25, // or 1.25 depending on size
      },
    }}
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
              pageSizeOptions={[5, 10, 20 ,50 ,100]}
              density={isSmallScreen ? 'compact' : 'standard'}
           
              autoHeight  
            />
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserExcelList;