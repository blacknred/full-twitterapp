import { User } from '../../users/types/user.type';

export type Status = {
  id: number;
  text?: string;
  media?: string[];
  createdAt: string;
  author: User;
  origin?: Status;
  //
  likesCnt: number;
  retweetsCnt: number;
  repostsCnt: number;
};
