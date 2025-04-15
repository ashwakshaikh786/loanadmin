import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Modal,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationCity as LocationCityIcon,
  PinDrop as PinDropIcon,
  MonetizationOn as MonetizationOnIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Update as UpdateIcon,
  Work as WorkIcon,
  EventNote as FollowUpIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';
export interface LeadProfile {
  id: string;
  customer_id:string;
  name: string;
  mobile: string;
  loanamount: string;
  city: string;
  pincode: string;
  Proccess: string;
  note?: string;
  nextfollowup_dt?: string;
  nextfollowup_at?: string;
  currentupdatename?: string;
  tele_id: string;
  user_id: string;
}

interface UpdateOption {
  currentupdatename: string;
  currentupdate_id: string; // Fixed typo from currepupdate_id
}

interface TelecallerProfileProps {
  lead: LeadProfile | null;
  onBack: () => void;
  isMobile: boolean;
}

const InfoCard = ({
  icon,
  label,
  value
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
}) => (
  <Box
    sx={{
      display: 'flex',
      gap: 1.5,
      alignItems: 'flex-start',
      p: 2,
      borderRadius: 2,
      border: '1px solid #e0e0e0',
      backgroundColor: '#fff'
    }}
  >
    {icon}
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="500">
        {value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

const TelecallerProfile = ({ lead, onBack }: TelecallerProfileProps) => {
  const [open, setOpen] = useState(false);
  const [updates, setUpdates] = useState<UpdateOption[]>([]);
  const [formData, setFormData] = useState({
    currentupdate_id: '',
    nextfollowup_dt: '',
    nextfollowup_at: '',
    note: ''
  });

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/telecaller/assign/currentupdate`)
      .then(res => {
        console.log('API response:', res.data.data); // 🪵 Check what the API returns
        if (Array.isArray(res.data)) {
          setUpdates(res.data);
        } else if (Array.isArray(res.data.data)) {
          setUpdates(res.data.data); // In case it's wrapped inside a "data" key
        } else {
          console.error('Unexpected response format:', res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);
  

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!lead) return;

    const payload = {
      tele_id: lead.tele_id,
      customer_id: lead.customer_id,
      user_id: lead.user_id,
      ...formData
    };

    try {
      await axios.post(`${BASE_URL}/api/telecaller/assign/nextfollowup`, payload);
      alert('Follow-up added successfully');
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to submit follow-up');
    }
  };

  if (!lead) return null;

  return (
    <Paper sx={{ width: '100%', p: { xs: 2, md: 3 }, borderRadius: 3 }}>
    <Box>
      {/* Back Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="contained"
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
        >
          Back
        </Button>
      </Box>
  
      {/* Header + Add Follow Up Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        mb={3}
        gap={2}
      >
        <Typography variant="h5" fontWeight={600}>
          Lead Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<FollowUpIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
        >
          Add Follow Up
        </Button>
      </Box>
  
      {/* Lead Info */}
      
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InfoCard icon={<PersonIcon color="primary" />} label="Name" value={lead.name} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoCard icon={<PhoneIcon color="success" />} label="Mobile" value={lead.mobile} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoCard icon={<MonetizationOnIcon color="warning" />} label="Loan Amount" value={lead.loanamount} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoCard icon={<LocationCityIcon color="info" />} label="City" value={lead.city} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoCard icon={<PinDropIcon color="secondary" />} label="Pincode" value={lead.pincode} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoCard icon={<WorkIcon color="primary" />} label="Process" value={lead.Proccess} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoCard icon={<DescriptionIcon />} label="Note" value={lead.note || 'N/A'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoCard icon={<CalendarTodayIcon color="error" />} label="Next Followup Date" value={lead.nextfollowup_dt || 'N/A'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoCard icon={<AccessTimeIcon color="warning" />} label="Next Followup Time" value={lead.nextfollowup_at || 'N/A'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoCard icon={<UpdateIcon color="primary" />} label="Current Update" value={lead.currentupdatename || 'N/A'} />
            </Grid>
          </Grid>
        

  
      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 320, sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 6,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Add Follow Up
          </Typography>
  
          <TextField
            select
            label="Current Update"
            fullWidth
            value={formData.currentupdate_id}
            onChange={(e) => handleInputChange('currentupdate_id', e.target.value)}
            margin="normal"
            size="small"
          >
            {updates.map((option) => (
              <MenuItem key={option.currentupdate_id} value={option.currentupdate_id}>
                {option.currentupdatename}
              </MenuItem>
            ))}
          </TextField>
  
          <TextField
            type="date"
            label="Next Followup Date"
            fullWidth
            value={formData.nextfollowup_dt}
            onChange={(e) => handleInputChange('nextfollowup_dt', e.target.value)}
            margin="normal"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
  
          <TextField
            type="time"
            label="Next Followup Time"
            fullWidth
            value={formData.nextfollowup_at}
            onChange={(e) => handleInputChange('nextfollowup_at', e.target.value)}
            margin="normal"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
  
          <TextField
            label="Note"
            fullWidth
            multiline
            rows={3}
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            margin="normal"
            size="small"
          />
  
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: 2,color:"#000", }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 2 }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  </Paper>
  
  );
};

export default TelecallerProfile;
