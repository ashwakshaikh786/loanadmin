import {
    Button,
    Paper,
    Typography,
    Stack,
    Grid,
    Divider,
    TextField,
    IconButton,
  } from '@mui/material';
  import { useState, FormEvent } from 'react';
  import Swal from 'sweetalert2';
  import axios from 'axios';
  import BASE_URL from '../../config';
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';
  import AddCircleIcon from '@mui/icons-material/AddCircle';
  import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
  
  type RegisterProps = {
    onBackToList: () => void;
  };
  
  type Customer = {
    name: string;
    mobile: string;
  };
  
  const ManualCustomerForm = ({ onBackToList }: RegisterProps) => {
    const [customers, setCustomers] = useState<Customer[]>([
      { name: '', mobile: '' },
    ]);
  
    const handleChange = (index: number, field: keyof Customer, value: string) => {
      const updated = [...customers];
      updated[index][field] = value;
      setCustomers(updated);
    };
  
    const handleAddRow = () => {
      setCustomers([...customers, { name: '', mobile: '' }]);
    };
  
    const handleRemoveRow = (index: number) => {
      if (customers.length > 1) {
        const updated = customers.filter((_, i) => i !== index);
        setCustomers(updated);
      }
    };
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
  
      const invalid = customers.some(
        (cust) => !cust.name.trim() || !cust.mobile.trim()
      );
  
      if (invalid) {
        Swal.fire('Error', 'Please fill in all name and mobile fields', 'error');
        return;
      }
  
      try {
        const response = await axios.post(`${BASE_URL}/api/upload/uploadsingleexcel`, customers);
  
        if (response.data.success) {
          Swal.fire('Success!', 'Customers added successfully!', 'success');
          setCustomers([{ name: '', mobile: '' }]); // Reset form
        } else {
          Swal.fire('Error', response.data.message || 'Upload failed', 'error');
        }
      } catch (error) {
        console.error('Upload failed', error);
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    };
  
    return (
      <Stack alignItems="center" justifyContent="center" px={1} py={4}>
        <Paper sx={{ px: 4, py: 4, width: '100%', maxWidth: 600 }}>
          <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h4">Add Multiple Customers</Typography>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              startIcon={<ArrowBackIcon />}
              onClick={onBackToList}
            >
              Back to List
            </Button>
          </Grid>
  
          <Divider sx={{ my: 2 }}>Customer Details</Divider>
  
          <form onSubmit={handleSubmit}>
            {customers.map((customer, index) => (
              <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={5}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={customer.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Mobile"
                    variant="outlined"
                    fullWidth
                    value={customer.mobile}
                    onChange={(e) => handleChange(index, 'mobile', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={handleAddRow}>
                      <AddCircleIcon />
                    </IconButton>
                    {customers.length > 1 && (
                      <IconButton color="error" onClick={() => handleRemoveRow(index)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            ))}
  
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              Submit All
            </Button>
          </form>
        </Paper>
      </Stack>
    );
  };
  
  export default ManualCustomerForm;
  