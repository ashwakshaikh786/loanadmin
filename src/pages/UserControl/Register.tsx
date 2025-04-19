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
import dayjs from 'dayjs';
import { User } from './UserListTable';

interface RegisterProps {
  onBackToList: () => void;
  userData?: User | null;
  isEditMode?: boolean;
}
const Register = ({ onBackToList, userData, isEditMode = false }: RegisterProps) => {
  type Role = {
    role_id: string | number;
    role_name: string;
  };
  const [roles, setRoles] = useState<Role[]>([]);
  const userId = sessionStorage.getItem('user_id');
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    return dateString; // fallback
  };
 
  const [formData, setFormData] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    address: '',
    username: '',
    password: '',
    role_id: '',
    dob: '',
    createuid:userId,
    modified_uid: userId
  });
  useEffect(() => {
    if (isEditMode && userData) {
      setFormData({
        user_id: userData.user_id?.toString() || '', // Safe access with optional chaining
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        mobile: userData.mobile || '',
        email: userData.email || '',
        address: userData.address || '',
        username: userData.username || '',
        password: '', // Never pre-fill password
        role_id: userData.role_id?.toString() || '',
        dob: formatDateForInput(userData.dob || ''),
        createuid:userId,
        modified_uid: userId
      });
    }
  }, [isEditMode, userData]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/roles`);
        if (response.data.success && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        } else {
          setRoles([]); 
        }
      } catch (error) {
        console.error('Failed to fetch roles', error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, []);


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const maxDate = dayjs().subtract(18, 'year').format('YYYY-MM-DD');


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditMode
        ? `${BASE_URL}/api/user/userupdate`
        : `${BASE_URL}/api/user/userregister`;

      const response = await axios.post(url, formData);
      console.log("payload data", formData)
      if (response.data?.success) {
        console.log("payload data", response.data)
        Swal.fire('Success!', `User ${isEditMode ? 'updated' : 'registered'} successfully!`, 'success');
        if (!isEditMode) {
          // Reset form after successful registration
          setFormData({
            user_id: '',
            first_name: '',
            last_name: '',
            mobile: '',
            email: '',
            address: '',
            username: '',
            password: '',
            role_id: '',
            dob: '',
            createuid:userId,
            modified_uid: userId
          });
        }
      }
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Something went wrong';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" px={1} py={4}>
      <Paper sx={{ px: 4, py: 4, width: '100%' }}>
        <Grid container alignItems="center" sx={{ mb: 3, position: 'relative' }}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center">
              {isEditMode ? 'Edit User' : 'Add New User'}
            </Typography>
          </Grid>
          <Grid item sx={{ position: 'absolute', right: 16 }}>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              startIcon={<ArrowBackIcon />}
              onClick={onBackToList}
            >
              Back to List
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }}>User Details</Divider>

        <form onSubmit={handleSubmit}>
          {isEditMode && (
            <input type="hidden" name="user_id" value={formData.user_id} />
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First name"
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
                label="Last name"
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
                label="Mobile no."
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
                label="Email address"
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
                label="Username"
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
                label="Password"
                name="password"
                type="text"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth

              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Role"
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
                label="Date of Birth"
                name="dob"
                placeholder="Date of Birth"
                type="date"
                variant="outlined"
                value={formData.dob}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: maxDate }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
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
            Submit
          </Button>
        </form>
      </Paper>
    </Stack>
  );
};

export default Register;
