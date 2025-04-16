import { Box, Typography, Paper, IconButton, Avatar } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import BASE_URL from '../../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LeadProfile } from './TelecallerProfile';

interface TelecallerSidebarProps {
  onSelectLead: (lead: LeadProfile) => void;
}

const TelecallerSidebar = ({ onSelectLead }: TelecallerSidebarProps) => {
  const [records, setRecords] = useState<LeadProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const userId = sessionStorage.getItem('user_id');
        if (!userId) return;

        const response = await axios.post(`${BASE_URL}/api/telecaller/assign/teleassignListNext`, {
          userId: userId,
        });
        setRecords(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleCall = (mobile: string) => {
    window.open(`tel:${mobile}`, '_blank');
  };

  const handleRowClick = (record: LeadProfile) => {
    if (onSelectLead) {
      onSelectLead(record);
    }
  };

  return (
    <Box sx={{ height: '100vh',width:"100%", overflowY: 'auto', p: { xs: 1, md: 2 }, bgcolor: '#fff' ,borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Open Leads
      </Typography>

      {loading ? (
        <Typography>Loading records...</Typography>
      ) : records.length === 0 ? (
        <Typography>No records found</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1,     }}>
          {records.map((record) => (
            <Paper
              key={record.id}
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                cursor: 'pointer',
                boxShadow: 2,
                transition: 'transform 0.2s, box-shadow 0.3s',  
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: 6,
                  
                },
              }}
              onClick={() => handleRowClick(record)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2,   }}>
                <Avatar>
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {record.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondry">
                    {record.mobile}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCall(record.mobile);
                    }}
                    sx={{
                      color: '#fff',
                      bgcolor: 'primary.light',
                         borderRadius:"5px",
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: '#fff',
                         borderRadius:"5px"
                      },
                     
                    }}
                  >
                    <PhoneIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TelecallerSidebar;
