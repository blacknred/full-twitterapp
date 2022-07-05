// import { CreateUser } from '@/features/users/components/CreateUser';
import { Navigate, Route, Routes } from 'react-router-dom';
// import { CreateAuth } from '../components/CreateAuth';

import { Login } from './Login';
import { Register } from './Register';
import { Restore } from './Restore';

const AuthRoutes = () => {
  console.log(345345)
  return <Routes>
    <Route path="auth/new" element={<Login />} />
    <Route path="auth/restore" element={<Restore />} />
    <Route path='auth' element={<Login />} />
    {/* <Route path="auth/reset" element={<ResetPassword />} /> */}
    <Route path="*" element={<Navigate to={`/auth?next=${location.pathname}`} />} />
  </Routes>
};

// name/email(SENT ? disabled : enabled)
// SENT && enter code
// SENT ? confirm btn : 

export default AuthRoutes