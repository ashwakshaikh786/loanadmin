import { useState } from 'react';
import { MenuItem } from 'routes/sitemap';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import IconifyIcon from 'components/base/IconifyIcon';

const CollapseListItem = ({ subheader, active, items, icon }: MenuItem) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ pb: 1.5 }}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderRadius: 2,
          px: 2,
          py: 1.2,
          bgcolor: open ? 'action.hover' : 'transparent',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <ListItemIcon>
          {icon && (
            <IconifyIcon
              icon={icon}
              sx={{
                color: active ? 'text.primary' : 'text.secondary',
              }}
            />
          )}
        </ListItemIcon>
        <ListItemText
          primary={subheader}
          sx={{
            '& .MuiListItemText-primary': {
              fontWeight: 500,
              color: active ? 'text.primary' : 'text.secondary',
            },
          }}
        />
        <IconifyIcon
          icon="iconamoon:arrow-down-2-duotone"
          sx={{
            color: active ? 'text.primary' : 'text.disabled',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        />
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        {items?.map((route) => (
  <Box key={route.pathName}>
    <Box
      component="hr"
      sx={{
        border: 0,
        height: '1px',
        backgroundColor: '#4634ff',
        width: '50%',
        margin: '8px auto',
      }}
    />
    <ListItemButton
      component={Link}
      href={route.path}
      sx={{
        pl: 5,
        py: 1,
        borderRadius: 2,
        bgcolor: route.active ? 'info.light' : 'transparent',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <ListItemText
        primary={route.name}
        sx={{
          '& .MuiListItemText-primary': {
            color: 'text.primary',
            fontWeight: 400,
          },
        }}
      />
    </ListItemButton>
  </Box>
))}

        </List>
      </Collapse>
    </Box>
  );
};

export default CollapseListItem;
