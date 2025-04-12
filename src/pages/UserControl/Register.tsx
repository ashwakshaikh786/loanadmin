import {
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    MenuItem,
    Divider,
    Stack,
  } from '@mui/material';
  import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
  import Swal from 'sweetalert2';
  import axios from 'axios';
  import BASE_URL from '../../config';
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';

  // Define the type for Role
  type Role = {
    role_id: string | number;
    role_name: string;
  };
  type RegisterProps = {
    onBackToList: () => void;
  };
  const Register =  ({ onBackToList }: RegisterProps) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      mobile: '',
      email: '',
      address: '',
      username: '',
      password: '',
      role_id: '',
      dob: '',
    });
  
    useEffect(() => {
        const fetchRoles = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/api/user/roles`);
            if (response.data.success && Array.isArray(response.data.data)) {
              setRoles(response.data.data); // ✅ this is the correct path
            } else {
              setRoles([]); // fallback to empty array
            }
          } catch (error) {
            console.error('Failed to fetch roles', error);
            setRoles([]); // fallback on error
          }
        };
      
        fetchRoles();
      }, []);
    const handleInputChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${BASE_URL}/api/user/userregister`, formData);
        console.log("formdata",formData);
        if (response.data.success) {
          Swal.fire('Success!', 'User registered successfully!', 'success');
          setFormData({
            first_name: '',
            last_name: '',
            mobile: '',
            email: '',
            address: '',
            username: '',
            password: '',
            role_id: '',
            dob: '',
          });
        } else {
          Swal.fire('Error', response.data.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    };
  
    return (
      <Stack alignItems="center" justifyContent="center" px={1} py={4}>
        <Paper sx={{ px: 4, py: 4, width: '100%'}}>
        <Grid container alignItems="center" sx={{ mb: 3, position: 'relative' }}>
  <Grid item xs={12}>
    <Typography variant="h4" align="center">
      User Management
    </Typography>
  </Grid>
  <Grid item sx={{ position: 'absolute', right: 16 }}>
    <Button
      variant="contained" 
      sx={{borderRadius:2}}
      startIcon={<ArrowBackIcon />}
      onClick={onBackToList}
    >
      Back to List
    </Button>
  </Grid>
</Grid>
          <Divider sx={{ my: 2 }}>User Details</Divider>
  
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="first_name"
                  placeholder="First Name"
                  variant="outlined"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField
                  name="last_name"
                  placeholder="Last Name"
                  variant="outlined"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField
                  name="mobile"
                  placeholder="Mobile"
                  variant="outlined"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  placeholder="Email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
  
  
              <Grid item xs={12} sm={6}>
                <TextField
                  name="username"
                  placeholder="Username"
                  variant="outlined"
                  value={formData.username}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField
                  name="password"
                  placeholder="Password"
                  type="password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  fullWidth
                placeholder="Role"
                  required  
                   variant="outlined"
                >
                  <MenuItem value="" disabled>
                    <em>Select Role</em>
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <TextField
                  name="dob"
                  placeholder="Date of Birth"
                  type="date"
                  variant="outlined"
                  value={formData.dob}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="address"
                  placeholder="Address"
                  variant="outlined"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
            </Grid>
  
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 4 }}>
              Register
            </Button>
          </form>
        </Paper>
      </Stack>
    );
  };
  
  export default Register;
  