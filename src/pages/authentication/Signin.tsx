import { useState, ChangeEvent, FormEvent,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
// import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
// import Checkbox from '@mui/material/Checkbox';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import BASE_URL from '../../config';

interface User {
  [key: string]: string;
}

const Signin = () => {
  const [user, setUser] = useState<User>({ usernameOrEmail: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role_name');
    const expiry = sessionStorage.getItem('session_expiry');
    const role_id = sessionStorage.getItem('role_id');
    // Check if session exists and not expired
    if (username && role && role_id && expiry && Date.now() < Number(expiry)) {
      if (role_id === '1') {
        navigate(paths.dashboard);
      } else if (role_id === '2') {
        navigate(paths.teledashboard);
      } else {
        alert('No dashboard route defined for your role');
      } // redirect if still valid
    } else {
      // Remove expired session
      sessionStorage.clear();
    }
  }, []);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
   
      const response = await axios.post(`${BASE_URL}/api/user/login`, {
        usernameOrEmail: user.usernameOrEmail,
        password: user.password,
      });

      if (response.data.success) {
        const { username, role_name, email,role_id } = response.data.data;
        console.log("succss" ,response.data.data);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('role_name', role_name);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('role_id', role_id);
        console.log('Login success:', username);
        const expiryTime = Date.now() + 12 * 60 * 60 * 1000;
        sessionStorage.setItem('session_expiry', expiryTime.toString());
        if (role_id == '1') {
          navigate(paths.dashboard);
        } else if (role_id == '2') {
          navigate(paths.teledashboard);
        } else {
          alert('No dashboard route defined for your role');
        }
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error);
        alert(error.response?.data?.message || 'Login request failed');
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Sign In
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Welcome back! Let's continue with,
      </Typography>

      <Divider sx={{ my: 4 }}>Signin with</Divider>

      <Stack component="form" mt={3} onSubmit={handleSubmit} direction="column" gap={2}>
        <TextField
          id="email"
          name="usernameOrEmail"
          type="text"
          value={user.usernameOrEmail}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Username or Email"
          autoComplete="email"
          fullWidth
          autoFocus
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="ic:baseline-alternate-email" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={user.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Password"
          autoComplete="current-password"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="ic:outline-lock" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  opacity: user.password ? 1 : 0,
                  pointerEvents: user.password ? 'auto' : 'none',
                }}
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ border: 'none', bgcolor: 'transparent !important' }}
                  edge="end"
                >
                  <IconifyIcon
                    icon={showPassword ? 'ic:outline-visibility' : 'ic:outline-visibility-off'}
                    color="neutral.light"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* <Stack mt={-1.25} alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={<Checkbox id="checkbox" name="checkbox" size="medium" color="primary" />}
            label="Remember me"
            sx={{ ml: -0.75 }}
          />
          <Link href="#!" fontSize="body2.fontSize">
            Forgot password?
          </Link>
        </Stack> */}

        <Button type="submit" variant="contained" size="medium" fullWidth>
          Sign In
        </Button>
      </Stack>

      {/* <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Don't have an account? <Link href={paths.signup}>Signup</Link>
      </Typography> */}
    </>
  );
};

export default Signin;
