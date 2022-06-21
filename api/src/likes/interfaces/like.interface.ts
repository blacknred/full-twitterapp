import { ITweet } from 'src/tweets/interfaces/tweet.interface';
import { IUser } from '../../users/interfaces/user.interface';

export interface ILike {
  id: number;
  userId: number;
  tweetId?: number;
  createdAt: string;
  //
  user: IUser;
  tweet: ITweet;
}
