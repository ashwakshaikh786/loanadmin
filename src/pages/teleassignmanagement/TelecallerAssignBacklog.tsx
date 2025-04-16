import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import TelecallerSidebar from './TelecallerSidebarBacklog';
import TelecallerDashboard from './TelecallerDashboard';
import TelecallerProfile, { LeadProfile } from './TelecallerProfile';
import { useState } from 'react';

const TelecallerAssign = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedLead, setSelectedLead] = useState<LeadProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleLeadSelect = (lead: LeadProfile) => {
    setSelectedLead(lead);
    setShowProfile(true);
  };

  const handleBackToDashboard = () => {
    setShowProfile(false);
    setSelectedLead(null);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', p: isSmallScreen ? 1 : 3 }}>
      <Grid container spacing={2}>
        {/* === Sidebar === */}
        {(!isSmallScreen || !showProfile) && (
          <Grid item xs={12} md={4}>
            <TelecallerSidebar onSelectLead={handleLeadSelect} />
          </Grid>
        )}

        {/* === Dashboard (Desktop only & when not viewing profile) === */}
        {!isSmallScreen && !showProfile && (
          <Grid item md={8}>
            <TelecallerDashboard />
          </Grid>
        )}

        {/* === Profile (Full screen on mobile, 8 cols on desktop) === */}
        {showProfile && (
          <Grid item xs={12} md={8}>
            <TelecallerProfile
              lead={selectedLead}
              onBack={handleBackToDashboard}
              isMobile={isSmallScreen}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TelecallerAssign;
