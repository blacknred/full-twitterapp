import type { Status } from 'src/statuses/statuses/types/status.type';
import type { User } from '../../users/types/user.type';

export type Report = {
  user: User;
  status?: Status;
  reason: string;
  createdAt: number;
};
