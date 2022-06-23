import { Status } from 'src/statusses/types/status.type';
import { User } from '../../users/types/user.type';

export type Strike = {
  user: User;
  status: Status;
  reason: string;
  createdAt: string;
};
