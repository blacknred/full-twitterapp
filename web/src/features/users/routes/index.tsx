import { Navigate, Route, Routes } from 'react-router-dom';

import { UpdateUser } from '../components/UpdateUser';

const UserRoutes = () => (
  <Routes>
    <Route index element={<UpdateUser />} />
    {/* <Route path="/followers" element={<SubscriptionList />} />
    <Route path="/following" element={<SubscriptionList />} /> */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default UserRoutes