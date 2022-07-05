import { ContentLayout } from '@/components/Layout';
import { useParams } from 'react-router-dom';
import { Trend } from '../components/Trend';
import { TweetList } from '../components/TweetList';
import { TrendList } from '../components/TrendList'

export const Explore = () => {
  const { hash } = useParams<'hash'>()
  console.log(hash)
  return (
    <ContentLayout>
      {hash ? <Trend /> : <TrendList />}
      <TweetList />
    </ContentLayout>
  )
};
