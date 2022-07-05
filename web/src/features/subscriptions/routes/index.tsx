import { Navigate, Route, Routes } from 'react-router-dom';

import { Explore } from './Explore';
import { Timeline } from './Timeline';
import { UserTweet } from './UserTweet';
import { UserTweets } from './UserTweets';

export const UserRoutes = () => (
  <Routes>
    <Route index element={<Profile />} />
    <Route path="/followers" element={<SubscriptionList />} />
    <Route path="/following" element={<SubscriptionList />} />
    <Route path="*" element={<Navigate to="/my" />} />
  </Routes>
);

