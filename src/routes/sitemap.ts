import paths from 'routes/paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  icon?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}
const iconMap: Record<string, string> = {
  'Dashboard': 'ri:dashboard-fill',
  'User Management': 'ic:round-security',
  'Tellecaller Management': 'ic:round-phone',
  'Master Settings': 'mdi:cog-outline',
  'filter': 'ic:baseline-filter-list',
  'FollowUp': 'material-symbols:local-library-outline',
  'Schedules': 'ic:outline-calendar-today',
  'Payouts': 'material-symbols:account-balance-wallet-outline',
  'Settings': 'ic:outline-settings',
};

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: iconMap['Dashboard'],
    active: true,
  },
  {
    id: 'User Management',
    subheader: 'User Management',
    icon: iconMap['User Management'],
    active: true,
    items: [
      {
        name: 'Users',
        pathName: 'signin',
        path: paths.usermanagement,
      },
    ],
  },
  {
    id: 'Tellecaller Management',
    subheader: 'Tellecaller Management',
    icon: iconMap['Tellecaller Management'],
    active: true,
    items: [
      {
        name: 'Customers List',
        pathName: 'signin',
        path: paths.usercontrol,
      },
      {
        name: 'Assigned Customers',
        pathName: 'Assigned Customers',
        path: paths.filter,
      },
    ],
  },
  {
    id: 'Master Settings',
    subheader: 'Master Settings',
    icon: iconMap['Master Settings'],
    active: true,
    items: [
      {
        name: 'Disposition',
        pathName: 'Disposition',
        path: paths.master,
      },
    ],
  },
  
  {
    id: 'FollowUp',
    subheader: 'FollowUp',
    path: paths.followUp,
    icon: iconMap['FollowUp'],
  },
  {
    id: 'schedules',
    subheader: 'coming soon',
    path: '#!',
    icon: iconMap['Schedules'],
   },
  // {
  //   id: 'payouts',
  //   subheader: 'coming soon',
  //   path: '#!',
  //   icon: iconMap['Payouts'],
  // },
  // {
  //   id: 'settings',
  //   subheader: 'coming soon',
  //   path: '#!',
  //   icon: iconMap['Settings'],
  // },
];


export default sitemap;
