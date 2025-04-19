import { MenuItem } from 'routes/sitemap';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconifyIcon from 'components/base/IconifyIcon';

const ListItem = ({ subheader, icon, path, active }: MenuItem) => {
  return (
    <ListItemButton
      component={Link}
      href={path}
      aria-current={active ? 'page' : undefined}
      sx={{
        mb: 2.5,
        bgcolor: active ? 'primary.main' : 'transparent',
        '&:hover': {
          bgcolor: active ? 'primary.main' : 'action.hover',
        },
      }}
    >
      {icon && (
        <ListItemIcon>
          <IconifyIcon
            icon={icon}
            fontSize="h4.fontSize"
            sx={{
              color: active ? 'info.light' : 'text.primary',
            }}
          />
        </ListItemIcon>
      )}
      <ListItemText
        primary={subheader}
        sx={{
          '& .MuiListItemText-primary': {
            color: active ? 'info.light' : 'text.primary',
          },
        }}
      />
    </ListItemButton>
  );
};

export default ListItem;
