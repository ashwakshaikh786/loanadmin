
import { Box, Grid, Typography, Paper } from '@mui/material';

import BASE_URL from '../../config';
import { useEffect, useState } from 'react';
import axios from 'axios';  
import {
  Phone as PhoneIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as PendingIcon
} from '@mui/icons-material';

const TelecallerDashboard = () => {
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
    <Paper sx={{ width: '100%' }}>
    <Box sx={{ flex: 1 }}>
     
      
     
        <Typography variant="h4" gutterBottom>
          Telecaller Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h5" mt={1}>{counts.today_or_null_count || 0}</Typography>
              <Typography variant="subtitle1">Today Leads</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <PendingIcon color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="h5" mt={1}>{counts.past_count || 0}</Typography>
              <Typography variant="subtitle1">Backlog Leads</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
            <PersonAddIcon sx={{ fontSize: 40, color: 'grey' }} />

              <Typography variant="h5" mt={1}>{counts.future_count || 0}</Typography>
              <Typography variant="subtitle1">Open Leads</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <PhoneIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5" mt={1}>{counts.total_count || 0}</Typography>
              <Typography variant="subtitle1">Total Leads</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        
        {/* Recent Activity or other dashboard components can go here */}
      </Box>
      </Paper>
 
  );
};

export default TelecallerDashboard;