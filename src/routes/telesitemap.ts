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
    path:  paths.teledashboard,
    icon: 'ri:dashboard-fill',
    active: true,
  },
  {
    id: 'authentication',
    subheader: 'Follow Up',
    icon: 'ic:round-security',
    active: true,
    items: [
      {
        name: 'All Follow Up ',
        pathName: 'FollowUp',
        path:paths.teleassign,
      },
      {
        name: 'Today Follow Up ',
        pathName: 'FollowUp',
        path:paths.todayfollowup,
      },
      {
        name: 'Backlog Follow Up ',
        pathName: 'FollowUp',
        path:paths.backlogfollowup,
      },
      {
        name: 'Open Follow Up ',
        pathName: 'FollowUp',
        path:paths.nextfollowup,
      },
     
    ],
  },
  {
    id: 'activity',
    subheader: 'coming soon',
    path:'#!',
    icon: 'ic:baseline-show-chart',
  },
  {
    id: 'library',
    subheader: 'coming soon',
    path: '#!',
    icon: 'material-symbols:local-library-outline',
  },
  
 
  // {
  //   id: 'authentication',
  //   subheader: 'Authentication',
  //   icon: 'ic:round-security',
  //   active: true,
  //   items: [
  //     {
  //       name: 'Sign In',
  //       pathName: 'signin',
  //       path: paths.signin,
  //     },
  //     {
  //       name: 'Sign Up',
  //       pathName: 'signup',
  //       path: paths.signup,
  //     },

  //     {
  //       name: 'Logout',
  //       pathName: 'logout',
  //       path: paths.logout,
  //     },
  //   ],
  // },
  // {
  //   id: 'schedules',
  //   subheader: 'Schedules',
  //   path: '#!',
  //   icon: 'ic:outline-calendar-today',
  // },
  // {
  //   id: 'payouts',
  //   subheader: 'Payouts',
  //   path: '#!',
  //   icon: 'material-symbols:account-balance-wallet-outline',
  // },
  // {
  //   id: 'settings',
  //   subheader: 'Settings',
  //   path: '#!',
  //   icon: 'ic:outline-settings',
  // },
];

export default sitemap;
