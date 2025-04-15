
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
    totalAssigned: 0,
    completed: 0,
    pending: 0,
    newLeads: 0
  });
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userId = sessionStorage.getItem('user_id');
        if (!userId) return;

        const response = await axios.post(`${BASE_URL}/api/telecaller/dashboard/counts`, {
          userId: parseInt(userId)
        });
        setCounts(response.data.data);
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
              <PhoneIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5" mt={1}>{counts.totalAssigned}</Typography>
              <Typography variant="subtitle1">Total Assigned</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h5" mt={1}>{counts.completed}</Typography>
              <Typography variant="subtitle1">Completed Calls</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <PendingIcon color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="h5" mt={1}>{counts.pending}</Typography>
              <Typography variant="subtitle1">Pending Calls</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <PersonAddIcon color="info" sx={{ fontSize: 40 }} />
              <Typography variant="h5" mt={1}>{counts.newLeads}</Typography>
              <Typography variant="subtitle1">New Leads</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Recent Activity or other dashboard components can go here */}
      </Box>
      </Paper>
 
  );
};

export default TelecallerDashboard;