import { Status } from '../../statuses/types/status.type';
import { User } from '../../users/types/user.type';

export type Like = {
  user: User;
  status: Status;
  createdAt: number;
};
