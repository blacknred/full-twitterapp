import { ContentLayout } from '@/components/Layout';
import { CreateTweet } from '../components/CreateTweet';
import { Tweet } from '../components/Tweet';
import { TweetList } from '../components/TweetList';

export const UserTweet = () => (
  <ContentLayout>
    <Tweet extended />
    <CreateTweet slim/>
    <TweetList />
  </ContentLayout>
);
