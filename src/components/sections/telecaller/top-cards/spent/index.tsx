import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SpentChart from './SpentChart';
import { useState, useEffect } from 'react';
import BASE_URL from '../../../../../config';
import axios from 'axios'; 
const Spent = () => {

  
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
    <Paper component={Stack} alignItems="center" justifyContent="space-between" sx={{ py: 2.5 }}>
      <Box>
        <Typography variant="body2" color="text.disabled" fontWeight={500}>
        Today's Activities
        </Typography>
        <Typography mt={1} variant="h3">
        {counts.today_or_null_count}
        </Typography>
      </Box>

      <SpentChart data={[160, 100, 210, 270, 180]} sx={{ width: 75, height: '68px !important' }} />
    </Paper>
  );
};

export default Spent;
