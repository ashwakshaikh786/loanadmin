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
    ],
  },
  {
    id: 'activity',
    subheader: 'Activity',
    path: '#!',
    icon: 'ic:baseline-show-chart',
  },
  {
    id: 'library',
    subheader: 'Library',
    path: '#!',
    icon: 'material-symbols:local-library-outline',
  },
  {
    id: 'authentication',
    subheader: 'Authentication',
    icon: 'ic:round-security',
    active: true,
    items: [
      {
        name: 'Sign In',
        pathName: 'signin',
        path: paths.signin,
      },
      {
        name: 'Sign Up',
        pathName: 'signup',
        path: paths.signup,
      },

      {
        name: 'Logout',
        pathName: 'logout',
        path: paths.logout,
      },
    ],
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
