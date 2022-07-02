import { lazy } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

import { MainLayout } from '@/components/Layout';
import { useAuth } from '@/features/auth';

const AuthRoutes = lazy(() => import('../features/auth/routes'));
const UserRoutes = lazy(() => import('../features/users/routes'));
const TweetsRoutes = lazy(() => import('../features/statuses/routes'));

export const AppRoutes = () => {
  const { isValidating, data: auth } = useAuth();

  const element = useRoutes([{
    path: "/",
    element: <MainLayout><Outlet/> </MainLayout>,
    children: auth?.data ? [
      { path: '/my', element: <UserRoutes /> },
      { path: '*', element: <TweetsRoutes /> },
    ] : [
      {  path: '*', element: <AuthRoutes /> },
    ],
  }]);

  console.log(element)

  return isValidating ? null : element;
};

