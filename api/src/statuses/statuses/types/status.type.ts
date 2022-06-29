import type { User } from '../../../users/users/types/user.type';

export type Status = {
  id: number;
  text?: string;
  links?: string[];
  createdAt: string;
  author: User;
  status?: Status;
  //
  totalLikes: number;
  totalReposts: number;
  totalReplies: number;
  //
  relation?: {
    liked: boolean;
    reposted: boolean;
  };
};
