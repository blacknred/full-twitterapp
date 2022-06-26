import { User } from '../../../users/users/types/user.type';

export type Status = {
  id: number;
  text?: string;
  media?: string[];
  createdAt: string;
  author: User;
  status?: Status;
  //
  totalLikes: number;
  totalRetweets: number;
  totalReplies: number;
  //
  relation?: {
    liked: boolean;
    retweeted: boolean;
  };
};
