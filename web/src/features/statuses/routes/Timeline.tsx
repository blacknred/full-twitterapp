import { ContentLayout } from '@/components/Layout';
import { CreateTweet } from '../components/CreateTweet';
import { TweetList } from '../components/TweetList';

export const Timeline = () => (
  <ContentLayout>
     <CreateTweet slim />
     <TweetList />
  </ContentLayout>
);
