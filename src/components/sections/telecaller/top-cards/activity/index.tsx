import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ActivityChart from './ActivityChart';
import { useState, useEffect } from 'react';
import BASE_URL from '../../../../../config';
import axios from 'axios';  
const Activity = () => {

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
      sx={(theme) => ({
        px: 3,
        py: 2.5,
        background: `linear-gradient(135deg, ${theme.palette.gradients.primary.state} 0%, ${theme.palette.gradients.primary.main} 100%)`,
      })}
    >
      <Box>
        <Typography variant="body2" color="info.dark" fontWeight={500}>
         Total Activities
        </Typography>
        <Typography mt={1} variant="h3" color="info.light">
        {counts.total_count}
        </Typography>
      </Box>
  
      <ActivityChart data={[15, 50, 30, 45, 50]} sx={{ width: 75, height: '68px !important' }} />
    </Paper>
  );
};

export default Activity;
