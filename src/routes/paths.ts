export const rootPaths = {
  root: '/',
  pageRoot: 'pages',
  authRoot: 'auth',
  errorRoot: 'error',
};

export default {
  dashboard: `/${rootPaths.pageRoot}/dashboard`,
  activity: `/${rootPaths.pageRoot}/activity`,
  library: `/${rootPaths.pageRoot}/library`,
  schedules: `/${rootPaths.pageRoot}/schedules`,
  payouts: `/${rootPaths.pageRoot}/payouts`,
  settings: `/${rootPaths.pageRoot}/settings`,
test:`/${rootPaths.pageRoot}/test`,
admin:`/${rootPaths.authRoot}/admin`,
usermanagement:`/${rootPaths.pageRoot}/usermanagement`,
usercontrol:`/${rootPaths.pageRoot}/usercontrol`,
  signin: `/${rootPaths.authRoot}/signin`,
  signup: `/${rootPaths.authRoot}/signup`,
  logout: `/${rootPaths.authRoot}/logout`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  404: `/${rootPaths.errorRoot}/404`,
};
