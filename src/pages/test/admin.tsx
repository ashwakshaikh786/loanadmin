import { useState, ChangeEvent, FormEvent } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import Swal from 'sweetalert2';  // Import Swal for alerts
import axios from 'axios'; // Import axios for API calls
import BASE_URL from '../../config';

interface User {
  [key: string]: string;
}

const Signin = () => {
  const [user, setUser] = useState<User>({ name: '' });


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
     
      const response = await axios.post(
        `${BASE_URL}/api/user/signin`,
        { name: user.name }, // Hardcoded value
        { headers: { 'Content-Type': 'application/json' } }
      );
       console.log("response",response);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'You have successfully signed in!',   
        });
       
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.message || 'Something went wrong, please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to communicate with the server, please try again later.',
      });
    }
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Admin
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Welcome back! Let's continue with,
      </Typography>

      <Stack mt={3} spacing={1.75} width={1}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<IconifyIcon icon="logos:google-icon" />}
          sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.main' } }}
        >
          Google
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<IconifyIcon icon="logos:apple" sx={{ mb: 0.5 }} />}
          sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.main' } }}
        >
          Apple
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }}>or Signin with</Divider>

      <Stack component="form" mt={3} onSubmit={handleSubmit} direction="column" gap={2}>
        <TextField
          id="name"
          name="name"
          type="text"
          value={user.name}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your name"
          autoComplete="name"
          fullWidth
          autoFocus
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="ic:baseline-alternate-name" />
              </InputAdornment>
            ),
          }}
        />

        <Stack mt={-1.25} alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={<Checkbox id="checkbox" name="checkbox" size="medium" color="primary" />}
            label="Remember me"
            sx={{ ml: -0.75 }}
          />
          <Link href="#!" fontSize="body2.fontSize">
            Forgot password?
          </Link>
        </Stack>

        <Button type="submit" variant="contained" size="medium" fullWidth>
          Sign In
        </Button>
      </Stack>

      <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Don't have an account? <Link href={paths.signup}>Signup</Link>
      </Typography>
    </>
  );
};

export default Signin;
