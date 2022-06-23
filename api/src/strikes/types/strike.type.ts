import { Status } from 'src/statuses/types/status.type';
import { User } from '../../users/types/user.type';

export type Strike = {
  user: User;
  status: Status;
  reason: string;
  createdAt: number;
};
