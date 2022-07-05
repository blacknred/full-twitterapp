import { Navigate, Route, Routes } from 'react-router-dom';

import { Explore } from './Explore';
import { Timeline } from './Timeline';
import { UserTweet } from './UserTweet';
import { UserTweets } from './UserTweets';

const TweetRoutes = () => {
  console.log(56456345345623452345)
  return <Routes>
    <Route index element={<Timeline />} />
    <Route path="explore/:hash" element={<Explore />} />
    <Route path="explore" element={<Explore />} />
    <Route path="auth/jh" element={<Navigate to="/" />} />
    <Route path="auth" element={<Navigate to="/" />} />
    <Route path=":username/:tid" element={<UserTweet />} />
    <Route path=":username" element={<UserTweets />} />
  </Routes>
};

export default TweetRoutes