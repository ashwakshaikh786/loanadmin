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

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: 'ri:dashboard-fill',
    active: true,
  },
  {
    id: 'User Management',
    subheader: 'User Management',
    icon: 'ic:round-security',
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
    icon: 'ic:round-security',
    active: true,
    items: [
      {
        name: 'Customers',
        pathName: 'signin',
        path: paths.usercontrol,
      },

      {
        name:'Filter',
        pathName:'filter',
        path:paths.filter
      }
    ],
  },


  {
    id: 'Master Settings',
    subheader: 'Master Settings', 
    icon: 'ic:round-security',
    active: true,
    items: [
      {
        name: 'Users',
        pathName: 'signin',
        path: paths.master,
      },
    ],
  },

  {
    id: 'filter',
    subheader: 'filter',
    path: paths.filter,
    icon: 'ic:baseline-show-chart',
  },
  {
    id: 'FollowUp',
    subheader: 'FollowUp',
    path:paths.followUp,
    icon: 'material-symbols:local-library-outline',
  },
  {
    id: 'schedules',
    subheader: 'Schedules',
    path: paths.test,
    icon: 'ic:outline-calendar-today',
  },
  {
    id: 'payouts',
    subheader: 'Payouts',
    path: paths.admin,
    icon: 'material-symbols:account-balance-wallet-outline',
  },
  {
    id: 'settings',
    subheader: 'Settings',
    path: '#!',
    icon: 'ic:outline-settings',
  },
];

export default sitemap;
