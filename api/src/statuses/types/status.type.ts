import { User } from '../../users/types/user.type';

export type Status = {
  id: number;
  text?: string;
  media?: string[];
  createdAt: string;
  author: User;
  status?: Status;
  //
  likesCnt: number;
  retweetsCnt: number;
  repostsCnt: number;
  likedByMe: boolean;
  retweetedByMe: boolean;
};
