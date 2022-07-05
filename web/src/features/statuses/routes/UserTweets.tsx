import { ContentLayout } from '@/components/Layout';
import { User } from '@/features/users/components/User';
import { TweetList } from '../components/TweetList';

export const UserTweets = () => (
  <ContentLayout>
    {/* <User /> */}
    <TweetList />
  </ContentLayout>
);
