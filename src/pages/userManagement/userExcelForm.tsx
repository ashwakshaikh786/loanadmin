import {
  Button,
  Paper,
  Typography,
  Stack,
  Grid,
  Divider,
  TextField,
  IconButton,
  useMediaQuery,
  useTheme,
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
  loanamount: string;
  city: string;
  pincode: string;
};

const ManualCustomerForm = ({ onBackToList }: RegisterProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [customers, setCustomers] = useState<Customer[]>([
    { name: '', mobile: '', loanamount: '', city: '', pincode: '' },
  ]);

  const handleChange = (index: number, field: keyof Customer, value: string) => {
    const updated = [...customers];
    updated[index][field] = value;
    setCustomers(updated);
  };

  const handleAddRow = () => {
    setCustomers([...customers, { name: '', mobile: '', loanamount: '', city: '', pincode: '' }]);
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
      (cust) => !cust.name.trim() || !cust.mobile.trim() || !cust.loanamount.trim()
    );

    if (invalid) {
      Swal.fire('Error', 'Please fill in all required fields (Name, Mobile, Loan Amount)', 'error');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/upload/uploadsingleexcel`, customers);

      if (response.data.success) {
        Swal.fire('Success!', 'Customers added successfully!', 'success');
        setCustomers([{ name: '', mobile: '', loanamount: '', city: '', pincode: '' }]); // Reset form
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
      <Paper sx={{ px: { xs: 2, sm: 4 }, py: 4, width: '100%' }}>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant={isSmallScreen ? "h5" : "h4"}>Add Multiple Customers</Typography>
          <Button
            variant="contained"
            sx={{ borderRadius: 2 }}
            startIcon={<ArrowBackIcon />}
            onClick={onBackToList}
            size={isSmallScreen ? "small" : "medium"}
          >
            {isSmallScreen ? "Back" : "Back to List"}
          </Button>
        </Grid>

        <Divider sx={{ my: 2 }}>Customer Details</Divider>

        <form onSubmit={handleSubmit}>
          {customers.map((customer, index) => (
            <Grid 
              container 
              key={index} 
              spacing={1} 
              alignItems="center"
              sx={{ 
                mb: 2, 
                p: 1, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1 
              }}
            >
              {/* Name - Full width on mobile, 2 cols on desktop */}
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={customer.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  required
                  size="small"
                />
              </Grid>

              {/* Mobile - Full width on mobile, 2 cols on desktop */}
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Mobile"
                  variant="outlined"
                  fullWidth
                  value={customer.mobile}
                  onChange={(e) => handleChange(index, 'mobile', e.target.value)}
                  required
                  size="small"
                />
              </Grid>

              {/* Loan Amount - Only show on desktop */}
              <Grid item xs={false} sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                <TextField
                  label="Loan Amount"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={customer.loanamount}
                  onChange={(e) => handleChange(index, 'loanamount', e.target.value)}
                  required
                  size="small"
                />
              </Grid>

              {/* City - Only show on desktop */}
              <Grid item xs={false} sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                <TextField
                  label="City"
                  variant="outlined"
                  fullWidth
                  value={customer.city}
                  onChange={(e) => handleChange(index, 'city', e.target.value)}
                  size="small"
                />
              </Grid>

              {/* Pincode - Only show on desktop */}
              <Grid item xs={false} sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                <TextField
                  label="Pincode"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={customer.pincode}
                  onChange={(e) => handleChange(index, 'pincode', e.target.value)}
                  size="small"
                />
              </Grid>

              {/* Icons - Always at the end */}
              

              {/* Additional fields for mobile (stacked below) */}
              {isSmallScreen && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Loan Amount"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={customer.loanamount}
                      onChange={(e) => handleChange(index, 'loanamount', e.target.value)}
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      variant="outlined"
                      fullWidth
                      value={customer.city}
                      onChange={(e) => handleChange(index, 'city', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Pincode"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={customer.pincode}
                      onChange={(e) => handleChange(index, 'pincode', e.target.value)}
                      size="small"
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                <Stack direction="row" spacing={0} justifyContent="flex-end">
                  <IconButton 
                    color="primary" 
                    onClick={handleAddRow} 
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    <AddCircleIcon fontSize="small" />
                  </IconButton>
                  {customers.length > 1 && (
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveRow(index)}
                      size="small"
                      sx={{ p: 0.5 }}
                    >
                      <RemoveCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Grid>
            </Grid>
          ))}

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 3 }}
            size={isSmallScreen ? "medium" : "large"}
          >
            Submit All
          </Button>
        </form>
      </Paper>
    </Stack>
  );
};

export default ManualCustomerForm;