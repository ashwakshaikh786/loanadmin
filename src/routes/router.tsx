/* eslint-disable react-refresh/only-export-components */
import paths, { rootPaths } from './paths';
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import MainLayout from 'layouts/main-layout';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
import AuthLayout from 'layouts/auth-layout';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard/Dashbaord'));
const Signin = lazy(() => import('pages/authentication/Signin'));
const Signup = lazy(() => import('pages/authentication/Signup'));
 const Test = lazy(() => import('pages/test/test'));
 const Admin = lazy(() => import('pages/test/admin'));
 const Usermanagement = lazy(() => import('pages/UserControl/userRegister'));



const router = createBrowserRouter(
  [
    {   
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
          ],
        },
        {
         
          children: [
            {
              path: paths.test,
              element: <Test />,
            },
          ],
        },
        {
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              path: paths.admin,
              element: <Admin />,
            },
          ],
        },
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            {
              path: paths.signin,
              element: <Signin />,
            },
            {
              path: paths.signup,
              element: <Signup />,
            },
          ],
        },{
          path: rootPaths.pageRoot,
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              path: paths.usermanagement,
              element: <Usermanagement />,
            },
           
          ],
        },
        
      ],
    },
  ],
  {
    basename: '/',
  },
);

export default router;
