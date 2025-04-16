import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import { useState, useEffect } from 'react';
import BASE_URL from '../../../../../config';
import axios from 'axios';  
const Earnings = () => {

  const [counts, setCounts] = useState({
    future_count: 0,
    past_count: 0,
    today_or_null_count: 0,
    total_count: 0
  });
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userId = sessionStorage.getItem('user_id');
        if (!userId) return;

        const response = await axios.post(`${BASE_URL}/api/telecaller/assign/teleassignListCount`, {
          userId: userId,
        });
        setCounts(response.data.counts || []);
      } catch (error) {
        console.error('Failed to fetch dashboard counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Paper
      component={Stack}
      alignItems="center"
      justifyContent="space-between"
      sx={{ px: 2, py: 3 }}
    >
      <Stack alignItems="center" justifyContent="flex-start" spacing={2}>
        <Stack
          alignItems="center"
          justifyContent="center"
          height={56}
          width={56}
          bgcolor="info.main"
          borderRadius="50%"
        >
          <IconifyIcon icon="ic:round-bar-chart" color="primary.main" fontSize="h3.fontSize" />
        </Stack>
        <Box>
          <Typography variant="body2" color="text.disabled" fontWeight={500}>
            Future Activities
          </Typography>
          <Typography mt={1} variant="h3">
            {counts.future_count}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Earnings;
